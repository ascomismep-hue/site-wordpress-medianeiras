import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

// Define a animação CSS usando keyframes personalizados
const floatAnimation = `
  @keyframes floatSoft {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(8px); /* Flutua suavemente 8px para baixo */
    }
    100% {
      transform: translateY(0px); /* Retorna à posição original */
    }
  }
`;

export default function FloatingDonationButton() {
  return (
    <>
      {/* Injeta a animação na tag style globalmente */}
      <style>{floatAnimation}</style>

      {/* Aplica a classe de animação e estilos clean */}
      <div 
        className="fixed bottom-8 right-8 z-50"
        style={{ 
          animation: 'floatSoft 4s ease-in-out infinite' /* Duração de 4s para suavidade */
        }}
      >
        <Link
          to="/doacoes"
          className="group bg-white/90 backdrop-blur-sm text-[#005a8d] px-6 py-4 rounded-full shadow-lg flex items-center gap-3 transition-all hover:bg-white hover:shadow-xl border border-gray-100"
          title="Central de Doações - DOE COM AMOR"
        >
          {/* Ícone mais suave, sem animação de pulso */}
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 text-[#e31e24] group-hover:fill-[#e31e24] transition-colors" />
          </div>
          
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">Contribua</span>
            <span className="text-sm font-serif font-bold tracking-wide text-[#005a8d]">DOE COM AMOR</span>
          </div>
        </Link>
      </div>
    </>
  );
}
