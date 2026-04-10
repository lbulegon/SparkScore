# SparkScore SaaS (API + Landing + Railway)

**SparkScore** é uma metodologia e plataforma de análise semiótica aplicada à comunicação: quantifica o **PPA** (Potencial Prévio de Ação), **SparkUnits**, **Orbitais** e projeções tipo **PreCogs** — mantra **Certainty Ahead**.

Este repositório segue a **mesma estrutura operacional** do projeto SinapLint: API Django que orquestra chamadas HTTP ao motor no **Core_SinapUm** (endpoint interno SinapLint), mais frontend Next.js com proxy de autenticação e análises.

## Arquitetura

```
Cliente  →  SparkScore (este repo)  →  HTTP  →  Core_SinapUm / motor SinapLint
```

| Pasta | Conteúdo |
|-------|----------|
| `backend/` | Django/DRF: auth, health, proxy de análise, modelos SaaS. |
| `sparkscore-landing/` | Next.js: landing, login, registo, dashboard; `app/api/*` → Django. |
| `legacy/original-repo/` | Código Django/monólito anterior ao alinhamento (referência). |

### Rotas úteis (API)

- `GET /health/` — estado do serviço.
- `POST /auth/register/`, `POST /auth/login/` — registo e token.
- `POST /api/sparkscore/saas/public/analyze/` — demo pública (`repo_url`).
- `POST /api/sparkscore/saas/v1/analyze/` — SaaS com `X-API-KEY` (alias `/api/sinaplint/saas/...` mantido).

## Configuração

1. Copiar `.env.example` para `.env` na **raiz** do repositório.
2. Motor no Core — como no SinapLint:
   - **`SINAPLINT_ENGINE_URL`**: URL completa do motor, ou
   - **`SINAPUM_CORE_BASE_URL`**: base HTTP do Core; se `SINAPLINT_ENGINE_URL` estiver vazio, usa `…/api/sinaplint/internal/engine/`.
3. Segredo partilhado: `SINAPLINT_ENGINE_API_KEY` ou `SINAPLINT_ENGINE_SHARED_SECRET`.

## Desenvolvimento local

```bash
cd Source/SparkScore
cp .env.example .env
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd backend
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Em outro terminal:

```bash
cd sparkscore-landing
cp .env.example .env.local
# NEXT_PUBLIC_SPARKSCORE_API_URL=http://127.0.0.1:8000
npm install && npm run dev
```

## Deploy (Railway)

- **Serviço API (Django):** raiz do repo vazia; arranque conforme `railway.json` (`cd backend && … gunicorn`).
- **Serviço Landing (Next):** Root Directory = `sparkscore-landing`; variável `NEXT_PUBLIC_SPARKSCORE_API_URL` = URL público do serviço Django.

## Documentação conceitual

O ficheiro `legacy/original-repo/README-SparkScore-conceito-original.md` conserva a descrição longa da metodologia (SparkCore, Orbitais, Efeito Zappa, etc.).
