import Link from "next/link";

import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-xl text-center">
        <Link href="/" className="mb-8 inline-block text-sm text-gray-500 hover:text-gray-300">
          ← SparkScore
        </Link>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Sign in</h1>
        <p className="mt-3 text-gray-400">Access your dashboard and API keys.</p>
      </div>

      <div className="mx-auto mt-12 max-w-xl">
        <LoginForm />
      </div>
    </div>
  );
}
