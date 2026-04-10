"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { setStoredToken } from "@/lib/auth";
import { readJsonSafe } from "@/lib/json-fetch";
import { sparkscoreApiUrl } from "@/lib/site";

export default function RegisterForm() {
  const router = useRouter();
  const apiDisplay = sparkscoreApiUrl();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
          email: email.trim() || undefined,
        }),
      });
      const { data, parseError } = await readJsonSafe<{
        token?: string;
        error?: string | string[];
        detail?: string;
      }>(res);

      if (parseError) {
        setError(parseError);
        return;
      }

      if (!res.ok) {
        const msg = data.error;
        const text = Array.isArray(msg) ? msg.join(" ") : msg || res.statusText;
        const extra = typeof data.detail === "string" ? `\n\n${data.detail}` : "";
        setError((text || `Registration failed (HTTP ${res.status}).`) + extra);
        return;
      }

      if (!data.token) {
        const msg = data.error;
        const hint =
          typeof msg === "string"
            ? msg
            : Array.isArray(msg)
              ? msg.join(" ")
              : "No token in response.";
        setError(hint);
        return;
      }

      setStoredToken(data.token);
      router.replace("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(
        `Network or browser error: ${msg}. If the deploy is old, trigger a new deploy of the landing (Root Directory: sparkscore-landing).`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onSubmit}
      className="mx-auto max-w-md space-y-4"
    >
      <p className="text-center text-xs text-gray-500">
        Requests go through this site (same origin) → Django API. Backend URL for proxy:{" "}
        {apiDisplay ? (
          <span className="font-mono text-gray-400">{apiDisplay}</span>
        ) : (
          <span className="text-amber-400">not set (add NEXT_PUBLIC_SPARKSCORE_API_URL)</span>
        )}
      </p>

      <div className="text-left">
        <label htmlFor="username" className="mb-1 block text-sm text-gray-400">
          Username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-neutral-950 px-4 py-3 text-white placeholder-gray-600 focus:border-gray-500 focus:outline-none"
          placeholder="your_name"
        />
      </div>
      <div className="text-left">
        <label htmlFor="password" className="mb-1 block text-sm text-gray-400">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-neutral-950 px-4 py-3 text-white placeholder-gray-600 focus:border-gray-500 focus:outline-none"
        />
      </div>
      <div className="text-left">
        <label htmlFor="email" className="mb-1 block text-sm text-gray-400">
          Email (optional)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-neutral-950 px-4 py-3 text-white placeholder-gray-600 focus:border-gray-500 focus:outline-none"
          placeholder="you@company.com"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-900/80 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-white py-3 font-semibold text-black hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Creating…" : "Create account & go to dashboard"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-white underline">
          Sign in
        </Link>
      </p>
    </motion.form>
  );
}
