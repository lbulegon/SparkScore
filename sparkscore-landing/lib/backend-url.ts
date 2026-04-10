import { sanitizeApiBaseUrl } from "@/lib/sanitize-api-url";

/**
 * URL base da API Django (só servidor — Route Handlers / proxy).
 * Preferir variáveis SparkScore; mantém fallback SinapLint (mesmo backend).
 */
export function getBackendBaseUrl(): string {
  const raw =
    process.env.SPARKSCORE_API_URL ||
    process.env.NEXT_PUBLIC_SPARKSCORE_API_URL ||
    process.env.SINAPLINT_API_URL ||
    process.env.NEXT_PUBLIC_SINAPLINT_API_URL ||
    "";
  return sanitizeApiBaseUrl(raw);
}
