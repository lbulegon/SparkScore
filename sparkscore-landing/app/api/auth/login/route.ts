import { NextRequest, NextResponse } from "next/server";

import { DJANGO_404_HINT, postDjangoAuth } from "@/lib/django-proxy";
import { getBackendBaseUrl } from "@/lib/backend-url";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const base = getBackendBaseUrl();
  if (!base) {
    return NextResponse.json(
      {
        error:
          "Backend URL not configured. Set NEXT_PUBLIC_SPARKSCORE_API_URL on this Railway service.",
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let res: Response;
  let text: string;
  try {
    const out = await postDjangoAuth(base, "login", body);
    res = out.res;
    text = out.text;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `Cannot reach Django API. (${msg})` }, { status: 502 });
  }

  if (res.status === 404) {
    return NextResponse.json(
      {
        error:
          "O backend não expõe /auth/login/ nem /api/auth/login/ (404). Verifique o URL do serviço Django na Railway.",
        detail: DJANGO_404_HINT,
      },
      { status: 502 }
    );
  }

  let data: unknown = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    return NextResponse.json(
      {
        error: `Non-JSON from API (HTTP ${res.status}). ${text.slice(0, 160)}`,
        detail: res.status === 404 ? DJANGO_404_HINT : undefined,
      },
      { status: 502 }
    );
  }
  return NextResponse.json(data, { status: res.status });
}
