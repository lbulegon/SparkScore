import { NextRequest, NextResponse } from "next/server";

import { getBackendBaseUrl } from "@/lib/backend-url";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const base = getBackendBaseUrl();
  if (!base) {
    return NextResponse.json({ error: "Backend URL not configured." }, { status: 503 });
  }

  const auth = request.headers.get("authorization");
  const res = await fetch(`${base}/me/analyses/`, {
    headers: {
      ...(auth ? { Authorization: auth } : {}),
      Accept: "application/json",
    },
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
