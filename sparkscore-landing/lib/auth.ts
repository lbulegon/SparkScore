/** Token DRF guardado no browser após registo ou login. */

const SPARKSCORE_TOKEN_KEY = "sparkscore_token";
const LEGACY_SINAPLINT_TOKEN_KEY = "sinaplint_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(SPARKSCORE_TOKEN_KEY) ??
    localStorage.getItem(LEGACY_SINAPLINT_TOKEN_KEY)
  );
}

export function setStoredToken(token: string): void {
  localStorage.setItem(SPARKSCORE_TOKEN_KEY, token);
  localStorage.removeItem(LEGACY_SINAPLINT_TOKEN_KEY);
}

export function clearStoredToken(): void {
  localStorage.removeItem(SPARKSCORE_TOKEN_KEY);
  localStorage.removeItem(LEGACY_SINAPLINT_TOKEN_KEY);
}
