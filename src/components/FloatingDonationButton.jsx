import { Link } from "react-router-dom";
import { Heart, Sparkles } from "lucide-react";

export default function FloatingDonationButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <Link
        to="/doacoes"
        className="bg-gradient-to-r from-[#e31e24] to-[#c9181d] hover:from-[#c9181d] hover:to-[#a81318] text-white px-5 py-3.5 rounded-full font-bold shadow-xl flex items-center gap-2.5 transition-transform hover:scale-105 border-2 border-white/30 backdrop-blur-md"
        title="Central de Doações - DOE COM AMOR"
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
          <Heart className="w-4 h-4 fill-white text-white" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-white/90">Faça o Bem</span>
          <span className="text-xs sm:text-sm font-serif tracking-wide">DOE COM AMOR</span>
        </div>
        <Sparkles className="w-4 h-4 text-amber-200" />
      </Link>
    </div>
  );
}
