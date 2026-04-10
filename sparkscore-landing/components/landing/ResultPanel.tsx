"use client";

import Link from "next/link";

import {
  edgeCount,
  fileCount,
  pickBiggestRiskBlock,
  pickInsight,
  scoreTone,
} from "@/lib/analyze-result";
import { registerPath } from "@/lib/site";

export type MeUser = {
  username: string;
  tenant: string;
  api_key: string;
  project_id: number | null;
};

type Props = {
  result: Record<string, unknown>;
  me: MeUser | null;
};

export function ResultPanel({ result, me }: Props) {
  const scoreNum =
    result.score != null && (typeof result.score === "number" || typeof result.score === "string")
      ? Number(result.score)
      : NaN;
  const score = Number.isFinite(scoreNum) ? Math.round(scoreNum) : null;
  const tone = score != null ? scoreTone(score) : null;
  const insight = pickInsight(result);
  const risk = pickBiggestRiskBlock(result);
  const files = fileCount(result);
  const edges = edgeCount(result);

  if (score == null || !tone) {
    return (
      <div className="mt-10 w-full max-w-xl rounded-xl border border-gray-800 bg-gray-900/80 p-6 text-left">
        <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words font-mono text-xs text-gray-400">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="mt-10 w-full max-w-xl rounded-xl border border-gray-800 bg-gray-900/90 p-6 text-left shadow-xl ring-1 ring-white/5">
      <div className={`text-5xl font-bold tabular-nums ${tone.label}`}>{score}</div>
      <p className="mt-1 text-sm text-gray-500">Architecture score</p>

      <p className="mt-4 text-xs text-gray-500">
        System analyzed: {files != null ? files : "—"} files · {edges} connections
      </p>

      <div className="mt-5 rounded-lg border border-amber-500/25 bg-amber-950/20 px-4 py-3">
        <p className="text-lg font-semibold leading-snug text-white">
          <span aria-hidden className="mr-1.5">
            🔥
          </span>
          Biggest risk
        </p>
        <p className="mt-2 text-base font-medium leading-snug text-amber-100">{risk.headline}</p>
        <p className="mt-2 text-sm leading-relaxed text-amber-200/90">{risk.impact}</p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gray-400">{insight}</p>

      <p className="mt-4 border-t border-gray-800/80 pt-4 text-sm text-gray-500">
        See how your system evolves over time — deltas, history, and CI gates when you&apos;re ready.
      </p>

      {!me && (
        <div className="mt-6 rounded-lg bg-blue-600 p-4 text-blue-50">
          <p className="mb-2 text-sm font-medium">
            Save this analysis and track your architecture over time.
          </p>
          <Link href={registerPath()} className="text-sm font-semibold underline decoration-blue-200/80">
            Create free account →
          </Link>
        </div>
      )}

      {me && (
        <p className="mt-4 text-sm text-emerald-400/90">
          Full analysis saved to your project — see{" "}
          <Link href="/dashboard" className="underline hover:text-emerald-300">
            dashboard
          </Link>{" "}
          for history.
        </p>
      )}
    </div>
  );
}
