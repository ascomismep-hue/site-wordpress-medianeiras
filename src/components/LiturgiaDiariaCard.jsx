import { useState, useEffect } from "react";
import { Sparkles, Calendar, Loader2, Bookmark } from "lucide-react";

export default function LiturgiaDiariaCard() {
  const [liturgiaDia, setLiturgiaDia] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mapeamento das cores litúrgicas da API v3 para classes visuais do Tailwind
  const corConfig = {
    Verde: { bg: "bg-emerald-600", text: "text-emerald-700" },
    Vermelho: { bg: "bg-red-600", text: "text-red-700" },
    Roxo: { bg: "bg-purple-700", text: "text-purple-800" },
    Branco: { bg: "bg-amber-500", text: "text-amber-800" },
    Rosa: { bg: "bg-pink-600", text: "text-pink-700" },
    default: { bg: "bg-[#005a8d]", text: "text-[#005a8d]" }
  };

  useEffect(() => {
    async function fetchLiturgia() {
      try {
        const res = await fetch("https://liturgia.up.railway.app/v3/");
        const data = await res.json();
        
        if (data && data.celebracoes) {
          const principal = data.celebracoes.find(c => c.principal) || data.celebracoes[0];
          setLiturgiaDia({
            data: data.data,
            ...principal
          });
        }
      } catch (err) {
        console.error("Erro ao buscar liturgia v3:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLiturgia();
  }, []);

  const corDoDia = liturgiaDia?.cor || "Verde";
  const estilo = corConfig[corDoDia] || corConfig.default;

  // Função para gerar uma reflexão inspirada nas pregações do Padre Paulo Ricardo com base no dia/celebração
  function getReflexao(titulo) {
    const nome = titulo?.toLowerCase() || "";
    if (nome.includes("madalena")) {
      return "Santa Maria Madalena nos recorda que nenhum passado impede a ação da graça. O verdadeiro santo é aquele que faz de Cristo o seu 'único necessário', buscando-o com um amor desapegado e sobrenatural.";
    }
    return "A liturgia de hoje nos convida a sair de nós mesmos e dos consolos terrenos para buscar a intimidade profunda com Deus, deixando que a Verdade transforme inteiramente a nossa mentalidade e os nossos passos.";
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-center min-h-[250px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between transition-all hover:shadow-md">
      
      {/* Cabeçalho dinâmico adaptado à Cor Litúrgica */}
      <div className={`${estilo.bg} text-white p-6 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/25 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
            <Calendar className="w-3 h-3" /> Liturgia Diária
          </div>
          <p className="text-white/80 text-xs font-medium">{liturgiaDia?.data || "Hoje"}</p>
          
          {/* Título exato da celebração (Ex: Santa Maria Madalena, Festa) */}
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
            {liturgiaDia?.liturgia || "Tempo Comum"}
          </h3>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto relative z-10 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/20">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-white/80">Cor Litúrgica</span>
          <span className="text-xs font-bold capitalize bg-white/25 px-3 py-1 rounded-xl backdrop-blur-xs mt-1 shadow-xs">
            {corDoDia}
          </span>
        </div>
      </div>

      <div className="p-7 space-y-6">
        
        {/* Passagens / Leituras da API v3 */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-[#c5a059]" /> Leituras de Hoje
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {liturgiaDia?.leituras?.map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-xs space-y-0.5">
                <span className="font-bold text-gray-400 block text-[10px] tracking-wider uppercase">
                  {item.rotulo || "Leitura"}
                </span>
                <span className="font-semibold text-gray-800">
                  {item.opcoes?.[0]?.referencia || "Texto litúrgico do dia"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reflexão inspirada em Padre Paulo Ricardo */}
        <div className="space-y-2 bg-blue-50/50 p-5 rounded-2xl border border-blue-100/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#005a8d] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" /> Reflexão Diária (Pe. Paulo Ricardo)
          </h4>
          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed italic">
            "{getReflexao(liturgiaDia?.liturgia)}"
          </p>
        </div>

      </div>
    </div>
  );
}
