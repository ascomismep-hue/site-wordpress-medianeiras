import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingDonationButton from "./components/FloatingDonationButton";
import PopupNovena from "./components/PopupNovena"; // Importação correta do componente
import Home from "./pages/Home";
import InstitucionalSubNav from "./components/InstitucionalSubNav";
import LoginUnificado from "./admin/LoginUnificado";
import Agenda from "./pages/Agenda";
import ObrasMissoes from "./pages/ObrasMissoes";
import Noticias from "./pages/Noticias";
import Vocacional from "./pages/Vocacional";
import Contato from "./pages/Contato";
import Doacoes from "./pages/Doacoes";
import Pastoral from "./pages/Pastoral";

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
      <div className="flex flex-col min-h-screen bg-[#fcfbf9] relative">
        
        {/* Pop-up global da Novena integrado no fluxo principal */}
        <PopupNovena />

        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/institucional" element={<Navigate to="/institucional/sobre-nos" replace />} />

            <Route path="/institucional/sobre-nos" element={<LayoutInstitucional><SobreNos /></LayoutInstitucional>} />
            <Route path="/institucional/madres-gerais" element={<LayoutInstitucional><MadresGerais /></LayoutInstitucional>} />
            <Route path="/institucional/irmas" element={<LayoutInstitucional><Irmas /></LayoutInstitucional>} />
            <Route path="/institucional/memorial" element={<LayoutInstitucional><Memorial /></LayoutInstitucional>} />
            <Route path="/institucional/causa-dom-campelo" element={<LayoutInstitucional><CausaDomCampelo /></LayoutInstitucional>} />

            <Route path="/agenda" element={<Agenda />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/vocacional" element={<Vocacional />} />
            <Route path="/pastoral" element={<Pastoral />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/doacoes" element={<Doacoes />} />
            <Route path="/obras-e-missoes" element={<ObrasMissoes />} />
            <Route path="/admin" element={<LoginUnificado />} />
          </Routes>
        </main>

        <FloatingDonationButton />
        <Footer />
      </div>
    </Router>
  );
}
