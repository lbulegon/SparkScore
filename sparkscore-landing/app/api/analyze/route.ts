import { NextRequest, NextResponse } from "next/server";

import { getBackendBaseUrl } from "@/lib/backend-url";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const base = getBackendBaseUrl();
  if (!base) {
    return NextResponse.json({ error: "Backend URL not configured." }, { status: 503 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed =
    raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};

  // Header pode ser removido por proxies (ex. Railway) no hop browser → Next.
  const fromHeader = request.headers.get("x-api-key")?.trim();
  const fromBody =
    typeof parsed.api_key === "string" ? parsed.api_key.trim() : "";
  const apiKey = fromHeader || fromBody;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Bad Request", detail: "Envie o header X-API-KEY ou o campo api_key no JSON." },
      { status: 400 }
    );
  }

  const { api_key: _drop, ...forwardBody } = parsed;

  const res = await fetch(`${base.replace(/\/$/, "")}/analyze/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
      Accept: "application/json",
    },
    body: JSON.stringify(forwardBody),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
