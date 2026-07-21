import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#002845] text-white pt-16 pb-12 border-t-4 border-[#c5a059]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        
        {/* Coluna 1: Sobre / Ícone */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src="/icone.png" alt="Ícone IRIMEP" className="h-12 w-auto object-contain" />
            <span className="font-serif font-bold text-xl text-[#c5a059]">IRIMEP</span>
          </div>
          <p className="text-sm text-white/80 leading-relaxed">
            Instituto Religioso das Irmãs Medianeiras da Paz. Consagradas à paz, à oração e ao serviço em prol da comunidade e da evangelização.
          </p>
        </div>

        {/* Coluna 2: Links Rápidos */}
        <div>
          <h4 className="font-serif text-lg font-bold text-[#c5a059] mb-4">Navegação</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/quem-somos" className="hover:text-[#c5a059] transition-colors">Quem Somos</Link></li>
            <li><Link to="/agenda" className="hover:text-[#c5a059] transition-colors">Agenda e Eventos</Link></li>
            <li><Link to="/obras-e-missoes" className="hover:text-[#c5a059] transition-colors">Obras e Missões</Link></li>
            <li><Link to="/vocacional" className="hover:text-[#c5a059] transition-colors">Caminho Vocacional</Link></li>
          </ul>
        </div>

        {/* Coluna 3: Sede Oficial */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-bold text-[#c5a059] mb-4">Casa Sede</h4>
          <div className="flex items-start gap-3 text-sm text-white/80">
            <MapPin className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
            <span>Rua Edgar Chastinet, 01 - Bairro Santa Mônica<br />Salvador - BA<br />CEP: 40342-100</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 text-center text-xs text-white/60">
        <p>&copy; {new Date().getFullYear()} IRIMEP - Instituto Religioso das Irmãs Medianeiras da Paz. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
