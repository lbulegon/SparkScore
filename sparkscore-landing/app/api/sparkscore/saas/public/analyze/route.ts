import { NextRequest, NextResponse } from "next/server";

import { getBackendBaseUrl } from "@/lib/backend-url";

export const dynamic = "force-dynamic";

/** Proxy: demo sem credenciais → Django `POST .../api/sparkscore/saas/public/analyze/` */
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

  const res = await fetch(`${base.replace(/\/$/, "")}/api/sparkscore/saas/public/analyze/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
