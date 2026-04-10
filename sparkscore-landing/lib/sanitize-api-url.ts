/**
 * Sufixo errado comum: o motor no Core costuma ser /api/sinaplint/internal/engine/ —
 * a API SaaS Django fica na raiz do serviço (ex. /auth/register/), não aí.
 */
const WRONG_API_BASE_SUFFIX = /\/api\/sinaplint\/internal\/engine\/?$/i;

/**
 * Normaliza URL da API (copy-paste no Railway às vezes adiciona "-" ou espaços antes de https://).
 */
export function sanitizeApiBaseUrl(raw: string): string {
  if (!raw) return "";
  let s = raw.trim();
  // Remove hífens ASCII e espaços à esquerda (ex.: "-https://...")
  s = s.replace(/^[-\s]+/, "");
  s = s.replace(/\/$/, "");
  // Se colaram o URL do motor do Core em vez da raiz do serviço Django (API) na Railway.
  s = s.replace(WRONG_API_BASE_SUFFIX, "");
  s = s.replace(/\/$/, "");
  // Confusão comum: .../api — o proxy junta /auth/register/ e vira .../api/auth/register/ (404).
  // Neste projeto as rotas Django estão na raiz do serviço, não sob /api.
  s = s.replace(/\/api\/?$/i, "");
  return s.replace(/\/$/, "");
}
