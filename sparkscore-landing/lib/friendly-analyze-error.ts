/**
 * Mensagens legíveis para a landing (EN) quando o backend/motor devolve texto cru ou PT.
 */

export function friendlyAnalyzeError(status: number, detail: string): string {
  const raw = (detail || "").trim();
  const lower = raw.toLowerCase();

  if (!raw) {
    if (status === 503) {
      return "The analysis service is temporarily unavailable. Try again in a moment or use a smaller repo.";
    }
    if (status >= 500) {
      return "Something went wrong on our side. Please try again in a few minutes.";
    }
    return `Something went wrong (HTTP ${status}). Please try again.`;
  }

  // Rede / URL do motor mal configurada (ex.: 127.0.0.1 no Railway) — não confundir com timeout.
  if (
    lower.includes("connection refused") ||
    lower.includes("errno 111") ||
    lower.includes("falha de rede") ||
    lower.includes("network is unreachable") ||
    lower.includes("name or service not known") ||
    lower.includes("getaddrinfo failed")
  ) {
    return (
      "Cannot reach the analysis engine from the API. On Railway, set SINAPUM_CORE_BASE_URL or " +
      "SINAPLINT_ENGINE_URL to your Core service’s public HTTPS URL (not localhost). " +
      "Ensure the Core service is running and SINAPLINT_ENGINE_API_KEY matches the Core secret."
    );
  }

  // Motor respondeu mas falhou internamente (ex.: sinaplint_failed no Core).
  if (
    lower.includes("motor remoto") ||
    lower.includes("remote engine") ||
    lower.includes("http 500") ||
    lower.includes("upstream_status") && lower.includes("500")
  ) {
    return "The analysis engine hit an error. Try another repository or retry later.";
  }

  // Timeout no cliente HTTP Django → motor ou análise longa.
  if (lower.includes("timed out") || lower.includes("timeout")) {
    return "The analysis took too long or the service is busy. Try a smaller public repo or retry shortly.";
  }

  // 503 genérico (fila, motor indisponível) sem texto de rede/timeout acima.
  if (status === 503) {
    return "The analysis service is temporarily unavailable. Try again in a moment or use a smaller repo.";
  }

  // Validação PT do Django → EN
  if (lower.includes("apenas repositórios")) {
    return "Only public HTTPS URLs on GitHub, GitLab, or Codeberg are allowed. Check the link and try again.";
  }
  if (lower.includes("use apenas https") || lower.includes("apenas https")) {
    return "Use an HTTPS repository URL (e.g. https://github.com/org/repo).";
  }
  if (lower.includes("url inválida")) {
    return "That doesn’t look like a valid repository URL. Paste the full HTTPS link.";
  }
  if (lower.includes("organização") || lower.includes("caminho completo")) {
    return "Include the full path: organization and repository name.";
  }

  if (raw.length > 280) {
    return `${raw.slice(0, 240)}…`;
  }

  return raw;
}
