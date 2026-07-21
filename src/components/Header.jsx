import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo Original */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="IRIMEP - Medianeiras da Paz" className="h-16 w-auto object-contain" />
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-gray-700">
            <Link to="/" className="hover:text-[#005a8d] transition-colors">Início</Link>
            <Link to="/institucional" className="hover:text-[#005a8d] transition-colors">Institucional</Link>
            <Link to="/agenda" className="hover:text-[#005a8d] transition-colors">Agenda</Link>
            <Link to="/obras-e-missoes" className="hover:text-[#005a8d] transition-colors">Obras e Missões</Link>
            <Link to="/vocacional" className="hover:text-[#005a8d] transition-colors">Vocacional</Link>
            <Link to="/contato" className="bg-[#005a8d] text-white px-5 py-2.5 rounded-xl hover:bg-[#004068] transition-colors shadow">
              Contato
            </Link>
          </nav>

          {/* Botão Mobile */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3">
          <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 font-medium">Início</Link>
          <Link to="/institucional" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 font-medium">Quem Somos</Link>
          <Link to="/agenda" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 font-medium">Agenda</Link>
          <Link to="/obras-e-missoes" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 font-medium">Obras e Missões</Link>
          <Link to="/vocacional" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 font-medium">Vocacional</Link>
          <Link to="/contato" onClick={() => setIsOpen(false)} className="block text-center bg-[#005a8d] text-white py-3 rounded-xl font-medium">Contato</Link>
        </div>
      )}
    </header>
  );
}
