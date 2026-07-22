import { Link as RouterLink } from "react-router-dom";
import { Shield, Instagram, Youtube, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#002845] text-white py-10 border-t border-[#c5a059]/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Conteúdo Principal do Rodapé (Compacto e Estreito) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 items-center">
          
          {/* Logo e Nome */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {/* Logo puxada diretamente da pasta public com filtro branco */}
              <img 
                src="/logo.png" 
                alt="IRIMEP Logo" 
                className="w-10 h-10 object-contain filter brightness-0 invert" 
              />
              <span className="font-serif font-bold text-lg text-[#c5a059] tracking-wider">IRIMEP</span>
            </div>
            <p className="text-white/70 text-xs leading-relaxed">
              Instituto Religioso das Irmãs Medianeiras da Paz. Consagradas à paz, à oração e ao serviço.
            </p>
          </div>

          {/* Links de Navegação */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#c5a059] mb-2 uppercase tracking-wider">Navegação</h4>
            <ul className="space-y-1.5 text-xs text-white/80">
              <li><RouterLink to="/" className="hover:text-white transition-colors">Início</RouterLink></li>
              <li><RouterLink to="/institucional/sobre-nos" className="hover:text-white transition-colors">Institucional</RouterLink></li>
              <li><RouterLink to="/agenda" className="hover:text-white transition-colors">Agenda e Eventos</RouterLink></li>
              <li><RouterLink to="/obras-e-missoes" className="hover:text-white transition-colors">Obras e Missões</RouterLink></li>
              <li><RouterLink to="/vocacional" className="hover:text-white transition-colors">Vocacional</RouterLink></li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#c5a059] mb-2 uppercase tracking-wider">Redes Sociais</h4>
            <div className="flex items-center gap-3">
              <a 
                href="https://www.instagram.com/medianeiras.dapaz/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#c5a059] hover:text-[#002845] flex items-center justify-center transition-all text-white"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.youtube.com/@Irm%C3%A3sMedianeirasdapaz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#c5a059] hover:text-[#002845] flex items-center justify-center transition-all text-white"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/irmasmedianeiras.dapaz/?locale=pt_BR" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#c5a059] hover:text-[#002845] flex items-center justify-center transition-all text-white"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.tiktok.com/@medianeiras.dapaz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#c5a059] hover:text-[#002845] flex items-center justify-center transition-all text-white font-bold text-xs"
                title="TikTok"
              >
                TK
              </a>
            </div>
          </div>

          {/* Casa Sede */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#c5a059] mb-2 uppercase tracking-wider">Casa Sede</h4>
            <p className="text-white/70 text-xs leading-relaxed">
              Rua Edgar Chastinet, 01 - Bairro Santa Mônica<br />
              Salvador - BA • CEP: 40342-100
            </p>
          </div>

        </div>

        {/* Linha Inferior com Direitos e Área Restrita */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/60">
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
