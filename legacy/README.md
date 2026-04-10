# Código legado (antes da estrutura SinapLint/SparkScore)

Esta pasta conserva o repositório **SparkScore** original antes de alinhar com a mesma arquitetura do projeto SinapLint:

- `original-repo/` — `manage.py` na raiz, `setup/`, `app_core/`, `packages/` (motor PPA, gateway, documentação), etc.

O produto ativo passa a viver em:

- `backend/` — Django SaaS (API, auth, proxy para o motor no Core)
- `sparkscore-landing/` — Next.js (landing, login, dashboard, proxies `/app/api/*`)

Para referência metodológica puramente conceitual, ver `README-SparkScore-conceito-original.md`.
