import Link from "next/link";

import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-xl text-center">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-gray-500 hover:text-gray-300"
        >
          ← SparkScore
        </Link>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Get your API key</h1>
        <p className="mt-3 text-gray-400">
          One account → tenant, default project, and keys for{" "}
          <code className="text-gray-300">/analyze/</code>.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-xl">
        <RegisterForm />
      </div>
    </div>
  );
}
