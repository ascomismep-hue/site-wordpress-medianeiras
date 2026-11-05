import { Link } from "react-router-dom";
import { Heart, Stethoscope } from "lucide-react";

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

      {/* Contentor fixo no canto inferior direito alinhado na vertical */}
      <div 
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex flex-col gap-3.5 items-end"
        style={{ animation: 'floatSlow 4s ease-in-out infinite' }}
      >
        
        {/* BOTÃO 1: CORAÇÃO / DOE COM AMOR (VERMELHO) */}
        <Link
          to="/doacoes"
          className="group flex items-center bg-[#e31e24] hover:bg-[#c9181d] text-white p-3.5 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl border border-white/20"
          title="DOE COM AMOR"
        >
          {/* Texto deslizante que aparece ao passar o rato */}
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:px-3 transition-all duration-300 ease-in-out text-xs font-serif font-bold tracking-wide uppercase">
            DOE COM AMOR
          </span>

          {/* Círculo do Ícone */}
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white text-white" />
          </div>
        </Link>

        {/* BOTÃO 2: ISMEP SAÚDE / ACESSE O ISMEP (VERDE) */}
        <a
          href="https://ismep.com.br" 
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center bg-[#10b981] hover:bg-[#059669] text-white p-3.5 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl border border-white/20"
          title="ACESSE O ISMEP"
        >
          {/* Texto deslizante que aparece ao passar o rato */}
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:px-3 transition-all duration-300 ease-in-out text-xs font-serif font-bold tracking-wide uppercase">
            ACESSE O ISMEP
          </span>

          {/* Círculo do Ícone */}
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
        </a>

      </div>
    </>
  );
}
