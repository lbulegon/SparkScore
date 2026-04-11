"use client";

import { CheckItem, useLaunchChecklist } from "@/components/launch-checklist/ChecklistStorage";

const SECTIONS: { id: string; title: string; intro?: string; items: CheckItem[] }[] = [
  {
    id: "critical",
    title: "1. Crítico (sem isto, não lança)",
    items: [
      { id: "c-demo-speed", label: "Demo responde em ~5–8s (repo pequeno); UI não trava; loading visível (“Analyzing…”)" },
      { id: "c-error-invalid", label: "Erro tratado: repo inválido com mensagem amigável" },
      { id: "c-test-small", label: "Testado: repo pequeno" },
      { id: "c-test-medium", label: "Testado: repo médio" },
      { id: "c-test-invalid", label: "Testado: repo inválido" },
      { id: "c-input", label: "Input sem fricção: placeholder com exemplo; URL colada direta; botão visível sem scroll; mobile OK" },
      { id: "c-result-3s", label: "Resultado legível em ~3s: score claro, Biggest risk, ≥1 insight simples" },
      { id: "c-cta", label: "CTA pós-análise: “Create account” visível; link /register funciona" },
      { id: "c-backend", label: "Backend: valida repo_url (GitHub/GitLab/Codeberg); timeout no motor; sem execução arbitrária; limite de tamanho/URL (equipa Core)" },
    ],
  },
  {
    id: "high",
    title: "2. Alto impacto (conversão)",
    items: [
      { id: "h-headline", label: "Headline com tensão + promessa (não parece “lint” genérico)" },
      { id: "h-insight", label: "Insight humano (Biggest risk + texto); não só números" },
      { id: "h-nosignup", label: "“No signup required” visível junto ao input" },
      { id: "h-example-repo", label: "Primeiro sucesso rápido: exemplo sugerido funciona (ex.: facebook/react)" },
    ],
  },
  {
    id: "ph",
    title: "3. Product Hunt ready",
    items: [
      { id: "ph-video", label: "Vídeo 30–60s: colar repo → score → insight (PR opcional)" },
      { id: "ph-page", label: "Página PH: tagline, descrição, maker comment (ver /product-hunt)" },
      { id: "ph-screens", label: "3–5 screenshots prontos" },
      { id: "ph-dist", label: "Distribuição: tweet, lista de contactos, comunidades dev" },
    ],
  },
  {
    id: "saas",
    title: "4. SaaS / monetização",
    items: [
      { id: "s-stripe", label: "Stripe: checkout + webhook + plano aplicado (se já estiver no produto)" },
      { id: "s-limits", label: "Limites free: mensagem clara (“10/10 analyses”)" },
      { id: "s-auth", label: "Auth: login OK; sessão; API key funcional" },
    ],
  },
  {
    id: "dash",
    title: "5. Dashboard",
    items: [
      { id: "d-history", label: "Histórico de análises; ordenação OK; empty state não quebra" },
      { id: "d-usage", label: "Uso/limites visíveis e atualizam após análise (quando aplicável)" },
      { id: "d-billing", label: "Billing: plano e estado visíveis (quando aplicável)" },
    ],
  },
  {
    id: "polish",
    title: "6. Detalhes que fazem diferença",
    items: [
      { id: "p-perf", label: "Performance: 1ª análise perceptível <10s quando possível; cache se existir" },
      { id: "p-ux", label: "UX: loading suave; sem flash estranho; feedback claro" },
      { id: "p-err", label: "Erros: inválido e timeout com mensagens distintas e acionáveis" },
    ],
  },
];

const TESTS: CheckItem[] = [
  { id: "t-leigo", label: "Teste com pessoa não técnica: “O que isto faz?” — resposta em ~5s ou ajustar copy" },
  { id: "t-dev", label: "Teste dev: feedback onde trava / hesita" },
  { id: "t-mobile", label: "Teste mobile: input, botão, layout" },
];

const FINAL: CheckItem[] = [
  { id: "f1", label: "Consigo colar repo e ver valor em <10s" },
  { id: "f2", label: "Entendo o resultado em <3s" },
  { id: "f3", label: "Sei o que fazer a seguir (CTA claro)" },
  { id: "f4", label: "Consigo criar conta sem fricção" },
  { id: "f5", label: "Dashboard funciona" },
];

const ALL_ITEMS: CheckItem[] = [
  ...SECTIONS.flatMap((s) => s.items),
  ...TESTS.map((t) => ({ ...t, id: `test-${t.id}` })),
  ...FINAL,
];

export function LaunchChecklistClient() {
  const { checked, toggle, reset, done, total } = useLaunchChecklist(ALL_ITEMS);

  return (
    <div className="mt-10 space-y-14">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-800 bg-gray-900/40 px-4 py-3">
        <p className="text-sm text-gray-400">
          Progresso: <span className="font-semibold text-white">{done}</span> / {total}
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-900"
        >
          Limpar marcações
        </button>
      </div>

      {SECTIONS.map((section) => (
        <section key={section.id}>
          <h2 className="text-lg font-semibold text-white">{section.title}</h2>
          {section.intro && <p className="mt-2 text-sm text-gray-500">{section.intro}</p>}
          <ul className="mt-4 space-y-3">
            {section.items.map((item) => (
              <li key={item.id}>
                <label className="flex cursor-pointer gap-3 text-left text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={!!checked[item.id]}
                    onChange={() => toggle(item.id)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-gray-600 bg-gray-900 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={checked[item.id] ? "text-gray-500 line-through" : ""}>{item.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section>
        <h2 className="text-lg font-semibold text-white">Teste final (obrigatório)</h2>
        <ul className="mt-4 space-y-3">
          {TESTS.map((item) => {
            const id = `test-${item.id}`;
            return (
              <li key={id}>
                <label className="flex cursor-pointer gap-3 text-left text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={!!checked[id]}
                    onChange={() => toggle(id)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-gray-600 bg-gray-900 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={checked[id] ? "text-gray-500 line-through" : ""}>{item.label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-xl border border-amber-900/40 bg-amber-950/10 p-6">
        <h2 className="text-lg font-semibold text-amber-200">Check final (sim/não)</h2>
        <ul className="mt-4 space-y-3">
          {FINAL.map((item) => (
            <li key={item.id}>
              <label className="flex cursor-pointer gap-3 text-left text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={!!checked[item.id]}
                  onChange={() => toggle(item.id)}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-gray-600 bg-gray-900 text-blue-600 focus:ring-blue-500"
                />
                <span className={checked[item.id] ? "text-gray-500 line-through" : ""}>{item.label}</span>
              </label>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-gray-500">
          Se tudo acima estiver alinhado com o produto: <strong className="text-gray-400">você está pronto para lançar</strong>.
          A parte difícil (produto + motor + SaaS) já está; agora é <span className="text-gray-400">percepção + distribuição</span>.
        </p>
      </section>
    </div>
  );
}
