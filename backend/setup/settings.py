"""
Django settings — SparkScore SaaS API (Railway).

O motor de análise corre no Core_SinapUm (endpoint HTTP SinapLint interno); este projeto orquestra HTTP.
"""

from __future__ import annotations

import os
from pathlib import Path

import dj_database_url
from django.core.management.utils import get_random_secret_key
from dotenv import load_dotenv

# backend/
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR.parent / ".env")

SECRET_KEY = os.environ.get("SECRET_KEY", get_random_secret_key())
DEBUG = os.environ.get("DEBUG", "False").lower() in ("1", "true", "yes")

ALLOWED_HOSTS = [
    h.strip()
    for h in os.environ.get("ALLOWED_HOSTS", "*").split(",")
    if h.strip()
] or ["*"]

def _sanitize_engine_url(raw: str) -> str:
    """Railway/copy-paste às vezes prefixa '=' ou hífens — urllib falha com 'unknown url type: =http'."""
    s = (raw or "").strip()
    while s.startswith("="):
        s = s[1:].strip()
    while s.startswith("-"):
        s = s[1:].strip()
    return s


# Base HTTP do Core — mesmo nome que MrFoo (`Source/mrfoo`: SINAPUM_CORE_BASE_URL), sem path.
# Se `SINAPLINT_ENGINE_URL` estiver vazio, usa automaticamente:
#   {SINAPUM_CORE_BASE_URL}/api/sinaplint/internal/engine/
SINAPUM_CORE_BASE_URL = _sanitize_engine_url(os.environ.get("SINAPUM_CORE_BASE_URL") or "").rstrip("/")

# URL completa do motor (prioridade) ou derivada da base acima (alinhado aos outros apps).
SINAPLINT_ENGINE_URL = _sanitize_engine_url(os.environ.get("SINAPLINT_ENGINE_URL") or "")
if not SINAPLINT_ENGINE_URL and SINAPUM_CORE_BASE_URL:
    SINAPLINT_ENGINE_URL = f"{SINAPUM_CORE_BASE_URL}/api/sinaplint/internal/engine/"

# Segredo partilhado com o Core (`SINAPLINT_ENGINE_SHARED_SECRET` no Core_SinapUm).
SINAPLINT_ENGINE_API_KEY = (os.environ.get("SINAPLINT_ENGINE_API_KEY") or "").strip()
if not SINAPLINT_ENGINE_API_KEY:
    SINAPLINT_ENGINE_API_KEY = (os.environ.get("SINAPLINT_ENGINE_SHARED_SECRET") or "").strip()
SINAPLINT_ENGINE_TIMEOUT = int(os.environ.get("SINAPLINT_ENGINE_TIMEOUT", "120"))

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "api",
    "saas.apps.SaasConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "setup.urls"
WSGI_APPLICATION = "setup.wsgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# PostgreSQL (Railway):
# - DATABASE_URL — rede privada (app no Railway → postgres.railway.internal)
# - DATABASE_PUBLIC_URL — proxy público (migrates / debug a partir da tua máquina)
# Prioridade: URL interna no deploy; URL pública só quando não há DATABASE_URL.
_db_url = (os.environ.get("DATABASE_URL") or "").strip()
_db_public = (os.environ.get("DATABASE_PUBLIC_URL") or "").strip()
_db_conn_max = int(os.environ.get("DB_CONN_MAX_AGE", "60"))

if _db_url:
    DATABASES = {"default": dj_database_url.parse(_db_url, conn_max_age=_db_conn_max)}
elif _db_public:
    DATABASES = {"default": dj_database_url.parse(_db_public, conn_max_age=_db_conn_max)}
elif os.environ.get("PGDATABASE"):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ["PGDATABASE"],
            "USER": os.environ.get("PGUSER", "postgres"),
            "PASSWORD": os.environ.get("PGPASSWORD", ""),
            "HOST": os.environ.get("PGHOST", "localhost"),
            "PORT": os.environ.get("PGPORT", "5432"),
            "CONN_MAX_AGE": _db_conn_max,
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "pt-br"
TIME_ZONE = "America/Sao_Paulo"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CORS — browser (landing Next.js em outro domínio).
# Opção A (recomendado): CORS_ALLOWED_ORIGINS=https://teu-landing.up.railway.app
# Opção B (rápido no Railway): CORS_ALLOW_RAILWAY_PUBLIC=true — aceita qualquer https://*.up.railway.app
_cors_origins = [
    o.strip()
    for o in os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",")
    if o.strip()
]
CORS_ALLOWED_ORIGINS = _cors_origins
CORS_ALLOWED_ORIGIN_REGEXES: list[str] = []
if os.environ.get("CORS_ALLOW_RAILWAY_PUBLIC", "").lower() in ("1", "true", "yes"):
    CORS_ALLOWED_ORIGIN_REGEXES.append(r"^https://[a-zA-Z0-9.-]+\.up\.railway\.app$")

if not CORS_ALLOWED_ORIGINS and not CORS_ALLOWED_ORIGIN_REGEXES:
    if DEBUG:
        CORS_ALLOWED_ORIGINS = [
            "http://127.0.0.1:3000",
            "http://localhost:3000",
        ]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
}
