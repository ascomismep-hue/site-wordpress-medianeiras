import { useState, useEffect } from "react";
import { BookOpen, Sparkles, Calendar, Loader2, Bookmark } from "lucide-react";

export default function LiturgiaDiariaCard() {
  const [liturgia, setLiturgia] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mapeamento de cores litúrgicas para classes visuais do Tailwind
  const corConfig = {
    verde: { bg: "bg-emerald-600", text: "text-emerald-700", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", nome: "Tempo Comum" },
    vermelho: { bg: "bg-red-600", text: "text-red-700", badge: "bg-red-50 text-red-700 border-red-200", nome: "Mártir / Solenidade" },
    roxo: { bg: "bg-purple-700", text: "text-purple-800", badge: "bg-purple-50 text-purple-800 border-purple-200", nome: "Penitência / Advento / Quaresma" },
    branco: { bg: "bg-amber-500", text: "text-amber-800", badge: "bg-amber-50 text-amber-800 border-amber-200", nome: "Festa / Alegria" },
    rosa: { bg: "bg-pink-600", text: "text-pink-700", badge: "bg-pink-50 text-pink-700 border-pink-200", nome: "Gaudete / Laetare" },
    default: { bg: "bg-[#005a8d]", text: "text-[#005a8d]", badge: "bg-blue-50 text-[#005a8d] border-blue-200", nome: "Liturgia Diária" }
  };

  useEffect(() => {
    async function fetchLiturgia() {
      try {
        // Pega a data atual no formato YYYY-MM-DD
        const hoje = new Date().toISOString().split('T')[0];
        const res = await fetch(`https://api-liturgia-diaria.vercel.app/?date=${hoje}`);
        const data = await res.json();
        if (data) {
          setLiturgia(data);
        }
      } catch (err) {
        console.error("Erro ao buscar liturgia:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLiturgia();
  }, []);

  // Determina a cor com base no retorno da API ou define verde como padrão
  const corDoDia = liturgia?.cor?.toLowerCase() || "verde";
  const estilo = corConfig[corDoDia] || corConfig.default;

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-center min-h-[250px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between transition-all hover:shadow-md">
      
      {/* Cabeçalho dinâmico com a Cor Litúrgica */}
      <div className={`${estilo.bg} text-white p-6 relative overflow-hidden flex items-center justify-between`}>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
            <Calendar className="w-3 h-3" /> Liturgia Diária
          </div>
          <h3 className="text-xl font-serif font-bold text-white">{liturgia?.data || "Hoje"}</h3>
        </div>
        <div className="flex flex-col items-end relative z-10">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-white/80">Cor Litúrgica</span>
          <span className="text-xs font-bold capitalize bg-white/20 px-3 py-1 rounded-xl backdrop-blur-xs mt-1">
            {liturgia?.cor || "Verde"}
          </span>
        </div>
      </div>

      <div className="p-7 space-y-6">
        
        {/* Passagens / Leituras (Somente as referências) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-[#c5a059]" /> Leituras de Hoje
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {liturgia?.primeiraLeitura && (
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs">
                <span className="font-bold text-gray-400 block text-[10px]">1ª LEITURA</span>
                <span className="font-semibold text-gray-800">{liturgia.primeiraLeitura.ref || "Primeira Leitura"}</span>
              </div>
            )}
            {liturgia?.salmo && (
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs">
                <span className="font-bold text-gray-400 block text-[10px]">SALMO RESPONSORIAL</span>
                <span className="font-semibold text-gray-800">{liturgia.salmo.ref || "Salmo"}</span>
              </div>
            )}
            {liturgia?.evangelho && (
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs">
                <span className="font-bold text-gray-400 block text-[10px]">EVANGELHO</span>
                <span className="font-semibold text-gray-800">{liturgia.evangelho.ref || "Evangelho"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Reflexão do Dia */}
        <div className="space-y-2 bg-blue-50/50 p-5 rounded-2xl border border-blue-100/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#005a8d] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" /> Reflexão Espiritual
          </h4>
          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed italic">
            "{liturgia?.observacao || liturgia?.resumo || "Busque meditar na Palavra do Senhor neste dia, permitindo que ela transforme seus passos e alimente seu espírito com a verdadeira paz."}"
          </p>
        </div>

      </div>
    </div>
  );
}
