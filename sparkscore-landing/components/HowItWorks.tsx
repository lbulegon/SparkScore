export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-neutral-950 px-6 py-24 text-center text-white"
    >
      <h2 className="mb-6 text-3xl font-semibold">Simple API. Powerful insight.</h2>

      <div className="mx-auto max-w-xl rounded-xl border border-gray-800 bg-black p-6 text-left text-sm text-green-400">
        POST /analyze
        <br />
        {`{
  "score": 82,
  "issues": [...],
  "insights": [...]
}`}
      </div>
    </section>
  );
}
