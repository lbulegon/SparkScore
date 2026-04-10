"use client";

import { useCallback, useState } from "react";

type Props = {
  id: string;
  label: string;
  text: string;
};

export function CopyBlock({ id, label, text }: Props) {
  const [done, setDone] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text.trim());
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      setDone(false);
    }
  }, [text]);

  return (
    <div className="relative rounded-xl border border-gray-800 bg-gray-900/40 p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
          aria-describedby={id}
        >
          {done ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        id={id}
        className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-gray-300"
      >
        {text.trim()}
      </pre>
    </div>
  );
}
