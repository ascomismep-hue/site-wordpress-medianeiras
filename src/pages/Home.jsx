import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { 
  ChevronRight, Calendar, Heart, ArrowRight, Loader2, Sparkles, 
  Users, GraduationCap, Stethoscope, Clock, MapPin, Phone, 
  ChevronLeft, Gift, Globe 
} from "lucide-react";
import LiturgiaDiariaCard from "../components/LiturgiaDiariaCard";

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [eventosHome, setEventosHome] = useState([]);
  const [casasMissao, setCasasMissao] = useState([]);
  const [noticiasHome, setNoticiasHome] = useState([]);
  const [aniversariantes, setAniversariantes] = useState([]);
  
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [loadingCasas, setLoadingCasas] = useState(true);
  const [loadingNoticias, setLoadingNoticias] = useState(true);
  const [loadingAniversariantes, setLoadingAniversariantes] = useState(true);

  const [indiceCarrosselCasas, setIndiceCarrosselCasas] = useState(0);
  const [indiceCarrosselBanners, setIndiceCarrosselBanners] = useState(0);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const { data } = await supabase
          .from("banners")
          .select("*")
          .eq("active", true)
          .order("order", { ascending: true });
        if (data) setBanners(data);
      } catch (err) {
        console.error("Erro ao buscar banners:", err);
      } finally {
        setLoadingBanners(false);
      }
    }

    async function fetchEventosFuturos() {
      try {
        const hoje = new Date().toISOString().split('T')[0];
        const { data } = await supabase
          .from("agenda_eventos")
          .select("*")
          .gte("data_evento", hoje)
          .order("data_evento", { ascending: true })
          .limit(6);
        if (data) setEventosHome(data);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
      } finally {
        setLoadingEventos(false);
      }
    }

    async function fetchCasasMissao() {
      try {
        const { data } = await supabase
          .from("casas_missao")
          .select("*")
          .order("ordem", { ascending: true });
        if (data) setCasasMissao(data);
      } catch (err) {
        console.error("Erro ao buscar casas:", err);
      } finally {
        setLoadingCasas(false);
      }
    }

    async function fetchNoticiasHome() {
      try {
        const { data } = await supabase
          .from("noticias")
          .select("*")
          .eq("active", true)
          .order("data_publicacao", { ascending: false })
          .limit(3);
        if (data) setNoticiasHome(data);
      } catch (err) {
        console.error("Erro ao buscar notícias:", err);
      } finally {
        setLoadingNoticias(false);
      }
    }

    async function fetchAniversariantesHoje() {
      try {
        const hoje = new Date();
        const mesAtual = String(hoje.getMonth() + 1).padStart(2, '0');
        const diaAtual = String(hoje.getDate()).padStart(2, '0');

        const { data } = await supabase.from("irmas").select("*");
        if (data) {
          const aniversariantesHoje = data.filter(irma => {
            if (!irma.data_nascimento) return false;
            const partes = irma.data_nascimento.split('-');
            if (partes.length === 3) {
              const [, mes, dia] = partes;
              return mes === mesAtual && dia === diaAtual;
            }
            return false;
          });
          setAniversariantes(aniversariantesHoje);
        }
      } catch (err) {
        console.error("Erro aniversariantes:", err);
      } finally {
        setLoadingAniversariantes(false);
      }
    }

    fetchBanners();
    fetchEventosFuturos();
    fetchCasasMissao();
    fetchNoticiasHome();
    fetchAniversariantesHoje();
  }, []);

  // Rotação automática dos banners a cada 10 segundos
  useEffect(() => {
    if (banners.length <= 1) return;
    const intervalo = setInterval(() => {
      setIndiceCarrosselBanners((prev) => (prev + 1) % banners.length);
    }, 10000);
    return () => clearInterval(intervalo);
  }, [banners.length]);

  // Rotação automática das casas
  useEffect(() => {
    if (casasMissao.length <= 1) return;
    const intervalo = setInterval(() => {
      setIndiceCarrosselCasas((prev) => (prev + 1) % casasMissao.length);
    }, 10000);
    return () => clearInterval(intervalo);
  }, [casasMissao.length]);

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

  const proximaCasa = () => setIndiceCarrosselCasas((prev) => (prev + 1) % casasMissao.length);
  const casaAnterior = () => setIndiceCarrosselCasas((prev) => (prev - 1 + casasMissao.length) % casasMissao.length);

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfbf9]">
      {/* 1. HERO SECTION: Apenas o Carrossel de Banners Completo e Visível */}
      <section className="relative bg-gradient-to-br from-[#005a8d] via-[#004068] to-[#002845] py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-inner">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/10 border border-white/25 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden relative h-[320px] sm:h-[420px] lg:h-[480px] flex items-center justify-center">
            {loadingBanners ? (
              <Loader2 className="w-8 h-8 animate-spin text-[#c5a059]" />
            ) : banners.length > 0 ? (
              <div className="w-full h-full relative">
                {banners.map((banner, index) => (
                  <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 overflow-hidden flex items-center justify-center bg-[#001d30] ${
                      index === indiceCarrosselBanners ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <img
                      src={banner.foto_url}
                      alt={banner.titulo}
                      style={{
                        transform: `translate(${banner.pos_x || 0}px, ${banner.pos_y || 0}px) scale(${banner.zoom || 1})`,
                        transformOrigin: 'center center'
                      }}
                      className="w-full h-full object-contain"
                    />

                    {/* Barra Inferior com Título e Link do Banner */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#002845]/95 via-[#002845]/70 to-transparent p-6 flex items-end justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-wider block">Destaque Institucional</span>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-white line-clamp-1">{banner.titulo}</h3>
                      </div>

                      {banner.link && (
                        <a
                          href={banner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#c5a059] hover:bg-[#b08c48] text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 transition-colors shadow-md"
                        >
                          Saiba Mais <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                {/* Indicadores do Carrossel */}
                {banners.length > 1 && (
                  <div className="absolute top-4 right-4 z-20 flex gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    {banners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setIndiceCarrosselBanners(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === indiceCarrosselBanners ? "w-6 bg-[#c5a059]" : "w-2 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-6 text-white/80">
                <p className="text-sm font-medium">Portal oficial do IRIMEP</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEÇÃO DE ANIVERSARIANTES DO DIA */}
      {!loadingAniversariantes && aniversariantes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 w-full">
          <div className="bg-gradient-to-r from-amber-500 via-[#c5a059] to-amber-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
                <Gift className="w-4 h-4 text-white animate-bounce" /> Celebração Especial
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold">Os parabéns de hoje são para...</h2>
              <p className="text-white/90 text-xs sm:text-sm">Unimo-nos em oração e ação de graças pela vida de nossas queridas irmãs aniversariantes!</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              {aniversariantes.map((irma) => (
                <div key={irma.id} className="bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-4 flex items-center gap-4 shadow-md">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/80 shrink-0 shadow-inner bg-black/20">
                    <img 
                      src={irma.foto_url || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80"} 
                      alt={irma.nome} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200 block">Aniversariante</span>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-tight">{irma.nome}</h3>
                    <p className="text-[11px] text-white/80 mt-0.5">Parabéns e muitas bênçãos!</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. SEÇÃO DE BOAS-VINDAS E PILARES DA NOSSA MISSÃO UNIDOS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full bg-white rounded-[3rem] shadow-sm border border-gray-100 my-12">
        {/* Bloco de Boas-Vindas Integrado */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#005a8d]/10 border border-[#005a8d]/20 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-[#005a8d]">
            <Sparkles className="w-4 h-4 text-[#c5a059]" />
            Instituto Religioso das Medianeiras da Paz
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#005a8d] leading-tight">
            Consagradas à paz, à <span className="text-[#c5a059]">oração</span> e ao <span className="text-[#e31e24]">serviço</span>.
          </h1>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Bem-vindo ao portal oficial do IRIMEP. Um espaço de comunhão, fé e esperança onde compartilhamos nossa missão de amor ao próximo e edificação espiritual.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link 
              to="/institucional" 
              className="bg-[#e31e24] hover:bg-[#c9181d] text-white px-7 py-3.5 rounded-2xl font-bold transition-all shadow-lg hover:shadow-red-600/30 flex items-center gap-2 group text-sm"
            >
              Conheça Nossa História <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/agenda" 
              className="bg-gray-100 hover:bg-gray-200 text-[#005a8d] border border-gray-200 px-7 py-3.5 rounded-2xl font-bold transition-all text-sm"
            >
              Ver Agenda
            </Link>
          </div>
        </div>

        <div className="w-24 h-1 bg-[#c5a059] mx-auto rounded-full mb-16"></div>

        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#005a8d]">Pilares da nossa Missão</h2>
          <p className="text-gray-600 text-sm">Conheça as frentes de atuação e o impacto social e espiritual da congregação.</p>
        </div>

        {/* Linha Superior: 3 Cartões (Educação, Saúde, Social) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-gray-50 p-8 rounded-3xl border border-blue-100 hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-blue-50 text-[#005a8d] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#005a8d] px-2.5 py-1 rounded-full">Obras Sociais</span>
              <h3 className="font-serif text-xl font-bold text-[#005a8d] mt-3 mb-2">Educação</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Formação integral de crianças e jovens através de escolas e projetos pedagógicos humanizados.
              </p>
            </div>
            <Link to="/obras-e-missoes" className="text-[#005a8d] font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Ver unidades <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-emerald-100 hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">Obras Sociais</span>
              <h3 className="font-serif text-xl font-bold text-emerald-900 mt-3 mb-2">Saúde</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Atendimento e amparo à saúde com dedicação, postos de apoio e assistência comunitária.
              </p>
            </div>
            <Link to="/obras-e-missoes" className="text-emerald-700 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Ver saúde <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-purple-100 hover:shadow-md transition-all group flex flex-col justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <div className="w-14 h-14 bg-purple-50 text-purple-700 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">Assistência</span>
              <h3 className="font-serif text-xl font-bold text-purple-950 mt-3 mb-2">Social</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Apoio contínuo a famílias carentes, abrigos e amparo às comunidades em situação de vulnerabilidade.
              </p>
            </div>
            <Link to="/obras-e-missoes" className="text-purple-700 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Conhecer projetos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Linha Inferior: 2 Cartões Centralizados (Missão e Vocacional) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-50 p-8 rounded-3xl border border-red-100 hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-red-50 text-[#e31e24] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-[#e31e24] px-2.5 py-1 rounded-full">Evangelização</span>
              <h3 className="font-serif text-xl font-bold text-red-950 mt-3 mb-2">Missão</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Casas missionárias e frentes de evangelização espalhadas em diferentes regiões levando a Palavra.
              </p>
            </div>
            <Link to="/obras-e-missoes" className="text-[#e31e24] font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Casas de missão <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-amber-100 hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-amber-50 text-[#c5a059] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-[#c5a059] px-2.5 py-1 rounded-full">Espiritualidade</span>
              <h3 className="font-serif text-xl font-bold text-[#005a8d] mt-3 mb-2">Vocacional</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Sente o chamado divino para a vida consagrada? Descubra os passos para trilhar este caminho.
              </p>
            </div>
            <Link to="/institucional/sobre-nos" className="text-[#c5a059] font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Quero saber mais <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SEÇÃO DA LITURGIA DIÁRIA */}
      <LiturgiaDiariaCard />

      {/* CARROSSEL DE CASAS DE MISSÃO */}
      <section className="bg-gradient-to-br from-[#002845] to-[#004068] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden my-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Presença Missionária</span>
              <h2 className="text-3xl font-serif font-bold text-white">Casas de Missão</h2>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/obras-e-missoes" className="text-xs font-bold text-[#c5a059] hover:underline mr-4">
                Ver Todas &rarr;
              </Link>
              {casasMissao.length > 1 && (
                <div className="flex gap-2">
                  <button onClick={casaAnterior} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-colors">
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button onClick={proximaCasa} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-colors">
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
              {casasMissao[indiceCarrosselCasas].foto_url && (
                <div className="h-64 sm:h-80 rounded-2xl overflow-hidden bg-black/20 shadow-inner">
                  <img src={casasMissao[indiceCarrosselCasas].foto_url} alt={casasMissao[indiceCarrosselCasas].nome_casa} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="space-y-4">
                <span className="text-xs font-bold text-[#c5a059] bg-[#c5a059]/20 px-3 py-1 rounded-full inline-block uppercase tracking-wider">
                  {casasMissao[indiceCarrosselCasas].cidade_estado}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {casasMissao[indiceCarrosselCasas].nome_casa}
                </h3>
                {casasMissao[indiceCarrosselCasas].descricao_breve && (
                  <p className="text-white/80 text-sm leading-relaxed">
                    {casasMissao[indiceCarrosselCasas].descricao_breve}
                  </p>
                )}
                <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-white/90">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                    <span>{casasMissao[indiceCarrosselCasas].endereco}</span>
                  </p>
                  {casasMissao[indiceCarrosselCasas].telefone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#c5a059] shrink-0" />
                      <span className="font-semibold">{casasMissao[indiceCarrosselCasas].telefone}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SEÇÃO: 3 ÚLTIMAS NOTÍCIAS EM DESTAQUE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Avisos e Comunicados</span>
            <h2 className="font-serif text-3xl font-bold text-[#005a8d]">Últimas Notícias</h2>
          </div>
          <Link to="/noticias" className="text-xs font-bold text-[#005a8d] hover:underline flex items-center gap-1">
            Ver Todas as Notícias <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingNoticias ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>
        ) : noticiasHome.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhuma notícia publicada no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {noticiasHome.map((item) => {
              const dataFormatada = new Date(item.data_publicacao + 'T00:00:00').toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              });

              return (
                <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between transition-all hover:shadow-md">
                  <div>
                    {item.foto_url && (
                      <div className="h-52 w-full overflow-hidden bg-gray-100">
                        <img src={item.foto_url} alt={item.titulo} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059]">
                        <Calendar className="w-3.5 h-3.5" /> {dataFormatada}
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#005a8d] line-clamp-2">{item.titulo}</h3>
                      <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">{item.subtitulo || item.conteudo}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Link to={`/noticias/${item.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-[#005a8d] hover:text-[#c5a059] transition-colors">
                      Confira &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SEÇÃO DE PRÓXIMOS EVENTOS E AGENDA */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Acompanhe a Congregação</span>
              <h2 className="text-3xl font-serif font-bold text-[#005a8d]">Próximos Eventos e Agenda</h2>
            </div>
            <Link to="/agenda" className="flex items-center gap-2 bg-[#005a8d]/10 text-[#005a8d] hover:bg-[#005a8d] hover:text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all">
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
                  <div key={evento.id} className={`bg-gray-50 p-7 rounded-3xl shadow-sm border transition-all flex flex-col justify-between ${eDaSemana ? "border-[#c5a059] ring-2 ring-[#c5a059]/20 bg-white" : "border-gray-200"}`}>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${eDaSemana ? "bg-[#c5a059] text-white" : "bg-[#005a8d]/10 text-[#005a8d]"}`}>
                          {eDaSemana ? "✨ Esta Semana" : dataFormatada}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {evento.tipo === 'madre' ? 'Agenda da Madre' : 'Geral'}
                        </span>
                      </div>

                      <h3 className="text-xl font-serif font-bold text-[#005a8d] mb-2">{evento.titulo}</h3>
                      
                      <div className="space-y-1 mb-4 text-xs text-gray-500 font-medium">
                        <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#c5a059]" /> {dataFormatada}</p>
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
