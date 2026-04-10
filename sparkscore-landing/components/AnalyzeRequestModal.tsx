"use client";

import { useCallback, useEffect, useId, useState } from "react";

import { friendlyAnalyzeError } from "@/lib/friendly-analyze-error";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultApiKey: string;
  defaultProjectId: string;
  onSuccess?: () => void;
};

export function AnalyzeRequestModal({
  open,
  onClose,
  defaultApiKey,
  defaultProjectId,
  onSuccess,
}: Props) {
  const titleId = useId();
  const [apiKey, setApiKey] = useState(defaultApiKey);
  const [projectId, setProjectId] = useState(defaultProjectId);
  const [repoUrl, setRepoUrl] = useState("");
  const [extraJson, setExtraJson] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (open) {
      setApiKey(defaultApiKey);
      setProjectId(defaultProjectId);
      setRepoUrl("");
      setMessage(null);
    }
  }, [open, defaultApiKey, defaultProjectId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const submit = useCallback(async () => {
    setMessage(null);
    const pid = projectId.trim();
    if (!apiKey.trim()) {
      setMessage({ type: "err", text: "Add your X-API-KEY." });
      return;
    }
    if (!pid || Number.isNaN(Number(pid))) {
      setMessage({ type: "err", text: "Enter a numeric project_id." });
      return;
    }

    let payload: Record<string, unknown> = { project_id: Number(pid) };
    const repo = repoUrl.trim();
    if (repo) {
      payload.repo_url = repo;
    }
    if (extraJson.trim()) {
      try {
        const parsed = JSON.parse(extraJson.trim()) as unknown;
        if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
          setMessage({ type: "err", text: "Extra JSON must be an object." });
          return;
        }
        payload = { ...(parsed as Record<string, unknown>), ...payload, project_id: Number(pid) };
        if (repo) payload.repo_url = repo;
      } catch {
        setMessage({ type: "err", text: "Invalid extra JSON." });
        return;
      }
    }

    setSubmitting(true);
    try {
      const body = { ...payload, api_key: apiKey.trim() };
      const res = await fetch("/api/sparkscore/saas/v1/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": apiKey.trim(),
        },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) {
        const detail =
          (typeof data.detail === "string" && data.detail) ||
          (typeof data.error === "string" && data.error) ||
          `HTTP ${res.status}`;
        setMessage({ type: "err", text: friendlyAnalyzeError(res.status, detail) });
        return;
      }
      const score = typeof data.score === "number" ? ` Score: ${data.score}.` : "";
      setMessage({ type: "ok", text: `Analysis saved.${score}` });
      onSuccess?.();
    } catch {
      setMessage({ type: "err", text: "Network error calling the API." });
    } finally {
      setSubmitting(false);
    }
  }, [apiKey, projectId, repoUrl, extraJson, onSuccess]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-gray-800 bg-neutral-950 p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="text-lg font-semibold text-white">
          New analysis (SaaS · POST /api/sparkscore/saas/v1/analyze/)
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Values are prefilled from your account. Add a public <code className="text-gray-400">repo_url</code> to
          match the landing demo.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="modal-repo-url" className="block text-xs font-medium text-gray-500">
              repo_url (optional, HTTPS)
            </label>
            <input
              id="modal-repo-url"
              type="url"
              inputMode="url"
              autoComplete="off"
              placeholder="https://github.com/org/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-800 bg-black px-3 py-2 font-mono text-sm text-blue-300 outline-none ring-blue-500/30 focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="modal-api-key" className="block text-xs font-medium text-gray-500">
              X-API-KEY
            </label>
            <input
              id="modal-api-key"
              type="text"
              autoComplete="off"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-800 bg-black px-3 py-2 font-mono text-sm text-green-400 outline-none ring-emerald-500/30 focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="modal-project-id" className="block text-xs font-medium text-gray-500">
              project_id
            </label>
            <input
              id="modal-project-id"
              type="number"
              min={1}
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-800 bg-black px-3 py-2 font-mono text-sm text-gray-200 outline-none ring-emerald-500/30 focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="modal-extra-json" className="block text-xs font-medium text-gray-500">
              Extra JSON body (optional, merged with project_id and repo_url)
            </label>
            <textarea
              id="modal-extra-json"
              rows={4}
              placeholder='{"ficheiros": []}'
              value={extraJson}
              onChange={(e) => setExtraJson(e.target.value)}
              className="mt-1 w-full resize-y rounded-lg border border-gray-800 bg-black px-3 py-2 font-mono text-xs text-gray-300 outline-none ring-emerald-500/30 focus:ring-2"
            />
          </div>
        </div>

        {message && (
          <p
            className={`mt-4 text-sm ${message.type === "ok" ? "text-emerald-400" : "text-red-400"}`}
            role="status"
          >
            {message.text}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-neutral-900"
          >
            Close
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={submit}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Run analysis"}
          </button>
        </div>
      </div>
    </div>
  );
}
