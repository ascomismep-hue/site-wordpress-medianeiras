import { useState, useEffect } from "react";
import { Sparkles, Loader2, X, ChevronRight, UserCheck, RotateCcw } from "lucide-react";

export default function LiturgiaDiariaCard() {
  const [liturgiaData, setLiturgiaData] = useState(null);
  const [santoDoDia, setSantoDoDia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leituraAberta, setLeituraAberta] = useState(null);

  const [dataSelecionada, setDataSelecionada] = useState(new Date());

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
    async function fetchLiturgiaPorData(date) {
      setLoading(true);
      try {
        const ano = date.getFullYear();
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const dia = String(date.getDate()).padStart(2, '0');
        const dataFormatadaExibicao = `${dia}/${mes}/${ano}`;

        let dadosLiturgia = null;

        // Tenta buscar da API passando a data específica
        try {
          const res = await fetch(`https://api-liturgia-diaria.vercel.app/?date=${ano}-${mes}-${dia}`);
          if (res.ok) {
            const json = await res.json();
            dadosLiturgia = json.today || json;
          }
        } catch (e) {
          console.warn("Falha na API por data.");
        }

        // Fallback para Railway caso falhe
        if (!dadosLiturgia || !dadosLiturgia.leituras) {
          try {
            const resRailway = await fetch(`https://liturgia.up.railway.app/v3/${ano}/${mes}/${dia}`);
            if (resRailway.ok) {
              const dataRailway = await resRailway.json();
              if (dataRailway && dataRailway.celebracoes) {
                const principal = dataRailway.celebracoes.find(c => c.principal) || dataRailway.celebracoes[0];
                dadosLiturgia = {
                  data: dataRailway.data || dataFormatadaExibicao,
                  cor: principal.cor || dataRailway.cor || "Verde",
                  liturgia: principal.liturgia || principal.titulo || "Celebração do Dia",
                  leituras: principal.leituras || []
                };
              }
            }
          } catch (e) {
            console.warn("Falha no fallback Railway.");
          }
        }

        // Busca o Santo do Dia correspondente
        const resSanto = await fetch(`https://catolicoapp.com/wp-json/wp/v2/santos?dia=${date.getDate()}&mes=${date.getMonth() + 1}`).catch(() => null);
        if (resSanto && resSanto.ok) {
          const dataSanto = await resSanto.json();
          if (Array.isArray(dataSanto) && dataSanto.length > 0) {
            setSantoDoDia({
              nome: dataSanto[0].title?.rendered || "Santo do Dia",
              imagem: dataSanto[0].imagem_destacada || ""
            });
          } else {
            setSantoDoDia(null);
          }
        } else {
          setSantoDoDia(null);
        }

        if (dadosLiturgia) {
          setLiturgiaData({
            data: dadosLiturgia.data || dataFormatadaExibicao,
            cor: dadosLiturgia.cor || dadosLiturgia.color || "Verde",
            liturgia: dadosLiturgia.liturgia || dadosLiturgia.titulo || dadosLiturgia.title || "Celebração do Dia",
            leituras: dadosLiturgia.leituras || dadosLiturgia.readings || []
          });
        } else {
          setLiturgiaData({
            data: dataFormatadaExibicao,
            cor: "Verde",
            liturgia: "Celebração do Dia",
            leituras: []
          });
        }

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLiturgiaPorData(dataSelecionada);
  }, [dataSelecionada]);

  const corBruta = liturgiaData?.cor || "Verde";
  const corDoDia = corBruta.charAt(0).toUpperCase() + corBruta.slice(1).toLowerCase();
  const estilo = corConfig[corDoDia] || corConfig.default;

  function getReflexao() {
    if (santoDoDia?.nome) {
      return `Celebrando a memória de ${santoDoDia.nome}, somos convidados a fazer de Cristo o nosso 'único necessário', buscando a santidade com um amor autêntico e entregue.`;
    }
    return "A liturgia de hoje nos convida a silenciar o coração e escutar com atenção a Palavra de Deus, permitindo que ela seja luz viva para orientar nossos passos e transformar nossas atitudes.";
  }

  const voltarParaHoje = () => {
    setDataSelecionada(new Date());
  };

  const hoje = new Date();
  const ehHoje = 
    dataSelecionada.getDate() === hoje.getDate() &&
    dataSelecionada.getMonth() === hoje.getMonth() &&
    dataSelecionada.getFullYear() === hoje.getFullYear();

  return (
    <div className={`w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-20 px-4 sm:px-8 my-8 overflow-hidden transition-all duration-700 ${estilo.sectionBg}`}>
      
      {/* Imagem do Vaticano com opacidade sutil */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url(${imagemVaticano})` }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        
        {/* Controles de Data / Voltar para Hoje */}
        <div className="flex justify-between items-center max-w-5xl mx-auto px-4 flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl text-white text-xs font-bold">
            <span>Data Selecionada: {liturgiaData?.data || "Carregando..."}</span>
          </div>

          {!ehHoje && (
            <button
              onClick={voltarParaHoje}
              className="px-4 py-2.5 rounded-2xl font-bold text-xs bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-md flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Voltar para Hoje
            </button>
          )}
        </div>

        {/* CARD DA LITURGIA */}
        {loading ? (
          <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl flex items-center justify-center min-h-[380px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" />
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 text-gray-950 animate-fadeIn">
            
            {/* Esquerda */}
            <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-full overflow-hidden bg-black flex items-center justify-center">
              <img 
                src={santoDoDia?.imagem || imagemVaticano} 
                alt={santoDoDia?.nome || "Celebração"} 
                className="absolute inset-0 w-full h-full object-cover filter brightness-90"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30 flex flex-col justify-between p-8 text-white z-10">
                <div className="flex justify-between items-center">
                  <span className="bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    {ehHoje ? "Liturgia de Hoje" : "Liturgia Selecionada"}
                  </span>
                  <span className={`text-xs font-bold px-4 py-1.5 rounded-xl shadow-md border ${estilo.badgeBg}`}>
                    Cor: {corDoDia}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-white/80 font-medium">{liturgiaData?.data}</p>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold leading-snug">{liturgiaData?.liturgia}</h3>
                  
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

            {/* Direita */}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {liturgiaData?.leituras && Array.isArray(liturgiaData.leituras) && liturgiaData.leituras.length > 0 ? (
                      liturgiaData.leituras.map((item, idx) => {
                        const opcaoPrincipal = item.opcoes?.[0];
                        return (
                          <div 
                            key={idx}
                            onClick={() => setLeituraAberta(item)}
                            className="bg-gray-50 hover:bg-blue-50/60 p-3.5 rounded-2xl border border-gray-200 hover:border-[#005a8d] text-xs space-y-1 cursor-pointer transition-all group shadow-xs"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-400 group-hover:text-[#005a8d] block text-[10px] tracking-wider uppercase">
                                {item.rotulo || item.titulo || "Leitura"}
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#005a8d] group-hover:translate-x-0.5 transition-transform" />
                            </div>
                            <span className="font-bold text-gray-800 block truncate">
                              {opcaoPrincipal?.referencia || item.referencia || item.ref || "Ver texto"}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-gray-500 italic col-span-3">Nenhuma leitura encontrada para esta data.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 bg-blue-50/50 p-5 rounded-2xl border border-blue-100/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#005a8d] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" /> Reflexão Diária
                </h4>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed italic">
                  "{getReflexao()}"
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL DE LEITURA COM SUPORTE A REFRÃO DO SALMO */}
      {leituraAberta && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full p-8 rounded-3xl shadow-2xl space-y-6 relative animate-fadeIn my-8 max-h-[85vh] flex flex-col text-gray-950">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">{leituraAberta.rotulo || leituraAberta.titulo}</span>
                <h3 className="text-xl font-serif font-bold text-[#005a8d] mt-0.5">{leituraAberta.opcoes?.[0]?.referencia || leituraAberta.referencia || leituraAberta.ref}</h3>
              </div>
              <button onClick={() => setLeituraAberta(null)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-xl transition-colors font-bold flex items-center gap-1 text-xs">
                <X className="w-4 h-4" /> Fechar
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 flex-1 text-gray-700 text-sm leading-relaxed">
              {leituraAberta.opcoes?.[0]?.titulo && (
                <p className="font-serif italic font-bold text-[#005a8d]">{leituraAberta.opcoes[0].titulo}</p>
              )}
              {leituraAberta.opcoes?.[0]?.refrao && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 font-semibold">
                  <span>R. </span>{leituraAberta.opcoes[0].refrao}
                </div>
              )}
              <div className="whitespace-pre-wrap font-sans">
                {leituraAberta.opcoes?.[0]?.texto || leituraAberta.texto || leituraAberta.text || "Texto não disponível."}
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button onClick={() => setLeituraAberta(null)} className="bg-[#005a8d] hover:bg-[#004068] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-colors">
                Recolher / Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
