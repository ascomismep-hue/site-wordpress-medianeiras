import { useState, useEffect } from "react";
import { Sparkles, Calendar, Loader2, Bookmark, Church, Image as ImageIcon } from "lucide-react";

export default function LiturgiaDiariaCard() {
  const [liturgiaDia, setLiturgiaDia] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mapeamento de cores litúrgicas para barras indicadoras ou detalhes
  const corConfig = {
    Verde: { border: "border-emerald-500", text: "text-emerald-700", badge: "bg-emerald-50 text-emerald-700" },
    Vermelho: { border: "border-red-500", text: "text-red-700", badge: "bg-red-50 text-red-700" },
    Roxo: { border: "border-purple-500", text: "text-purple-800", badge: "bg-purple-50 text-purple-800" },
    Branco: { border: "border-amber-400", text: "text-amber-800", badge: "bg-amber-50 text-amber-800" },
    Rosa: { border: "border-pink-500", text: "text-pink-700", badge: "bg-pink-50 text-pink-700" },
    default: { border: "border-[#005a8d]", text: "text-[#005a8d]", badge: "bg-blue-50 text-[#005a8d]" }
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

  // Função para associar imagem ilustrativa conforme o Santo ou Festa do dia
  function getImagemLiturgica(titulo) {
    const nome = titulo?.toLowerCase() || "";
    if (nome.includes("madalena")) {
      return "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=600&q=80"; // Imagem representativa sacra/vela
    } else if (nome.includes("senhor") || nome.includes("natal") || nome.includes("pascoa")) {
      return "https://images.unsplash.com/photo-1548625361-168c14d9b626?auto=format&fit=crop&w=600&q=80";
    } else {
      // Imagem padrão litúrgica (altar/cálice sagrado)
      return "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80";
    }
  }

  function getReflexaoPadrePaulo(titulo) {
    const nome = titulo?.toLowerCase() || "";
    if (nome.includes("madalena")) {
      return "Santa Maria Madalena nos recorda que nenhum passado impede a ação da graça. O verdadeiro santo é aquele que faz de Cristo o seu 'único necessário', buscando-o com um amor desapegado e sobrenatural.";
    }
    return "A liturgia de hoje nos convida a sair de nós mesmos e dos consolos terrenos para buscar a intimidade profunda com Deus, deixando que a Verdade transforme inteiramente a nossa mentalidade e os nossos passos.";
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all hover:shadow-md">
      
      {/* COLUNA ESQUERDA: Vídeo de Missa em Looping + Imagem Dinâmica do Santo/Festa */}
      <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full overflow-hidden bg-black flex items-center justify-center">
        {/* Vídeo de celebração de missa sem som, em looping e cobrindo todo o espaço */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          {/* Link público de vídeo curto em loop demonstrativo de altar/missa */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-priest-holding-a-chalice-in-a-church-41584-large.mp4" type="video/mp4" />
        </video>

        {/* Camada translúcida e a Imagem dinâmica flutuante que altera conforme o santo/festa */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-between p-8 text-white z-10">
          <div className="flex justify-between items-center">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Liturgia Viva
            </span>
            <span className="text-xs font-semibold bg-black/40 px-3 py-1 rounded-xl backdrop-blur-xs">
              Cor: {corDoDia}
            </span>
          </div>

          <div className="space-y-3">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/40 shadow-2xl bg-white/10 backdrop-blur-md">
              <img 
                src={getImagemLiturgica(liturgiaDia?.liturgia)} 
                alt="Tema litúrgico do dia" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-white/80 font-medium">{liturgiaDia?.data || "Hoje"}</p>
              <h3 className="text-xl font-serif font-bold leading-snug">{liturgiaDia?.liturgia || "Celebração do Dia"}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: Leituras e Reflexão */}
      <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
        
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c5a059]">Missas e Orações</span>
              <h4 className="font-serif font-bold text-xl text-[#005a8d]">Leituras e Palavra de Deus</h4>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${estilo.badge}`}>
              Cor Litúrgica: {corDoDia}
            </span>
          </div>

          {/* Passagens */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {liturgiaDia?.leituras?.map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-xs space-y-0.5">
                <span className="font-bold text-gray-400 block text-[10px] tracking-wider uppercase">
                  {item.rotulo || "Leitura"}
                </span>
                <span className="font-semibold text-gray-800">
                  {item.opcoes?.[0]?.referencia || "Texto litúrgico"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reflexão Inspirada no Pe. Paulo Ricardo */}
        <div className="space-y-2 bg-blue-50/50 p-5 rounded-2xl border border-blue-100/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#005a8d] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" /> Reflexão Diária (Pe. Paulo Ricardo)
          </h4>
          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed italic">
            "{getReflexaoPadrePaulo(liturgiaDia?.liturgia)}"
          </p>
        </div>

      </div>

    </div>
  );
}
