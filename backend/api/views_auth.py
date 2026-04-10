"""Registo e login — onboarding self-service."""

from __future__ import annotations

import logging

from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from saas.models import Project
from saas.onboarding import ensure_saas_profile

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    """
    Cria utilizador Django; o sinal `saas.signals` cria Tenant + `Default Project` + `UserProfile`.
    Devolve token DRF + `api_key` + `project_id` para testar `/analyze/` de imediato.
    """
    username = (request.data.get("username") or "").strip()
    password = request.data.get("password") or ""
    email = (request.data.get("email") or "").strip()

    if not username or not password:
        return Response(
            {"error": "username e password são obrigatórios."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(username__iexact=username).exists():
        return Response(
            {"error": "Este nome de utilizador já está em uso."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        validate_password(password, user=User(username=username))
    except ValidationError as e:
        return Response({"error": e.messages}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email or "",
        )
        token, _ = Token.objects.get_or_create(user=user)
        tenant, default_project = ensure_saas_profile(user)
    except Exception as e:
        logger.exception("register failed for username=%s", username)
        payload: dict = {
            "error": "Erro ao criar conta. Se vir 'no such table', corra migrações no serviço Django.",
            "detail": f"{type(e).__name__}: {e!s}",
        }
        if settings.DEBUG:
            payload["trace"] = True
        return Response(payload, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(
        {
            "message": "Conta criada.",
            "token": token.key,
            "tenant": tenant.name,
            "api_key": str(tenant.api_key),
            "project_id": default_project.pk if default_project else None,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    """Devolve ou recria token para utilizadores já registados."""
    username = (request.data.get("username") or "").strip()
    password = request.data.get("password") or ""
    # Mesma regra que o registo (username__iexact): o ModelBackend é case-sensitive no username.
    user = User.objects.filter(username__iexact=username).first()
    if not user or not user.check_password(password):
        return Response(
            {"error": "Credenciais inválidas."},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    token, _ = Token.objects.get_or_create(user=user)
    tenant = getattr(getattr(user, "userprofile", None), "tenant", None)
    default_project = (
        Project.objects.filter(tenant=tenant, name="Default Project").first()
        if tenant
        else None
    )
    return Response(
        {
            "token": token.key,
            "tenant": tenant.name if tenant else None,
            "api_key": str(tenant.api_key) if tenant else None,
            "project_id": default_project.pk if default_project else None,
        }
    )
