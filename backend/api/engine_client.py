"""
Cliente HTTP para o motor SinapLint que roda no Core_SinapUm (ou em outro serviço).

Este repositório não inclui o código do linter — só orquestra chamadas à URL configurada.
"""

from __future__ import annotations

import json
import ssl
import urllib.error
import urllib.request
from typing import Any

from django.conf import settings


class EngineClientError(Exception):
    """Erro ao contatar o motor remoto."""

    def __init__(self, message: str, *, status: int | None = None, body: str | None = None) -> None:
        super().__init__(message)
        self.status = status
        self.body = body


def fetch_sinaplint_report(
    *,
    method: str = "POST",
    body: dict[str, Any] | None = None,
    timeout: float | None = None,
) -> dict[str, Any]:
    """
    Obtém o JSON do relatório SinapLint no serviço configurado (ex.: Core_SinapUm).

    `SINAPLINT_ENGINE_URL` deve apontar para um endpoint que retorna o mesmo schema
    que `SinapLint().run()` (ex.: rota interna no monólito que executa o motor).
    """
    url = getattr(settings, "SINAPLINT_ENGINE_URL", "") or ""
    if not url.strip():
        raise EngineClientError(
            "SINAPLINT_ENGINE_URL não está definida. Configure a URL do motor no Core_SinapUm."
        )

    to = timeout if timeout is not None else float(getattr(settings, "SINAPLINT_ENGINE_TIMEOUT", 120))
    m = method.upper()
    headers = {"Accept": "application/json"}
    data: bytes | None = None
    if m == "POST":
        data = json.dumps(body or {}).encode("utf-8")
        headers["Content-Type"] = "application/json"

    api_key = getattr(settings, "SINAPLINT_ENGINE_API_KEY", "") or ""
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
        headers["X-API-KEY"] = api_key
        headers["X-SinapLint-Engine-Key"] = api_key

    req = urllib.request.Request(
        url.strip(),
        data=data,
        headers=headers,
        method=m,
    )

    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=to, context=ctx) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw)
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        raise EngineClientError(
            f"Motor remoto respondeu HTTP {e.code}",
            status=e.code,
            body=err_body,
        ) from e
    except urllib.error.URLError as e:
        raise EngineClientError(f"Falha de rede ao contatar o motor: {e.reason!s}") from e
    except json.JSONDecodeError as e:
        raise EngineClientError("Resposta do motor não é um JSON válido") from e
