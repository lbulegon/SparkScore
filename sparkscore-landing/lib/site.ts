import { sanitizeApiBaseUrl } from "@/lib/sanitize-api-url";

/**
 * URL pública da API Django (Railway), mostrada no registo.
 * Preferir NEXT_PUBLIC_SPARKSCORE_API_URL; mantém fallback SinapLint (mesmo backend).
 */
export function sparkscoreApiUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SPARKSCORE_API_URL ??
    process.env.NEXT_PUBLIC_SINAPLINT_API_URL ??
    "";
  return sanitizeApiBaseUrl(raw);
}

/** Página de registo na própria landing (obter API key). */
export function registerPath(): string {
  return "/register";
}

/** CTAs principais: fluxo self-serve na landing (não abre a API Django em nova aba). */
export function primaryCtaHref(): string {
  return registerPath();
}
