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

  // Estado para controlar o estado selecionado no Mapa Interativo
  const [estadoSelecionado, setEstadoSelecionado] = useState("PE");

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

  // Filtra as casas de missão de acordo com o estado selecionado no mapa
  const casasFiltradas = casasList.filter(casa => {
    if (!casa.cidade_estado) return false;
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
                            <img src={item.foto_url} alt={item.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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

            {obrasList.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <p className="text-gray-500">Nenhuma obra social cadastrada no momento.</p>
              </div>
            )}

          </div>
        ) : (
          /* ABA: CASAS DE MISSÃO - LAYOUT LADO A LADO (MAPA À ESQUERDA, CASAS À DIREITA) */
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
              <h2 className="text-3xl font-serif font-bold text-[#005a8d]">Casas de Missão por Estado</h2>
              <p className="text-gray-600 text-sm">Clique em um dos estados destacados no mapa interativo para visualizar as casas missionárias correspondentes.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* COLUNA ESQUERDA: MAPA FIEL DO NORDESTE (Ocupa 5 colunas) */}
              <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center sticky top-6">
                <div className="w-full max-w-[280px] h-96 relative flex items-center justify-center">
                  <svg viewBox="0 0 600 700" className="w-full h-full drop-shadow-md">
                    
                    {/* MA = Maranhão (Cinza Claro / Inativo) */}
                    <path d="M 60,60 Q 110,40 160,80 Q 190,130 170,200 Q 160,260 190,320 Q 210,380 200,440 Q 180,510 130,570 Q 90,620 60,590 Q 30,510 40,410 Q 50,260 40,160 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="2.5" />

                    {/* PI = Piauí (Cinza Claro / Inativo) */}
                    <path d="M 190,320 Q 250,270 300,310 Q 350,370 330,460 Q 300,530 260,610 Q 230,650 200,580 Q 210,500 200,440 Q 210,380 190,320 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="2.5" />

                    {/* CE = Ceará (Azul ou Vermelho se selecionado) */}
                    <path
                      d="M 300,310 Q 390,270 450,320 Q 430,420 380,450 Q 320,470 320,380 Q 310,340 300,310 Z"
                      fill={estadoSelecionado === "CE" ? "#e31e24" : "#005a8d"}
                      stroke="#ffffff"
                      strokeWidth="3"
                      className="cursor-pointer hover:opacity-85 transition-all"
                      onClick={() => setEstadoSelecionado("CE")}
                    />

                    {/* RN = Rio Grande do Norte (Cinza Claro / Inativo) */}
                    <path d="M 450,320 Q 520,300 565,350 Q 540,400 450,380 Q 440,350 450,320 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="2.5" />

                    {/* PB = Paraíba (Cinza Claro / Inativo) */}
                    <path d="M 450,380 Q 535,400 580,430 Q 530,470 435,450 Q 442,410 450,380 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="2.5" />

                    {/* PE = Pernambuco (Azul ou Vermelho se selecionado) */}
                    <path
                      d="M 380,450 Q 480,450 580,430 Q 550,515 420,500 Q 360,480 380,450 Z"
                      fill={estadoSelecionado === "PE" ? "#e31e24" : "#005a8d"}
                      stroke="#ffffff"
                      strokeWidth="3"
                      className="cursor-pointer hover:opacity-85 transition-all"
                      onClick={() => setEstadoSelecionado("PE")}
                    />

                    {/* AL = Alagoas (Cinza Claro / Inativo) */}
                    <path d="M 515,515 Q 585,520 600,570 Q 540,600 515,515 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="2.5" />

                    {/* SE = Sergipe (Azul ou Vermelho se selecionado) */}
                    <path
                      d="M 515,600 Q 565,615 545,670 Q 490,640 515,600 Z"
                      fill={estadoSelecionado === "SE" ? "#e31e24" : "#005a8d"}
                      stroke="#ffffff"
                      strokeWidth="3"
                      className="cursor-pointer hover:opacity-85 transition-all"
                      onClick={() => setEstadoSelecionado("SE")}
                    />

                    {/* BA = Bahia (Azul ou Vermelho se selecionado) */}
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
                    Casas em {estadosInfo[estadoSelecionado]?.nome}
                  </h3>
                  <span className="bg-[#005a8d]/10 text-[#005a8d] font-bold text-xs px-3.5 py-1.5 rounded-full">
                    {casasFiltradas.length} encontrada(s)
                  </span>
                </div>

                {casasFiltradas.length === 0 ? (
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
