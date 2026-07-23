import { useState, useEffect } from "react";
import { Sparkles, Calendar, Loader2, Bookmark, X, ChevronRight, UserCheck } from "lucide-react";

export default function LiturgiaDiariaCard() {
  const [liturgiaDia, setLiturgiaDia] = useState(null);
  const [santoDoDia, setSantoDoDia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leituraAberta, setLeituraAberta] = useState(null);

  // Mapeamento de cores para o fundo com onda fluida
  const corConfig = {
    Verde: { 
      sectionBg: "bg-emerald-900/15 border-emerald-500/40", 
      badgeBg: "bg-emerald-600 text-white border-emerald-700", 
      waveColor: "rgba(16, 185, 129, 0.2)"
    },
    Vermelho: { 
      sectionBg: "bg-red-900/15 border-red-500/40", 
      badgeBg: "bg-red-600 text-white border-red-700", 
      waveColor: "rgba(239, 68, 68, 0.2)"
    },
    Roxo: { 
      sectionBg: "bg-purple-900/15 border-purple-500/40", 
      badgeBg: "bg-purple-700 text-white border-purple-800", 
      waveColor: "rgba(147, 51, 234, 0.2)"
    },
    Branco: { 
      sectionBg: "bg-amber-500/15 border-amber-400/50", 
      badgeBg: "bg-amber-600 text-white border-amber-700", 
      waveColor: "rgba(245, 158, 11, 0.2)"
    },
    Rosa: { 
      sectionBg: "bg-pink-900/15 border-pink-500/40", 
      badgeBg: "bg-pink-600 text-white border-pink-700", 
      waveColor: "rgba(236, 72, 153, 0.2)"
    },
    default: { 
      sectionBg: "bg-blue-900/15 border-blue-500/40", 
      badgeBg: "bg-[#005a8d] text-white border-[#004068]", 
      waveColor: "rgba(0, 90, 141, 0.2)"
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const hoje = new Date();
        const dia = hoje.getDate();
        const mes = hoje.getMonth() + 1;

        const [resLiturgia, resSanto] = await Promise.all([
          fetch("https://liturgia.up.railway.app/v3/"),
          fetch(`https://catolicoapp.com/wp-json/wp/v2/santos?dia=${dia}&mes=${mes}`).catch(() => null)
        ]);

        const dataLiturgia = await resLiturgia.json();
        if (dataLiturgia && dataLiturgia.celebracoes) {
          const principal = dataLiturgia.celebracoes.find(c => c.principal) || dataLiturgia.celebracoes[0];
          setLiturgiaDia({
            data: dataLiturgia.data,
            ...principal
          });
        }

        if (resSanto && resSanto.ok) {
          const dataSanto = await resSanto.json();
          if (Array.isArray(dataSanto) && dataSanto.length > 0) {
            setSantoDoDia({
              nome: dataSanto[0].title?.rendered || "Santo do Dia",
              imagem: dataSanto[0].imagem_destacada || ""
            });
          }
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const corDoDia = liturgiaDia?.cor || "Verde";
  const estilo = corConfig[corDoDia] || corConfig.default;

  function getReflexao(titulo) {
    if (santoDoDia?.nome) {
      return `Celebrando a memória de ${santoDoDia.nome}, somos convidados a fazer de Cristo o nosso 'único necessário', buscando a santidade com um amor autêntico e entregue.`;
    }
    return "A liturgia de hoje nos convida a silenciar o coração e escutar com atenção a Palavra de Deus, permitindo que ela seja luz viva para orientar nossos passos e transformar nossas atitudes.";
  }

  if (loading) {
    return (
      <div className="w-full bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex items-center justify-center min-h-[320px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" />
      </div>
    );
  }

  return (
    <>
      {/* Estilos inline para as animações de onda lenta e contínua */}
      <style>{`
        @keyframes waveSlow1 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.1); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes waveSlow2 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-30px, 20px) scale(1.15); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-wave-1 {
          animation: waveSlow1 12s ease-in-out infinite;
        }
        .animate-wave-2 {
          animation: waveSlow2 16s ease-in-out infinite;
        }
      `}</style>

      <div className={`w-full py-14 px-4 sm:px-8 my-6 relative overflow-hidden transition-all duration-700 ${estilo.sectionBg} rounded-[3rem] border shadow-sm`}>
        
        {/* Formas orgânicas com movimento de onda lento nas extremidades */}
        <div 
          className="absolute -top-28 -right-28 w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none animate-wave-1 opacity-70"
          style={{ backgroundColor: estilo.waveColor }}
        ></div>
        <div 
          className="absolute -bottom-28 -left-28 w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none animate-wave-2 opacity-70"
          style={{ backgroundColor: estilo.waveColor }}
        ></div>

        {/* Container Principal do Card */}
        <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-md border border-white/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
          
          {/* COLUNA ESQUERDA: Santo do Dia */}
          <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-full overflow-hidden bg-black flex items-center justify-center">
            <img 
              src={santoDoDia?.imagem || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"} 
              alt={santoDoDia?.nome || "Santo do Dia"} 
              className="absolute inset-0 w-full h-full object-cover filter brightness-90"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30 flex flex-col justify-between p-8 text-white z-10">
              <div className="flex justify-between items-center">
                <span className="bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  Liturgia & Santo do Dia
                </span>
                <span className={`text-xs font-bold px-4 py-1.5 rounded-xl shadow-md border ${estilo.badgeBg}`}>
                  Cor: {corDoDia}
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-white/80 font-medium">{liturgiaDia?.data || "Hoje"}</p>
                <h3 className="text-xl sm:text-2xl font-serif font-bold leading-snug">{liturgiaDia?.liturgia || "Celebração do Dia"}</h3>
                
                {santoDoDia?.nome && (
                  <div className="pt-2 border-t border-white/20">
                    <p className="text-xs text-[#c5a059] font-bold flex items-center gap-1.5 leading-relaxed">
                      <UserCheck className="w-4 h-4 shrink-0 text-[#c5a059]" /> 
                      <span>Santo do Dia: {santoDoDia.nome}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: Leituras e Reflexão */}
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c5a059]">Missas e Orações</span>
                  <h4 className="font-serif font-bold text-xl text-[#005a8d]">Leituras e Palavra de Deus</h4>
                </div>
                
                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-bold text-xs shadow-xs ${estilo.badgeBg}`}>
                  <span className={`w-3.5 h-3.5 rounded-full ${corDoDia === 'Branco' ? 'bg-amber-300' : 'bg-white'} inline-block shadow-xs`}></span>
                  Cor Litúrgica: {corDoDia}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Clique em uma leitura para ver o texto completo:</span>
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
                            {item.rotulo}
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

            <div className="space-y-2 bg-blue-50/50 p-5 rounded-2xl border border-blue-100/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#005a8d] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" /> Reflexão Diária
              </h4>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed italic">
                "{getReflexao(liturgiaDia?.liturgia)}"
              </p>
            </div>

          </div>

        </div>

        {/* MODAL / QUADRO EXPANSÍVEL DA LEITURA SELECIONADA */}
        {leituraAberta && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white max-w-2xl w-full p-8 rounded-3xl shadow-2xl space-y-6 relative animate-fadeIn my-8 max-h-[85vh] flex flex-col">
              
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
                  title="Fechar quadro"
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
