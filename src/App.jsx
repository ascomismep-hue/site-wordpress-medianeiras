import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import InstitucionalSubNav from "./components/InstitucionalSubNav";
import AdminDashboard from "./admin/AdminDashboard";
import AdminAgenda from "./admin/AdminAgenda";

// Import das subpáginas institucionais
import SobreNos from "./pages/institucional/SobreNos";
import MadresGerais from "./pages/institucional/MadresGerais";
import Irmas from "./pages/institucional/Irmas";
import Memorial from "./pages/institucional/Memorial";
import CausaDomCampelo from "./pages/institucional/CausaDomCampelo";

function LayoutInstitucional({ children }) {
  return (
    <div>
      <InstitucionalSubNav />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#fcfbf9]">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Redireciona /institucional direto para Sobre Nós */}
            <Route path="/institucional" element={<Navigate to="/institucional/sobre-nos" replace />} />

            {/* Rotas das Subpáginas Institucionais */}
            <Route path="/institucional/sobre-nos" element={<LayoutInstitucional><SobreNos /></LayoutInstitucional>} />
            <Route path="/institucional/madres-gerais" element={<LayoutInstitucional><MadresGerais /></LayoutInstitucional>} />
            <Route path="/institucional/irmas" element={<LayoutInstitucional><Irmas /></LayoutInstitucional>} />
            <Route path="/institucional/memorial" element={<LayoutInstitucional><Memorial /></LayoutInstitucional>} />
            <Route path="/institucional/causa-dom-campelo" element={<LayoutInstitucional><CausaDomCampelo /></LayoutInstitucional>} />

            {/* Rota do Painel Administrativo */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin-agenda" element={<AdminAgenda />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
