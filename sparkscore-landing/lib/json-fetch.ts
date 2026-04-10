/**
 * Lê o corpo como texto e tenta JSON; não lança se vier HTML (ex.: 404 do Next).
 */
export async function readJsonSafe<T extends Record<string, unknown>>(
  res: Response
): Promise<{ data: T; parseError?: string }> {
  const raw = await res.text();
  if (!raw) {
    return { data: {} as T };
  }
  try {
    return { data: JSON.parse(raw) as T };
  } catch {
    return {
      data: {} as T,
      parseError: `Resposta não é JSON (HTTP ${res.status}). Início: ${raw.slice(0, 180)}`,
    };
  }
}
