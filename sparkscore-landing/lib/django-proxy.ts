/**
 * Chamadas ao Django SaaS: tenta rota na raiz e, se 404, a variante /api/... (aliases no backend).
 */
const HEADERS_JSON = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;

export async function postDjangoAuth(
  base: string,
  which: "register" | "login",
  body: unknown
): Promise<{ res: Response; text: string }> {
  const bodyStr = JSON.stringify(body);
  const primary = which === "register" ? "/auth/register/" : "/auth/login/";
  const alternate = which === "register" ? "/api/auth/register/" : "/api/auth/login/";

  let res = await fetch(`${base}${primary}`, {
    method: "POST",
    headers: HEADERS_JSON,
    body: bodyStr,
  });
  let text = await res.text();

  if (res.status === 404) {
    const res2 = await fetch(`${base}${alternate}`, {
      method: "POST",
      headers: HEADERS_JSON,
      body: bodyStr,
    });
    const text2 = await res2.text();
    if (res2.status !== 404) {
      return { res: res2, text: text2 };
    }
  }

  return { res, text };
}

export const DJANGO_404_HINT =
  "Confirme no Railway: o serviço da API Django tem Root Directory = raiz do repositório (vazio), NÃO sparkscore-landing; o arranque deve ser gunicorn do backend (railway.json na raiz). Na landing, defina SPARKSCORE_API_URL (runtime) ou NEXT_PUBLIC_SPARKSCORE_API_URL.";
