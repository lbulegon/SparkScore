"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ArchitectureGraphPreview } from "@/components/landing/ArchitectureGraphPreview";
import { MeUser, ResultPanel } from "@/components/landing/ResultPanel";
import { getStoredToken } from "@/lib/auth";
import { friendlyAnalyzeError } from "@/lib/friendly-analyze-error";
import { registerPath } from "@/lib/site";

const EXAMPLE_REPO = "https://github.com/facebook/react";

export default function LandingPage() {
  const [repo, setRepo] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<MeUser | null>(null);
  const [meChecked, setMeChecked] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setMe(null);
      setMeChecked(true);
      return;
    }
    (async () => {
      const res = await fetch("/api/me", {
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) setMe(null);
      else setMe((await res.json()) as MeUser);
      setMeChecked(true);
    })();
  }, []);

  const previewScore = (() => {
    if (!result || result.score == null) return null;
    const n = Number(result.score);
    return Number.isFinite(n) ? Math.round(n) : null;
  })();

  const analyze = useCallback(async () => {
    setError(null);
    setResult(null);
    const repoUrl = repo.trim();
    if (!repoUrl) {
      setError("Cole um URL HTTPS de repositório (GitHub, GitLab ou Codeberg) — demo técnica.");
      return;
    }

    setLoading(true);
    try {
      if (me?.api_key) {
        const pid = me.project_id;
        if (pid == null) {
          setError("Sem project_id na conta. Contacte suporte ou use a demo sem login.");
          setLoading(false);
          return;
        }
        const res = await fetch("/api/sparkscore/saas/v1/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": me.api_key,
          },
          body: JSON.stringify({
            project_id: pid,
            repo_url: repoUrl,
            api_key: me.api_key,
          }),
        });
        const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
        if (!res.ok) {
          const detail =
            (typeof data.detail === "string" && data.detail) ||
            (typeof data.error === "string" && data.error) ||
            `HTTP ${res.status}`;
          setError(friendlyAnalyzeError(res.status, detail));
          return;
        }
        setResult(data);
        return;
      }

      const res = await fetch("/api/sparkscore/saas/public/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ repo_url: repoUrl }),
      });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) {
        const detail =
          (typeof data.detail === "string" && data.detail) ||
          (typeof data.error === "string" && data.error) ||
          `HTTP ${res.status}`;
        setError(friendlyAnalyzeError(res.status, detail));
        return;
      }
      setResult(data);
    } catch {
      setError("Erro de rede ao chamar a API.");
    } finally {
      setLoading(false);
    }
  }, [me, repo]);

  return (
    <main className="bg-black text-white">
      <section
        id="demo-analyze"
        className="flex min-h-[100dvh] min-h-screen flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-20"
      >
        <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl md:leading-tight">
          Certeza prévia sobre{" "}
          <span className="bg-gradient-to-r from-amber-300 to-violet-400 bg-clip-text text-transparent">
            impacto e recepção
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-gray-400">
          O SparkScore estima o <strong className="text-stone-200">PPA</strong> (Potencial Prévio de Ação) e
          sinais estruturais a partir de um fluxo reproduzível. Abaixo: uma{" "}
          <strong className="text-stone-200">demo técnica</strong> com URL de repositório — proxy para o motor
          de análise.
        </p>

        <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-gray-500">
          <span>✔ SparkUnits</span>
          <span className="hidden text-gray-700 sm:inline">·</span>
          <span>✔ Orbitais</span>
          <span className="hidden text-gray-700 sm:inline">·</span>
          <span>✔ PreCogs (projeção)</span>
        </p>

        <div className="mt-8 w-full max-w-xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <input
              type="url"
              name="repo"
              inputMode="url"
              autoComplete="off"
              placeholder="Ex.: https://github.com/facebook/react"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="min-h-[52px] min-w-0 flex-1 rounded-lg border border-gray-800 bg-gray-900 px-4 py-4 text-left text-sm text-white outline-none ring-amber-500/30 focus:ring-2"
            />
            <button
              type="button"
              disabled={loading || !meChecked}
              onClick={analyze}
              className="min-h-[52px] w-full whitespace-nowrap rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-4 text-sm font-semibold text-stone-950 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 sm:w-auto sm:px-6"
            >
              {loading ? "A analisar…" : "Correr demo"}
            </button>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={() => setRepo(EXAMPLE_REPO)}
            className="mt-2 text-xs text-amber-400 underline decoration-amber-500/50 underline-offset-2 hover:text-amber-300 disabled:opacity-50"
          >
            Usar repositório de exemplo
          </button>
        </div>

        {meChecked && !me && (
          <p className="mt-3 inline-flex items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-950/30 px-4 py-1.5 text-xs font-medium text-emerald-300/95">
            Sem registo — demo instantânea
          </p>
        )}
        {meChecked && me && (
          <p className="mt-3 text-sm text-gray-500">Sessão iniciada — as análises guardam-se no painel.</p>
        )}

        {error && (
          <p
            className="mt-6 max-w-xl text-left text-sm text-red-400"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {loading && (
          <div className="mt-8 flex flex-col items-center gap-3" aria-busy="true" aria-live="polite">
            <div
              className="h-10 w-10 animate-spin rounded-full border-2 border-gray-700 border-t-amber-500"
              aria-hidden
            />
            <span className="text-sm text-gray-500">A processar…</span>
          </div>
        )}

        {result && !loading && <ResultPanel result={result} me={me} />}
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-4xl">A mensagem falha na recepção, não só no texto</h2>
        <p className="text-lg text-gray-400">
          Peças comunicacionais degradam-se por desalinhamento simbólico e de contexto. O SparkScore antecipa
          PPA, ponto de ignição e irradiação — antes de comprometer orçamento e reputação.
        </p>
      </section>

      <section className="bg-gray-900 px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Como funciona</h2>
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3 md:gap-8">
          {[
            {
              title: "1. Ingestão",
              body: "Texto, imagem ou fluxo — normalizamos estímulos e contexto de recepção.",
            },
            {
              title: "2. SparkCore + Orbitais",
              body: "Camadas cognitiva, afetiva e cultural ajustam índices ao público-alvo.",
            },
            {
              title: "3. PreCogs & PPA",
              body: "Projeção do ponto de ignição e do potencial prévio de ação — para decidir antes de lançar.",
            },
          ].map((s) => (
            <div key={s.title} className="text-center">
              <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
              <p className="text-gray-400">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-4xl">Isto não é só analytics</h2>
        <p className="text-lg text-gray-400">
          Dashboards contam cliques depois do facto. O SparkScore lê{" "}
          <strong className="text-stone-300">significação, predisposição e risco estrutural</strong> — a
          camada onde a cultura e a percepção decidem.
        </p>
      </section>

      <section className="px-6 py-20">
        <ArchitectureGraphPreview score={previewScore} />
      </section>

      <section className="border-y border-gray-800 bg-neutral-950 px-6 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="text-2xl font-bold">Experimente a demo, depois persista o que importa</h2>
            <p className="mt-2 text-gray-400">
              Visitantes obtêm uma análise limitada na hora. Contas desbloqueiam histórico, API e fluxo SaaS
              completo.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => document.getElementById("demo-analyze")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-lg border border-gray-600 px-5 py-3 text-sm font-semibold hover:bg-gray-900"
            >
              Correr demo
            </button>
            <Link
              href={registerPath()}
              className="rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-3 text-sm font-semibold text-stone-950 hover:from-amber-500 hover:to-amber-400"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold">Planos</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8">
            <h3 className="text-lg font-bold">Demo</h3>
            <p className="mt-2 text-3xl font-bold text-white">Grátis</p>
            <p className="mt-4 text-sm text-gray-400">Análise instantânea a partir de URL pública. Sem histórico.</p>
            <ul className="mt-6 space-y-2 text-left text-sm text-gray-300">
              <li>• Repositórios HTTPS públicos (ex.: GitHub)</li>
              <li>• Score e insights-chave</li>
              <li>• Sem persistência</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-8 ring-1 ring-amber-500/30">
            <h3 className="text-lg font-bold">SaaS</h3>
            <p className="mt-2 text-3xl font-bold text-white">API + painel</p>
            <p className="mt-4 text-sm text-gray-400">
              Chave de API, análises guardadas, histórico e integração com o teu fluxo de entrega.
            </p>
            <ul className="mt-6 space-y-2 text-left text-sm text-gray-300">
              <li>• Análises persistidas</li>
              <li>• API por tenant</li>
              <li>• Pronto para limites e billing</li>
            </ul>
            <Link
              href={registerPath()}
              className="mt-8 inline-block rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-3 text-sm font-semibold text-stone-950 hover:from-amber-500 hover:to-amber-400"
            >
              Começar
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-900 px-6 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold">FAQ</h2>
        <div className="mx-auto max-w-2xl space-y-8">
          {[
            {
              q: "Preciso de conta para experimentar?",
              a: "Não. Cole um URL de repositório público e corra a demo. Crie conta quando quiser histórico e API.",
            },
            {
              q: "O SparkScore substitui o Google Analytics?",
              a: "Complementa: foca-se em PPA e semiótica da peça antes da ação — não só em cliques depois da exposição.",
            },
            {
              q: "O que é guardado com login?",
              a: "Análises associadas ao projeto para comparar corridas e evolução do risco ao longo do tempo.",
            },
          ].map((item) => (
            <div key={item.q}>
              <h3 className="font-semibold text-white">{item.q}</h3>
              <p className="mt-2 text-gray-400">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-4xl">Certainty Ahead — comece pelo PPA</h2>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 px-10 py-4 font-semibold text-stone-950 hover:from-amber-500 hover:to-amber-400"
        >
          Subir e experimentar
        </button>
        <p className="mt-8 text-sm text-gray-600">
          <Link href="/launch-checklist" className="text-gray-500 hover:text-gray-400">
            Checklist de lançamento
          </Link>
          <span className="mx-2 text-gray-700">·</span>
          <Link href="/product-hunt" className="text-gray-500 hover:text-gray-400">
            Kit Product Hunt
          </Link>
        </p>
      </section>
    </main>
  );
}
