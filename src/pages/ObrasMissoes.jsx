import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Heart, Building2, MapPin, Phone, GraduationCap, Stethoscope, Users, CheckCircle2, Church } from "lucide-react";

export default function ObrasMissoes() {
  const [abaAtiva, setAbaAtiva] = useState("obras"); // "obras" ou "casas"
  const [obrasList, setObrasList] = useState([]);
  const [casasList, setCasasList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para controlar qual obra está expandida na aba Obras Sociais
  const [itemExpandido, setItemExpandido] = useState(null);

  // Nenhum estado selecionado ao entrar na aba (inicia null)
  const [estadoSelecionado, setEstadoSelecionado] = useState(null);

  useEffect(() => {
    fetchDados();
  }, []);

  async function fetchDados() {
    setLoading(true);
    const [{ data: obras }, { data: casas }] = await Promise.all([
      supabase.from("obras_sociais").select("*").order("ordem"),
      supabase.from("casas_missao").select("*").order("ordem")
    ]);

    if (obras) setObrasList(obras);
    if (casas) setCasasList(casas);
    setLoading(false);
  }

  const educacao = obrasList.filter(o => o.categoria === "educacao");
  const saude = obrasList.filter(o => o.categoria === "saude");
  const social = obrasList.filter(o => o.categoria === "social");

  // Filtra as casas de missão de acordo com o estado selecionado
  const casasFiltradas = casasList.filter(casa => {
    if (!estadoSelecionado || !casa.cidade_estado) return false;
    return casa.cidade_estado.toUpperCase().includes(estadoSelecionado);
  });

  const estadosInfo = {
    PE: { nome: "Pernambuco" },
    CE: { nome: "Ceará" },
    BA: { nome: "Bahia" },
    SE: { nome: "Sergipe" }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] pb-24">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#005a8d] via-[#004068] to-[#002845] text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#c5a059]">
            <Heart className="w-4 h-4 text-[#c5a059]" /> Missão e Carisma
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold">Obras e Missões</h1>
          <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base font-light">
            Conheça o alcance da nossa congregação através das frentes de atuação social, educacional, de saúde e das casas missionárias.
          </p>
        </div>
      </section>

      {/* Menu Interno (Abas) */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-20 mb-16 flex justify-center">
        <div className="bg-white p-2 rounded-2xl shadow-md border border-gray-100 flex gap-2">
          <button
            onClick={() => setAbaAtiva("obras")}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              abaAtiva === "obras"
                ? "bg-[#005a8d] text-white shadow-sm"
                : "text-gray-600 hover:text-[#005a8d]"
            }`}
          >
            <Heart className="w-4 h-4" /> Obras Sociais
          </button>
          <button
            onClick={() => setAbaAtiva("casas")}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              abaAtiva === "casas"
                ? "bg-[#005a8d] text-white shadow-sm"
                : "text-gray-600 hover:text-[#005a8d]"
            }`}
          >
            <Building2 className="w-4 h-4" /> Casas de Missão
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>
        ) : abaAtiva === "obras" ? (
          <div className="space-y-20">
            {/* Bloco 1: EDUCAÇÃO */}
            {educacao.length > 0 && (
              <div className="space-y-6">
                <div className="bg-blue-50/70 border border-blue-100 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white text-[#005a8d] flex items-center justify-center shadow-xs shrink-0">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Educação</h2>
                      <p className="text-gray-600 text-sm mt-0.5">
                        <strong className="text-[#005a8d]">Objetivo:</strong> Promover a formação integral de crianças e jovens, unindo excelência pedagógica, valores cristãos e apoio às famílias em vulnerabilidade.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {educacao.map(item => {
                    const isOpen = itemExpandido === item.id;
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => setItemExpandido(isOpen ? null : item.id)}
                        className={`bg-white rounded-3xl shadow-sm border transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer ${
                          isOpen ? "border-[#005a8d] ring-2 ring-[#005a8d]/20 shadow-md" : "border-blue-100 hover:border-blue-300"
                        }`}
                      >
                        {item.foto_url && (
                          <div className="h-48 overflow-hidden bg-gray-100 relative">
                            <img src={item.foto_url} alt={item.titulo} className="w-full h-full object-cover" />
                            <span className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                              {isOpen ? "Recolher" : "Ver Detalhes"}
                            </span>
                          </div>
                        )}
                        <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#005a8d] px-2.5 py-1 rounded-full">Educação</span>
                            <h3 className="text-xl font-serif font-bold text-gray-800 mt-2">{item.titulo}</h3>
                            {item.subtitulo && <p className="text-xs font-semibold text-[#c5a059]">{item.subtitulo}</p>}
                            <p className="text-gray-600 text-sm mt-3 leading-relaxed">{item.descricao}</p>
                          </div>

                          {isOpen && (
                            <div className="pt-4 mt-4 border-t border-blue-100 space-y-3 bg-blue-50/40 p-4 rounded-2xl animate-fadeIn">
                              {item.unidades_escolas && (
                                <div className="text-xs text-gray-700 space-y-1">
                                  <p className="text-[#005a8d] font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Unidades e Escolas:
                                  </p>
                                  <p className="pl-4">{item.unidades_escolas}</p>
                                </div>
                              )}
                              {item.telefone && (
                                <div className="text-xs text-gray-700 flex items-center gap-1.5 pt-1">
                                  <Phone className="w-3.5 h-3.5 text-[#005a8d]" />
                                  <span className="font-semibold">{item.telefone}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {!isOpen && (
                            <div className="pt-3 text-xs text-[#005a8d] font-bold flex items-center gap-1">
                              Clique para ver mais informações &rarr;
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bloco 2: SAÚDE */}
            {saude.length > 0 && (
              <div className="space-y-6">
                <div className="bg-emerald-50/70 border border-emerald-100 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white text-emerald-700 flex items-center justify-center shadow-xs shrink-0">
                      <Stethoscope className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-emerald-900">Saúde</h2>
                      <p className="text-gray-600 text-sm mt-0.5">
                        <strong className="text-emerald-800">Objetivo:</strong> Oferecer atendimento médico-hospitalar humanizado, priorizando o acolhimento aos mais necessitados e atuando como referência na região.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {saude.map(item => {
                    const isOpen = itemExpandido === item.id;
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => setItemExpandido(isOpen ? null : item.id)}
                        className={`bg-white rounded-3xl shadow-sm border transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer ${
                          isOpen ? "border-emerald-600 ring-2 ring-emerald-600/20 shadow-md" : "border-emerald-100 hover:border-emerald-300"
                        }`}
                      >
                        {item.foto_url && (
                          <div className="h-48 overflow-hidden bg-gray-100 relative">
                            <img src={item.foto_url} alt={item.titulo} className="w-full h-full object-cover" />
                            <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                              {isOpen ? "Recolher" : "Ver Detalhes"}
                            </span>
                          </div>
                        )}
                        <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">Saúde</span>
                            <h3 className="text-xl font-serif font-bold text-gray-800 mt-2">{item.titulo}</h3>
                            {item.subtitulo && <p className="text-xs font-semibold text-emerald-600">{item.subtitulo}</p>}
                            <p className="text-gray-600 text-sm mt-3 leading-relaxed">{item.descricao}</p>
                          </div>

                          {isOpen && (
                            <div className="pt-4 mt-4 border-t border-emerald-100 space-y-3 bg-emerald-50/40 p-4 rounded-2xl animate-fadeIn">
                              {item.unidades_escolas && (
                                <div className="text-xs text-gray-700 space-y-1">
                                  <p className="text-emerald-800 font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Unidades e Projetos:
                                  </p>
                                  <p className="pl-4">{item.unidades_escolas}</p>
                                </div>
                              )}
                              {item.telefone && (
                                <div className="text-xs text-gray-700 flex items-center gap-1.5 pt-1">
                                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                                  <span className="font-semibold">{item.telefone}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {!isOpen && (
                            <div className="pt-3 text-xs text-emerald-700 font-bold flex items-center gap-1">
                              Clique para ver mais informações &rarr;
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bloco 3: SOCIAL */}
            {social.length > 0 && (
              <div className="space-y-6">
                <div className="bg-red-50/70 border border-red-100 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white text-[#e31e24] flex items-center justify-center shadow-xs shrink-0">
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-red-950">Social & Missão</h2>
                      <p className="text-gray-600 text-sm mt-0.5">
                        <strong className="text-red-900">Objetivo:</strong> Estender o amor cristão aos mais vulneráveis através de amparo comunitário, assistência social e evangelização ativa.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {social.map(item => {
                    const isOpen = itemExpandido === item.id;
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => setItemExpandido(isOpen ? null : item.id)}
                        className={`bg-white rounded-3xl shadow-sm border transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer ${
                          isOpen ? "border-red-600 ring-2 ring-red-600/20 shadow-md" : "border-red-100 hover:border-red-300"
                        }`}
                      >
                        {item.foto_url && (
                          <div className="h-48 overflow-hidden bg-gray-100 relative">
                            <img src={item.foto_url} alt={item.titulo} className="w-full h-full object-cover" />
                            <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                              {isOpen ? "Recolher" : "Ver Detalhes"}
                            </span>
                          </div>
                        )}
                        <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-[#e31e24] px-2.5 py-1 rounded-full">Social</span>
                            <h3 className="text-xl font-serif font-bold text-gray-800 mt-2">{item.titulo}</h3>
                            {item.subtitulo && <p className="text-xs font-semibold text-red-600">{item.subtitulo}</p>}
                            <p className="text-gray-600 text-sm mt-3 leading-relaxed">{item.descricao}</p>
                          </div>

                          {isOpen && (
                            <div className="pt-4 mt-4 border-t border-red-100 space-y-3 bg-red-50/40 p-4 rounded-2xl animate-fadeIn">
                              {item.unidades_escolas && (
                                <div className="text-xs text-gray-700 space-y-1">
                                  <p className="text-red-900 font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Projetos Relacionados:
                                  </p>
                                  <p className="pl-4">{item.unidades_escolas}</p>
                                </div>
                              )}
                              {item.telefone && (
                                <div className="text-xs text-gray-700 flex items-center gap-1.5 pt-1">
                                  <Phone className="w-3.5 h-3.5 text-[#e31e24]" />
                                  <span className="font-semibold">{item.telefone}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {!isOpen && (
                            <div className="pt-3 text-xs text-[#e31e24] font-bold flex items-center gap-1">
                              Clique para ver mais informações &rarr;
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ABA: CASAS DE MISSÃO - MAPA DO BRASIL REAL (LADO A LADO) */
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
              <h2 className="text-3xl font-serif font-bold text-[#005a8d]">Casas de Missão por Estado</h2>
              <p className="text-gray-600 text-sm">Clique em um dos estados em destaque no mapa (ou nos botões) para visualizar as casas missionárias.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* COLUNA ESQUERDA: MAPA DO BRASIL SVG REAL (Ocupa 5 colunas) */}
              <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center sticky top-6">
                <div className="w-full max-w-[320px] h-[380px] relative flex items-center justify-center">
                  <svg 
                    viewBox="0 0 220000 194010" 
                    className="w-full h-full drop-shadow-sm"
                    style={{ shapeRendering: "geometricPrecision" }}
                  >
                    {/* Demais estados do Brasil (Cinza Neutro Fixo) */}
                    <path
                      d="M 627 220000l0 -220000 2200000 0 0 220000 -220000 0z"
                      style={{ fill: "none", stroke: "none" }}
                    />
                    
                    {/* Caminhos cinzas gerais do mapa base */}
                    <path
                      id="base-mapa"
                      d="M549 648l105945 0c611,385 1390,935 1463,1524 7,58 970,265 1320,504 416,390 875,734 1370,1022 205,326 184,836 684,925l710 1132 -32 32 -32 32 -97 354 -32 418 -32 128 -32 33 0 161 -33 128 -64 129 -96 257 -32 64 0 64 0 97 -97 64 -96 32 -65 65 -64 32 -161 32 -32 32 -96 97 -32 64 0 64 0 97 -33 96 -64 97 -96 64 0 32 -33 64 -96 33 -32 32 -32 32 0 32 -65 97 -64 32 -64 0 -32 32 -65 32 -32 64 32 129 -32 96 -128 -32 -65 64 -32 161 -32 32 -32 33 -32 225 -33 64 -96 96 -161 354 -96 32 32 32 -64 65 -33 32 -32 128 -64 65 -193 386 -32 96 -161 193 0 64 -32 32 -129 193 -32 33 -64 32 -32 -65 -32 -32 -33 32 0 33 -64 32 -64 32 0 64 -64 64 32 161 -65 -32 -64 32 -32 65 -32 64 32 32 -32 32 -32 -32 -33 64 33 32 32 -32 32 32 -32 33 -32 64 96 96 -64 129 -65 129 -32 32 -32 96 0 32 0 65 -64 128 -32 65 -33 0 0 32 0 64 33 32 32 0 0 32 -65 97 -32 0 -32 -32 -64 64 -129 193 -32 96 -96 161 -32 64 32 65 -32 64 0 32 -65 129 -64 128 -32 65 -65 161 -32 -33 -32 33 -64 64 64 64 -32 64 96 65 33 96 -33 0 -32 64 0 33 -32 0 -64 32 32 96 0 65 -64 0 -97 96 0 97 -96 0 -32 64 32 32 -32 32 -65 0 -32 32 -32 32 0 65 -96 96 32 32 -32 65 -258 192 0 33 -64 32 -32 0 -32 32 -97 32 -32 32 -32 -32 0 64 -32 -32 -65 65 -160 64 -32 0 0 32 -97 0 32 64 0 33 -96 0 0 96 -64 32 0 64 -33 33 -32 96 -32 32 -32 -32 -64 0 0 32 -33 -32 -32 0 32 32 -32 97 -193 32 -128 -65 -161 0 -32 -32 -64 -64 0 -32 -65 -64 -96 0 -193 0 -161 32 -64 32 -97 0 -32 32 -32 -32 0 32 -32 -32 -32 -32 -32 0 -33 32 -32 0 -32 32 -32 32 -32 -32 -32 0 32 32 -32 0 -33 -32 0 -32 33 -32 32 -65 -32 -32 64 0 32 -32 0 -96 32 32 129 -97 -32 -64 -65 32 -64 -32 0 -64 -96 -32 0 -65 -65 0 -64 -32 -32 -32 0 -64 -32 -65 -32 32 -33 -64 -64 0 -64 32 0 65 -32 64 -33 32 -32 32 -64 0 -32 65 -64 0 -33 32 -32 0 -32 64 -129 -64 -32 0 32 64 33 32 0 32 -65 33 -64 -33 -64 33 -65 -33 -32 0 -64 33 -96 0 -65 -65 -64 0 -32 0 -65 -64 -64 0 0 32 -32 0 -32 -32 -32 0 -97 0 0 -97 -32 33 0 -33 -96 0 0 33 -33 0 -32 -65 -64 0 -96 -32 -33 32 -64 0 0 -32 32 -32 32 0 -32 -64 65 -33 32 -64 -32 32 -33 -64 -32 32 -64 -32 64 -32 32 0 -32 -32 -64 0 -64 0 -33 0 -32 32 -32 32 -32 0 -32 32 -32 0 -33 64 -96 33 32 32 32 0 32 64 -32 0 -96 32 -32 0 -32 -32 -33 32 -32 -32 -64 0 -32 64 32 33 -32 32 0 32 -32 -32 -32 96 -65 -32 0 -64 -64 0 0 -32 -32 32 0 32 0 32 32 97 -32 32 0 32 -32 32 -33 -32 -64 0 -32 64 -64 -32 -65 32 -900 257 -1157 -160 -804 -611 -257 64 -161 -193 32 -418 -290 -96 -225 128 -353 32 -225 -321 -97 -97 -64 -289 -257 -64 -258 193 -192 128 -97 -193 -257 32 -161 193 -129 97 -192 -64 -193 0 -193 193 64 128 -193 161 -193 -97 -257 0 -96 -32 -129 32 0 33 -97 0 -96 32 -32 -65 -65 33 -32 -33 -32 33 -32 0 -32 32 -64 32 -65 0 -64 -32 -96 32 -97 -32 -32 96 -64 0 -129 -32 -64 -96 -33 -33 33 -32 -33 -64 -64 -32 -32 32 -225 -32 -96 -32 0 -65 -65 0 -32 -32 -32 0 -32 -64 -32 -32 -33 -32 -32 -33 -64 0 0 -32 -64 -32 -161 32 -32 0 -32 32 -33 33 0 64 65 32 -32 32 -33 32 0 65 -96 64 0 64 32 -32 32 64 32 0 33 0 0 33 -33 32 -64 32 -32 64 -32 0 -32 64 0 33 -65 32 0 64 33 0 32 32 0 32 0 32 -32 33 0 32 -97 -32 -32 -33 -32 -64 -32 -64 -33 0 0 -32 -32 0 -32 32 0 32 0 64 -32 65 32 32 0 32 -64 32 -32 32 0 65 -65 64 0 32 -64 32 0 32 64 33 32 32 33 32 64 0 64 -32 32 64 33 -32 64 64 32 0 32 32 0 32 32 0 0 33 -32 64 -64 32 0 32 32 0 32 32 32 65 97 0 64 0 64 96 -32 32 32 32 33 0 32 33 0 64 32 0 -32 32 32 97 96 -33 65 65 32 0 0 32 -32 64 128 64 32 33 0 64 -32 32 0 32 0 32 0 32 -32 65 -32 -32 -32 0 -32 0 0 32 64 193 -32 32 32 32 0 64 96 65 0 96 -64 32 -96 65 -97 128 -64 -32 -32 32 -32 32 -65 0 0 32 -128 -64 -32 0 -33 -32 -32 0 -32 0 -64 0 -65 0 0 32 -32 0 0 -64 -32 0 -32 32 -64 -32 -33 32 0 -32 -64 0 0 -64 -32 -33 -64 -64 -32 0 -33 0 -32 -64 -32 32 -96 0 -32 0 -33 -32 -96 32 -32 96 -97 -32 -64 -64 -64 -64 -32 0 -33 0 -32 -65 -64 0 -64 -64 -33 0 -64 -32 -64 32 -97 0 0 64 -32 0 -32 -32 -32 0 -64 -64 0 -32 -32 0 -33 0 -32 0 -32 -32 -96 32 -65 -32 -64 96 -97 0 -32 64 -64 33 -64 0 -32 32 -97 0 -64 -97 -32 -32 -32 0 -65 -64 -32 32 -64 64 -32 0 0 65 -129 0 -32 -33 0 33 -97 -33 -96 -32 -32 65 -32 0 0 32 -65 32 -32 32 -32 32 -32 64 -32 33 -65 32 0 32 0 32 -32 -32 0 -32 -32 -32 32 0 -64 -33 -32 0 -32 -32 -33 0 0 -32 -32 0 -32 -32 -64 32 0 -32 -32 0 -97 0 -32 -32 -64 -32 0 -32 -65 -65 -128 32 -32 0 -32 0 -33 33 -32 64 -32 -32 -96 0 -33 -32 -32 0 -32 -65 -32 -64 -32 -32 -64 -32 -33 0 -32 0 -32 -65 0 -128 -32 -33 -32 -32 0 -64 -32 -32 -33 32 -64 -32 -32 0 0 64 0 32 -129 32 -32 65 -96 -32 -32 32 -33 32 -64 0 -64 96 -97 33 0 96 -32 -32 -32 -32 -32 0 -32 -65 -65 -64 33 -32 -65 0 -128 -64 -32 96 -65 -32 -64 32 -32 -32 -32 64 0 32 -65 33 65 32 0 32 -65 96 -32 0 -64 -32 -64 32 0 33 -129 32 -32 0 0 96 0 32 32 32 -32 33 32 64 -64 64 32 64 -32 33 -32 64 0 32 -129 32 -32 0 -32 32 -33 0 -32 33 32 96 -32 32 -32 0 -32 65 0 64 0 32 -32 -32 -32 32 -65 32 32 32 0 65 -64 0 0 32 -64 -32 -32 32 -32 0 0 -65 -33 0 -64 33 -32 32 -64 -32 -65 0 0 32 -96 32 0 -32 -32 0 -32 -32 -33 -65 0 32 -64 0 -64 -32 0 -32 -32 -64 -33 0 33 64 -65 0 32 0 -32 -32 -64 32 -64 -32 -65 32 0 -32 -32 0 -32 -32 -32 64 -64 -32 0 96 -32 0 32 65 -32 32 -33 -32 -64 32 -64 0 -32 0 0 -32 -33 64 0 64 -128 -64 0 32 -32 0 -33 0 -32 0 -32 32 0 32 -32 65 -64 0 -129 0 -32 -32 -32 -33 -32 33 -32 -33 -65 0 0 33 -32 0 -32 32 129 64 0 64 -33 0 33 97 -33 64 33 64 -33 33 -32 0 32 32 -32 32 32 32 -64 97 0 32 -32 32 0 64 -97 -64 0 32 -64 -64 -96 -32 -33 32 0 64 -96 0 0 -32 -64 0 -65 64 -64 0 -96 -32 0 -32 -32 -64 0 -65 0 -32 -33 -64 -96 -32 -64 -33 0 33 -65 0 -128 96 -32 -32 -65 -32 0 -32 -32 -33 -32 33 -97 -33 0 33 -128 0 32 -129 -64 -32 -32 32 -33 64 -32 32 0 33 -64 32 0 32 0 32 -32 32 -129 32 0 65 32 32 -32 32 0 32 32 64 33 0 32 33 -65 64 -160 0 -33 0 -64 0 -32 64 -64 -64 -65 32 -64 0 -32 -32 -64 32 0 64 32 33 32 64 -32 32 0 32 -32 32 0 32 128 65 -32 32 96 64 0 -32 33 32 -65 97 0 160 0 33 -32 32 -64 32 0 129 -32 0 -65 -33 -32 33 0 64 -32 -64 -32 32 0 -32 -32 -97 -32 0 -65 0 0 -32 -32 64 -32 0 0 32 -32 65 -32 0 0 -32 -97 -33 -32 -32 -64 -32 -32 32 -65 -32 -64 64 -64 -32 0 -64 -65 0 -64 0 -32 32 0 32 -32 129 0 64 32 32 -129 193 -64 -64 -64 64 -32 65 -33 -33 -64 0 -32 65 -32 -32 -64 64 -33 0 0 -64 -32 -33 -64 33 -32 0 -32 -97 -33 0 -32 -96 -32 -33 -64 0 -64 -32 32 -32 0 -32 64 -32 -64 -97 -65 -32 -32 -32 0 -32 32 -32 0 -65 -225 33 -32 0 -32 32 -32 -32 -32 -65 -32 -32 0 32 -65 0 -64 -32 -129 32 -32 -64 -32 0 -32 32 -32 0 -32 -32 -33 -64 -32 32 -32 -32 -64 32 -65 -32 -64 0 -32 0 -32 -32 -32 0 -32 -33 -65 -64 -32 0 -64 0 0 32 -97 -32 -32 -64 -96 0 -32 -32 -33 -33 -32 -32 -32 0 32 -32 -32 -96 -32 -32 32 -33 -32 -32 -64 -64 -33 0 -32 32 -64 0 0 -64 32 -32 -32 -129 0 -32 -32 -32 -97 0 0 64 -32 32 0 -32 -32 0 -64 0 32 -64 -32 0 0 -32 -64 -65 0 -64 0 -32 -65 32 -64 0 -32 -64 32 -97 -64 -32 -33 -129 -96 0 -97 -32 -32 -64 0 -32 0 -129 -32 -32 -32 32 0 32 -32 0 0 -64 -64 -64 0 -65 -33 -32 0 -32 -32 -32 -32 0 0 -32 -32 32 -64 -64 -65 32 -32 32 -96 0 -32 32 -65 -64 -32 -32 -96 -32 -33 32 0 -32 -32 -65 -96 0 0 -32 32 -32 -32 -32 32 -65 32 0 -32 -32 32 -64 64 -32 0 32 33 -32 0 -32 32 -97 -65 -96 0 -32 -32 32 32 64 -64 64 -32 -32 -32 -64 -97 0 -64 32 -32 0 -32 0 -32 0 -32 -64 32 -97 -65 -96 33 -32 -33 -65 65 -32 0 -96 32 -97 -32 -32 32 -32 32 0 0 -97 0 -32 0 -32 -32 0 32 -32 32 0 32 -32 -64 0 32 -32 -32 -32 0 -33 -32 0 -32 -128 32 -97 64 -32 0 -64 0 -32 -32 -32 32 -33 -64 -64 0 -64 0 -32 0 -33 0 -32 32 -32 32 -64 -32 -32 32 0 -32 -129 64 -32 0 -64 -64 -65 32 -64 -64 -32 0 -32 -64 0 -97 0 -32 32 -32 0 -65 -64 -32 -65 -96 -32 0 -64 -32 32 -33 32 -32 -64 -32 0 0 -32 0 -4727 32 -32 32 -32 33 -32 32 -32 -32 -97 32 -32 64 32 32 -32 0 -64 -32 -33 -32 -160 32 -97 -32 0 -64 32 -33 0 0 -64 0 -32 33 -64 32 -65 32 0 32 0 0 -32 -64 0 0 -32 96 -32 0 -97 -64 -64 -97 -32 -32 -64 0 -65 -32 0 0 -193 0 -64 64 0 65 -32 32 32 0 -64 64 32 32 -32 33 32 64 -64 64 0 -32 -32 64 0 33 -97 32 -32 96 0 0 -32 32 -32 32 -33 33 -32 32 0 32 -64 32 32 64 -32 32 -64 -32 -65 32 -32 -32 -32 -32 -32 0 -32 -32 0 0 -32 64 -33 32 -64 65 -32 32 0 32 -64 32 0 0 32 -32 32 32 0 65 -32 32 -64 32 64 32 -32 0 -32 -32 -33 32 -32 32 -32 32 32 0 -64 -32 -32 0 -65 0 -32 -32 0 0 -32 0 -96 32 -33 65 0 -33 -64 65 64 0 -128 96 0 32 -32 -32 -32 32 0 32 32 33 0 0 -32 0 -33 64 -32 -32 -32 0 -32 -32 -64 -97 0 0 -32 -64 0 -32 64 -32 -32 -65 0 0 -32 65 -65 -33 -32 33 -32 -33 0 -32 32 -32 -32 32 -32 0 -65 -64 65 -32 -32 0 -33 32 33 32 0 0 -65 -96 -32 0 -64 0 -32 -65 0 -64 -65 -32 0 96 -193 32 -32 33 -96 -129 -64 -193 0 -96 -65 -33 -32 -64 -64 0 -32 -32 -97 0 -96 -32 -33 128 -160 -32 -32 -64 0 0 -33 0 -32 32 -32 32 -64 32 0 33 0 0 -64 64 -65 64 -32 0 -32 -32 -96 64 -33 -64 -64 -64 32 -97 -96 -32 -32 -64 -65 -64 0 -65 -96 -64 0 0 -32 -64 0 -33 -97 -32 0 0 64 -32 33 -64 -33 -32 -32 -65 32 -32 0 -32 0 -32 -32 32 -64 -64 -32 0 -32 -32 64 -65 0 -64 64 -32 -32 32 -32 -96 -32 32 -32 -65 -32 0 -33 -32 33 -96 -33 0 -32 -32 0 -32 97 -33 32 -64 -32 -32 -65 -32 0 -32 33 -33 -33 -64 33 -32 -33 -97 0 -32 0 0 -32 0 -32 -32 -32 -64 32 0 -32 0 -32 -97 32 33 64 -129 0 -32 0 -97 0 -32 -32 32 -128 -32 -33 0 -64 32 -32 33 0 0 32 64 0 -32 -64 64 0 -32 -97 64 -32 32 0 32 -32 33 32 128 -64 0 -65 0 -64 -32 -32 32 -32 64 -97 161 -160 0 -32 -64 -33 64 -128 0 -97 0 -64 -64 -64 32 -33 32 -64 -32 -32 32 -64 32 -32 33 -33 32 -321 32 -64 32 -65 0 -64 32 0 -32 -64 32 -65 -32 -32 32 -32 -64 -129 0 -64 0 -32 0 -32 32 -32 0 -32 -64 -33 64 -64 -32 -32 32 -32 -32 -32 -32 0 -65 -33 -32 33 0 -33 -96 -64 -32 0 -33 -64 0 -32 -32 -32 -32 -33 -96 0 0 -32 -32 -225 -129 -161 -32 -96 -97 64 -64 32 -96 -64 0 -64 -33 -65 -64 -32 -64 32 -32 33 -65 32 -96 0 0 64 -32 32 -32 0 0 32 -129 0 -32 97 -64 0 -33 0 -64 0 -32 0 -64 32 0 -32 0 -32 -65 -32 -96 64 -65 -32 0 32 0 64 -96 64 -32 0 -32 -96 -65 0 -32 0 -32 0 -96 0 -129 -32 -64 32 -32 32 -129 0 -96 -64 0 -64 -33 0 -32 32 -32 -32 -64 32 -65 -32 -64 -33 -32 0 -96 -32 -65 32 -64 33 -64 0 -65 96 65 32 96 0 32 0 32 0 33 32 0 65 96 64 32 64 -32 65 32 96 0 32 32 -64 32 32 0 32 -32 64 32 65 -32 128 65 33 32 96 64 64 0 65 64 32 33 128 32 65 -32 160 -65 0 -32 33 -64 64 0 64 -129 32 0 33 32 32 -32 32 -32 64 -64 64 0 33 -65 32 0 32 -32 32 -64 0 -64 64 -33 32 33 33 -33 32 33 0 -33 32 -32 0 -32 64 -32 32 -64 -32 -129 32 0 33 -96 0 -33 32 33 32 -65 32 -32 0 -96 129 -97 -32 -32 -33 -96 0 -65 65 0 96 -32 64 -64 33 0 32 -64 0 -33 0 0 64 65 32 0 64 32 33 -64 64 32 32 32 32 -32 32 -97 0 32 97 -32 64 -32 32 -96 0 -33 97 0 32 -64 0 -64 0 0 -32 -129 0 -96 0 -32 32 -33 0 -64 -32 -64 64 -97 32 0 32 -32 0 -64 65 0 -65 -64 0 0 -32 -32 0 -33 -32 -64 -64 -32 0 -32 32 -65 -96 0 64 -128 -64 -32 64 -33 -64 -64 -33 0 65 -32 0 -32 -32 -64 0 -33 -33 0 33 -96 0 -32 96 64 32 0 32 32 0 32 32 33 0 0 65 96 32 0 32 -64 32 32 32 -129 0 0 32 -64 33 32 64 -96 0 0 64 -65 0 -96 -32 -161 0 0 -32 -64 0 -32 0 0 32 -65 0 32 -32 -32 -32 -32 0 -64 0 -32 64 -32 0 -65 64 -128 33 0 32 0 32 -32 32 0 64 32 97 -32 32 -33 0 33 64 0 32 64 33 -32 32 -32 96 0 32 -33 0 -64 65 -64 32 0 32 -32 32 -33 0 -96 32 -64 0 -33 -64 -64 32 -32 64 -32 0 -32 0 0 -64 -65 0 0 -32 -32 0 -32 0 -32 32 -32 0 -32 0 -65 0 -96 32 -32 -32 32 -32 0 -32 -32 0 -32 64 -129 32 -32 0 0 32 32 32 0 33 -64 0 -33 0 0 -33 -64 33 0 32 -32 32 0 64 -64 0 32 65 -32 96 0 32 -65 0 -64 -32 0 -32 -64 0 -32 0 -32 32 32 32 -32 32 -33 0 -32 0 -64 -32 -32 32 -64 0 0 33 -33 128 0 32 0 32 0 33 -64 -33 -32 -96 -129 -129 -32 -32 0 -64 32 -32 -32 0 -32 32 -32 64 -32 -32 -33 64 -64 0 -32 33 0 -33 0 -32 -32 32 -32 33 -97 -65 -64 32 0 33 0 64 32 32 -32 32 -32 0 -32 -32 -32 0 0 32 -33 32 -64 0 0 65 32 0 0 32 0 32 -96 0 -32 32 -33 32 0 -32 -64 -32 -32 0 -32 0 -97 -32 0 -65 0 -32 -96 32 -64 -32 -33 -32 -32 32 -64 -64 -129 0 -32 -64 -64 32 -64 0 0 -32 -33 0 -32 32 -64 -64 -32 0 0 -97 -65 0 0 32 -32 0 -96 -96 0 32 -32 0 -32 -32 -33 0 -32 -32 0 32 -96 0 -32 0 0 32 -32 0 -33 -32 -32 32 -32 64 64 0 33 32 -33 0 0 65 -32 0 -32 0 -32 64 -32 -32 -32 -32 -33 0 -32 32 0 32 -128 -32 64 64 0 32 -96 32 -65 0 32 65 -32 64 -32 0 64 32 33 -32 0 96 32 65 -32 32 -33 0 -64 32 0 64 32 33 -96 0 -32 0 0 -33 -33 -64 -64 0 -32 -32 -96 0 -97 -32 -32 32 0 32 -97 0 -64 0 -64 32 -161 -64 -64 32 0 32 0 32 -65 65 -32 0 32 128 97 33 -32 96 -65 64 -96 32 0 33 0 32 0 32 -32 128 64 33 0 32 32 64 65 32 0 32 32 0 -97 65 0 32 97 64 32 65 64 0 0 32 -64 64 32 32 0 97 32 96 -32 96 32 65 -32 32 0 64 -32 0 0 65 -32 0 -97 -65 -32 -64 -32 0 -32 -97 -32 0 -32 -64 -33 0 -32 0 -64 -32 -97 129 -96 64 -64 64 -97 65 -64 0 0 96 -32 64 -129 129 -32 32 -32 0 -64 0 -33 -32 -64 -64 -64 -97 -65 0 0 -96 -192 -97 -65 -32 65 0 32 -64 0 -129 32 -32 0 -32 -32 -32 -32 0 -65 -65 0 -64 -96 -64 -97 -64 -64 0 -64 0 -65 0 -64 -33 -64 0 -65 0 -96 -128 0 -32 -32 -33 0 -160 64 -65 64 -257 -64 0 -128 -32 -33 -32 -128 32 -32 -64 -32 0 -33 -32 -32 -33 -32 65 0 32 -32 0 -64 32 -97 0 -193 -129 -96 33 -65 0 -96 96 0 32 64 0 -32 64 32 0 32 0 65 0 0 33 -32 32 64 64 -32 32 -97 97 0 32 0 64 -64 32 -64 -32 -32 0 -65 -32 -32 0 0 32 -32 -32 -32 0 32 96 0 65 -32 -65 -32 33 -65 -65 -32 0 -32 -32 -32 0 -32 0 0 -32 0 -97 -97 33 -32 0 -64 0 0 -33 32 -32 -32 -32 32 -64 -32 -64 -97 -97 -64 -96 -64 -32 -65 -129 -32 -32 -64 -32 -64 0 0 32 0 64 0 32 0 32 -32 97 0 32 -33 32 0 32 33 32 64 0 0 33 32 32 64 0 -96 96 -64 -32 -65 0 0 32 -32 0 -32 -32 -65 -32 -32 -32 32 -32 -96 -33 -64 0 -129 33 -96 -33 -97 0 0 -32 -32 -32 -32 0 0 32 -32 -32 -32 32 -129 65 -32 -33 -32 33 -32 32 -65 0 -32 32 -32 64 -32 32 -32 65 -33 -33 0 33 0 64 -32 0 -64 -129 -32 0 -64 -32 0 -128 -161 -33 0 -32 -64 -32 -129 -257 -97 -97 -32 -64 32 -32 0 -64 -96 -161 -97 -97 -64 0 -64 -96 -32 0 -97 64 -128 0 -65 -32 -96 -32 -64 0 -33 0 0 -64 -96 0 -64 32 -129 32 -257 -32 -64 0 -129 0 -129 64 -225 32 0 32 -96 -32 -97 0 -64 65 -161 -65 -161 -128 -160 -354 -161 -161 -418 -193 -64 0 -97 97 -32 96 0 161 64 193 129 96 129 97 96 64 64 64 65 193 96 129 32 129 32 32 0 32 97 64 96 65 65 128 96 64 97 33 32 225 96 96 129 97 96 160 97 129 32 32 128 -32 97 32 96 64 97 33 225 128 64 64 161 97 64 161 0 32 97 64 64 97 193 193 96 128 0 129 0 161 0 64 -32 -32 -64 96 -161 161 -64 64 -32 97 32 64 96 64 -32 322 129 354 0 96 0 193 0 64 -32 97 -65 128 -32 65 97 96 193 161 64 128 161 161 32 97 64 96 32 64 161 65 0 289 64 129 33 64 160 97 32 32 -32 32 0 32 32 64 0 32 0 33 65 0 0 32 -32 32 0 96 64 32 32 65 -32 0 -64 64 0 32 64 65 0 64 -32 0 32 64 0 65 -32 64 -65 64 0 64 -96 65 0 96 -32 0 -32 -32 0 32 0 64 -32 65 0 64 -33 97 -32 64 32 32 65 0 0 32 64 32 -32 33 32 32 32 0 32 0 32 -32 33 0 64 64 32 -32 96 64 322 129 129 32 160 64 225 96 258 0 193 0 160 -32 290 -96 450 -97 257 -32 161 32 64 33 0 96 -128 161 0 64 96 322 32 128 -32 97 0 32 161 161 -129 64 0 64 32 0 -32 97 0 32 0 64 -32 0 -96 64 -33 0 -32 33 -32 0 -96 -65 -32 0 -33 65 -64 64 -96 0 0 -32 -129 -65 -97 0 -32 33 -96 32 -32 0 -65 64 -64 0 0 64 0 33 -32 0 -64 96 -32 0 -33 0 -32 0 -32 32 32 129 0 64 -32 32 -32 -32 -96 0 32 -64 -32 -32 -33 -33 -128 97 0 32 -33 32 -32 32 0 32 -32 33 -64 -33 -32 0 -32 65 -33 32 -64 -32 -128 0 -33 96 -64 32 -32 -96 -161 0 -32 -32 -32 -32 -32 0 -97 64 -64 -32 -64 0 -33 -32 -32 32 -32 -32 -64 64 -32 0 -32 32 -65 64 -32 0 0 65 -96 32 -32 32 -65 32 0 65 0 96 0 64 -32 161 0 32 64 0 0 97 -32 0 32 64 -32 32 0 64 -64 161 0 32 32 0 0 65 0 32 -32 32 32 96 32 0 -32 97 0 32 -32 129 -64 64 -33 96 -64 65 0 96 -64 32 -65 0 -32 0 -64 32 -64 0 -32 0 0 65 -65 96 -32 65 -96 96 -32 0 -65 -32 -32 32 -64 32 -32 64 -65 0 0 33 -96 64 -32 32 -33 32 0 32 -32 33 -32 32 0 64 0 64 0 32 0 33 -64 32 0 32 0 32 32 32 -32 32 -32 -32 -32 -64 -33 -32 -96 0 -64 0 -32 -32 32 -97 0 -32 64 -129 32 -32 -32 -32 96 -96 65 -97 -32 -96 -97 0 -32 0 -64 -32 -65 64 0 32 -64 64 0 32 -96 65 -33 0 -32 -32 -96 64 -64 64 -65 65 -96 32 -32 -32 0 32 0 32 -97 64 -96 161 -65 32 33 32 -33 65 33 0 -65 96 -96 0 -65 64 -32 0 -64 97 -64 64 -32 0 -65 32 -32 0 -64 -32 -32 32 0 32 0 33 -33 96 -32 0 0 64 -128 65 -32 0 -33 -33 -96 -128 -64 -64 0 -33 32 -32 -65 -128 -32 -33 -64 97 -193 129 32 32 -64 96 0 64 -32 0 -65 0 0 -96 -32 0 -64 0 32 32 -64 64 -32 65 -65 32 -32 -32 0 -32 -32 -33 -32 0 -64 65 32 96 32 32 -64 97 -97 96 -64 97 -64 32 0 64 -129 -32 -64 32 -32 -32 32 -96 -65 -65 -32 32 -32 0 -64 -64 -97 64 0 65 -96 32 -65 0 33 96 -33 97 0 128 -32 129 -32 32 0 32 0 32 97 33 -33 96 -32 32 -32 161 -64 129 -64 64 -65 0 32 -32 -32 -64 -64 0 -96 32 -65 -32 -32 32 -32 -32 32 -33 -32 -32 -32 0 -129 0 -96 65 -33 -33 -64 193 -64 65 32 32 -96 64 -33 64 -32 0 -32 32 -32 97 -64 32 64 129 0 32 32 32 -32 32 32 65 -32 32 -64 -32 0 32 0 64 -32 32 -33 97 -64 64 0 32 -64 32 -97 0 -32 0 -32 32 -32 0 -32 32 -129 0 -64 97 -32 -32 -33 0 0 -65 -32 -32 -64 -160 -32 -33 -32 -32 64 -96 0 -97 96 -64 33 0 32 -96 0 -33 64 0 32 -96 -32 -64 32 -33 32 33 32 -33 33 0 -33 -128 65 -64 0 -33 -97 0 0 -32 32 -96 -64 -64 0 -33 -64 -64 32 -32 -32 -32 -32 -65 -65 0 -32 -64 32 -32 -64 0 -32 32 -32 -96 -32 32 -97 -32 0 -33 -32 33 -64 0 32 96 -129 -129 -96 65 -32 64 -33 -32 -32 -32 -32 -32 -32 32 -32 0 -64 0 -65 0 -64 96 -32 0 -32 65 -32 32 -33 -32 -32 32 -32 32 -64 32 -32 -32 -97 64 -128 65 -97 -33 32 65 -32 96 -64 32 -32 65 -33 -33 -96 0 -32 33 0 96 -64 32 0 97 -65 64 0 64 -32 0 -32 0 -32 0 -32 0 -65 32 -64 0 -96 -32 -97 32 -64 0 0 33 -32 96 0 32 -65 65 -64 -33 -32 0 -32 65 -161 32 -32 0 -32 -64 -65 -65 -32 -32 -128 -32 -483 129 -1350 -1190 -1222 -1126 -1093 322 32 -193 -32 -129 0 -450 32 -386 64 -192 -32 -161 0 -129 -32 -675 -32 -97 -32 -96 -33 -129 33 -128 -97 -193 -32 -129 -64 -128 -97 -129 -96 -32 -257 -32 -65 32 -161 -97 -32 -64 -64 -193 -129 -482 0 -257 -32 -97 -32 -514 -128 -129 -97 -64 -96 0 -97 0 -32 64 -64 129 -354 160 -64 65 -65 96 -32 161 -128 97 -97 257 -64 64 -161 0 -225 0 -225 -96 -96 0 -65 32 -161 321 -64 65 -32 32 -97 128 -128 97 -129 32 32 129 -32 64 -64 32 -32 64 -32 32 -161 0 -161 -160 -96 -97 -97 -96 -96 32 -65 -32 -32 0 -32 -32 -32 -129 -64 -32 -32 -129 -65 -64 -32 0 -64 32 -65 -64 -64 32 -64 96 -64 0 -65 65 -64 64 -32 32 -32 257 -65 65 0 96 0 64 97 0 32 0 -32 161 32 129 64 0 65 -32 32 -32 64 0 96 64 -64 96 97 0 32 33 0 64 -32 0 -2541 0 -2282 0 -965 0 -32 32 0 -64 -161 -97 -129 -32 -32 32 -32 -32 -32 -32 -32 64 -32 -32 0 -32 -32 32 -290 -129 -64 65 -161 64 -96 64 -33 0 -32 65 -64 -32 -32 32 -64 0 -65 0 0 -32 -96 0 -32 -33 -32 33 -65 0 -64 0 -129 96 -32 0 -32 64 0 32 -64 -32 -129 32 -32 -32 32 -32 -96 0 0 707 0 1351 0 1029 64 64 96 32 32 -32 33 -96 64 -32 129 -97 96 0 32 0 97 -32 0 64 0 97 32 64 32 -32 64 32 65 -32 96 -32 96 0 33 -65 64 0 96 97 97 32 225 0 129 -32 160 32 65 -32 32 32 0 32 0 64 96 33 161 -161 32 -32 65 32 64 -32 128 0 65 64 0 32 64 0 32 64 64 -32 33 0 257 225 32 32 32 65 -96 64 64 64 161 65 32 64 -97 32 -32 32 32 65 0 32 0 64 65 0 96 64 32 0 65 65 -32 64 0 32 -65 0 -64 32 0 97 32 64 32 32 32 129 -32 96 -32 0 -64 0 -65 65 0 96 33 32 64 32 96 65 161 257 -32 64 -32 0 -32 -32 -65 0 -64 -32 -64 0 -32 -32 -65 32 0 64 -32 32 0 65 0 64 -64 -32 -129 32 0 -32 -64 32 -64 0 -33 0 -96 0 32 -64 -32 -97 32 -32 -64 -32 -32 64 -65 32 -96 -32 0 64 -32 33 -32 32 -65 -65 -193 -192 0 -65 -96 -64 -32 -32 0 -64 -32 -33 -65 0 -32 -64 -32 -32 -32 0 -97 32 -32 32 -32 65 -32 0 -32 0 -32 64 0 64 -32 0 -129 0 0 64 -129 65 0 96 -64 0 0 32 -64 0 -33 -32 -32 0 -64 -96 -32 -32 -129 -33 -32 33 0 64 -64 0 -64 32 -33 129 -64 32 -64 -65 -65 97 -96 32 -32 65 -97 64 0 -64 -32 0 -64 -33 -32 33 -32 0 -65 32 -128 32 -32 -64 -65 32 -32 -32 -64 96 -65 64 -128 -32 -32 -64 -129 0 64 64 -32 64 -32 33 -64 0 -32 -33 -33 -64 -32 0 -32 0 0 386 0 1125 -32 901 0 385 32 547 -32 96 -32 65 0 128 32 33 257 225 32 64 32 32 97 129 32 32 32 64 32 0 33 64 64 65 129 96 32 -32 128 32 65 -32 96 193 64 0 97 32 0 64 64 0 64 33 65 96 32 0 32 64 32 33 65 32 128 32 0 32 97 32 128 32 0 97 32 0 65 0 64 64 -32 129 32 32 64 96 -32 97 -32 64 64 32 32 65 33 0 32 32 0 64 32 0 -32 64 -32 65 -33 96 -64 96 -32 33 32 64 -64 0 -32 32 0 32 -33 65 65 0 -32 32 64 32 -32 32 128 97 33 64 32 0 64 32 0 64 -64 97 128 96 33 0 64 64 0 65 0 161 0 32 32 32 64 0 32 32 65 32 96 97 0 64 64 96 65 -32 64 32 32 65 -64 0 -32 64 -32 0 0 32 64 32 32 32 -32 129 32 32 129 161 0 97 0 64 -65 64 0 129 -64 128 -32 97 32 128 64 129 0 32 0 193 65 129 0 64 -97 32 -64 32 0 65 -32 96 0 193 0 64 -65 65 -32 64 32 161 -321 1800 -450 2669 -354 2090 -707 3987 -225 1254 -214 1254 -11 0 0 64 -33 0 -1659 0 -13 -64 0 -129 -32 -32 -64 -32 -64 -64 -32 32 32 64 -32 32 -33 65 -64 -33 -32 -64 -64 -128 -65 -33 -32 33 -128 0 -65 -33 -64 33 64 64 -32 32 -96 0 0 64 -33 0 -96 -64 -32 32 -32 129 -65 0 -32 -32 65 -129 -33 -96 -160 -33 32 65 -65 64 -32 32 -64 32 -64 32 -97 33 -64 32 -32 -32 -32 -33 0 -64 64 -128 0 -65 -32 0 -97 0 0 193 -32 -64 -32 -32 -32 -32 0 128 0 97 -32 64 -65 0 -32 -64 -32 0 -96 -33 -97 -96 -64 0 -32 0 -32 32 -65 97 -96 -33 -32 65 -33 32 -32 64 11 0 -11 32 32 65 -32 32 0 32 -64 32 -64 -32 -65 0 33 64 64 97 -129 64 -32 32 32 97 -96 32 -64 32 -33 96 -32 33 -32 0 -32 32 0 32 -32 64 -32 -32 -97 -32 -32 -64 -32 -33 -65 -32 0 32 33 33 32 64 -32 64 -65 0 -32 0 -64 0 -32 65 -32 0 -65 -33 32 -96 -64 0 0 64 -96 65 -32 -33 32 -64 -32 -32 -65 32 -32 32 0 65 -32 64 -97 -129 -96 0 32 65 -64 32 0 -65 -32 0 -33 0 -32 0 -32 33 0 64 -64 64 -32 -128 32 -65 -32 -32 -32 0 -33 129 -32 0 0 -97 -32 0 -64 32 -97 -32 -32 0 32 65 33 128 -33 32 -64 65 -64 -33 -64 -96 -65 0 32 64 65 32 0 65 -32 32 0 -32 -33 -32 -96 0 -32 0 0 -65 -33 -32 -32 32 -64 32 -64 -64 -65 64 -96 129 -64 0 0 -32 -32 -32 -33 0 -64 -65 -64 0 -32 33 0 32 -32 32 -33 -32 -64 -32 0 96 64 64 0 32 -32 0 -96 -64 -65 -32 -32 32 0 64 -64 -32 -64 129 -65 64 -96 65 -64 0 -33 -33 -64 -32 0 -32 64 -32 33 -97 0 -32 0 -32 -33 32 -32 32 32 33 -128 96 -32 -64 -65 64 -96 -32 -64 32 -33 0 -64 -64 -64 0 0 -65 -32 -64 -33 32 0 32 0 65 -32 32 -64 0 0 -32 -32 -65 -32 33 -65 0 -64 32 -128 32 -65 32 -64 64 -64 -32 -33 32 0 33 -32 32 -32 -32 0 64 -32 32 0 -64 -97 32 33 64 0 32 -33 0 0 33 -32 32 -32 0 -32 32 32 32 -32 32 32 32 -96 32 -32 -32 -33 32 -32 65 -96 0 0 32 0 64 -32 -32 -32 -32 -97 -32 0 64 -32 64 -97 32 -96 97 32 32 -64 32 -32 65 -129 96 -64 -32 -32 32 -65 32 0 32 -32 0 -128 65 32 32 -32 32 -65 -64 -32 32 0 64 -96 32 -65 32 -32 -64 -64 129 -64 32 0 -64 32 -33 -129 -32 -32 32 -64 0 -33 0 33 33 0 32 -65 0 -64 64 -96 0 -33 96 -32 33 0 64 0 32 0 97 -64 0 -64 64 -33 -32 -32 0 32 32 0 64 -64 0 0 64 -32 0 -32 -64 -32 32 0 -64 -65 32 0 32 33 32 0 65 -97 32 0 64 0 32 -32 0 0 -32 -32 -32 -32 64 -33 0 0 -64 -64 0 -32 97 -64 0 -32 0 -97 96 -32 32 -64 0 -33 32 -64 32 32 33 0 32 -32 32 0 96 -96 65 -65 32 0 -32 -32 0 -32 64 -64 -32 -32 0 -65 32 -96 -64 0 32 -64 0 0 32 -65 0 0 32 32 32 -32 32 0 33 -64 -33 -32 65 -32 32 -33 -32 -32 32 -32 32 -64 32 -64 -32 -33 129 -32 32 -96 32 0 -32 -64 0 -33 64 -32 0 -32 32 -32 32 0 33 32 0 0 32 64 96 -32 32 32 0 0 32 0 97 0 32 -32 64 32 65 0 32 0 64 -32 32 0 33 -32 32 -32 32 0 32 -64 64 0 65 -33 96 0 32 -64 32 0 65 -32 64 0 32 -32 32 -32 97 -65 32 32 32 -32 64 -32 129 0 32 0 129 32 64 0 96 0 33 -32 32 32 64 -64 32 -32 97 0 64 32 32 0 65 32 64 -32 32 -32 -32 -64 32 0 32 0 32 0 32 0 65 -33 0 0 32 -32 32 0 32 0 32 -96 32 0 65 -64 32 -33 0 -32 96 -32 0 0 97 -32 0 -64 96 -97 32 0 33 -64 0 -32 32 0 128 -97 33 -32 0 -32 0 -32 32 0 32 0 32 -65 64 0 65 0 32 0 64 -32 -32 -32 64 0 32 0 65 0 32 -32 128 0 65 -64 32 -32 0 -33 32 0 32 -64 65 -32 0 32 192 -32 33 32 32 -96 96 0 129 0 64 160 161 0 128 0 33 0 64 33 32 64 32 32 97 32 0 97 96 0 32 0 33 0 64 32 64 0 64 32 -32 32 161 32 32 32 129 65 32 32 64 0 65 -32 0 -33 32 33 96 -33 32 0 33 -32 32 -32 96 -32 32 32 32 -32 33 -64 96 -32 0 -33 -32 -64 32 0 64 -32 32 -32 0 0 33 -32 32 32 32 -64 64 -33 -32 0 -32 -64 32 0 32 -64 32 -161 0 -96 33 -65 0 -64 0 -32 32 -32 -32 -65 0 -32 64 -64 32 -32 32 0 97 -97 32 -64 0 -64 32 -32 0 -97 64 -96 0 -33 32 -64 0 -96 33 -161 128 -32 97 -97 0 -32 0 -96 64 -32 32 -129 96 -32 65 -97 161 -64 32 -64 96 -33 32 -32 0 -32 97 0 32 -32 96 -96 97 -65 128 0 33 65 128 0 65 0 96 64 32 0 65 -64 128 -161 193 -97 96 -32 33 32 64 0 32 65 64 32 65 64 64 32 161 32 32 97 64 64 65 0 160 64 129 0 32 -96 129 -161 96 -32 0 0 -64 0 -32 -32 0 -129 64 -96 -32 -64 0 -129 64 -32 97 -32 64 -193 -32 -97 -97 -32 0 -32 33 -32 -65 -32 -32 -32 32 0 65 96 225 64 64 0 161 65 64 -65 64 0 65 -96 160 -97 32 -64 0 -32 0 32 161 64 0 193 193 97 97 96 32 32 128 97 97 96 0 32 96 65 97 32 32 129 0 225 64 32 32 160 97 65 32 32 96 -32 161 0 97 -32 64 -65 96 -32 0 -128 0 -65 -96 -32 0 -32 64 64 129 -64 0 -32 32 96 97 32 64 0 96 33 32 32 33 32 0 32 -33 96 0 65 65 32 161 64 0 97 -33 96 97 0 96 -32 97 64 32 65 96 64 65 32 128 -32 97 32 128 0 65 -32 96 64 32 32 97 65 32 0 32 32 32 64 97 -32 128 64 65 -32 160 97 129 64 32 64 0 0 64 32 0 129 33 64 64 65 0 32 0 32 0 32 64 32 129 65 96 64 -32 0 32 32 -32 96 32 65 0 32 32 96 0 65 161 64 257 -32 129 -32 32 32 129 64 -32 32 32 0 64 33 -32 32 32 0 96 64 65 32 0 32 64 32 0 33 32 64 0 64 -32 97 32 64 0 64 97 64 32 33 96 32 193 96 97 0 128 65 97 64 0 0 96 32 32 0 65 32 128 65 65 32 -32 32 -97 0 129 64 0 97 32 96 289 129 32 -33 65 -32 32 0 32 32 64 0 129 33 64 -33 65 0 128 -64 161 -64 64 -129 64 -96 65 32 32 96 32 0 32 -32 32 -32 33 -64 32 0 32 -97 64 -32 0 -32 -64 -96 64 -97 161 -96 32 32 32 32 65 0 32 -129 32 -32 96 -64 32 -32 65 -97 32 -64 32 0 32 -32 129 -64 64 1864 0 322 0 32 0 0 32 -32 32 32 33 64 32 0 -32 0 32 33 0 0 32 32 -32 32 0 0 32 64 -32 0 32 32 32 33 0 32 0 32 -32 32 32 32 -32 0 32 32 0 0 32 32 -32 33 32 64 0 64 32 0 -32 32 32 32 0 0 33 33 -33 0 65 0 -32 32 0 32 0 32 32 0 -32 0 32 32 0 0 32 32 0 -32 0 32 32 33 0 128 -32 32 0 32 32 0 -32 97 32 32 -32 32 0 0 -32 0 32 32 0 33 0 32 0 32 0 32 -32 64 64 32 0 33 32 32 0 32 -32 32 32 32 0 32 32 33 0 0 65 0 32 32 0 0 32 64 64 32 0 64 -32 65 32 96 -32 65 32 -33 290 97 64 32 0 32 0 -32 129 64 96 -32 64 0 97 -32 96 0 65 -32 96 0 32 64 0 64 64 33 -32 32 32 64 33 64 0 129 64 129 64 -65 32 -96 97 0 32 32 32 0 129 64 64 32 32 -64 32 -32 97 -64 32 -32 64 32 32 64 33 0 64 0 64 -32 64 -97 33 0 64 2573 0 1318 0 64 -97 32 33 32 0 0 -65 65 -32 96 97 33 0 192 -65 65 0 0 -64 32 0 96 32 97 0 0 -96 64 -65 32 -64 32 -32 32 -129 33 -32 32 -32 96 -64 161 -65 97 -64 64 -64 64 0 32 -32 65 0 32 -32 64 32 129 0 0 -32 0 -33 0 -96 32 32 64 -161 32 -32 0 -32 32 32 33 -64 0 32 0 -32 128 0 32 -64 33 0 32 -65 32 0 32 -128 32 0 0 -33 64 -64 97 -64 0 32 64 -32 0 -64 32 32 0 -32 32 32 33 -32 64 0 32 -33 32 -32 32 -32 -32 0 0 -32 97 -32 0 -32 32 0 32 0 0 -65 -32 -32 32 0 -32 -32 32 32 0 -32 32 -32 -32 0 32 -32 32 -32 65 64 32 -32 0 -32 -32 0 32 0 32 -33 32 -32 32 0 65 -64 32 32 0 -32 32 0 32 -64 32 32 0 -32 32 0 0 -33 0 -32 65 0 -33 -32 65 32 0 -32 0 -32 0 -32 32 -32 32 -32 32 32 0 -32 0 -65 32 0 33 0 32 -64 32 0 64 -32 0 -32 32 0 32 0 0 32 33 0 32 -65 32 33 0 32 64 -32 0 32 32 0 0 -32 65 -33 32 33 32 -33 -32 97 -32 0 -32 0 32 96 -32 0 -33 -32 -32 32 32 65 65 96 0 32 -32 -64 -65 64 -32 0 0 65 -64 -33 0 97 32 0 0 32 -32 0 -65 0 -32 -32 -32 0 32 64 -32 32 0 33 64 0 33 64 -33 32 -32 0 -64 -64 -32 32 0 64 -32 32 32 0 -32 65 -32 32 64 161 64 32 -32 32 64 64 65 0 0 64 32 0 64 161 32 0 -32 32 32 33 -32 32 0 64 -32 0 0 96 -32 65 -65 32 -96 -32 -32 32 -32 96 -32 -32 -65 0 -32 97 0 32 0 675 -32 547 0 1414 0 483 0 1221 32 1383 418 -289 64 32 0 32 65 0 32 64 32 0 64 33 32 96 97 64 64 129 -32 32 32 0 32 32 33 -32 64 32 0 32 32 -32 64 32 32 0 0 32 33 33 96 -33 32 33 32 32 65 -32 64 32 96 -32 33 -33 32 0 32 33 32 -65 32 0 97 -32 32 32 32 0 64 0 65 32 32 -32 0 -32 64 0 0 -32 32 32 32 0 0 -32 33 32 0 -32 64 -32 32 -32 32 0 32 -65 32 0 0 -32 33 0 0 32 0 -64 64 -32 -32 32 32 0 32 -64 0 32 32 -32 0 32 32 0 33 0 32 0 0 -32 32 0 32 -32 32 32 -32 -32 64 0 0 -32 32 32 0 -32 65 0 32 -33 32 -32 0 32 32 -64 32 32 32 -64 33 32 32 -64 32 0 32 0 0 -65 97 0 32 0 32 33 32 -33 64 -32 97 32 32 33 32 -33 32 33 32 -33 65 33 32 0 96 0 0 -33 65 0 0 33 32 0 32 32 64 -32 0 32 32 32 0 -32 33 0 32 64 32 64 32 0 -32 33 32 32 64 -65 33 65 64 -65 32 33 32 -33 64 -32 33 32 32 -64 128 32 65 -32 32 32 0 -64 64 0 64 32 0 -32 0 -32 161 32 0 32 32 0 33 0 0 -64 96 0 64 32 32 -32 0 64 65 0 32 32 0 -32 32 -32 32 32 32 0 0 -32 32 32 0 -64 97 0 32 -65 32 0 32 65 32 -32 33 64 32 0 -32 -32 32 -32 32 64 32 0 0 32 32 -64 65 32 0 -32 64 0 -32 64 32 0 32 -32 0 32 32 0 32 -64 0 32 97 32 32 -32 32 32 0 -32 32 0 32 64 33 -32 -33 0 33 -32 96 -32 0 32 -32 0 64 32 32 -64 65 64 32 32 64 -32 64 0 33 32 64 32 64 -32 0 32 32 0 -32 33 32 0 33 -33 0 33 64 0 32 64 32 -64 64 32 65 -32 32 32 32 -65 32 97 64 -32 33 32 32 -32 32 32 32 0 0 32 64 0 0 32 -32 32 32 0 33 32 32 -32 0 32 64 0 -32 -64 32 0 64 -32 33 0 64 0 -32 64 32 0 0 32 64 -32 64 65 65 32 64 -65 32 0 0 33 32 -33 32 0 33 33 32 0 0 -65 64 -32 32 0 -32 0 32 32 32 -32 33 0 -33 32 33 32 32 -32 32 0 32 0 -32 -32 64 0 65 32 0 65 0 -65 32 -32 0 32 32 32 64 -32 0 32 -32 0 32 33 32 -33 32 0 -32 65 0 32 0 32 -32 0 -32 64 32 32 -32 65 32 32 0 32 32 32 32 32 33 0 32 0 64 33 -32 64 64 64 -32 97 514 -129 322 -64 0 -32 96 -65 65 -64 0 -64 96 -65 193 -32 64 -64 65 64 32 0 32 32 32 32 0 -32 32 -32 33 -32 -33 -32 33 -64 160 -65 32 0 65 65 32 -33 32 -64 32 -32 97 0 32 0 32 0 32 -64 64 -32 33 -33 64 -32 32 -64 0 -64 0 -33 32 -64 65 -32 32 -97 -32 -32 32 0 32 -96 64 0 32 -97 32 0 65 -96 64 -32 0 -32 64 -32 33 -65 64 -32 32 -32 -32 -32 32 -32 0 -33 32 -32 -32 -32 -32 0 0 -64 0 -32 32 -65 32 0 32 -32 32 -32 33 -64 32 32 0 -64 64 -33 64 0 32 0 0 -64 33 0 32 -32 32 32 0 -32 32 32 0 -32 64 32 65 32 96 -64 65 32 0 -32 0 32 64 0 32 -32 32 32 32 -64 65 0 0 32 32 -32 64 0 64 0 32 32 33 0 32 32 32 -32 64 32 32 32 0 32 33 -32 0 32 64 0 0 65 32 -32 0 32 64 0 0 32 33 0 32 0 32 32 32 0 32 64 0 32 32 -32 0 32 32 0 0 -32 33 32 32 -32 32 32 128 -546 97 64 96 -96 33 -65 96 -96 32 -97 97 -160 32 -32 96 -33 65 -32 32 0 96 0 0 -64 64 -32 65 32 64 -32 32 -32 129 -32 32 -33 0 -64 32 -32 32 0 33 0 0 -129 -33 -64 65 -96 32 0 32 32 64 32 65 -32 64 64 0 -64 64 0 64 32 33 -32 32 0 0 -32 -32 -65 32 -64 -65 -64 33 -33 32 -32 64 32 0 -32 32 32 32 -32 65 32 32 33 96 -33 32 -32 65 0 32 32 96 0 65 65 64 0 32 -32 64 -33 33 0 32 -32 32 0 -32 -32 0 -64 32 -32 64 0 64 -32 33 0 32 0 0 32 32 0 32 -32 129 -65 -32 0 32 -32 32 0 0 -32 32 32 32 -32 32 0 0 -32 33 32 0 -32 32 -32 0 -65 32 -32 0 32 32 -32 32 -32 -64 0 32 -32 0 -64 0 32 64 -65 32 0 33 0 32 -64 0 64 32 -32 32 -128 32 -33 32 0 0 -32 32 -32 65 32 0 -32 -32 -32 32 -32 0 32 0 -32 64 0 0 -32 0 -32 32 -33 32 33 0 -65 0 32 33 -64 32 32 0 -32 -32 -64 32 0 32 0 64 0 0 32 65 -32 0 -64 0 -33 64 0 32 -64 64 0 0 -32 0 -32 65 -32 0 -33 64 -32 32 32 0 -64 32 0 0 -32 32 0 32 -32 33 0 32 -32 0 -33 32 0 32 0 32 -32 97 -32 96 0 0 -64 32 32 32 -64 -32 -32 65 -33 0 33 0 -33 32 33 32 32 32 -65 32 0 0 -32 -32 0 0 -32 32 0 -32 -64 32 0 0 -64 32 -33 161 33 32 32 0 -32 32 -33 33 33 32 -33 -32 -32 32 0 64 32 0 -64 97 32 32 0 32 -32 64 0 0 32 32 0 0 -64 65 0 32 0 64 32 32 0 -32 -32 64 0 33 -32 64 32 -32 96 32 33 64 0 -64 0 0 -33 32 -32 32 0 0 -32 32 -32 0 -32 97 32 128 -32 0 -65 0 -32 33 -32 128 0 32 -32 32 32 33 0 64 32 32 0 0 -64 32 -32 0 64 64 -32 33 0 32 -32 0 -32 32 32 0 -64 96 64 33 32 32 0 64 -32 -32 0 32 -32 32 32 -32 -64 0 -33 97 0 0 -64 96 -32 32 32 32 -32 32 32 33 -32 0 32 64 0 0 -32 32 0 32 0 0 32 0 64 32 33 32 -65 33 0 -33 -32 65 -32 161 0 64 129 32 0 97 -97 0 64 32 0 32 33 0 -65 64 32 32 0 -64 -32 32 -128 64 -33 65 -32 32 32 0 33 32 -33 32 0 -32 -32 32 -32 32 0 0 64 65 0 0 -32 64 -32 64 0 32 32 33 32 -33 33 0 32 -32 64 65 0 96 0 0 -32 32 -32 0 -65 65 0 0 -64 32 0 32 32 32 0 0 32 -64 33 32 64 32 32 0 -32 32 32 32 -32 32 -64 33 -33 -33 -96 0 -32 65 -32 0 64 -32 64 64 32 64 65 32 0 0 -65 32 -32 65 0 64 0 32 -32 64 -32 0 64 33 0 -33 32 -32 0 -64 0 -32 0 0 33 64 64 -64 96 96 33 0 -65 97 -96 64 64 32 0 33 0 -65 64 32 33 0 32 33 -65 32 0 32 129 32 32 32 -32 64 -32 33 0 0 96 128 -32 32 32 32 0 0 -32 -32 -96 0 -32 32 -33 65 0 32 -128 96 64 65 -32 0 -32 0 -65 0 -160 96 -32 -32 -65 0 -32 32 32 32 0 129 -64 32 -64 0 -33 -32 -32 0 -32 257 97 129 128 64 65 32 128 64 129 65 161 128 96 33 64 -33 129 -160 161 -33 128 0 65 0 96 33 64 32 129 -65 225 33 64 32 129 64 64 32 193 -32 129 0 96 64 129 0 32 0 32 -32 64 -32 65 -32 32 -64 193 -97 96 -96 129 -65 32 -64 97 64 128 0 161 -64 96 -64 65 -97 0 -32 96 32 64 65 65 -32 128 64 97 32 128 0 33 0 32 -64 32 0 64 -32 32 32 33 32 32 0 32 32 32 96 0 97 32 32 97 32 96 0 96 -32 129 32 97 -32 96 -64 0 0 97 64 32 64 0 97 64 193 257 64 257 -96 -32 0 32 32 97 32 96 96 97 0 32 -96 64 -161 129 32 32 65 129 32 64 -32 64 -226 65 -96 96 -64 64 0 65 64 193 32 0 64 0 33 0 32 64 -32 32 -129 32 -32 32 0 161 64 257 32 32 193 0 32 65 -32 32 -161 32 -32 64 65 161 0 161 64 354 32 64 32 0 193 64 161 0 32 32 32 33 -32 96 -96 96 0 65 64 64 -32 64 0 33 64 128 0 32 -64 129 -129 129 -32 32 32 32 129 96 193 97 64 0 0 -32 0 -33 -64 -64 32 -32 257 0 129 -64 64 0 32 64 0 64 97 290 0 160 -65 161 0 32 65 97 128 0 65 32 32 32 -65 225 -64 97 0 32 32 -32 32 32 -32 64 0 64 32 0 97 -32 32 0 64 129 32 0 33 0 32 -97 64 -32 32 32 65 97 64 64 161 -96 128 0 32 0 65 0 32 32 64 128 32 65 -32 64 -64 32 -64 97 0 64 32 64 32 0 96 -128 32 -65 65 0 96 65 32 32 33 32 -65 161 32 64 33 0 64 0 32 -96 0 -97 -32 -96 96 -32 32 -33 65 65 0 32 -65 96 -32 97 32 161 65 64 128 32 258 96 128 0 65 0 32 33 64 96 32 0 129 -64 64 -32 32 32 32 160 0 161 -32 161 -32 64 0 33 32 96 129 64 64 32 64 97 129 128 32 33 65 64 257 32 96 0 161 0 0 64 -32 97 32 32 32 32 32 -32 32 -64 97 -32 96 -129 65 64 32 0 64 32 32 0 32 -32 65 0 0 129 -32 64 32 32 32 0 32 0 32 0 0 -32 32 -128 32 0 33 0 32 32 0 96 32 0 64 -64 32 -32 33 0 0 64 32 0 32 0 32 -32 32 0 65 32 32 97 32 0 64 -65 64 65 33 -33 0 -32 32 0 128 97 32 32 97 -32 96 -65 65 0 32 -32 0 -32 0 -64 32 -97 0 -64 32 -32 65 0 96 64 96 32 65 -96 32 32 32 -32 64 -65 32 -32 97 65 128 0 226 64 64 64 96 -32 161 64 32 65 97 32 96 32 97 32 96 193 129 97 161 0 160 0 0 96 65 64 -97 0 32 32 32 33 33 -33 64 33 32 128 129 97 32 32 96 -32 97 64 161 64 160 0 32 0 33 33 64 0 0 -33 -32 -32 0 -32 -32 0 0 -32 96 0 32 -32 97 0 32 -32 0 -33 -32 -64 32 -32 32 32 64 64 65 -32 -33 -64 33 -32 32 0 0 96 64 0 0 32 0 33 64 -33 0 65 33 0 64 0 64 0 0 64 -32 32 0 32 96 0 33 0 32 33 0 32 -65 32 -32 96 65 32 64 0 32 65 64 193 65 32 0 96 64 0 -32 97 32 64 129 32 0 32 32 33 32 0 32 -65 64 0 0 65 32 -33 0 -32 33 -32 64 0 64 64 65 33 0 96 64 32 64 129 32 0 65 64 -33 64 33 32 32 0 32 -32 32 -32 97 32 0 32 0 65 0 32 64 129 64 96 97 32 32 -96 32 0 0 64 64 64 0 -32 0 -32 32 -64 65 32 32 -32 32 32 0 -64 96 0 65 -65 0 -32 64 -32 32 0 0 32 -32 97 64 0 33 0 0 32 -33 64 33 32 32 0 64 -32 32 32 -64 32 0 65 257 128 64 32 65 0 64 -32 96 97 97 -32 -32 -65 32 -32 32 0 0 97 32 0 32 -65 33 0 0 32 -33 65 33 32 32 -64 32 0 32 32 0 96 64 64 32 65 65 -97 0 32 0 65 32 32 32 -32 64 64 32 -32 65 32 32 -32 32 32 -32 0 0 32 64 -64 32 64 33 -64 64 0 32 64 32 -32 65 64 32 0 -32 -64 64 32 0 -32 64 0 32 -129 32 0 33 33 32 -65 32 0 64 65 0 128 64 32 33 -64 0 -32 0 -32 0 -65 64 0 0 97 32 32 32 32 32 65 33 0 32 -65 32 0 32 32 32 33 -32 64 32 161 32 32 0 96 -32 65 0 32 65 64 32 64 32 0 0 32 64 33 64 -33 0 129 65 0 64 97 32 -33 32 0 32 0 0 129 65 96 32 -32 -32 0 0 -32 96 32 32 32 -32 65 32 0 33 32 -33 64 65 0 32 32 32 -32 64 65 0 32 65 32 32 0 64 -32 0 32 64 128 0 97 0 96 65 65 0 96 64 32 32 -64 32 0 0 32 0 32 0 65 32 -65 65 -32 0 32 32 0 0 -64 32 32 96 32 33 -32 32 -64 32 0 0 96 32 0 32 -32 -32 -32 32 -32 32 32 65 0 0 -32 32 32 96 -64 65 -32 -32 -33 64 65 64 -32 0 32 97 32 32 0 0 -64 64 32 32 0 0 -65 32 0 0 65 32 0 65 -65 64 0 0 -32 32 -32 32 32 -32 97 32 32 33 0 32 0 96 32 0 32 65 32 64 32 96 0 97 65 193 -65 64 -32 32 0 32 0 -32 -64 97 -32 160 0 65 0 0 -64 128 0 65 -33 -33 -96 33 0 64 32 0 64 32 33 64 -33 65 0 32 0 0 65 32 32 32 32 32 32 65 -32 64 64 64 -64 -32 -32 32 -64 0 32 65 0 64 32 0 32 32 32 32 -32 -32 -32 32 -32 32 0 -32 96 64 -64 97 64 32 -32 0 -32 32 -64 0 -65 32 0 65 32 32 0 32 65 32 0 64 -32 33 -33 -97 -32 0 -32 32 0 32 0 65 32 64 -32 129 64 -33 33 -32 -33 -32 33 0 64 32 32 0 32 -32 -32 -32 0 32 129 97 -33 0 -32 32 0 32 0 32 0 32 65 32 0 97 -65 32 0 32 32 -32 65 32 64 32 64 129 97 32 64 161 64 64 0 64 33 33 64 96 32 64 32 33 0 0 97 64 32 64 -32 129 64 32 -32 0 64 64 64 0 -64 32 -32 33 96 64 65 64 32 0 -32 0 32 32 0 32 -32 33 0 32 -65 64 65 0 32 0 32 32 -32 0 64 32 0 33 -32 32 32 64 0 -32 32 64 0 -32 65 64 0 32 64 33 0 0 -64 64 0 32 0 32 32 -64 64 96 0 33 32 32 -32 32 32 96 0 32 32 -32 0 -32 0 0 33 64 32 -32 32 -64 0 -32 0 0 32 32 32 64 -32 0 32 -96 97 32 0 32 0 32 0 65 0 -33 32 0 64 -32 32 -32 32 32 33 0 -33 32 -32 33 0 32 0 0 32 -32 33 32 64 0 161 32 0 -32 -33 32 0 64 33 32 0 32 0 0 32 33 32 -33 0 -32 64 -32 -32 64 97 129 0 32 32 0 32 -64 0 0 32 0 -32 -32 32 0 64 -32 65 0 32 -65 64 -32 64 0 33 -96 96 -65 32 -32 0 -32 32 0 32 32 33 -64 32 64 64 -64 32 32 64 0 33 -32 32 -32 32 0 64 0 32 32 0 64 0 0 65 0 64 32 32 0 65 65 32 0 32 -65 32 0 32 33 64 -33 33 33 32 0 64 32 32 0 32 32 32 32 65 64 32 -32 32 32 32 32 -32 0 32 0 32 33 -32 0 32 0 33 32 -33 0 33 32 -33 0 65 0 32 0 32 -32 -32 0 32 0 64 0 33 -32 32 32 0 0 32 32 0 0 32 -32 32 32 0 32 0 32 32 0 65 32 0 -32 32 97 64 0 64 -32 -32 0 32 96 32 0 65 32 32 0 64 32 32 -32 0 32 33 0 64 33 64 -33 0 33 65 32 160 128 65 97 -33 128 2348 -1221 0 -290 32 1543 1800 161 1994 161 1865 3312 64 3247 129 1672 96 129 -64 64 -64 32 -193 97 64 64 0 32 0 32 0 97 -32 0 128 64 97 0 96 -32 161 32 32 -96 64 -32 33 -33 -33 -32 33 0 32 -64 161 64 128 65 97 0 64 -65 129 -64 64 -129 64 -32 97 -128 64 -33 64 -32 32 -128 290 0 64 -33 193 0 64 -32 129 32 64 33 97 0 32 0 32 -65 0 0 129 0 32 65 96 -33 32 33 0 -33 33 33 32 -33 32 33 0 -33 128 33 0 -33 65 -32 32 32 32 -32 64 32 33 33 -33 32 33 -32 64 0 64 32 0 32 0 0 32 64 65 65 0 -33 64 -32 32 0 97 65 0 0 32 -65 0 0 32 0 32 65 0 -65 64 0 65 0 32 0 32 32 0 0 96 0 33 33 0 96 -33 32 0 32 33 -64 96 32 257 97 65 32 0 0 64 32 0 64 96 32 0 0 32 97 65 -32 32 32 32 64 32 0 32 64 33 -32 32 0 32 32 32 65 -32 0 128 64 33 0 64 32 0 0 32 65 32 0 -32 32 0 32 0 0 32 32 0 97 0 32 64 -32 65 96 32 161 -32 -32 96 32 32 32 33 64 -33 32 33 0 160 161 65 64 -65 65 0 64 65 0 128 64 32 32 0 33 33 32 0 32 32 32 -32 0 64 97 -32 450 -290 611 547 -161 -32 -32 0 0 32 64 32 0 32 -32 32 0 33 64 -33 -32 65 -32 0 64 0 -32 64 0 32 32 -32 0 32 0 64 -32 65 32 64 64 32 65 161 32 0 64 129 32 0 65 64 -65 193 193 161 0 96 -193 0 579 1093 64 290 33 128 353 322 0 -32 65 32 32 -32 32 32 0 32 0 32 32 32 64 32 0 33 -482 32 -997 3215 225 0 0 386 32 0 33 32 64 64 -32 65 32 0 -64 96 -354 0 -482 1061 -708 1479 -482 1029 1318 1029 -32 64 -129 161 -64 129 -96 -97 -65 -32 -32 0 -64 32 -64 129 -65 32 -64 0 -96 0 -65 32 -64 161 0 32 -193 32 -96 65 -33 96 -96 32 -96 0 -33 64 -32 33 0 32 32 32 129 0 32 32 32 32 -32 65 -128 32 -33 64 -32 32 32 129 97 64 0 -32 64 -64 32 -32 97 0 32 32 32 32 0 64 -32 161 -32 96 64 225 129 97 193 32 128 193 0 64 -96 161 -32 129 96 289 -64 96 0 97 96 129 97 0 0 32 -32 96 -33 97 0 32 0 64 161 0 97 -193 32 0 32 0 32 32 32 65 129 160 32 65 32 64 0 32 -64 0 -193 -32 -64 32 -65 32 -64 161 0 32 64 32 65 0 96 -64 64 0 161 129 32 64 -32 96 -193 129 -96 64 -32 65 64 32 64 -32 64 32 33 32 64 129 32 32 64 0 65 -65 64 0 0 33 0 128 32 64 -64 65 -97 161 -96 64 32 128 97 161 -97 161 0 32 64 257 0 161 -32 64 -289 193 -32 33 64 64 64 64 193 32 32 32 -32 97 -32 64 -193 225 -32 97 -64 161 0 64 -32 64 -65 97 -64 32 -32 96 0 97 32 96 161 64 64 65 0 32 -96 32 -65 97 65 128 32 64 193 97 0 32 -65 64 -193 129 -32 64 0 32 32 33 65 64 64 0 0 96 -96 193 -97 32 -96 33 0 32 257 128 32 32 -32 33 -64 0 -97 64 32 32 32 0 0 64 -64 226 -64 64 0 96 0 32 -161 97 -32 64 0 64 64 0 32 33 -32 160 32 -32 33 32 64 0 32 -64 32 32 64 0 33 97 32 32 -32 64 128 0 64 0 33 32 64 0 64 33 -32 -33 161 -64 32 32 32 65 32 0 33 64 32 0 32 -97 32 -32 96 65 33 0 32 0 64 -33 0 -64 -32 0 0 -64 32 0 32 -32 64 64 0 -32 33 -32 0 -33 64 0 32 -32 64 65 33 32 128 0 129 -65 0 33 0 32 32 64 -32 32 32 0 0 32 32 0 0 33 32 0 0 32 32 -32 0 32 0 96 33 64 32 0 128 33 65 -33 32 -32 32 0 64 65 65 0 0 32 32 0 64 -32 32 32 32 -32 0 64 0 -32 33 -32 64 64 64 0 -32 32 64 -32 97 32 0 32 32 -32 0 32 64 0 -32 64 32 0 0 33 64 0 33 -33 32 33 32 0 0 32 32 -32 0 32 64 32 33 0 -33 -32 65 -32 0 -33 64 -32 0 32 32 0 32 33 0 32 32 -32 0 32 97 0 64 64 97 -64 0 -32 64 0 -32 -33 0 -32 0 -32 0 32 32 0 32 -32 32 32 0 32 32 33 0 32 33 -32 32 0 32 0 32 -33 32 33 65 -33 96 33 64 -33 -32 97 32 32 32 0 33 -32 32 32 32 -32 64 0 32 0 -32 -64 65 0 0 32 32 32 32 -32 64 0 32 -32 32 32 65 -65 32 33 -32 32 32 32 64 0 65 -32 32 64 32 32 64 0 32 -32 32 32 33 0 -33 0 33 32 32 33 32 -33 0 -32 64 -32 32 0 33 64 -33 65 33 32 64 32 32 0 32 64 32 0 65 -32 32 -32 64 -32 0 -64 0 -33 0 -64 64 -32 33 0 -33 32 33 0 0 32 32 0 64 -32 0 -32 32 0 32 0 32 -32 33 32 32 32 -32 32 64 32 64 -64 32 -32 0 -32 32 0 0 -32 -32 -33 0 -32 32 0 33 0 0 32 32 -32 0 32 0 33 32 64 64 32 65 32 32 32 32 0 -32 -96 32 0 32 0 97 -64 0 -33 32 -32 0 -32 32 32 32 -32 32 0 0 -32 32 0 32 32 33 -64 32 0 -32 -32 32 -32 0 -65 96 -64 -32 0 0 -64 64 32 0 -64 32 0 -32 -33 0 -32 32 -32 0 -64 65 0 0 -32 32 -33 96 0 33 -64 32 32 0 -32 32 0 0 32 32 0 0 -32 32 32 32 -32 33 32 32 -32 32 32 0 -32 64 0 32 0 32 -32 0 96 -32 33 65 32 0 32 32 32 -32 0 64 32 0 65 0 32 0 32 32 96 32 32 32 -32 0 32 32 0 0 33 33 64 32 0 0 32 64 64 32 -32 32 32 65 32 64 65 32 -32 32 32 97 0 32 32 0 64 96 65 0 32 33 0 32 0 32 -32 32 64 0 -32 64 0 0 32 32 32 33 -32 32 0 64 0 32 0 32 -32 0 -32 32 0 97 64 32 0 32 0 -32 32 32 -32 65 0 32 -32 32 0 64 32 129 32 32 32 32 0 0 -64 97 -32 64 64 64 0 32 0 32 -32 65 -32 32 32 32 -32 97 32 193 0 64 64 32 129 32 96 129 65 0 32 -32 64 64 32 32 32 32 -32 32 32 32 -32 97 32 32 32 -32 33 32 32 32 128 -32 97 0 32 -32 0 -32 64 32 65 0 64 96 257 129 64 32 65 32 64 65 0 32 32 96 65 97 96 0 96 32 33 0 96 32 64 -32 33 32 96 -32 96 0 33 -32 32 0 32 32 32 0 32 -64 -32 -33 32 0 64 -64 33 0 64 -32 32 0 32 0 32 0 97 -32 32 32 96 -32 65 64 32 0 64 32 97 -32 64 32 32 -32 32 64 0 0 32 0 33 65 128 -65 32 33 33 -33 128 65 32 32 32 32 33 -32 32 32 32 0 96 -32 0 64 129 32 64 0 65 0 96 97 -32 32 0 64 32 65 32 0 97 96 96 -32 32 -32 65 -65 0 65 96 -32 32 32 32 32 0 32 33 -64 64 -97 32 0 32 32 97 -32 64 97 64 64 97 0 64 32 0 32 64 -32 161 -161 193 33 32 -33 97 -64 0 0 32 0 32 32 0 32 64 33 97 0 32 32 64 0 64 64 65 -32 32 0 32 -32 64 0 129 0 32 32 32 96 -32 0 32 65 32 32 33 32 -33 32 65 0 128 32 0 32 33 -32 96 32 32 33 32 32 -32 32 0 32 32 -32 32 -32 97 32 64 -32 0 64 64 0 97 -64 129 32 32 0 32 0 161 32 64 -32 129 -32 64 96 64 -32 64 64 0 0 33 0 64 32 32 33 0 32 32 32 0 32 -32 32 0 0 64 65 0 32 33 64 32 32 0 97 -161 64 0 96 64 33 32 32 0 0 33 32 0 0 32 96 32 193 0 0 -32 32 -32 65 0 0 32 96 -32 32 -33 32 33 33 0 64 -33 0 -32 32 0 64 -64 33 32 32 64 64 33 32 -33 0 33 64 32 33 -65 32 0 64 -32 64 -32 65 -32 32 -32 64 32 32 -32 65 32 64 0 32 0 32 32 0 -32 65 0 -33 -97 33 -32 0 -32 0 -32 64 0 0 -64 64 0 32 -65 32 0 33 65 96 -32 32 32 0 -65 65 -64 96 32 32 -32 64 -32 0 -32 65 0 32 -32 32 0 32 -32 64 0 0 64 193 -32 33 -32 0 -65 64 -64 64 -97 32 33 65 0 32 64 64 0 32 32 32 0 33 64 32 0 32 -32 64 -32 0 64 97 33 -33 64 0 32 97 -32 64 32 32 0 65 32 32 0 32 0 0 -32 97 96 160 33 65 32 32 32 0 64 64 161 64 32 97 97 64 32 64 64 65 -32 96 32 0 64 32 65 0 64 129 96 -97 129 -128 96 -64 129 32 32 0 65 64 160 0 65 0 32 0 96 32 97 161 160 64 97 65 257 -33 64 -64 161 -96 129 -129 128 -64 225 32 129 64 225 0 65 -32 353 -64 161 -32 96 -65 161 -32 64 -64 33 -32 96 -97 289 -64 258 -32 128 -65 129 0 193 -96 257 0 97 32 96 -32 64 32 65 64 64 33 64 32 129 -32 64 -65 0 -64 97 -32 96 -64 97 -33 192 -64 129 -64 96 -129 161 -96 65 -65 96 -32 64 -64 129 0 64 -32 32 -65 33 0 32 0 64 97 64 0 193 32 97 0 257 129 -32 32 0 64 32 64 32 -32 64 32 65 33 0 96 -65 97 65 64 32 96 128 65 161 32 0 32 -32 -32 -129 160 -128 33 -64 0 -65 0 -32 64 -32 96 64 33 0 96 -160 161 -97 64 0 64 129 65 64 64 0 0 -129 32 -32 32 0 129 97 96 0 32 0 -32 -32 0 -33 -128 -64 -32 0 32 -64 64 -32 96 32 33 0 96 -97 161 -128 32 0 32 32 0 96 -128 161 0 64 64 161 64 97 0 -33 32 0 0 -160 33 -97 64 0 32 65 64 64 32 -32 65 -65 32 -32 64 32 32 65 32 32 97 64 -32 32 0 32 32 0 32 0 32 65 0 64 32 32 33 -64 -33 -64 33 0 0 -33 32 0 0 33 32 0 64 -33 32 33 -32 32 0 32 32 -32 0 32 97 -64 32 32 -32 64 32 32 -32 64 64 -32 64 32 33 65 0 32 64 32 -32 32 0 32 -32 33 0 -33 -65 -32 32 65 -64 0 64 32 -32 32 65 0 0 32 -33 97 65 -33 96 65 -64 0 32 32 -64 0 -32 32 64 32 64 32 0 32 -64 33 96 0 0 32 -32 64 -32 32 0 32 -32 0 -32 65 0 32 32 -32 32 64 0 32 -32 0 64 0 -32 64 64 0 -32 33 -32 0 0 32 0 32 0 32 64 0 32 0 -32 32 -32 0 -32 65 64 -33 32 0 -32 33 32 64 -32 0 -32 -64 0 64 -32 0 -32 0 32 128 32 33 -32 0 0 32 96 32 0 32 0 32 33 0 32 -32 0 32 0 32 32 32 32 -32 0 32 64 33 -32 32 32 0 -32 32 65 0 0 32 32 32 32 -32 0 32 0 32 32 -32 0 32 32 0 32 0 33 65 0 32 0 32 -33 0 -32 96 32 65 -32 32 0 32 97 64 32 0 32 65 32 64 97 64 32 32 64 97 32 0 0 64 64 32 -64 97 32 32 32 32 -32 0 32 32 0 32 0 65 -32 64 -32 64 -64 97 0 32 -32 0 32 32 -32 0 -65 32 0 65 -32 0 32 32 -64 32 0 32 32 32 -32 32 -32 0 0 65 64 32 -32 32 -32 0 32 32 32 0 0 64 32 0 0 65 -32 0 0 -32 -32 32 0 32 32 32 0 64 -32 -32 -64 32 32 0 0 65 32 -65 32 32 -32 0 32 65 -32 0 -32 32 32 64 -64 -32 -32 32 0 -32 -32 0 0 97 64 0 -32 64 0 32 -32 -32 -65 32 65 32 32 32 -65 32 33 0 64 -32 32 0 0 32 -64 0 0 129 -32 0 0 32 0 32 0 33 -33 0 33 32 -33 64 -32 0 0 64 -32 -32 -32 32 64 32 32 0 0 33 65 0 0 -33 0 33 32 64 -64 0 0 32 64 32 -64 65 -33 -65 -32 0 0 32 65 65 -33 64 -64 32 -32 -64 0 64 64 32 -32 65 64 0 33 -65 32 65 32 32 0 64 -32 0 -32 32 -65 -32 65 64 64 0 0 -32 64 0 0 32 -64 33 0 32 32 64 32 0 32 64 -32 0 -32 -32 0 32 32 32 32 65 32 32 -32 0 0 32 97 0 32 32 32 32 0 33 -161 -33 0 33 65 0 -33 64 -32 32 97 32 -32 64 32 33 -32 32 -65 32 65 64 64 32 -32 0 -32 0 -129 -64 0 32 32 65 0 32 -64 32 -64 -32 0 64 -33 0 97 64 0 32 -32 0 -97 0 65 65 -65 64 -32 -64 -64 0 32 64 32 32 0 32 -32 32 -32 33 -65 -65 -32 -32 32 129 65 32 32 32 -64 32 -33 -64 -64 -64 -64 0 32 64 64 64 32 0 33 32 -65 0 -64 -64 -32 64 0 33 128 96 -96 32 -32 0 0 32 0 33 -65 32 -32 0 32 64 97 -32 0 32 -161 32 -32 32 32 32 0 33 -32 0 -32 -33 -64 -160 -97 0 -32 32 -32 96 -64 97 -65 0 -32 -65 -64 -32 -65 0 -32 32 0 97 0 64 -64 0 -64 0 -97 32 -32 65 0 96 -64 97 -129 32 -64 128 -32 65 -129 0 -32 0 -97 0 -64 0 -64 -32 0 -129 0 -32 -32 -32 -33 0 -64 64 -32 129 0 64 -64 96 -32 97 0 64 0 64 -33 65 -64 32 -96 0 -32 32 -33 64 0 129 -96 32 -32 0 -65 -96 -64 -65 -64 -32 -32 0 0 32 0 65 32 96 0 64 -64 33 -65 -33 -32 -32 -96 -128 0 -33 -97 -64 -32 0 -64 64 -32 33 -129 0 -32 0 0 64 96 64 32 32 0 65 -64 32 -96 0 -129 0 -32 32 -32 64 -65 32 -32 0 -64 -128 -97 -97 -32 -32 -32 0 -32 65 0 64 -96 161 -33 96 -32 64 -32 0 -64 0 -64 -160 -33 -33 -32 0 -32 65 0 64 32 129 0 64 -32 32 -193 -64 -96 0 -65 64 -32 32 -32 0 -32 0 -64 -32 -33 -193 -64 -32 -32 0 -96 193 -33 161 -32 96 -32 32 -129 0 -64 0 -32 65 0 96 0 193 0 129 -129 128 0 32 -32 65 -64 32 -32 0 -97 -32 -64 0 -32 96 -64 32 -33 -32 -160 -128 -97 32 -32 32 -32 32 32 64 225 97 32 64 0 64 -32 65 -96 -32 -129 -65 -129 32 -64 33 -32 32 32 128 -32 32 -32 33 -32 -33 -65 -64 -64 -96 -64 -32 -65 0 -193 160 -96 161 -32 64 -64 0 -129 -32 -64 0 -33 0 -32 65 -32 128 -32 32 -129 0 -64 65 0 64 32 0 65 96 0 65 -33 32 -193 96 -128 129 -32 64 -32 0 -65 0 -64 -96 -64 0 -32 64 -65 129 -96 32 -65 64 0 32 0 65 -32 32 -32 0 -129 -65 0 -32 33 -64 0 -32 -65 -32 -64 0 -32 64 -32 32 32 64 -64 33 32 64 -32 32 -33 0 -64 32 -32 32 -193 161 -161 32 -193 65 -32 64 32 96 193 65 129 96 161 97 0 64 -97 257 0 97 -32 64 -64 0 -32 -64 -33 -65 -32 -96 -32 -32 -96 -33 -290 0 -128 -64 -129 32 -129 193 0 32 0 65 97 225 0 32 -32 32 -129 32 -161 32 -160 33 -129 32 -64 96 0 64 0 65 64 96 64 65 -32 64 -64 64 -129 64 -386 322 -96 129 -64 128 -129 161 -354 0 -96 64 -64 32 -33 97 33 225 0 129 -33 64 -96 128 -64 65 -225 64 -65 32 -64 65 -32 128 96 97 -64 96 -32 193 -64 0 -322 32 -64 32 -129 97 -161 0 -96 32 -64 193 -129 161 -97 193 33 128 -33 97 -225 418 -64 32 -193 0 -64 32 -32 161 0 64 0 96 -97 129 -96 64 -65 65 -128 64 -225 129 -129 193 -161 128 -96 129 -289 386 -226 193 -128 96 -32 32 -193 64 -257 0 -97 33 -225 192 -161 258 0 64 32 193 -32 193 -96 128 -290 161 -96 97 -96 96 -65 161 -96 96 -322 193 -161 65 -225 0 -64 64 64 -32 97 32 225 96 32 33 -32 192 32 33 32 64 129 32 128 32 33 -96 32 0 96 0 65 32 96 0 64 32 -32 32 0 65 64 0 65 0 32 0 0 -65 96 -64 32 -32 33 64 160 -64 33 -65 32 33 64 96 32 64 32 0 65 -64 0 -32 32 -32 32 32 0 32 32 32 129 0 64 -32 32 -96 97 -65 32 0 32 -32 32 -32 -32 -64 0 -32 -32 0 32 0 -32 -33 0 -64 64 0 0 -64 64 -65 65 -128 64 0 64 -32 0 -65 -64 0 0 -64 96 32 33 0 32 -32 -32 0 32 -64 64 -64 32 0 0 32 -32 0 0 32 64 0 65 32 64 0 0 -64 32 -32 129 0 64 0 32 64 97 0 96 -32 64 32 33 32 0 32 32 -32 0 32 96 -128 65 0 0 32 96 0 64 0 65 32 32 32 64 0 32 64 97 32 0 33 -32 96 32 64 96 0 129 32 64 33 32 0 0 64 64 64 65 -32 32 32 64 -32 0 32 32 32 33 -32 0 32 -97 33 0 32 97 0 32 64 64 64 0 32 -32 0 -32 0 64 65 64 -32 33 96 -65 64 32 33 65 -33 32 0 96 -32 0 65 97 96 32 -64 32 32 0 96 -64 32 32 65 0 32 128 0 65 32 0 64 32 33 32 64 32 0 32 -64 65 -33 64 129 32 32 -32 32 64 65 65 0 32 -33 32 97 64 0 0 64 -32 0 0 32 32 33 0 64 65 0 0 32 -33 0 33 32 96 0 0 -32 32 0 32 32 0 32 65 32 0 65 32 0 96 32 65 -32 0 -32 32 32 0 32 0 32 32 64 0 33 32 0 32 -33 32 33 33 32 -33 32 0 64 33 0 32 -64 32 0 64 32 0 32 -32 0 0 32 32 32 32 33 129 0 96 32 -64 64 32 32 64 32 -32 65 32 64 65 64 64 0 0 32 -64 33 0 64 64 32 32 32 32 0 -32 65 0 32 32 0 65 -32 32 0 32 128 32 0 64 -64 33 0 32 32 0 64 0 32 64 33 32 0 32 0 0 32 65 0 0 32 0 64 64 32 -32 0 0 32 32 33 32 96 32 32 32 32 0 65 -96 128 0 97 32 32 -64 129 32 0 0 32 0 64 32 32 -32 32 -32 97 0 225 32 129 0 32 96 32 0 -32 65 -32 96 32 97 32 32 -32 32 -32 64 0 32 -33 65 65 32 0 0 -32 64 0 65 -129 32 -32 96 32 0 -32 64 -97 0 -32 33 0 128 0 64 -32 -32 -64 97 32 32 -65 0 -32 96 0 -32 -32 32 -32 0 -96 33 0 -33 -33 33 0 32 65 32 0 32 -65 32 33 0 32 65 0 64 0 0 -32 32 -33 -32 -32 32 -64 32 0 32 -64 -64 -65 0 -64 32 0 -64 -32 32 -64 32 32 32 -65 32 -32 33 0 32 -32 64 0 0 32 32 0 64 -32 33 -32 32 0 0 32 32 0 32 64 0 65 32 32 32 64 65 32 0 33 32 -33 96 33 0 64 33 32 64 32 0 64 0 33 32 32 96 -32 33 64 64 0 0 64 32 0 32 32 0 32 -32 33 -32 64 64 32 64 0 33 32 0 32 32 0 64 -32 32 0 32 0 0 65 65 32 32 0 0 96 -32 32 32 33 0 -33 64 97 64 0 -32 64 0 32 0 32 0 33 -32 0 0 64 32 0 32 32 33 0 0 32 32 0 32 -32 64 32 0 32 32 32 -32 0 0 33 65 32 32 32 -65 32 0 32 97 0 64 65 -32 32 32 32 0 161 32 0 0 32 32 0 258 32 0 32 64 0 32 32 -32 32 32 0 32 0 0 33 97 64 32 0 32 0 0 32 64 0 33 32 96 32 32 32 64 0 0 -32 0 -32 33 0 32 -32 64 -96 0 -33 0 -32 -32 0 32 -32 64 -32 65 32 0 -32 0 32 32 32 0 32 32 0 -32 33 64 32 32 32 -32 32 32 32 97 32 32 32 0 33 -32 32 0 32 96 32 0 32 32 32 -32 0 0 65 32 0 33 -32 96 32 32 0 0 -32 32 0 32 32 -32 0 65 64 96 64 -32 33 32 0 97 128 32 -32 96 0 32 -32 65 32 128 -64 161 32 32 64 64 0 33 -32 32 32 32 0 64 64 418 0 0 33 32 32 0 64 97 32 0 32 32 0 0 32 96 0 33 33 32 32 128 193 -32 32 65 32 32 32 32 97 32 -33 32 65 0 32 0 -32 0 32 -64 32 32 64 32 33 32 32 -32 64 1415 1061 64 64 0 65 161 64 32 32 -32 0 32 32 0 32 64 0 0 33 65 -97 32 32 64 -64 0 -32 32 0 32 -32 33 0 32 0 -32 0 32 0 32 32 32 0 0 32 32 0 32 32 129 0 32 32 32 0 0 32 -32 0 0 33 -32 0 0 32 64 64 32 0 33 0 64 32 96 32 0 33 65 32 32 64 96 32 32 -32 65 32 0 32 0 32 0 65 32 0 32 32 -32 32 32 0 32 64 32 32 32 0 65 33 64 0 0 32 32 -32 65 32 32 32 32 -32 0 32 64 0 0 64 97 32 -32 33 -65 -33 32 33 -32 32 65 128 0 32 -33 33 97 0 -32 96 32 32 0 32 64 33 -32 32 32 32 32 0 0 32 32 32 65 97 0 96 32 64 64 33 0 64 64 32 -32 64 -32 0 0 32 64 33 0 64 33 64 -33 129 -32 32 161 64 0 32 0 65 64 64 65 32 0 65 96 32 32 64 65 0 0 32 96 64 32 -32 0 32 65 -32 128 0 32 0 32 0 0 65 0 32 33 64 0 32 64 97 64 128 32 -32 33 0 0 32 32 32 96 65 64 -65 33 0 64 97 32 0 64 -32 65 32 96 64 32 32 32 33 33 0 32 -65 128 -32 33 129 96 64 161 32 32 32 32 32 0 -32 482 418 -64 161 -289 64 -97 97 32 32 -128 193 -483 225 -96 96 289 97 -289 354 -225 -33 -450 258 -322 482 -32 482 97 483 -33 514 -64 354 0 321 -32 32 -32 65 64 64 -32 64 -32 32 32 65 0 32 32 32 -32 32 0 32 32 0 386 33 32 32 0 64 32 96 0 33 32 32 33 0 64 0 32 32 64 -32 32 0 20 -14z"
                      style={{ fill: "#e5e7eb", stroke: "#d1d5db", strokeWidth: 2 }}
                    />

                    {/* CE = Ceará (Azul se não selecionado, Vermelho se selecionado) */}
                    <path
                      d="M 300,310 Q 390,270 450,320 Q 430,420 380,450 Q 320,470 320,380 Q 310,340 300,310 Z"
                      fill={estadoSelecionado === "CE" ? "#e31e24" : "#005a8d"}
                      stroke="#ffffff"
                      strokeWidth="3"
                      className="cursor-pointer hover:opacity-85 transition-all"
                      onClick={() => setEstadoSelecionado("CE")}
                    />

                    {/* PE = Pernambuco (Azul se não selecionado, Vermelho se selecionado) */}
                    <path
                      d="M 380,450 Q 480,450 580,430 Q 550,515 420,500 Q 360,480 380,450 Z"
                      fill={estadoSelecionado === "PE" ? "#e31e24" : "#005a8d"}
                      stroke="#ffffff"
                      strokeWidth="3"
                      className="cursor-pointer hover:opacity-85 transition-all"
                      onClick={() => setEstadoSelecionado("PE")}
                    />

                    {/* SE = Sergipe (Azul se não selecionado, Vermelho se selecionado) */}
                    <path
                      d="M 515,600 Q 565,615 545,670 Q 490,640 515,600 Z"
                      fill={estadoSelecionado === "SE" ? "#e31e24" : "#005a8d"}
                      stroke="#ffffff"
                      strokeWidth="3"
                      className="cursor-pointer hover:opacity-85 transition-all"
                      onClick={() => setEstadoSelecionado("SE")}
                    />

                    {/* BA = Bahia (Azul se não selecionado, Vermelho se selecionado) */}
                    <path
                      d="M 330,460 Q 440,450 515,600 Q 500,670 450,730 Q 380,820 345,780 Q 290,680 330,460 Z"
                      fill={estadoSelecionado === "BA" ? "#e31e24" : "#005a8d"}
                      stroke="#ffffff"
                      strokeWidth="3"
                      className="cursor-pointer hover:opacity-85 transition-all"
                      onClick={() => setEstadoSelecionado("BA")}
                    />
                  </svg>
                </div>

                {/* Botões rápidos abaixo do mapa */}
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {Object.keys(estadosInfo).map(sigla => (
                    <button
                      key={sigla}
                      onClick={() => setEstadoSelecionado(sigla)}
                      className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all ${
                        estadoSelecionado === sigla
                          ? "bg-[#e31e24] text-white shadow"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {estadosInfo[sigla].nome} ({sigla})
                    </button>
                  ))}
                </div>
              </div>

              {/* COLUNA DIREITA: CASAS DO ESTADO SELECIONADO (Ocupa 7 colunas) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between border-b pb-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#005a8d]">
                    {estadoSelecionado ? `Casas em ${estadosInfo[estadoSelecionado]?.nome}` : "Selecione um estado no mapa"}
                  </h3>
                  {estadoSelecionado && (
                    <span className="bg-[#005a8d]/10 text-[#005a8d] font-bold text-xs px-3.5 py-1.5 rounded-full">
                      {casasFiltradas.length} encontrada(s)
                    </span>
                  )}
                </div>

                {!estadoSelecionado ? (
                  <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-gray-500">
                    <MapPin className="w-12 h-12 text-[#c5a059] mx-auto mb-3 animate-bounce" />
                    <p className="font-medium">Nenhum estado selecionado. Clique em Pernambuco, Ceará, Bahia ou Sergipe no mapa ao lado.</p>
                  </div>
                ) : casasFiltradas.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-gray-500">
                    <Church className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium">Nenhuma casa de missão cadastrada neste estado no momento.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {casasFiltradas.map(casa => (
                      <div key={casa.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                        {casa.foto_url && (
                          <div className="h-44 overflow-hidden bg-gray-100">
                            <img src={casa.foto_url} alt={casa.nome_casa} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-[#c5a059] bg-[#c5a059]/10 px-2.5 py-1 rounded-full inline-block">
                              {casa.cidade_estado}
                            </span>
                            <h4 className="text-lg font-serif font-bold text-[#005a8d]">{casa.nome_casa}</h4>
                            {casa.descricao_breve && <p className="text-gray-600 text-xs leading-relaxed">{casa.descricao_breve}</p>}
                          </div>

                          <div className="space-y-1.5 pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
                            <p className="flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#c5a059] shrink-0 mt-0.5" /> 
                              <span>{casa.endereco}</span>
                            </p>
                            {casa.telefone && (
                              <p className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-[#c5a059] shrink-0" /> 
                                <span className="font-semibold text-gray-700">{casa.telefone}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}
