import { useEffect, useState } from "react";

const fmt = (n) =>
  "R$\u00a0" +
  Number(n).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function App() {
  const [fixas, setFixas] = useState(() =>
    JSON.parse(localStorage.getItem("fixas") || "[]")
  );
  const [mensais, setMensais] = useState(() =>
    JSON.parse(localStorage.getItem("mensais") || "[]")
  );
  const [income, setIncome] = useState(() =>
    parseFloat(localStorage.getItem("income") || "0")
  );
  const [tab, setTab] = useState("fixas");
  const [nome, setNome] = useState("");
  const [val, setVal] = useState("");

  const totalFixas = fixas.reduce((s, f) => s + f.val, 0);
  const totalMensais = mensais.reduce((s, m) => s + m.val, 0);
  const totalGasto = totalFixas + totalMensais;
  const sobrou = income - totalGasto;
  const pct = income > 0 ? Math.min(100, Math.round((totalGasto / income) * 100)) : 0;
  const data = new Date().toLocaleDateString("pt-BR");

  useEffect(() => { localStorage.setItem("income", income); }, [income]);
  useEffect(() => { localStorage.setItem("fixas", JSON.stringify(fixas)); }, [fixas]);
  useEffect(() => { localStorage.setItem("mensais", JSON.stringify(mensais)); }, [mensais]);

  const lista = tab === "fixas" ? fixas : mensais;
  const setLista = tab === "fixas" ? setFixas : setMensais;

  function addItem() {
    const v = parseFloat(val);
    if (!nome.trim() || isNaN(v) || v <= 0) return;
    setLista((prev) => [...prev, { id: Date.now(), nome: nome.trim(), val: v }]);
    setNome("");
    setVal("");
  }

  function removeItem(id) {
    setLista((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <>
      {/* navbar */}
      <div className="flex items-center justify-between px-7 h-20 w-full text-fuchsia-600 border-b border-fuchsia-200">
        <h1 className="text-2xl">Finança</h1>
        <h2 className="text-sm text-slate-400">{data}</h2>
      </div>

      <div className="flex flex-col items-center p-6 gap-5 max-w-3xl mx-auto">
        {/* renda */}
        <div className="flex bg-white w-full rounded-2xl items-center justify-center gap-3 px-6 py-4">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide whitespace-nowrap">
            💰 Minha renda mensal
          </label>
          <input
            type="number"
            value={income || ""}
            onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
            placeholder="0,00"
            className="font-semibold text-base text-fuchsia-700 bg-fuchsia-50 border-2 border-fuchsia-200 rounded-xl px-5 h-11 w-48 outline-none"
          />
          <label className="text-xs text-slate-400">Defina quanto você recebe por mês</label>
        </div>

        {/* cards */}
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
          <div
            className="rounded-2xl p-4"
            style={{ background: "linear-gradient(135deg,#5b5ef4,#9b59f5)" }}
          >
            <div className="text-2xl mb-1">✨</div>
            <div className="text-xs font-medium text-white/70 uppercase mb-2">Sobrou</div>
            <div className={`font-bold text-2xl ${sobrou < 0 ? "text-red-300" : "text-white"}`}>
              {fmt(sobrou)}
            </div>
            <div className="text-xs text-white/60 mt-1.5">
              {income > 0 ? `${100 - pct}% do orçamento livre` : "Informe sua renda"}
            </div>
          </div>
        </section>

        {/* barra de progresso */}
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
                background:
                  pct >= 80
                    ? "linear-gradient(90deg,#f59e0b,#ef4444)"
                    : "linear-gradient(90deg,#5b5ef4,#9b59f5)",
              }}
            />
          </div>
        </div>

        {/* tabs */}
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

        {/* painel da lista */}
        <div className="bg-white border border-slate-200 rounded-2xl w-full overflow-hidden">
          {/* formulário de adição */}
          <div className="flex gap-2 p-4 border-b border-slate-100">
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              placeholder="Nome da despesa"
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-400"
            />
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
            >
              + Adicionar
            </button>
          </div>

          {/* itens */}
          {lista.length === 0 ? (
            <p className="text-center text-sm text-slate-300 py-8">Nenhuma despesa cadastrada</p>
          ) : (
            <ul>
              {lista.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between px-5 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors last:border-0"
                >
                  <span className="text-sm text-slate-700">{item.nome}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700">{fmt(item.val)}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-300 hover:text-red-400 transition-colors text-sm px-1"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}