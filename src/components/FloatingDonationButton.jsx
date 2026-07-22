import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

// Animação suave de flutuação para cima e para baixo
const floatAnimation = `
  @keyframes floatSlow {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
  }
`;

export default function FloatingDonationButton() {
  return (
    <>
      <style>{floatAnimation}</style>

      <div 
        className="fixed bottom-8 right-8 z-50"
        style={{ animation: 'floatSlow 4s ease-in-out infinite' }}
      >
        <Link
          to="/doacoes"
          className="group bg-[#e31e24] hover:bg-[#c9181d] text-white px-6 py-4 rounded-full shadow-lg flex items-center gap-3 transition-all hover:shadow-xl border border-white/20"
          title="Central de Doações - DOE COM AMOR"
        >
          {/* Fundo do ícone em branco suave para dar destaque ao coração vermelho */}
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white text-white" />
          </div>
          
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-white/80">Contribua</span>
            <span className="text-sm font-serif font-bold tracking-wide text-white">DOE COM AMOR</span>
          </div>
        </Link>
      </div>
    </>
  );
}
