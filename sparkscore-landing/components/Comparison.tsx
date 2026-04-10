export default function Comparison() {
  return (
    <section className="bg-black px-6 py-24 text-center text-white">
      <h2 className="mb-12 text-3xl font-semibold">Além das métricas tradicionais</h2>

      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-gray-800 p-6">
          <h3 className="mb-4 font-semibold">Métricas convencionais</h3>
          <ul className="space-y-2 text-gray-400">
            <li>CTR e conversão pós-exposição</li>
            <li>Volume e alcance agregados</li>
            <li>Retrospectiva (o que já aconteceu)</li>
          </ul>
        </div>

        <div className="rounded-xl border border-amber-500/40 bg-amber-950/10 p-6 ring-1 ring-amber-500/20">
          <h3 className="mb-4 font-semibold text-amber-100">SparkScore</h3>
          <ul className="space-y-2 text-stone-200">
            <li>PPA — predisposição à ação antes da resposta</li>
            <li>SparkUnits e Orbitais (camadas perceptivas)</li>
            <li>PreCogs — antecipação do ponto de ignição</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
