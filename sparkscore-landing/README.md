# SparkScore — Landing (Next.js)

Interface pública (home, login, registo, painel) com *Route Handlers* em `app/api/*` que fazem proxy para o backend Django.

## Deploy (Railway)

1. **New** → **GitHub Repo** → repositório **SparkScore**.
2. **Settings → Source → Root Directory** → **`sparkscore-landing`**.
3. **Variables**: `NEXT_PUBLIC_SPARKSCORE_API_URL` = URL público do **serviço Django** (sem path do motor Core; sem `/` final). Alias aceite: `NEXT_PUBLIC_SINAPLINT_API_URL`.

## Desenvolvimento local

```bash
cd sparkscore-landing
cp .env.example .env.local
# Definir NEXT_PUBLIC_SPARKSCORE_API_URL=http://127.0.0.1:8000
npm install
npm run dev
```

O backend Django deve estar a correr (por exemplo em `../backend` na porta 8000).
