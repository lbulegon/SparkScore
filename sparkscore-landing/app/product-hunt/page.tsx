import type { Metadata } from "next";
import Link from "next/link";

import { CopyBlock } from "@/components/product-hunt/CopyBlock";

export const metadata: Metadata = {
  title: "SparkScore — Kit Product Hunt",
  description:
    "Tagline, descrição, comentário do maker e checklist para lançar o SparkScore no Product Hunt — PPA e análise semiótica.",
};

const TAGLINE_PRIMARY = "Leitura antecipada — meça o PPA antes de publicar";
const TAGLINE_ALT = "Potencial prévio de ação para comunicação que precisa de impacto";

const SHORT_DESC = `A maioria das ferramentas mede cliques depois do facto. O SparkScore antecipa o Potencial Prévio de Ação (PPA) — predisposição à ação antes da resposta consciente.

SparkUnits, Orbitais e PreCogs organizam a recepção simbólica da sua peça para alinhar mensagem, canal e cultura.`;

const MAKER_COMMENT = `Olá Product Hunt 👋

Criei o SparkScore porque métricas tradicionais chegam tarde: quando já expuseste a peça e gastaste orçamento.

O SparkScore parte de semiótica aplicada e psicologia da recepção: quantifica unidades mínimas de significação (SparkUnits), camadas interpretativas (Orbitais) e projeta o ponto de ignição (PreCogs) — antecipação com método, não promessa de certeza.

Há uma demo técnica reproduzível na landing; com conta, você desbloqueia API e histórico.

Feedback bem-vindo — especialmente de marketing, criativos e equipas que precisam de linguagem comum entre dados e narrativa.`;

const TWITTER_THREAD = `Acabei de lançar o SparkScore no Product Hunt 🚀

PPA — Potencial Prévio de Ação — antes do clique.

SparkUnits · Orbitais · PreCogs

Leitura antecipada

[link]`;

const TAGS = [
  "Marketing",
  "Analytics",
  "SaaS",
  "Artificial Intelligence",
  "Productivity",
];

export default function ProductHuntPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-16 pb-28">
        <p className="text-sm text-gray-500">
          <Link href="/" className="text-amber-400 hover:text-amber-300">
            ← SparkScore
          </Link>
          {" · "}
          <Link href="/launch-checklist" className="text-amber-400 hover:text-amber-300">
            Checklist de lançamento
          </Link>
        </p>

        <header className="mt-8 border-b border-gray-900 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">Product Hunt</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">SparkScore</h1>
          <p className="mt-4 text-xl font-medium leading-snug text-gray-200 md:text-2xl">
            {TAGLINE_PRIMARY}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Tagline alternativa ({TAGLINE_ALT.length} chars):{" "}
            <span className="text-gray-400">{TAGLINE_ALT}</span>
          </p>
        </header>

        <section className="mt-12">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Gancho</h2>
          <p className="mt-3 text-2xl font-semibold text-white md:text-3xl">
            A falha está na recepção — antes do CTR.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Descrição curta (primeira impressão)
          </h2>
          <div className="mt-4 rounded-xl border border-gray-800 bg-gray-900/30 p-6">
            <p className="whitespace-pre-line text-lg leading-relaxed text-gray-300">{SHORT_DESC}</p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Descrição completa</h2>
          <div className="mt-4 space-y-6 text-gray-300">
            <p>O SparkScore integra referenciais de Peirce, Greimas e psicologia da recepção com métricas digitais.</p>
            <p className="font-medium text-white">O que entregamos</p>
            <ul className="list-inside list-disc space-y-2 pl-1 text-gray-400">
              <li>PPA — índice de predisposição à ação antes da veiculação</li>
              <li>SparkUnits — unidades mínimas de significação quantificáveis</li>
              <li>Orbitais — camadas cognitiva, afetiva e cultural</li>
              <li>PreCogs — projeção do ponto de ignição e cenários de irradiação</li>
            </ul>

            <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-5">
              <h3 className="font-semibold text-amber-200">Demo pública</h3>
              <p className="mt-2 text-sm text-gray-400">
                Fluxo técnico com URL de repositório na landing — proxy para o motor de análise; sem registo para
                experimentar.
              </p>
            </div>

            <div className="rounded-lg border border-violet-900/50 bg-violet-950/20 p-5">
              <h3 className="font-semibold text-violet-300">Modo SaaS</h3>
              <p className="mt-2 text-sm text-gray-400">API, histórico de análises e painel por tenant.</p>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Storyboard de vídeo (30–60s)
          </h2>
          <ol className="mt-6 space-y-4">
            {[
              { t: "Gancho (3s)", b: '"Antecipe impacto e recepção — antes de publicar."' },
              { t: "Demo (15s)", b: "Landing → demo → score / insight." },
              { t: "Insight (10s)", b: "PPA e Orbitais em linguagem acessível." },
              { t: "CTA (5s)", b: '"Experimentar na landing" + URL.' },
            ].map((row) => (
              <li
                key={row.t}
                className="flex flex-col gap-1 rounded-lg border border-gray-800 bg-gray-900/20 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4"
              >
                <span className="shrink-0 text-sm font-semibold text-amber-400">{row.t}</span>
                <span className="text-sm text-gray-400">{row.b}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Comentário do maker (colar no dia)
          </h2>
          <div className="mt-4">
            <CopyBlock id="maker-comment" label="Maker comment" text={MAKER_COMMENT} />
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tags sugeridas</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <span
                key={t}
                className="rounded-full border border-gray-700 bg-gray-900/50 px-3 py-1.5 text-sm text-gray-300"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-xl border border-gray-800 bg-gray-950/50 p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Posicionamento</h2>
          <p className="mt-4 text-sm text-gray-500">Não estamos a vender:</p>
          <ul className="mt-2 list-inside list-disc text-sm text-red-400/90">
            <li>só analytics de vanity</li>
            <li>só estética sem métrica</li>
          </ul>
          <p className="mt-4 text-sm text-gray-500">Estamos a vender:</p>
          <p className="mt-2 text-lg font-semibold text-amber-200/90">
            Antecipação semiótica — PPA, ignição e irradiação antes de comprometer orçamento.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Thread Twitter / X</h2>
          <div className="mt-4">
            <CopyBlock id="twitter-thread" label="Thread (substituir [link])" text={TWITTER_THREAD} />
          </div>
        </section>

        <footer className="mt-16 border-t border-gray-900 pt-10 text-center">
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 px-8 py-3 text-sm font-semibold text-stone-950 hover:from-amber-500 hover:to-amber-400"
          >
            Abrir SparkScore
          </Link>
        </footer>
      </div>
    </main>
  );
}
