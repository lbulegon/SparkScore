export default function Solution() {
  return (
    <section className="bg-black px-6 py-24 text-center text-white">
      <h2 className="mb-6 text-3xl font-semibold">
        Bring structural awareness to your workflow
      </h2>

      <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
        <div>
          <h3 className="mb-2 font-semibold">Behavior Analysis</h3>
          <p className="text-gray-400">Understand how your code actually behaves.</p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Risk Scoring</h3>
          <p className="text-gray-400">Quantify technical risk with real metrics.</p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Pattern Detection</h3>
          <p className="text-gray-400">Identify hidden structural issues.</p>
        </div>
      </div>
    </section>
  );
}
