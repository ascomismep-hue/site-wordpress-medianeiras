import { useState, useEffect } from "react";
import { Sparkles, Calendar, Loader2, Bookmark, X, ChevronRight, BookOpen } from "lucide-react";

export default function LiturgiaDiariaCard() {
  const [liturgiaDia, setLiturgiaDia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leituraAberta, setLeituraAberta] = useState(null); // Controla qual leitura está expandida

  // Mapeamento visual completo das cores litúrgicas para destaque máximo
  const corConfig = {
    Verde: { bg: "bg-emerald-600", text: "text-emerald-700", border: "border-emerald-500", badge: "bg-emerald-100 text-emerald-800 border-emerald-300" },
    Vermelho: { bg: "bg-red-600", text: "text-red-700", border: "border-red-500", badge: "bg-red-100 text-red-800 border-red-300" },
    Roxo: { bg: "bg-purple-700", text: "text-purple-800", border: "border-purple-500", badge: "bg-purple-100 text-purple-900 border-purple-300" },
    Branco: { bg: "bg-amber-500", text: "text-amber-800", border: "border-amber-400", badge: "bg-amber-100 text-amber-900 border-amber-300" },
    Rosa: { bg: "bg-pink-600", text: "text-pink-700", border: "border-pink-500", badge: "bg-pink-100 text-pink-900 border-pink-300" },
    default: { bg: "bg-[#005a8d]", text: "text-[#005a8d]", border: "border-[#005a8d]", badge: "bg-blue-100 text-[#005a8d] border-blue-300" }
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

  // Banco inteligente de imagens temáticas sacras reais baseadas no santo ou festa do dia
  function getImagemLiturgica(titulo) {
    const nome = titulo?.toLowerCase() || "";
    if (nome.includes("madalena") || nome.includes("maria")) {
      return "https://images.unsplash.com/photo-1548625361-168c14d9b626?auto=format&fit=crop&w=800&q=80"; // Nossa Senhora / Santa
    } else if (nome.includes("são") || nome.includes("santa") || nome.includes("mártir") || nome.includes("apóstolo")) {
      return "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80"; // Vitral / Santo
    } else if (nome.includes("senhor") || nome.includes("natal") || nome.includes("pascoa") || nome.includes("corpo")) {
      return "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80"; // Altar / Eucaristia
    } else {
      return "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"; // Cruz / Tempo Comum
    }
  }

  function getReflexao(titulo) {
    const nome = titulo?.toLowerCase() || "";
    if (nome.includes("madalena")) {
      return "Santa Maria Madalena nos recorda que nenhum passado impede a ação da graça de Deus. O verdadeiro discípulo é aquele que faz de Cristo o seu 'único necessário', buscando-o com amor autêntico e inesgotável.";
    }
    return "A liturgia de hoje nos convida a silenciar o coração e escutar com atenção a Palavra de Deus, permitindo que ela seja luz viva para orientar nossos passos e transformar nossas atitudes diárias.";
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-center min-h-[320px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all hover:shadow-md">
      
      {/* COLUNA ESQUERDA: Vídeo de Fundo + Imagem Temática Dinâmica do Santo/Festa */}
      <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-full overflow-hidden bg-black flex items-center justify-center">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-priest-holding-a-chalice-in-a-church-41584-large.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-8 text-white z-10">
          <div className="flex justify-between items-center">
            <span className="bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
              Liturgia Viva
            </span>
            {/* Cor Litúrgica destacada */}
            <span className="text-xs font-bold bg-white/25 px-3.5 py-1 rounded-xl backdrop-blur-xs border border-white/30">
              Cor: {corDoDia}
            </span>
          </div>

          <div className="space-y-4">
            {/* Imagem do Santo / Festa alterando dinamicamente */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/50 shadow-2xl bg-white/10 backdrop-blur-md">
              <img 
                src={getImagemLiturgica(liturgiaDia?.liturgia)} 
                alt="Tema litúrgico" 
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

      {/* COLUNA DIREITA: Leituras Interativas e Reflexão */}
      <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c5a059]">Missas e Orações</span>
              <h4 className="font-serif font-bold text-xl text-[#005a8d]">Leituras e Palavra de Deus</h4>
            </div>
            {/* Indicador chamativo da Cor Litúrgica */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border font-bold text-xs shadow-xs ${estilo.badge}`}>
              <span className={`w-3 h-3 rounded-full ${estilo.bg} inline-block shadow-xs`}></span>
              Cor Litúrgica: {corDoDia}
            </div>
          </div>

          {/* Cards das Leituras (Clicáveis para abrir o texto completo) */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Clique em uma leitura para ver o texto:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {liturgiaDia?.leituras?.map((item, idx) => {
                const opcaoPrincipal = item.opcoes?.[0];
                return (
                  <div 
                    key={idx}
                    onClick={() => setLeituraAberta(item)}
                    className="bg-gray-50 hover:bg-blue-50/60 p-3.5 rounded-2xl border border-gray-200 hover:border-[#005a8d] text-xs space-y-1 cursor-pointer transition-all group shadow-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-400 group-hover:text-[#005a8d] block text-[10px] tracking-wider uppercase">
                        {item.rotulo || "Leitura"}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#005a8d] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <span className="font-bold text-gray-800 block truncate">
                      {opcaoPrincipal?.referencia || "Ver texto"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reflexão Diária (Sem menção ao Padre Paulo Ricardo) */}
        <div className="space-y-2 bg-blue-50/50 p-5 rounded-2xl border border-blue-100/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#005a8d] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" /> Reflexão Diária
          </h4>
          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed italic">
            "{getReflexao(liturgiaDia?.liturgia)}"
          </p>
        </div>

      </div>

      {/* MODAL / QUADRO EXPANSÍVEL DA LEITURA SELECIONADA */}
      {leituraAberta && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full p-8 rounded-3xl shadow-2xl space-y-6 relative animate-fadeIn my-8 max-h-[85vh] flex flex-col">
            
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">{leituraAberta.rotulo}[cite: 1]</span>
                <h3 className="text-xl font-serif font-bold text-[#005a8d] mt-0.5">
                  {leituraAberta.opcoes?.[0]?.referencia || "Texto Litúrgico"}[cite: 1]
                </h3>
              </div>
              <button
                onClick={() => setLeituraAberta(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-xl transition-colors font-bold flex items-center gap-1 text-xs"
                title="Fechar quadro"
              >
                <X className="w-4 h-4" /> Fechar
              </button>
            </div>

            {/* Conteúdo completo da leitura vindo da API v3[cite: 1] */}
            <div className="space-y-4 overflow-y-auto pr-2 flex-1 text-gray-700 text-sm leading-relaxed">
              {leituraAberta.opcoes?.[0]?.titulo && (
                <p className="font-serif italic font-bold text-[#005a8d]">
                  {leituraAberta.opcoes[0].titulo}[cite: 1]
                </p>
              )}
              {leituraAberta.opcoes?.[0]?.refrao && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 font-semibold">
                  <span>R. </span>{leituraAberta.opcoes[0].refrao}[cite: 1]
                </div>
              )}
              <div className="whitespace-pre-wrap font-sans">
                {leituraAberta.opcoes?.[0]?.texto || "Texto não disponível para esta opção."}[cite: 1]
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                onClick={() => setLeituraAberta(null)}
                className="bg-[#005a8d] hover:bg-[#004068] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-colors"
              >
                Recolher / Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
