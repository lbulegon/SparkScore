"use client";

/**
 * Pré-visualização estática do “mapa” + score opcional (quando já há resultado no hero).
 */
export function ArchitectureGraphPreview({ score }: { score: number | null }) {
  return (
    <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-950 via-black to-violet-950/30 p-8 md:p-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.12),_transparent_55%)]" />

      <div className="relative flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">
            Orbitais &amp; irradiação
          </p>
          <h3 className="text-2xl font-bold text-white md:text-3xl">Ver o sistema simbólico, não só o ficheiro</h3>
          <p className="max-w-md text-sm text-gray-400">
            O SparkScore organiza sinais em camadas (cognitiva, afetiva, cultural) para que o PPA e o risco de
            desalinhamento apareçam antes da veiculação.
          </p>
        </div>

        <div className="relative h-48 w-full max-w-xs shrink-0 md:h-56">
          <svg viewBox="0 0 200 200" className="h-full w-full text-violet-500/90" aria-hidden>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <line x1="40" y1="100" x2="100" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <line x1="100" y1="50" x2="160" y2="100" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <line x1="160" y1="100" x2="100" y2="160" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <line x1="100" y1="160" x2="40" y2="100" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <line x1="100" y1="50" x2="100" y2="160" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
            <circle cx="40" cy="100" r="14" fill="#1e293b" stroke="currentColor" strokeWidth="2" filter="url(#glow)" />
            <circle cx="100" cy="50" r="14" fill="#1e293b" stroke="currentColor" strokeWidth="2" />
            <circle cx="160" cy="100" r="14" fill="#1e293b" stroke="currentColor" strokeWidth="2" />
            <circle cx="100" cy="160" r="14" fill="#1e293b" stroke="currentColor" strokeWidth="2" />
            <circle cx="100" cy="100" r="18" fill="#2e1064" stroke="#a78bfa" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {score != null && (
        <div className="relative mt-8 flex items-center justify-center gap-3 rounded-xl border border-gray-800/80 bg-black/40 px-4 py-3 text-center">
          <span className="text-xs uppercase tracking-wider text-gray-500">Última corrida</span>
          <span className="font-mono text-2xl font-bold text-emerald-400">{score}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      )}
    </div>
  );
}
