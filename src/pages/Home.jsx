import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { ChevronRight, Calendar, Heart, ArrowRight, Loader2, Sparkles, Church, Users, GraduationCap, Stethoscope, Clock, MapPin, Phone, ChevronLeft } from "lucide-react";

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [eventosHome, setEventosHome] = useState([]);
  const [casasMissao, setCasasMissao] = useState([]);
  
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [loadingCasas, setLoadingCasas] = useState(true);

  // Estado para controlar o carrossel de Casas de Missão
  const [indiceCarrossel, setIndiceCarrossel] = useState(0);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("*")
          .eq("active", true)
          .order("order", { ascending: true });
        
        if (data && !error) setBanners(data);
      } catch (err) {
        console.error("Erro ao buscar banners:", err);
      } finally {
        setLoadingBanners(false);
      }
    }

    async function fetchEventosFuturos() {
      try {
        const hoje = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from("agenda_eventos")
          .select("*")
          .gte("data_evento", hoje)
          .order("data_evento", { ascending: true })
          .limit(6);

        if (data && !error) setEventosHome(data);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
      } finally {
        setLoadingEventos(false);
      }
    }

    async function fetchCasasMissao() {
      try {
        const { data, error } = await supabase
          .from("casas_missao")
          .select("*")
          .order("ordem", { ascending: true });

        if (data && !error) setCasasMissao(data);
      } catch (err) {
        console.error("Erro ao buscar casas de missão:", err);
      } finally {
        setLoadingCasas(false);
      }
    }

    fetchBanners();
    fetchEventosFuturos();
    fetchCasasMissao();
  }, []);

  function isSemanaAtual(dataStr) {
    const hoje = new Date();
    const dataEvento = new Date(dataStr + 'T00:00:00');
    
    const primeiroDia = new Date(hoje);
    primeiroDia.setDate(hoje.getDate() - hoje.getDay());
    primeiroDia.setHours(0, 0, 0, 0);

    const ultimoDia = new Date(primeiroDia);
    ultimoDia.setDate(primeiroDia.getDate() + 6);
    ultimoDia.setHours(23, 59, 59, 999);

    return dataEvento >= primeiroDia && dataEvento <= ultimoDia;
  }

  // Controles do Carrossel de Casas de Missão
  const proximaCasa = () => {
    setIndiceCarrossel((prev) => (prev + 1) % casasMissao.length);
  };

  const casaAnterior = () => {
    setIndiceCarrossel((prev) => (prev - 1 + casasMissao.length) % casasMissao.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfbf9]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#005a8d] via-[#004068] to-[#002845] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#e31e24]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-[#c5a059] shadow-inner backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#c5a059]" />
              Instituto Religioso das Medianeiras da Paz
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-wide drop-shadow-sm">
              Consagradas à paz, à <span className="text-[#c5a059]">oração</span> e ao <span className="text-[#ff4d53]">serviço</span>.
            </h1>

            <p className="text-lg text-white/90 leading-relaxed font-light">
              Bem-vindo ao portal oficial do IRIMEP. Um espaço de comunhão, fé e esperança onde compartilhamos nossa missão de amor ao próximo e edificação espiritual.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/institucional"
                className="bg-[#e31e24] hover:bg-[#c9181d] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-red-600/30 flex items-center gap-2 group"
              >
                Conheça Nossa História 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/agenda"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-2xl font-bold transition-all backdrop-blur-md hover:border-[#c5a059]"
              >
                Ver Agenda
              </Link>
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative">
            <div className="absolute -top-3 -right-3 bg-[#c5a059] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              Destaques
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#c5a059] mb-6 flex items-center gap-2">
              <Church className="w-6 h-6" /> Avisos e Notícias
            </h3>

            {loadingBanners ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#c5a059]" />
              </div>
            ) : banners.length > 0 ? (
              <div className="space-y-4">
                {banners.slice(0, 2).map((banner) => (
                  <div key={banner.id} className="bg-white/10 p-5 rounded-2xl border border-white/15 hover:bg-white/20 transition-all shadow-sm">
                    <h4 className="font-bold text-lg text-white mb-1">{banner.title}</h4>
                    <p className="text-sm text-white/80 line-clamp-2">{banner.subtitle}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-black/10 rounded-2xl border border-white/5">
                <p className="text-sm text-white/80">Acompanhe nossas próximas programações e avisos oficiais.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Seção de Pilares e Obras com Cores Temáticas */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#005a8d]">Pilares da nossa Missão</h2>
          <div className="w-24 h-1 bg-[#c5a059] mx-auto rounded-full"></div>
          <p className="text-gray-600">Conheça as frentes de atuação e o impacto social e espiritual da congregação.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card Educação */}
          <div className="bg-white p-7 rounded-3xl shadow-sm border border-blue-100 hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-blue-50 text-[#005a8d] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#005a8d] px-2.5 py-1 rounded-full">Obras Sociais</span>
              <h3 className="font-serif text-xl font-bold text-[#005a8d] mt-2 mb-2">Educação</h3>
              <p className="text-gray-600 text-xs leading-relaxed mb-6">
                Formação integral de crianças e jovens através de escolas e projetos pedagógicos humanizados.
              </p>
            </div>
            <Link to="/obras-e-missoes" className="text-[#005a8d] font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Ver unidades de educação <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card Saúde */}
          <div className="bg-white p-7 rounded-3xl shadow-sm border border-emerald-100 hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">Obras Sociais</span>
              <h3 className="font-serif text-xl font-bold text-emerald-900 mt-2 mb-2">Saúde</h3>
              <p className="text-gray-600 text-xs leading-relaxed mb-6">
                Atendimento e amparo à saúde com dedicação, postos de apoio e assistência comunitária.
              </p>
            </div>
            <Link to="/obras-e-missoes" className="text-emerald-700 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Ver frentes de saúde <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card Social */}
          <div className="bg-white p-7 rounded-3xl shadow-sm border border-red-100 hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-red-50 text-[#e31e24] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-[#e31e24] px-2.5 py-1 rounded-full">Obras Sociais</span>
              <h3 className="font-serif text-xl font-bold text-red-950 mt-2 mb-2">Social & Missão</h3>
              <p className="text-gray-600 text-xs leading-relaxed mb-6">
                Apoio a famílias carentes, abrigos e casas missionárias espalhadas em diferentes regiões.
              </p>
            </div>
            <Link to="/obras-e-missoes" className="text-[#e31e24] font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Conhecer casas de missão <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card Vocacional */}
          <div className="bg-white p-7 rounded-3xl shadow-sm border border-amber-100 hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-amber-50 text-[#c5a059] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-[#c5a059] px-2.5 py-1 rounded-full">Espiritualidade</span>
              <h3 className="font-serif text-xl font-bold text-[#005a8d] mt-2 mb-2">Caminho Vocacional</h3>
              <p className="text-gray-600 text-xs leading-relaxed mb-6">
                Sente o chamado divino para a vida consagrada? Descubra os passos para trilhar este caminho conosco.
              </p>
            </div>
            <Link to="/institucional/sobre-nos" className="text-[#c5a059] font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Quero saber mais <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Seção: Carrossel de Casas de Missão */}
      <section className="bg-gradient-to-br from-[#002845] to-[#004068] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Presença Missionária</span>
              <h2 className="text-3xl font-serif font-bold text-white">Casas de Missão</h2>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                to="/obras-e-missoes" 
                className="text-xs font-bold text-[#c5a059] hover:underline mr-4"
              >
                Ver Todas &rarr;
              </Link>
              {casasMissao.length > 1 && (
                <div className="flex gap-2">
                  <button 
                    onClick={casaAnterior}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
                    title="Anterior"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button 
                    onClick={proximaCasa}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
                    title="Próxima"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {loadingCasas ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#c5a059]" /></div>
          ) : casasMissao.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10 text-white/70">
              Nenhuma casa de missão cadastrada no momento.
            </div>
          ) : (
            <div className="bg-white/10 border border-white/15 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-xl grid md:grid-cols-2 gap-8 items-center animate-fadeIn">
              {casasMissao[indiceCarrossel].foto_url && (
                <div className="h-64 sm:h-80 rounded-2xl overflow-hidden bg-black/20 shadow-inner">
                  <img 
                    src={casasMissao[indiceCarrossel].foto_url} 
                    alt={casasMissao[indiceCarrossel].nome_casa} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-4">
                <span className="text-xs font-bold text-[#c5a059] bg-[#c5a059]/20 px-3 py-1 rounded-full inline-block uppercase tracking-wider">
                  {casasMissao[indiceCarrossel].cidade_estado}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {casasMissao[indiceCarrossel].nome_casa}
                </h3>
                {casasMissao[indiceCarrossel].descricao_breve && (
                  <p className="text-white/80 text-sm leading-relaxed">
                    {casasMissao[indiceCarrossel].descricao_breve}
                  </p>
                )}
                <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-white/90">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                    <span>{casasMissao[indiceCarrossel].endereco}</span>
                  </p>
                  {casasMissao[indiceCarrossel].telefone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#c5a059] shrink-0" />
                      <span className="font-semibold">{casasMissao[indiceCarrossel].telefone}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Seção de Próximos Eventos e Agenda da Semana */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Acompanhe a Congregação</span>
              <h2 className="text-3xl font-serif font-bold text-[#005a8d]">Próximos Eventos e Agenda</h2>
            </div>
            <Link 
              to="/agenda" 
              className="flex items-center gap-2 bg-[#005a8d]/10 text-[#005a8d] hover:bg-[#005a8d] hover:text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all"
            >
              Ver Agenda Completa <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingEventos ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#005a8d]" /></div>
          ) : eventosHome.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 text-center text-gray-500 shadow-sm">
              Nenhum evento futuro cadastrado no momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventosHome.map((evento) => {
                const eDaSemana = isSemanaAtual(evento.data_evento);
                const dataFormatada = new Date(evento.data_evento + 'T00:00:00').toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                });

                return (
                  <div 
                    key={evento.id} 
                    className={`bg-gray-50 p-7 rounded-3xl shadow-sm border transition-all flex flex-col justify-between ${
                      eDaSemana ? "border-[#c5a059] ring-2 ring-[#c5a059]/20 bg-white" : "border-gray-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          eDaSemana ? "bg-[#c5a059] text-white" : "bg-[#005a8d]/10 text-[#005a8d]"
                        }`}>
                          {eDaSemana ? "✨ Esta Semana" : dataFormatada}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {evento.tipo === 'madre' ? 'Agenda da Madre' : 'Geral'}
                        </span>
                      </div>

                      <h3 className="text-xl font-serif font-bold text-[#005a8d] mb-2">{evento.titulo}</h3>
                      
                      <div className="space-y-1 mb-4 text-xs text-gray-500 font-medium">
                        {!eDaSemana && <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#c5a059]" /> {dataFormatada}</p>}
                        {evento.horario && <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#c5a059]" /> {evento.horario}</p>}
                        {evento.local && <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#c5a059]" /> {evento.local}</p>}
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{evento.descricao}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
