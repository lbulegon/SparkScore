import Link from "next/link";

import { registerPath } from "@/lib/site";

export default function CTA() {
  return (
    <section
      id="register"
      className="bg-neutral-950 px-6 py-24 text-center text-white"
    >
      <h2 className="mb-6 text-4xl font-bold">
        Start understanding your code like a system
      </h2>

      <p className="mx-auto mb-8 max-w-lg text-gray-400">
        Create an account and receive your tenant API key and default project id for{" "}
        <code className="text-gray-300">POST /analyze/</code>.
      </p>

      <Link
        href={registerPath()}
        className="inline-block rounded-xl bg-white px-8 py-4 font-semibold text-black hover:opacity-90"
      >
        Get API Key
      </Link>
    </section>
  );
}
