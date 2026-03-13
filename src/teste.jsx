import { useState, useEffect } from "react";

const fmt = (n) =>
  "R$ " + Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CAT_FIXAS = ["🏠 Moradia","💡 Energia/Água","📱 Telefone/Net","🚗 Transporte","🏥 Saúde","📚 Educação","🔒 Seguro","📦 Outros"];
const CAT_MENSAIS = ["🛒 Alimentação","🎮 Lazer","👗 Vestuário","💊 Farmácia","🚕 Transporte","🍕 Delivery","🎁 Presente","📦 Outros"];

const ICON_COLORS = {
  "🏠": "bg-violet-100 text-violet-700","💡": "bg-yellow-100 text-yellow-700",
  "📱": "bg-blue-100 text-blue-700","🚗": "bg-green-100 text-green-700",
  "🏥": "bg-red-100 text-red-700","📚": "bg-violet-100 text-violet-700",
  "🔒": "bg-slate-100 text-slate-500","🛒": "bg-pink-100 text-pink-700",
  "🎮": "bg-sky-100 text-sky-700","👗": "bg-fuchsia-100 text-fuchsia-700",
  "💊": "bg-red-100 text-red-700","🍕": "bg-orange-100 text-orange-700",
  "🎁": "bg-pink-100 text-pink-700","🚕": "bg-green-100 text-green-700","📦": "bg-slate-100 text-slate-500",
};

const iconColor = (cat) => ICON_COLORS[cat.split(" ")[0]] || "bg-slate-100 text-slate-500";

