import { useState } from "react";
import Principal from "./pages/Principal.jsx";
import Historico from "./pages/Historico.jsx";

export default function App() {
  const [page, setPage] = useState("principal");
  const navigate = (p) => setPage(p);

  return (
    <>
      {page === "principal" && <Principal navigate={navigate} />}
      {page === "historico" && <Historico navigate={navigate} />}
    </>
  );
}