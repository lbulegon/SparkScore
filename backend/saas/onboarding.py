"""Garante Tenant + Project + UserProfile após criar User (fallback se o sinal falhar)."""

from __future__ import annotations

import logging

from django.contrib.auth.models import User
from django.db import transaction

from saas.models import Project, Tenant, UserProfile

logger = logging.getLogger(__name__)


def ensure_saas_profile(user: User) -> tuple[Tenant, Project | None]:
    """
    Devolve (tenant, projeto default). Cria perfil se ainda não existir (idempotente).
    """
    existing = UserProfile.objects.filter(user=user).select_related("tenant").first()
    if existing:
        tenant = existing.tenant
        default_project = Project.objects.filter(tenant=tenant, name="Default Project").first()
        return tenant, default_project

    with transaction.atomic():
        tenant = Tenant.objects.create(name=user.get_username()[:100])
        Project.objects.create(tenant=tenant, name="Default Project")
        UserProfile.objects.create(user=user, tenant=tenant)

    default_project = Project.objects.filter(tenant=tenant, name="Default Project").first()
    logger.info("ensure_saas_profile: created tenant for user %s", user.pk)
    return tenant, default_project
