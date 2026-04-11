import type { Metadata } from "next";
import Link from "next/link";

import { LaunchChecklistClient } from "@/components/launch-checklist/LaunchChecklistClient";

export const metadata: Metadata = {
  title: "SparkScore — Checklist de lançamento",
  description: "Pre-launch checklist: demo, UX, Product Hunt, SaaS, dashboard, and final go/no-go.",
};

export default function LaunchChecklistPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-14 pb-24">
        <p className="text-sm text-gray-500">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← SparkScore
          </Link>
          {" · "}
          <Link href="/product-hunt" className="text-blue-400 hover:text-blue-300">
            Product Hunt kit
          </Link>
        </p>

        <header className="mt-8 border-b border-gray-900 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">Launch</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Checklist final — SparkScore</h1>
          <p className="mt-3 text-gray-400">
            Use esta página antes do lançamento. Marque os itens conforme for validando — o progresso fica salvo
            neste navegador.
          </p>
        </header>

        <LaunchChecklistClient />
      </div>
    </main>
  );
}
