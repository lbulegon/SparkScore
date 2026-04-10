"""Dados da conta autenticada (API key do tenant)."""

from __future__ import annotations

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from saas.models import Project, UserProfile


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    """
    Requer `Authorization: Token <key>` (ou sessão autenticada).
    Devolve nome do tenant, API key pública e id do projeto padrão.
    """
    try:
        profile = request.user.userprofile
    except UserProfile.DoesNotExist:
        return Response(
            {"error": "Perfil SaaS inexistente."},
            status=status.HTTP_404_NOT_FOUND,
        )

    tenant = profile.tenant
    default_project = Project.objects.filter(tenant=tenant, name="Default Project").first()

    return Response(
        {
            "username": request.user.get_username(),
            "tenant": tenant.name,
            "api_key": str(tenant.api_key),
            "project_id": default_project.pk if default_project else None,
        }
    )
