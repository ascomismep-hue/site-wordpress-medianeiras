import { Link } from "lucide-react"; // ou link do react-router-dom
import { Link as RouterLink } from "react-router-dom";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#002845] text-white pt-16 pb-8 border-t border-[#c5a059]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Conteúdo existente do rodapé (Navegação, Endereço, etc) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#c5a059] mb-4">IRIMEP</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Instituto Religioso das Irmãs Medianeiras da Paz. Consagradas à paz, à oração e ao serviço em prol da comunidade e da evangelização.
            </p>
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#c5a059] mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><RouterLink to="/" className="hover:text-white transition-colors">Início</RouterLink></li>
              <li><RouterLink to="/institucional/sobre-nos" className="hover:text-white transition-colors">Institucional</RouterLink></li>
              <li><RouterLink to="/agenda" className="hover:text-white transition-colors">Agenda e Eventos</RouterLink></li>
              <li><RouterLink to="/obras" className="hover:text-white transition-colors">Obras e Missões</RouterLink></li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#c5a059] mb-4">Casa Sede</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Rua Edgar Chastinet, 01 - Bairro Santa Mônica<br />
              Salvador - BA<br />
              CEP: 40342-100
            </p>
          </div>
        </div>

        {/* Linha Inferior com Direitos e Área Restrita */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/60">
          <p>© 2026 IRIMEP - Instituto Religioso das Irmãs Medianeiras da Paz. Todos os direitos reservados.</p>
          
          {/* Link discreto para o Painel Administrativo */}
          <RouterLink 
            to="/admin" 
            className="flex items-center gap-1.5 hover:text-[#c5a059] transition-colors py-1 px-3 rounded-lg hover:bg-white/5"
            title="Acesso Restrito à Gestão"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Área Restrita</span>
          </RouterLink>
        </div>

      </div>
    </footer>
  );
}
