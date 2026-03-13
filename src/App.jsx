import { useEffect, useState } from "react";

const fmt = (n) =>
  "R$" +
  Number(n).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function App() {
  const [fixas, setFixas] = useState(() =>
    JSON.parse(localStorage.getItem("fixas") || "[]"),
  );

  const [mensais, setMensais] = useState(() =>
    JSON.parse(localStorage.getItem("mensais") || "[]"),
  );
  const [income, setIncome] = useState(() =>
    parseFloat(localStorage.getItem("income") || "0"),
  );
  const totalFixas = fixas.reduce((s, f) => s + f.val, 0);
  const totalMensais = mensais.reduce((s, m) => s + m.val, 0);
  const totalGasto = totalFixas + totalMensais;
  const data = new Date().toLocaleDateString("pt-BR");

  useEffect(() => {
    localStorage.setItem("income", income);
  }, [income]);
  useEffect(() => {
    localStorage.setItem("fixas", JSON.stringify(fixas));
  }, [fixas]);
  useEffect(() => {
    localStorage.setItem("mensais", JSON.stringify(mensais));
  }, [mensais]);

  return (
    <>
      {/* navbar */}
      <div className="flex  items-center justify-between px-7 h-20 w-full text-fuchsia-600 border-b border-fuchsia-200 ">
        <h1 className=" text-2xl">Finança</h1>
        <h2>{data}</h2>
      </div>
      {/* renda */}
      <div className="flex flex-col items-center">
        <div className="flex bg-white h-20 w-[40%] mt-5 rounded-2xl items-center justify-center gap-2">
          <label className="text-xs font-medium text-slate-800 uppercase tracking-wide whitespace-nowrap">
            💰 Minha renda mensal
          </label>
          <input
            type="number"
            value={income || ""}
            onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
            placeholder="0,00"
            className="sora font-semibold text-base text-fuchsia-700 bg-fuchsia-50 border-2  border-fuchsia-200 rounded-xl px-5 h-11 w-48 outline-nonetransition-colors"
          />
          {/* cards de soma */}
          <label className="text-xs"> Defina quanto você recebe por mês</label>
        </div>

        <section className="flex gap-4 p-6  max-w-500">
          {/* card gasto total */}
          <div className="bg-white w-58 h-40 rounded-2xl p-4">
            <div className="text-2xl mb-1">📉</div>
            <div className="text-xs font-medium text-slate-400 uppercase mb-2">
              Total Gasto
            </div>
            <div className="font-bold text-2xl text-red-500">
              {fmt(totalGasto)}
            </div>
            <div className="text-xs text-slate-300 mt-1.5">
              Fixas: {fmt(totalFixas)} · Mensais: {fmt(totalMensais)}
            </div>
          </div>

          <div className="bg-white w-58 h-40 rounded-2xl justify-center ">
            sasaa
          </div>
          <div className="bg-fuchsia-500 w-58 h-40 rounded-2xl justify-center">
            sasaasa
          </div>
        </section>
      </div>
    </>
  );
}
