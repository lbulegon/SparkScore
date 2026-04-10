/** Campos comuns na resposta JSON do motor / SaaS. */

export function pickInsight(data: Record<string, unknown>): string {
  const keys = ["insight", "summary", "biggest_risk", "message", "headline"] as const;
  for (const k of keys) {
    const v = data[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "Analysis complete. Open the dashboard for history and deltas over time.";
}

export function scoreTone(score: number): { bar: string; label: string } {
  if (score >= 80) return { bar: "bg-emerald-500", label: "text-emerald-400" };
  if (score >= 50) return { bar: "bg-amber-400", label: "text-amber-300" };
  return { bar: "bg-red-500", label: "text-red-400" };
}

export function cycleCount(result: Record<string, unknown>): number {
  const arch = result.architecture;
  if (!arch || typeof arch !== "object" || arch === null) return 0;
  const c = (arch as Record<string, unknown>).cycles;
  return Array.isArray(c) ? c.length : 0;
}

/** Número de arestas no grafo (se o motor enviar `architecture.edges`). */
export function edgeCount(result: Record<string, unknown>): number {
  const arch = result.architecture;
  if (!arch || typeof arch !== "object" || arch === null) return 0;
  const e = (arch as Record<string, unknown>).edges;
  if (Array.isArray(e)) return e.length;
  if (typeof e === "number" && Number.isFinite(e)) return Math.max(0, Math.round(e));
  return 0;
}

/** Ficheiros analisados — vários nomes possíveis no JSON do motor. */
export function fileCount(result: Record<string, unknown>): number | null {
  const keys = ["total_files", "totalFiles", "files_analyzed", "file_count"] as const;
  for (const k of keys) {
    const v = result[k];
    if (typeof v === "number" && Number.isFinite(v)) return Math.max(0, Math.round(v));
  }
  return null;
}

export type BiggestRiskBlock = { headline: string; impact: string };

/**
 * Risco principal + impacto em linguagem humana (conversão).
 * Se o motor enviar `biggest_risk` (string), usa como headline e um impacto genérico.
 */
export function pickBiggestRiskBlock(result: Record<string, unknown>): BiggestRiskBlock {
  const direct = result.biggest_risk;
  if (typeof direct === "string" && direct.trim()) {
    return {
      headline: direct.trim(),
      impact: "Left unchecked, structural issues compound and slow down every change.",
    };
  }

  const cycles = cycleCount(result);
  const scoreNum = result.score != null ? Number(result.score) : NaN;
  const score = Number.isFinite(scoreNum) ? Math.round(scoreNum) : null;

  if (cycles > 0) {
    const n = cycles;
    return {
      headline: `Your system has ${n} dependency cycle${n === 1 ? "" : "s"}.`,
      impact: "This will make it harder to maintain, test, and evolve safely.",
    };
  }
  if (score != null && score < 70) {
    return {
      headline: "High coupling between modules.",
      impact: "Changes ripple across the codebase and slow down delivery.",
    };
  }
  return {
    headline: "No critical structural issues detected in this pass.",
    impact: "Keep tracking over time — architecture drift can creep in quietly.",
  };
}

/** @deprecated usar pickBiggestRiskBlock */
export function pickBiggestRisk(result: Record<string, unknown>): string {
  const { headline, impact } = pickBiggestRiskBlock(result);
  return impact ? `${headline} ${impact}` : headline;
}
