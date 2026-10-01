import { useState, useEffect } from "react";
import { Sparkles, Calendar, Loader2, X, ChevronRight, BookOpen } from "lucide-react";
import { supabase } from "@/api/supabaseClient";

export default function LiturgiaDiariaCard() {
  const [liturgiaDia, setLiturgiaDia] = useState(null);
  const [reflexaoManual, setReflexaoManual] = useState("");
  const [loading, setLoading] = useState(true);
  const [leituraAberta, setLeituraAberta] = useState(null);

  // URL da imagem do Vaticano solicitada
  const imagemVaticano = "https://previews.123rf.com/images/karakotsya/karakotsya1411/karakotsya141100256/33261436-st-peter-s-cathedral-rome-vatican-italy-hand-drawing-on-grunge-paper-background-saint-pietro.jpg";

  const corConfig = {
    Verde: { 
      sectionBg: "bg-emerald-800 text-white", 
      badgeBg: "bg-emerald-600 text-white border-emerald-500" 
    },
    Vermelho: { 
      sectionBg: "bg-red-900 text-white", 
      badgeBg: "bg-red-700 text-white border-red-600" 
    },
    Roxo: { 
      sectionBg: "bg-purple-950 text-white", 
      badgeBg: "bg-purple-800 text-white border-purple-700" 
    },
    Branco: { 
      sectionBg: "bg-amber-700 text-white", 
      badgeBg: "bg-amber-600 text-white border-amber-500" 
    },
    Rosa: { 
      sectionBg: "bg-pink-800 text-white", 
      badgeBg: "bg-pink-600 text-white border-pink-500" 
    },
    default: { 
      sectionBg: "bg-[#005a8d] text-white", 
      badgeBg: "bg-[#004068] text-white border-[#003050]" 
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const hoje = new Date();
        const dataFormatadaSupabase = hoje.toISOString().split('T')[0]; // Formato AAAA-MM-DD para busca opcional

        // Busca paralela da API de Liturgia e da reflexão cadastrada pelas irmãs no Supabase
        const [resLiturgia, resReflexaoSupabase] = await Promise.all([
          fetch("https://liturgia.up.railway.app/v3/"),
          supabase.from("liturgia_reflexao").select("texto_reflexao").eq("data", dataFormatadaSupabase).maybeSingle()
        ]);

        const dataLiturgia = await resLiturgia.json();
        if (dataLiturgia && dataLiturgia.celebracoes) {
          const principal = dataLiturgia.celebracoes.find(c => c.principal) || dataLiturgia.celebracoes[0];
          setLiturgiaDia({
            data: dataLiturgia.data,
            ...principal
          });
        }

        // Se houver reflexão escrita pelas irmãs no banco, usa-a; senão, usa uma mensagem padrão acolhedora
        if (resReflexaoSupabase && resReflexaoSupabase.data?.texto_reflexao) {
          setReflexaoManual(resReflexaoSupabase.data.texto_reflexao);
        } else {
          setReflexaoManual("A Palavra de Deus nos convida hoje a silenciar o coração e a escutar com docilidade a Sua vontade, renovando a nossa esperança e o amor fraterno em nossa comunidade.");
        }

      } catch (err) {
        console.error("Erro ao carregar dados da liturgia:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const corDoDia = liturgiaDia?.cor || "Verde";
  const estilo = corConfig[corDoDia] || corConfig.default;

  if (loading) {
    return (
      <div className="w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-center min-h-[320px] my-6">
        <Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" />
      </div>
    );
  }

  return (
    <>
      {/* Faixa de ponta a ponta na largura da tela com a textura do Vaticano */}
      <div className={`w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-16 px-4 sm:px-8 my-8 overflow-hidden transition-all duration-700 ${estilo.sectionBg}`}>
        
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url(${imagemVaticano})` }}
        ></div>

        {/* Container centralizado exclusivo para a Liturgia */}
        <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 sm:p-12 relative z-10 text-gray-950 space-y-8">
          
          {/* Cabeçalho */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Liturgia Diária
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#005a8d]">
                {liturgiaDia?.liturgia || "Celebração do Dia"}
              </h3>
              <p className="text-xs text-gray-500 font-medium">{liturgiaDia?.data || "Hoje"}</p>
            </div>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-bold text-xs shadow-xs ${estilo.badgeBg}`}>
              <span className={`w-3.5 h-3.5 rounded-full ${corDoDia === 'Branco' ? 'bg-amber-300' : 'bg-white'} inline-block shadow-xs`}></span>
              Cor Litúrgica: {corDoDia}
            </div>
          </div>

          {/* Leituras */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Leituras da Santa Missa (Clique para ler o texto completo):</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {liturgiaDia?.leituras?.map((item, idx) => {
                const opcaoPrincipal = item.opcoes?.[0];
                return (
                  <div 
                    key={idx}
                    onClick={() => setLeituraAberta(item)}
                    className="bg-gray-50 hover:bg-blue-50/60 p-4 rounded-2xl border border-gray-200 hover:border-[#005a8d] text-xs space-y-1.5 cursor-pointer transition-all group shadow-xs flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-400 group-hover:text-[#005a8d] block text-[10px] tracking-wider uppercase">
                        {item.rotulo}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#005a8d] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <span className="font-bold text-gray-800 block text-sm">
                      {opcaoPrincipal?.referencia || "Ver texto"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reflexão feita pelas Irmãs */}
          <div className="space-y-2 bg-blue-50/50 p-6 rounded-3xl border border-blue-100/80 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#005a8d] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c5a059]" /> Reflexão Espiritual (Por uma das Irmãs)
            </h4>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed italic font-serif">
              "{reflexaoManual}"
            </p>
          </div>

        </div>

        {/* Modal de Leitura */}
        {leituraAberta && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white max-w-2xl w-full p-8 rounded-3xl shadow-2xl space-y-6 relative animate-fadeIn my-8 max-h-[85vh] flex flex-col text-gray-950">
              
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">{leituraAberta.rotulo}</span>
                  <h3 className="text-xl font-serif font-bold text-[#005a8d] mt-0.5">
                    {leituraAberta.opcoes?.[0]?.referencia || "Texto Litúrgico"}
                  </h3>
                </div>
                <button
                  onClick={() => setLeituraAberta(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-xl transition-colors font-bold flex items-center gap-1 text-xs"
                >
                  <X className="w-4 h-4" /> Fechar
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto pr-2 flex-1 text-gray-700 text-sm leading-relaxed">
                {leituraAberta.opcoes?.[0]?.titulo && (
                  <p className="font-serif italic font-bold text-[#005a8d]">
                    {leituraAberta.opcoes[0].titulo}
                  </p>
                )}
                {leituraAberta.opcoes?.[0]?.refrao && (
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 font-semibold">
                    <span>R. </span>{leituraAberta.opcoes[0].refrao}
                  </div>
                )}
                <div className="whitespace-pre-wrap font-sans">
                  {leituraAberta.opcoes?.[0]?.texto || "Texto não disponível para esta opção."}
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
    </>
  );
}
