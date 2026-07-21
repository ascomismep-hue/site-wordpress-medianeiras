import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import InstitucionalSubNav from "./components/InstitucionalSubNav";

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
            
            {/* Rotas das Subpáginas Institucionais */}
            <Route path="/institucional/sobre-nos" element={<LayoutInstitucional><SobreNos /></LayoutInstitucional>} />
            <Route path="/institucional/madres-gerais" element={<LayoutInstitucional><MadresGerais /></LayoutInstitucional>} />
            <Route path="/institucional/irmas" element={<LayoutInstitucional><Irmas /></LayoutInstitucional>} />
            <Route path="/institucional/memorial" element={<LayoutInstitucional><Memorial /></LayoutInstitucional>} />
            <Route path="/institucional/causa-dom-campelo" element={<LayoutInstitucional><CausaDomCampelo /></LayoutInstitucional>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
