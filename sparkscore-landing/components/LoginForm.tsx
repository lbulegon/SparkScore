"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { setStoredToken } from "@/lib/auth";
import { readJsonSafe } from "@/lib/json-fetch";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });
      const { data, parseError } = await readJsonSafe<{
        token?: string;
        error?: string;
        detail?: string;
      }>(res);

      if (parseError) {
        setError(parseError);
        return;
      }

      if (!res.ok || !data.token) {
        const base = data.error || `Login failed (HTTP ${res.status}).`;
        const extra = typeof data.detail === "string" ? `\n\n${data.detail}` : "";
        setError(base + extra);
        return;
      }

      setStoredToken(data.token);
      router.replace("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Erro de rede: ${msg}`);
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
      <div className="text-left">
        <label htmlFor="login-username" className="mb-1 block text-sm text-gray-400">
          Username
        </label>
        <input
          id="login-username"
          name="username"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-neutral-950 px-4 py-3 text-white focus:border-gray-500 focus:outline-none"
        />
      </div>
      <div className="text-left">
        <label htmlFor="login-password" className="mb-1 block text-sm text-gray-400">
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-700 bg-neutral-950 px-4 py-3 text-white focus:border-gray-500 focus:outline-none"
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
        {loading ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-gray-500">
        No account?{" "}
        <Link href="/register" className="font-semibold text-white underline">
          Register
        </Link>
      </p>
    </motion.form>
  );
}
