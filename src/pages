import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Quote, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabaseClient"; // Importe o cliente Supabase
import useAgendaEvents from "@/hooks/useAgendaEvents";
import EventCard from "@/components/EventCard";
import NewsCard from "@/components/NewsCard";
import HeroSlider from "@/components/HeroSlider";

const SUPERIORA_IMG = "https://images.unsplash.com/photo-1507692049790-de58290eff4c?auto=format&fit=crop&w=600&q=80";

export default function Home() {
  const { events } = useAgendaEvents();
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from('news') // Certifique-se de que a tabela no Supabase se chama 'news'
          .select('*')
          .order('published_date', { ascending: false })
          .limit(6);

        if (error) throw error;
        setNews(data || []);
      } catch (err) {
        console.error("Erro ao buscar notícias:", err);
      } finally {
        setLoadingNews(false);
      }
    }

    fetchNews();
  }, []);

  const madreEvents = events.filter(e => e.agenda_type === "madre").slice(0, 3);
  const geralEvents = events.filter(e => e.agenda_type === "geral").slice(0, 3);
  const proximos = [...madreEvents, ...geralEvents].slice(0, 3);

  return (
    <div>
      <HeroSlider />

      {/* PALAVRA DA SUPERIORA */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl ring-1 ring-[#c5a059]/20">
                <img src={SUPERIORA_IMG} alt="Madre Superiora Geral" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-[#c5a059] opacity-20 -z-10" />
            </div>
          </div>
          <div className="md:col-span-3">
            <Quote className="w-10 h-10 text-[#c5a059]/40" />
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#005a8d]">
              Palavra da Superiora Geral
            </h2>
            <p className="mt-5 text-gray-700 leading-relaxed whitespace-pre-line">
              Queridas irmãs e amigos, que a paz de Cristo habite em vossos corações. Somos chamadas a ser Medianeiras da Paz, levando a luz do Evangelho a cada coração ferido. Bem-vindos à nossa casa digital, onde partilhamos nossa vida, oração e missão.
            </p>
            <p className="mt-4 font-serif italic text-[#e31e24]">Madre Superiora Geral</p>
          </div>
        </div>
      </section>

      {/* PRÓXIMOS EVENTOS */}
      {proximos.length > 0 && (
        <section className="py-20 bg-[#f8f9fa]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">Agendas</span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#005a8d]">Próximos Compromissos</h2>
              </div>
              <Link to="/agenda" className="inline-flex items-center gap-1 text-sm font-semibold text-[#e31e24] hover:underline">
                Ver agenda completa <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {proximos.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          </div>
        </section>
      )}

      {/* NOTÍCIAS RECENTES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">Notícias</span>
            <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#005a8d]">Novidades e Eventos</h2>
          </div>
          {loadingNews ? (
            <p className="text-gray-500 text-center py-12">Carregando...</p>
          ) : news.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map(n => <NewsCard key={n.id} news={n} />)}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">Nenhuma notícia publicada ainda.</p>
          )}
        </div>
      </section>

      {/* LITURGIA */}
      <section className="py-20 bg-gradient-to-br from-[#005a8d] to-[#003355] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-12 h-12 mx-auto text-[#c5a059] mb-6" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">Liturgia Diária & Espaço de Oração</h2>
          <p className="mt-4 text-white/85 leading-relaxed max-w-2xl mx-auto">
            Que a Palavra de Deus ilumine teu dia. Reservamos este espaço para que tua oração se una à nossa. Confia ao Senhor tuas intenções e necessidades; as irmãs as levarão em oração.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/contato#pedido-oracao" className="px-6 py-3 rounded-full bg-[#e31e24] hover:bg-[#b3181e] font-semibold transition-all">Enviar um Pedido de Oração</Link>
            <Link to="/vocacional" className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/30 backdrop-blur font-semibold transition-all">Descobrir minha Vocação</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
