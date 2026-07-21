import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Heart, Building2, MapPin, Phone, GraduationCap, Stethoscope, Users, Sparkles } from "lucide-react";

export default function ObrasMissoes() {
  const [abaAtiva, setAbaAtiva] = useState("obras"); // "obras" ou "casas"
  const [obrasList, setObrasList] = useState([]);
  const [casasList, setCasasList] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Separar obras por categoria
  const educacao = obrasList.filter(o => o.categoria === "educacao");
  const saude = obrasList.filter(o => o.categoria === "saude");
  const social = obrasList.filter(o => o.categoria === "social");

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
            Conheça o alcance da nossa congregação através das frentes de atuação social e das casas missionárias espalhadas.
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
            
            {/* Bloco 1: EDUCAÇÃO (Tons de Azul e Dourado) */}
            {educacao.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-blue-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#005a8d] flex items-center justify-center shadow-xs">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Educação</h2>
                    <p className="text-gray-500 text-sm">Formação integral, escolas e projetos pedagógicos.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {educacao.map(item => (
                    <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-blue-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                      {item.foto_url && (
                        <div className="h-48 overflow-hidden bg-gray-100">
                          <img src={item.foto_url} alt={item.titulo} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#005a8d] px-2.5 py-1 rounded-full">Educação</span>
                          <h3 className="text-xl font-serif font-bold text-gray-800 mt-2">{item.titulo}</h3>
                          {item.subtitulo && <p className="text-xs font-semibold text-[#c5a059]">{item.subtitulo}</p>}
                          <p className="text-gray-600 text-sm mt-3 leading-relaxed">{item.descricao}</p>
                        </div>
                        {item.unidades_escolas && (
                          <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium space-y-1">
                            <p className="text-[#005a8d] font-bold">Unidades / Escolas:</p>
                            <p>{item.unidades_escolas}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bloco 2: SAÚDE (Tons de Verde/Esmeralda) */}
            {saude.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-emerald-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-emerald-900">Saúde</h2>
                    <p className="text-gray-500 text-sm">Atendimento humanizado, postos e apoio assistencial.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {saude.map(item => (
                    <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                      {item.foto_url && (
                        <div className="h-48 overflow-hidden bg-gray-100">
                          <img src={item.foto_url} alt={item.titulo} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">Saúde</span>
                          <h3 className="text-xl font-serif font-bold text-gray-800 mt-2">{item.titulo}</h3>
                          {item.subtitulo && <p className="text-xs font-semibold text-emerald-600">{item.subtitulo}</p>}
                          <p className="text-gray-600 text-sm mt-3 leading-relaxed">{item.descricao}</p>
                        </div>
                        {item.unidades_escolas && (
                          <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium space-y-1">
                            <p className="text-emerald-800 font-bold">Unidades / Projetos:</p>
                            <p>{item.unidades_escolas}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bloco 3: SOCIAL (Tons de Vermelho/Rosa Institucional) */}
            {social.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-red-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#e31e24] flex items-center justify-center shadow-xs">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-red-950">Social</h2>
                    <p className="text-gray-500 text-sm">Apoio a famílias carentes, abrigos e projetos comunitários.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {social.map(item => (
                    <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-red-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                      {item.foto_url && (
                        <div className="h-48 overflow-hidden bg-gray-100">
                          <img src={item.foto_url} alt={item.titulo} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-[#e31e24] px-2.5 py-1 rounded-full">Social</span>
                          <h3 className="text-xl font-serif font-bold text-gray-800 mt-2">{item.titulo}</h3>
                          {item.subtitulo && <p className="text-xs font-semibold text-red-600">{item.subtitulo}</p>}
                          <p className="text-gray-600 text-sm mt-3 leading-relaxed">{item.descricao}</p>
                        </div>
                        {item.unidades_escolas && (
                          <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium space-y-1">
                            <p className="text-red-900 font-bold">Projetos Relacionados:</p>
                            <p>{item.unidades_escolas}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
          /* ABA: CASAS DE MISSÃO */
          <div className="space-y-8">
            <div className="max-w-xl">
              <h2 className="text-2xl font-serif font-bold text-[#005a8d] mb-1">Casas de Missão</h2>
              <p className="text-gray-600 text-sm">Conheça as comunidades religiosas e frentes missionárias instaladas em diferentes regiões.</p>
            </div>

            {casasList.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <p className="text-gray-500">Nenhuma casa de missão cadastrada no momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {casas.map(casa => (
                  <div key={casa.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                    {casa.foto_url && (
                      <div className="h-52 overflow-hidden bg-gray-100">
                        <img src={casa.foto_url} alt={casa.nome_casa} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[#c5a059] bg-[#c5a059]/10 px-3 py-1 rounded-full inline-block">
                          {casa.cidade_estado}
                        </span>
                        <h3 className="text-xl font-serif font-bold text-[#005a8d]">{casa.nome_casa}</h3>
                        {casa.descricao_breve && <p className="text-gray-600 text-sm leading-relaxed">{casa.descricao_breve}</p>}
                      </div>

                      <div className="space-y-2 pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium">
                        <p className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" /> 
                          <span>{casa.endereco}</span>
                        </p>
                        {casa.telefone && (
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-[#c5a059] shrink-0" /> 
                            <span>{casa.telefone}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
