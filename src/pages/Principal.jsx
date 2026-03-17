import { useEffect, useState } from "react";

// ── Helpers de storage por mês ───────────────────────────────
const MONTHS_PT = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];
const monthKey = (y, m) => `${y}-${String(m + 1).padStart(2, "0")}`;

export function loadMonth(key) {
  try {
    return (
      JSON.parse(localStorage.getItem(`financa_${key}`)) ||
      { fixas: [], mensais: [], income: 0 }
    );
  } catch {
    return { fixas: [], mensais: [], income: 0 };
  }
}
export function saveMonth(key, data) {
  localStorage.setItem(`financa_${key}`, JSON.stringify(data));
}

// ── Constantes ───────────────────────────────────────────────
const fmt = (n) =>
  "R$\u00a0" +
  Number(n).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const CAT_FIXAS = [
  "🏠 Moradia","💡 Energia/Água","📱 Telefone/Net","🚗 Transporte",
  "🏥 Saúde","📚 Educação","🔒 Seguro","📦 Outros",
];
const CAT_MENSAIS = [
  "🛒 Alimentação","🎮 Lazer","👗 Vestuário","💊 Farmácia",
  "🚕 Transporte","🍕 Delivery","🎁 Presente","📦 Outros",
];
const ICON_COLORS = {
  "🏠":"bg-violet-100 text-violet-700","💡":"bg-yellow-100 text-yellow-700",
  "📱":"bg-blue-100 text-blue-700","🚗":"bg-green-100 text-green-700",
  "🏥":"bg-red-100 text-red-700","📚":"bg-violet-100 text-violet-700",
  "🔒":"bg-slate-100 text-slate-500","🛒":"bg-pink-100 text-pink-700",
  "🎮":"bg-sky-100 text-sky-700","👗":"bg-fuchsia-100 text-fuchsia-700",
  "💊":"bg-red-100 text-red-700","🍕":"bg-orange-100 text-orange-700",
  "🎁":"bg-pink-100 text-pink-700","🚕":"bg-green-100 text-green-700",
  "📦":"bg-slate-100 text-slate-500",
};
const iconColor = (cat) => ICON_COLORS[cat.split(" ")[0]] || "bg-slate-100 text-slate-500";

