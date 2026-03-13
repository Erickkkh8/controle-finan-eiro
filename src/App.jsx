import { useState } from "react";

export default function App() {
  const data = new Date().toLocaleDateString("pt-BR");

  const [income, setIncome] = useState(() =>
    parseFloat(localStorage.getItem("income") || "0"),
  );
  return (
    <>
      <div className="flex  items-center justify-between px-7 h-20 w-full text-fuchsia-600 border-b border-fuchsia-200 ">
        <h1 className=" text-2xl">Finança</h1>
        <h2>{data}</h2>
      </div>

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

          <label className="text-xs"> Defina quanto você recebe por mês</label>
        </div>

        <section className="flex gap-4 p-6  max-w-500">
          <div className="bg-amber-200 w-58 h-40 rounded-2xl justify-center ">
            '📉'TOTAL GASTO
          </div>

          <div className="bg-blue-300 w-58 h-40 rounded-2xl justify-center ">
            sasaa
          </div>
          <div className="bg-emerald-50 w-58 h-40 rounded-2xl justify-center">
            sasaasa
          </div>
        </section>
      </div>
    </>
  );
}