function ItemRow({ item, onDelete }) {
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
      <button
        onClick={() => onDelete(item.id)}
        className="text-xs bg-red-50 text-red-400 border border-red-100 rounded-lg px-3 py-1.5 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-150"
      >✕</button>
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

export default function App() {
  const [fixas, setFixas] = useState(() => JSON.parse(localStorage.getItem("fixas") || "[]"));
  const [mensais, setMensais] = useState(() => JSON.parse(localStorage.getItem("mensais") || "[]"));
  const [income, setIncome] = useState(() => parseFloat(localStorage.getItem("income") || "0"));
  const [tab, setTab] = useState("fixas");
  const [shakeFixa, setShakeFixa] = useState(false);
  const [shakeMensal, setShakeMensal] = useState(false);

  const [fixaForm, setFixaForm] = useState({ nome: "", cat: CAT_FIXAS[0], val: "" });
  const [mensalForm, setMensalForm] = useState({ nome: "", cat: CAT_MENSAIS[0], val: "" });

  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  useEffect(() => { localStorage.setItem("fixas", JSON.stringify(fixas)); }, [fixas]);
  useEffect(() => { localStorage.setItem("mensais", JSON.stringify(mensais)); }, [mensais]);
  useEffect(() => { localStorage.setItem("income", income); }, [income]);

  const totalFixas = fixas.reduce((s, f) => s + f.val, 0);
  const totalMensais = mensais.reduce((s, m) => s + m.val, 0);
  const totalGasto = totalFixas + totalMensais;
  const sobrou = income - totalGasto;
  const pct = income > 0 ? Math.min(100, Math.round((totalGasto / income) * 100)) : 0;

  const addFixa = () => {
    if (!fixaForm.nome.trim() || !fixaForm.val || parseFloat(fixaForm.val) <= 0) {
      setShakeFixa(true); setTimeout(() => setShakeFixa(false), 600); return;
    }
    setFixas([...fixas, { id: Date.now(), nome: fixaForm.nome.trim(), cat: fixaForm.cat, val: parseFloat(fixaForm.val) }]);
    setFixaForm({ ...fixaForm, nome: "", val: "" });
  };

  const addMensal = () => {
    if (!mensalForm.nome.trim() || !mensalForm.val || parseFloat(mensalForm.val) <= 0) {
      setShakeMensal(true); setTimeout(() => setShakeMensal(false), 600); return;
    }
    setMensais([...mensais, { id: Date.now(), nome: mensalForm.nome.trim(), cat: mensalForm.cat, val: parseFloat(mensalForm.val) }]);
    setMensalForm({ ...mensalForm, nome: "", val: "" });
  };

  const handleKey = (e) => {
    if (e.key === "Enter") tab === "fixas" ? addFixa() : addMensal();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@300;400;600;700&display=swap');
        .sora { font-family: 'Sora', sans-serif; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-4px)} 40%,80%{transform:translateX(4px)} }
        .shake { animation: shake 0.4s ease; }
        @keyframes slideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        .slide-in { animation: slideIn 0.2s ease; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.25s ease; }
      `}</style>

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 flex items-center justify-between h-16 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-500"></div>
          <span className="sora font-bold text-lg text-indigo-600">Finança</span>
        </div>
        <span className="text-xs text-slate-400 capitalize">{today}</span>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-8 pb-16" onKeyDown={handleKey}>

        {/* RENDA */}
        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 mb-7 flex flex-wrap items-center gap-4 shadow-sm">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wide whitespace-nowrap">💰 Minha renda mensal</label>
          <input
            type="number"
            value={income || ""}
            onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
            placeholder="0,00"
            className="sora font-semibold text-base text-green-600 bg-green-50 border-2 border-green-200 rounded-xl px-4 h-11 w-48 outline-none focus:border-green-400 transition-colors"
          />
          <span className="text-xs text-slate-400">Defina quanto você recebe por mês</span>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
          {/* Total Gasto */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-base mb-3">📉</div>
            <div className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">Total Gasto</div>
            <div className="sora text-2xl font-bold text-red-500 leading-none">{fmt(totalGasto)}</div>
            <div className="text-xs text-slate-300 mt-1.5">Fixas: {fmt(totalFixas)} · Mensais: {fmt(totalMensais)}</div>
          </div>

          {/* Disponível */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-base mb-3">💵</div>
            <div className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">Disponível</div>
            <div className="sora text-2xl font-bold text-green-500 leading-none">{fmt(income)}</div>
            <div className="text-xs text-slate-300 mt-1.5">Renda informada</div>
          </div>

          {/* Sobrou */}
          <div className="rounded-2xl p-5 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200" style={{ background: "linear-gradient(135deg, #5b5ef4 0%, #9b59f5 100%)" }}>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-base mb-3">✨</div>
            <div className="text-xs font-medium uppercase tracking-wider text-white/70 mb-2">Sobrou</div>
            <div className={`sora text-2xl font-bold leading-none ${sobrou < 0 ? "text-red-300" : "text-white"}`}>{fmt(sobrou)}</div>
            <div className="text-xs text-white/60 mt-1.5">
              {income > 0 ? `${100 - pct}% do orçamento livre` : "Informe sua renda"}
            </div>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 mb-7 shadow-sm">
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
                  ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                  : "linear-gradient(90deg, #5b5ef4, #9b59f5)"
              }}
            />
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-1 bg-slate-100 border border-slate-200 rounded-2xl p-1.5 mb-7">
          {[
            { key: "fixas", icon: "📌", label: "Contas Fixas" },
            { key: "mensais", icon: "🛒", label: "Gastos Mensais" },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200
                ${tab === key ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-700 hover:bg-white/50"}`}
            >
              <span>{icon}</span>{label}
            </button>
          ))}
        </div>

        {/* TAB FIXAS */}
        {tab === "fixas" && (
          <div className="fade-up">
            {/* Form */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5 flex flex-wrap gap-3 items-end shadow-sm">
              <div className="flex flex-col gap-1 flex-1 min-w-32">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Nome</label>
                <input
                  value={fixaForm.nome}
                  onChange={(e) => setFixaForm({ ...fixaForm, nome: e.target.value })}
                  placeholder="ex: Aluguel"
                  className={`h-11 border-2 border-slate-200 rounded-xl px-3.5 text-sm text-slate-800 bg-slate-50 outline-none focus:border-indigo-400 focus:bg-white focus:shadow-[0_0_0_3px_#ededff] transition-all ${shakeFixa ? "shake border-red-400" : ""}`}
                />
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-36">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Categoria</label>
                <select
                  value={fixaForm.cat}
                  onChange={(e) => setFixaForm({ ...fixaForm, cat: e.target.value })}
                  className="h-11 border-2 border-slate-200 rounded-xl px-3.5 text-sm text-slate-800 bg-slate-50 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                >
                  {CAT_FIXAS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1 w-36">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Valor (R$)</label>
                <input
                  type="number"
                  value={fixaForm.val}
                  onChange={(e) => setFixaForm({ ...fixaForm, val: e.target.value })}
                  placeholder="0,00"
                  className="h-11 border-2 border-slate-200 rounded-xl px-3.5 text-sm text-slate-800 bg-slate-50 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                />
              </div>
              <button
                onClick={addFixa}
                className="h-11 px-5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 hover:-translate-y-px transition-all duration-150 flex items-center gap-1.5"
              >＋ Adicionar</button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="sora font-semibold text-slate-800">Suas contas fixas</span>
            </div>

            {fixas.length === 0 ? (
              <EmptyState icon="📌" text="Nenhuma conta fixa ainda.<br/>Adicione suas contas recorrentes acima." />
            ) : (
              <div className="flex flex-col gap-2.5">
                {fixas.map((f) => (
                  <div key={f.id} className="slide-in">
                    <ItemRow item={f} onDelete={(id) => setFixas(fixas.filter((x) => x.id !== id))} />
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3.5 bg-indigo-50 border border-indigo-200 rounded-xl mt-2">
                  <span className="font-semibold text-sm text-indigo-700">Total em contas fixas</span>
                  <strong className="sora text-base text-indigo-700">{fmt(totalFixas)}</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB MENSAIS */}
        {tab === "mensais" && (
          <div className="fade-up">
            {/* Form */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5 flex flex-wrap gap-3 items-end shadow-sm">
              <div className="flex flex-col gap-1 flex-1 min-w-32">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Descrição</label>
                <input
                  value={mensalForm.nome}
                  onChange={(e) => setMensalForm({ ...mensalForm, nome: e.target.value })}
                  placeholder="ex: Supermercado"
                  className={`h-11 border-2 border-slate-200 rounded-xl px-3.5 text-sm text-slate-800 bg-slate-50 outline-none focus:border-indigo-400 focus:bg-white focus:shadow-[0_0_0_3px_#ededff] transition-all ${shakeMensal ? "shake border-red-400" : ""}`}
                />
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-36">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Categoria</label>
                <select
                  value={mensalForm.cat}
                  onChange={(e) => setMensalForm({ ...mensalForm, cat: e.target.value })}
                  className="h-11 border-2 border-slate-200 rounded-xl px-3.5 text-sm text-slate-800 bg-slate-50 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                >
                  {CAT_MENSAIS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1 w-36">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Valor (R$)</label>
                <input
                  type="number"
                  value={mensalForm.val}
                  onChange={(e) => setMensalForm({ ...mensalForm, val: e.target.value })}
                  placeholder="0,00"
                  className="h-11 border-2 border-slate-200 rounded-xl px-3.5 text-sm text-slate-800 bg-slate-50 outline-none focus:border-indigo-400 focus:bg-white transition-all"
                />
              </div>
              <button
                onClick={addMensal}
                className="h-11 px-5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 hover:-translate-y-px transition-all duration-150 flex items-center gap-1.5"
              >＋ Adicionar</button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="sora font-semibold text-slate-800">Gastos do mês</span>
              {mensais.length > 0 && (
                <button
                  onClick={() => { if (window.confirm("Remover todos os gastos mensais?")) setMensais([]); }}
                  className="text-xs bg-red-50 text-red-400 border border-red-200 rounded-xl px-4 py-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-150 flex items-center gap-1.5"
                >🗑 Limpar todos</button>
              )}
            </div>

            {mensais.length === 0 ? (
              <EmptyState icon="🛒" text="Nenhum gasto mensal ainda.<br/>Adicione seus gastos variáveis acima." />
            ) : (
              <div className="flex flex-col gap-2.5">
                {mensais.map((m) => (
                  <div key={m.id} className="slide-in">
                    <ItemRow item={m} onDelete={(id) => setMensais(mensais.filter((x) => x.id !== id))} />
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3.5 bg-indigo-50 border border-indigo-200 rounded-xl mt-2">
                  <span className="font-semibold text-sm text-indigo-700">Total em gastos mensais</span>
                  <strong className="sora text-base text-indigo-700">{fmt(totalMensais)}</strong>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}