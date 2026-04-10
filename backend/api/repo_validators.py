"""Validação de URLs de repositório público para o modo demo (sem login)."""

from __future__ import annotations

import re
from urllib.parse import urlparse

# Hosts permitidos (HTTPS). Expandir conforme produto.
_ALLOWED_NETLOCS = frozenset(
    {
        "github.com",
        "www.github.com",
        "gitlab.com",
        "www.gitlab.com",
        "codeberg.org",
        "www.codeberg.org",
    }
)


def normalize_repo_url(raw: str) -> str:
    s = (raw or "").strip()
    if not s:
        return ""
    return s.rstrip("/")


def validate_public_repo_url(raw: str) -> tuple[str | None, str | None]:
    """
    Aceita apenas HTTPS para hosts conhecidos (GitHub/GitLab/Codeberg).
    Devolve (url_normalizada, None) ou (None, mensagem de erro).
    """
    s = normalize_repo_url(raw)
    if not s:
        return None, "Informe repo_url (HTTPS)."

    if len(s) > 2048:
        return None, "URL demasiado longa."

    if not s.lower().startswith("https://"):
        return None, "Use apenas HTTPS (ex.: https://github.com/org/repo)."

    try:
        p = urlparse(s)
    except Exception:
        return None, "URL inválida."

    if p.scheme.lower() != "https":
        return None, "Use apenas HTTPS."

    host = (p.netloc or "").split("@")[-1].lower()
    if ":" in host:
        host = host.split(":")[0]

    if host not in _ALLOWED_NETLOCS:
        return None, "Apenas repositórios em GitHub, GitLab ou Codeberg (HTTPS)."

    path = (p.path or "").strip("/")
    if not path or path.count("/") < 1:
        return None, "Indique o caminho completo do repositório (ex.: org/repo)."

    # Evita paths suspeitos
    if ".." in p.path or p.path.startswith("//"):
        return None, "URL inválida."

    # Pelo menos org/repo
    parts = [x for x in path.split("/") if x]
    if len(parts) < 2:
        return None, "O URL deve incluir organização e nome do repositório."

    # Caracteres seguros no path (letras, números, -, _, ., /)
    if not re.match(r"^[/\w.\-]+$", p.path):
        return None, "Caracteres não permitidos no caminho do repositório."

    return s, None
