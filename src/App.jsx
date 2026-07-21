import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#fcfbf9]">
        {/* Menu Superior com a Logo Original */}
        <Header />

        {/* Conteúdo Dinâmico das Rotas */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Outras rotas do site */}
          </Routes>
        </main>

        {/* Rodapé com o endereço de Salvador e Ícone */}
        <Footer />
      </div>
    </Router>
  );
}
