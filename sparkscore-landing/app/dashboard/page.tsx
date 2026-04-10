"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { AnalyzeRequestModal } from "@/components/AnalyzeRequestModal";
import { clearStoredToken, getStoredToken } from "@/lib/auth";

type Me = {
  username: string;
  tenant: string;
  api_key: string;
  project_id: number | null;
};

type AnalysisRow = {
  id: number;
  project_id: number;
  project_name: string;
  score: number;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [rows, setRows] = useState<AnalysisRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzeOpen, setAnalyzeOpen] = useState(false);

  const authFetch = useCallback(async (path: string) => {
    const t = getStoredToken();
    if (!t) return null;
    const res = await fetch(path, {
      headers: {
        Authorization: `Token ${t}`,
        Accept: "application/json",
      },
    });
    return res;
  }, []);

  const refreshAnalyses = useCallback(async () => {
    const rA = await authFetch("/api/me/analyses");
    if (rA?.ok) {
      const data = (await rA.json()) as { results: AnalysisRow[] };
      setRows(data.results ?? []);
    }
  }, [authFetch]);

  useEffect(() => {
    const t = getStoredToken();
    if (!t) {
      setLoading(false);
      router.replace("/login");
      return;
    }
    setToken(t);

    (async () => {
      const rMe = await authFetch("/api/me");
      if (!rMe?.ok) {
        clearStoredToken();
        setLoading(false);
        router.replace("/login");
        return;
      }
      const j = (await rMe.json()) as Me;
      setMe(j);

      await refreshAnalyses();
      setLoading(false);
    })();
  }, [router, authFetch, refreshAnalyses]);

  function logout() {
    clearStoredToken();
    router.replace("/");
  }

  if (loading || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-300">
              ← SparkScore
            </Link>
            <h1 className="mt-2 text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-400">
              {me?.username} · {me?.tenant}
            </p>
            <p className="mt-3 max-w-lg text-sm text-gray-500">
              Same hybrid flow as the landing: add a <code className="text-gray-400">repo_url</code> in the
              analysis modal for parity with the public demo.{" "}
              <Link href="/#demo-analyze" className="text-amber-400 hover:text-amber-300">
                Abrir demo na landing
              </Link>
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm hover:bg-neutral-900"
          >
            Log out
          </button>
        </div>

        <AnalyzeRequestModal
          open={analyzeOpen}
          onClose={() => setAnalyzeOpen(false)}
          defaultApiKey={me?.api_key ?? ""}
          defaultProjectId={me?.project_id != null ? String(me.project_id) : ""}
          onSuccess={refreshAnalyses}
        />

        <section className="mb-10 rounded-xl border border-gray-800 bg-neutral-950 p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">API access</h2>
            <button
              type="button"
              onClick={() => setAnalyzeOpen(true)}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
            >
              New analysis
            </button>
          </div>
          <dl className="grid gap-3 text-sm md:grid-cols-2">
            <div>
              <dt className="text-gray-500">API key (X-API-KEY)</dt>
              <dd className="break-all font-mono text-green-400">{me?.api_key}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Default project_id</dt>
              <dd className="font-mono text-gray-200">{me?.project_id ?? "—"}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-gray-500">
            Use <code className="text-gray-400">POST /api/sparkscore/saas/v1/analyze/</code> (or{" "}
            <code className="text-gray-400">POST /analyze/</code>) with <code className="text-gray-400">X-API-KEY</code>,{" "}
            <code className="text-gray-400">project_id</code>, and optionally{" "}
            <code className="text-gray-400">repo_url</code> in the JSON body.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Recent analyses</h2>
          {rows.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-800 py-12 text-center text-gray-500">
              No analyses yet. Run <code className="text-gray-400">POST /analyze/</code> with your
              key.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-800 bg-neutral-950 text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">When</th>
                    <th className="px-4 py-3 font-medium">Project</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-gray-900 last:border-0">
                      <td className="px-4 py-3 text-gray-300">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{r.project_name}</td>
                      <td className="px-4 py-3 font-mono">{r.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
