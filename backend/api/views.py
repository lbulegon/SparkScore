from __future__ import annotations

import logging
from typing import Any

from django.conf import settings
from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from api.engine_client import EngineClientError, fetch_sinaplint_report
from api.repo_validators import validate_public_repo_url
from api.utils import get_tenant_from_request
from saas.models import Analysis, Project

logger = logging.getLogger(__name__)


def index(request):
    """
    Página inicial (raiz `/`) — evita 404 no navegador ao abrir o domínio no Railway.
    """
    engine_ok = bool((getattr(settings, "SINAPLINT_ENGINE_URL", "") or "").strip())
    body = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>SparkScore SaaS API</title>
  <style>
    body {{ font-family: system-ui, sans-serif; max-width: 42rem; margin: 2rem auto; padding: 0 1rem; color: #1a1a1a; }}
    h1 {{ font-size: 1.5rem; }}
    .ok {{ color: #0a0; }} .warn {{ color: #a60; }}
    ul {{ line-height: 1.8; }}
    code {{ background: #f0f0f0; padding: 0.1rem 0.35rem; border-radius: 4px; }}
  </style>
</head>
<body>
  <h1>SparkScore SaaS API</h1>
  <p>API de orquestração — motor no Core (endpoint SinapLint interno).</p>
  <p>Motor remoto: <span class="{"ok" if engine_ok else "warn"}">{"configurado" if engine_ok else "SINAPLINT_ENGINE_URL não configurada"}</span></p>
  <ul>
    <li><a href="/health/"><code>/health/</code></a> — status do serviço</li>
    <li><code>POST /auth/register/</code> — criar conta (recebe <code>api_key</code> + <code>project_id</code>)</li>
    <li><code>POST /auth/login/</code> — obter <code>Token</code></li>
    <li><code>GET /me/</code> — <code>Authorization: Token …</code> → dados do tenant e API key</li>
    <li><a href="/analyze/"><code>/analyze/</code></a> — motor remoto (<code>X-API-KEY</code> + <code>project_id</code>)</li>
    <li><code>POST /api/sparkscore/saas/public/analyze/</code> — demo sem login (<code>repo_url</code>)</li>
    <li><code>POST /api/sparkscore/saas/v1/analyze/</code> — mesmo que <code>/analyze/</code> (SaaS)</li>
    <li>(Alias) <code>POST /api/sinaplint/saas/...</code> — compatível com integrações existentes</li>
    <li><a href="/admin/"><code>/admin/</code></a> — Django admin</li>
  </ul>
</body>
</html>"""
    return HttpResponse(body)


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    configured = bool((getattr(settings, "SINAPLINT_ENGINE_URL", "") or "").strip())
    return Response(
        {
            "status": "ok",
            "service": "sparkscore-saas",
            "engine_configured": configured,
            "mode": "remote_engine",
        }
    )


def _parse_project_id(request) -> tuple[int | None, str | None]:
    """Extrai `project_id` do body (POST) ou query (GET). Retorna (id ou None, erro humano ou None)."""
    if request.method == "POST":
        data = request.data if isinstance(getattr(request, "data", None), dict) else {}
        raw = data.get("project_id")
    else:
        raw = request.GET.get("project_id")
    if raw is None or raw == "":
        return None, "Informe project_id (corpo JSON em POST ou ?project_id= em GET)."
    try:
        return int(raw), None
    except (TypeError, ValueError):
        return None, "project_id deve ser um número inteiro."


@api_view(["POST"])
@permission_classes([AllowAny])
def public_analyze(request):
    """
    Demo na landing: sem API key, não persiste histórico.
    Corpo JSON: `{ "repo_url": "https://github.com/org/repo" }`.
    """
    data = request.data if isinstance(getattr(request, "data", None), dict) else {}
    raw_url = data.get("repo_url")
    if not isinstance(raw_url, str) or not raw_url.strip():
        return Response(
            {"error": "Bad Request", "detail": "Envie repo_url (string HTTPS) no JSON."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    repo_url, verr = validate_public_repo_url(raw_url)
    if verr or not repo_url:
        return Response(
            {"error": "Bad Request", "detail": verr or "repo_url inválido."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    payload: dict[str, Any] = {"repo_url": repo_url, "demo": True}

    try:
        result = fetch_sinaplint_report(method="POST", body=payload)
    except EngineClientError as e:
        logger.warning("Motor SinapLint (demo) indisponível: %s", e)
        err: dict[str, Any] = {
            "error": str(e),
            "service": "sparkscore-saas",
            "mode": "demo",
            "saved": False,
            "cta": "login_to_save",
        }
        if e.status is not None:
            err["upstream_status"] = e.status
        if e.body:
            err["upstream_body"] = e.body[:2000]
        return Response(err, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    if not isinstance(result, dict):
        return Response(
            {"error": "Invalid engine response", "detail": "Resposta do motor não é um objeto JSON."},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    out = dict(result)
    out["mode"] = "demo"
    out["cta"] = "login_to_save"
    out["saved"] = False
    return Response(out)


@api_view(["POST", "GET"])
@permission_classes([AllowAny])
def analyze(request):
    """
    Multi-tenant: exige header `X-API-KEY` (UUID do tenant) e um projeto existente desse tenant.

    O pedido é validado contra `saas.Project`, o motor remoto é chamado (`SINAPLINT_ENGINE_URL`)
    e o resultado é persistido em `saas.Analysis`.
    """
    tenant = get_tenant_from_request(request)
    if not tenant:
        return Response(
            {"error": "Unauthorized", "detail": "Envie o header X-API-KEY com a API key do tenant."},
            status=status.HTTP_403_FORBIDDEN,
        )

    project_id, err = _parse_project_id(request)
    if err or project_id is None:
        return Response({"error": "Bad Request", "detail": err or "project_id inválido."}, status=status.HTTP_400_BAD_REQUEST)

    project = Project.objects.filter(id=project_id, tenant=tenant).first()
    if not project:
        return Response(
            {"error": "Invalid project", "detail": "Projeto inexistente ou não pertence a este tenant."},
            status=status.HTTP_404_NOT_FOUND,
        )

    payload: dict[str, Any] = {}
    if request.method == "POST" and getattr(request, "data", None) is not None:
        if isinstance(request.data, dict):
            payload = dict(request.data)
    method = "POST" if request.method == "POST" else "GET"

    try:
        result = fetch_sinaplint_report(method=method, body=payload if method == "POST" else None)
    except EngineClientError as e:
        logger.warning("Motor SinapLint indisponível: %s", e)
        es = str(e).lower()
        if "timed out" in es:
            hint = (
                "Timeout ao contactar o motor. O Django na Railway tem de conseguir abrir TCP até ao host em "
                "SINAPLINT_ENGINE_URL. Confirme: firewall / security group do VPS com porta HTTP(s) aberta à internet; "
                "Core a escutar em 0.0.0.0 (não só 127.0.0.1); URL e porta corretas. "
                "Pode aumentar SINAPLINT_ENGINE_TIMEOUT. Alternativa: hospedar o motor no Railway (rede próxima)."
            )
        else:
            hint = "Configure SINAPLINT_ENGINE_URL com o endpoint do Core_SinapUm que executa o SinapLint."
        err: dict[str, Any] = {
            "error": str(e),
            "service": "sparkscore-saas",
            "hint": hint,
        }
        if e.status is not None:
            err["upstream_status"] = e.status
        if e.body:
            err["upstream_body"] = e.body[:2000]
        code = status.HTTP_503_SERVICE_UNAVAILABLE
        if "não está definida" in str(e):
            code = status.HTTP_503_SERVICE_UNAVAILABLE
        return Response(err, status=code)

    if not isinstance(result, dict):
        return Response(
            {"error": "Invalid engine response", "detail": "Resposta do motor não é um objeto JSON."},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    score = int(result.get("score", 0))
    analysis = Analysis.objects.create(project=project, score=score, result=result)

    out = dict(result)
    out["analysis_id"] = analysis.id
    out["mode"] = "saas"
    out["saved"] = True
    return Response(out)
