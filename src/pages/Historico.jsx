import { loadMonth } from "./Principal.jsx";

const fmt = (n) =>
  "R$\u00a0" +
  Number(n).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const MONTHS_PT = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

function allSavedMonths() {
  const results = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith("financa_")) {
      const mk = k.replace("financa_", "");
      const [y, m] = mk.split("-").map(Number);
      const d = loadMonth(mk);
      const total =
        d.fixas.reduce((s, f) => s + f.val, 0) +
        d.mensais.reduce((s, x) => s + x.val, 0);
      results.push({
        key: mk, year: y, month: m - 1,
        income: d.income, total,
        sobrou: d.income - total,
        nFixas: d.fixas.length,
        nMensais: d.mensais.length,
      });
    }
  }
  return results.sort((a, b) => b.key.localeCompare(a.key));
}

export default function Historico({ navigate }) {
  const now   = new Date();
  const saved = allSavedMonths();

  const totalGastoGeral  = saved.reduce((s, x) => s + x.total, 0);
  const saldoAcumulado   = saved.reduce((s, x) => s + x.sobrou, 0);

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.2s ease; }
      `}</style>

      {/* NAVBAR */}
      <div className="flex items-center justify-between px-7 h-16 w-full text-fuchsia-600 border-b border-fuchsia-200 bg-white sticky top-0 z-50">
        <h1 className="text-xl font-semibold">Finança</h1>
        <button
          onClick={() => navigate("principal")}
          className="text-sm px-4 py-1.5 rounded-xl font-medium text-slate-400 hover:text-indigo-600 transition-all"
        >← Voltar</button>
      </div>

      <div className="fade-up max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-slate-700">🗂 Histórico por mês</h2>

        {/* LISTA DE MESES */}
        {saved.length === 0 ? (
          <div className="text-center py-16 px-6 text-slate-300 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
            <div className="text-5xl mb-3 opacity-40">📂</div>
            <p className="text-sm">Nenhum mês salvo ainda.<br />Os dados aparecem aqui automaticamente.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {saved.map((s) => (
              <div
                key={s.key}
                className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-4 hover:shadow-md hover:border-indigo-200 transition-all duration-200"
              >
                <div className="flex flex-col gap-1">
                  <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                    {MONTHS_PT[s.month]} {s.year}
                    {s.year === now.getFullYear() && s.month === now.getMonth() && (
                      <span className="text-xs bg-indigo-100 text-indigo-600 rounded-full px-2 py-0.5">atual</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    Renda: {fmt(s.income)} · Gasto: {fmt(s.total)}
                  </div>
                  <div className="text-xs text-slate-300">
                    {s.nFixas} conta{s.nFixas !== 1 ? "s" : ""} fixa{s.nFixas !== 1 ? "s" : ""} · {s.nMensais} gasto{s.nMensais !== 1 ? "s" : ""} mensal{s.nMensais !== 1 ? "is" : ""}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`text-sm font-bold ${s.sobrou < 0 ? "text-red-500" : "text-green-500"}`}>
                    {s.sobrou < 0 ? "−" : "+"}{fmt(Math.abs(s.sobrou))}
                  </div>
                  <button
                    onClick={() => navigate("principal")}
                    className="text-xs bg-indigo-50 text-indigo-500 border border-indigo-200 rounded-xl px-3 py-1.5 hover:bg-indigo-500 hover:text-white transition-all duration-150"
                  >Ver →</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RESUMO GERAL */}
        {saved.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5">
            <h3 className="text-sm font-semibold text-slate-600 mb-4">📊 Resumo geral</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-slate-400 mb-1">Meses registrados</div>
                <div className="text-2xl font-bold text-indigo-600">{saved.length}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Total gasto</div>
                <div className="text-2xl font-bold text-red-500">{fmt(totalGastoGeral)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Saldo acumulado</div>
                <div className={`text-2xl font-bold ${saldoAcumulado < 0 ? "text-red-500" : "text-green-500"}`}>
                  {fmt(saldoAcumulado)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}