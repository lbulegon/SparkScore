"""Utilitários da API pública (multi-tenant)."""

from __future__ import annotations

import uuid

from django.http import HttpRequest

from saas.models import Tenant


def get_tenant_from_request(request: HttpRequest) -> Tenant | None:
    """
    Resolve o tenant pelo header `X-API-KEY` (UUID emitido em `Tenant.api_key`).
    Aceita também `Authorization: Bearer <uuid>` como alternativa.
    """
    raw = (
        request.headers.get("X-API-KEY")
        or request.headers.get("X-Api-Key")
        or ""
    ).strip()
    if not raw and request.headers.get("Authorization", "").startswith("Bearer "):
        raw = request.headers.get("Authorization", "")[7:].strip()

    if not raw:
        return None

    try:
        key = uuid.UUID(raw)
    except ValueError:
        return None

    return Tenant.objects.filter(api_key=key).first()
