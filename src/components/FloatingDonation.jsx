import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useState } from "react";

export default function FloatingDonation() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Link to="/doacao" className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#e31e24] text-white text-sm font-semibold shadow-lg hover:bg-[#b3181e] transition">
            <Heart className="w-4 h-4" /> Quero Doar
          </Link>
        </div>
      )}
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#e31e24] text-white font-semibold shadow-xl hover:bg-[#b3181e] hover:scale-105 transition-all" aria-label="Doação">
        <Heart className="w-5 h-5" fill="white" />
        <span className="hidden sm:inline text-sm">Doe Agora</span>
      </button>
    </div>
  );
}
