"use client";

import { motion } from "framer-motion";

import Link from "next/link";

import { registerPath } from "@/lib/site";

export default function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-bold leading-tight md:text-7xl"
      >
        SparkScore —{" "}
        <span className="bg-gradient-to-r from-amber-200 to-violet-400 bg-clip-text text-transparent">
          Certainty Ahead
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-6 max-w-xl text-lg text-gray-400"
      >
        Plataforma de análise semiótica: quantifica o <strong className="text-stone-200">PPA</strong>{" "}
        (Potencial Prévio de Ação) e as <strong className="text-stone-200">SparkUnits</strong> antes da
        publicação — para alinhar mensagem, canal e impacto.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 flex flex-wrap justify-center gap-4"
      >
        <Link
          href={registerPath()}
          className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-3 font-semibold text-stone-950 hover:from-amber-500 hover:to-amber-400"
        >
          Obter acesso API
        </Link>

        <a
          href="#demo-analyze"
          className="rounded-xl border border-stone-600 px-6 py-3 text-stone-200 hover:bg-stone-900/80"
        >
          Demo ao vivo
        </a>
      </motion.div>
    </section>
  );
}