// ── Componentes ──────────────────────────────────────────────
function ItemRow({ item, onDelete, readOnly }) {
  const emoji = item.cat.split(" ")[0];
  return (
    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:shadow-md hover:translate-x-0.5 transition-all duration-200">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${iconColor(item.cat)}`}>
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-slate-800 truncate">{item.nome}</div>
        <div className="text-xs text-slate-400 mt-0.5">{item.cat}</div>
      </div>
      <div className="font-semibold text-sm text-red-500 ml-auto mr-3 font-mono">{fmt(item.val)}</div>
      {!readOnly && (
        <button
          onClick={() => onDelete(item.id)}
          className="text-xs bg-red-50 text-red-400 border border-red-100 rounded-lg px-3 py-1.5 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-150"
        >✕</button>
      )}
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="text-center py-12 px-6 text-slate-300 bg-white border-2 border-dashed border-slate-200 rounded-xl">
      <div className="text-4xl mb-2 opacity-50">{icon}</div>
      <p className="text-sm" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}

// ── Página principal ─────────────────────────────────────────
export default function Principal({ navigate }) {
  const now = new Date();
  const [selYear, setSelYear]   = useState(now.getFullYear());
  const [selMonth, setSelMonth] = useState(now.getMonth());

  const isCurrentMonth =
    selYear === now.getFullYear() && selMonth === now.getMonth();

  const key = monthKey(selYear, selMonth);
  const [monthData, setMonthData] = useState(() => loadMonth(key));

  // Recarrega ao trocar de mês
  useEffect(() => { setMonthData(loadMonth(key)); }, [key]);

  // Salva ao alterar dados
  useEffect(() => { saveMonth(key, monthData); }, [monthData, key]);

  const { fixas, mensais, income } = monthData;
  const setFixas   = (fn) => setMonthData((d) => ({ ...d, fixas:   typeof fn === "function" ? fn(d.fixas)   : fn }));
  const setMensais = (fn) => setMonthData((d) => ({ ...d, mensais: typeof fn === "function" ? fn(d.mensais) : fn }));
  const setIncome  = (v)  => setMonthData((d) => ({ ...d, income: v }));

  const [tab, setTab]   = useState("fixas");
  const [nome, setNome] = useState("");
  const [val, setVal]   = useState("");
  const [cat, setCat]   = useState(CAT_FIXAS[0]);

  const catList = tab === "fixas" ? CAT_FIXAS : CAT_MENSAIS;
  useEffect(() => { setCat(tab === "fixas" ? CAT_FIXAS[0] : CAT_MENSAIS[0]); }, [tab]);

  const totalFixas   = fixas.reduce((s, f) => s + f.val, 0);
  const totalMensais = mensais.reduce((s, m) => s + m.val, 0);
  const totalGasto   = totalFixas + totalMensais;
  const sobrou       = income - totalGasto;
  const pct          = income > 0 ? Math.min(100, Math.round((totalGasto / income) * 100)) : 0;

  const lista    = tab === "fixas" ? fixas : mensais;
  const setLista = tab === "fixas" ? setFixas : setMensais;

  function addItem() {
    const v = parseFloat(val);
    if (!nome.trim() || isNaN(v) || v <= 0) return;
    setLista((prev) => [...prev, { id: Date.now(), nome: nome.trim(), cat, val: v }]);
    setNome(""); setVal("");
  }
  function removeItem(id) {
    setLista((prev) => prev.filter((item) => item.id !== id));
  }

  const years      = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);
  const emptyIcon  = tab === "fixas" ? "📌" : "🛒";
  const emptyText  = tab === "fixas"
    ? "Nenhuma conta fixa ainda.<br/>Adicione suas contas recorrentes acima."
    : "Nenhum gasto mensal ainda.<br/>Adicione seus gastos variáveis acima.";
  const totalAtual = tab === "fixas" ? totalFixas : totalMensais;
  const totalLabel = tab === "fixas" ? "Total em contas fixas" : "Total em gastos mensais";

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
          onClick={() => navigate("historico")}
          className="text-sm px-4 py-1.5 rounded-xl font-medium text-slate-400 hover:text-indigo-600 transition-all"
        >🗂 Histórico</button>
      </div>

      <div className="fade-up flex flex-col items-center p-6 gap-5 max-w-3xl mx-auto">

        {/* SELETOR DE MÊS */}
        <div className="flex flex-wrap items-center gap-3 bg-white w-full rounded-2xl px-6 py-4 border border-slate-100 shadow-sm">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">📅 Mês</span>
          <select
            value={selMonth}
            onChange={(e) => setSelMonth(Number(e.target.value))}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 bg-white"
          >
            {MONTHS_PT.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select
            value={selYear}
            onChange={(e) => setSelYear(Number(e.target.value))}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 bg-white"
          >
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
          {!isCurrentMonth ? (
            <span className="ml-auto text-xs bg-amber-100 text-amber-600 rounded-full px-3 py-1">
              👁 Histórico — somente leitura
            </span>
          ) : (
            <span className="ml-auto text-xs bg-green-100 text-green-600 rounded-full px-3 py-1">
              ✅ Mês atual
            </span>
          )}
        </div>

        {/* RENDA */}
        <div className="flex flex-wrap bg-white w-full rounded-2xl items-center justify-center gap-3 px-6 py-4 border border-slate-100">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide whitespace-nowrap">
            💰 Renda mensal
          </label>
          <input
            type="number"
            value={income || ""}
            onChange={(e) => isCurrentMonth && setIncome(parseFloat(e.target.value) || 0)}
            readOnly={!isCurrentMonth}
            placeholder="0,00"
            className={`font-semibold text-base text-fuchsia-700 bg-fuchsia-50 border-2 border-fuchsia-200 rounded-xl px-5 h-11 w-48 outline-none transition-colors
              ${isCurrentMonth ? "focus:border-fuchsia-400" : "opacity-60 cursor-default"}`}
          />
          <label className="text-xs text-slate-400">
            {isCurrentMonth ? "Defina quanto você recebe por mês" : `${MONTHS_PT[selMonth]} ${selYear}`}
          </label>
        </div>

        {/* CARDS */}
        <section className="grid grid-cols-3 gap-4 w-full">
          <div className="bg-white rounded-2xl p-4 border border-slate-100">
            <div className="text-2xl mb-1">📉</div>
            <div className="text-xs font-medium text-slate-400 uppercase mb-2">Total Gasto</div>
            <div className="font-bold text-2xl text-red-500">{fmt(totalGasto)}</div>
            <div className="text-xs text-slate-300 mt-1.5">
              Fixas: {fmt(totalFixas)} · Mensais: {fmt(totalMensais)}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100">
            <div className="text-2xl mb-1">💵</div>
            <div className="text-xs font-medium text-slate-400 uppercase mb-2">Disponível</div>
            <div className="font-bold text-2xl text-green-500">{fmt(income)}</div>
            <div className="text-xs text-slate-300 mt-1.5">Renda informada</div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: "linear-gradient(135deg,#5b5ef4,#9b59f5)" }}>
            <div className="text-2xl mb-1">✨</div>
            <div className="text-xs font-medium text-white/70 uppercase mb-2">Sobrou</div>
            <div className={`font-bold text-2xl ${sobrou < 0 ? "text-red-300" : "text-white"}`}>{fmt(sobrou)}</div>
            <div className="text-xs text-white/60 mt-1.5">
              {income > 0 ? `${100 - pct}% do orçamento livre` : "Informe sua renda"}
            </div>
          </div>
        </section>

        {/* BARRA DE PROGRESSO */}
        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 w-full">
          <div className="flex justify-between text-xs font-medium text-slate-400 mb-3">
            <span>Comprometido do orçamento</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: pct >= 80
                  ? "linear-gradient(90deg,#f59e0b,#ef4444)"
                  : "linear-gradient(90deg,#5b5ef4,#9b59f5)",
              }}
            />
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-1 bg-slate-100 border border-slate-200 rounded-2xl p-1.5 w-full">
          {[
            { key: "fixas", icon: "📌", label: "Contas Fixas" },
            { key: "mensais", icon: "🛒", label: "Gastos Mensais" },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200
                ${tab === key ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-700"}`}
            >
              <span>{icon}</span>{label}
            </button>
          ))}
        </div>

        {/* PAINEL DA LISTA */}
        <div className="bg-white border border-slate-200 rounded-2xl w-full overflow-hidden">
          {isCurrentMonth && (
            <div className="flex flex-wrap gap-2 p-4 border-b border-slate-100">
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
                placeholder="Nome da despesa"
                className="flex-1 min-w-32 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400 bg-white text-slate-700"
              >
                {catList.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input
                type="number"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
                placeholder="Valor"
                className="w-28 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <button
                onClick={addItem}
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
              >+ Adicionar</button>
            </div>
          )}
          <div className="p-3 flex flex-col gap-2">
            {lista.length === 0 ? (
              <EmptyState icon={emptyIcon} text={emptyText} />
            ) : (
              <>
                {lista.map((item) => (
                  <ItemRow key={item.id} item={item} onDelete={removeItem} readOnly={!isCurrentMonth} />
                ))}
                <div className="flex items-center justify-between px-4 py-3.5 bg-indigo-50 border border-indigo-200 rounded-xl mt-1">
                  <span className="font-semibold text-sm text-indigo-700">{totalLabel}</span>
                  <strong className="text-base text-indigo-700">{fmt(totalAtual)}</strong>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </>
  );
}