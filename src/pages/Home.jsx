import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Emblem } from "@/components/ui/Emblem";
import { ChevronRight, Calendar, Heart, ArrowRight, Loader2, Sparkles, Church, Users, ShieldCheck } from "lucide-react";

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("*")
          .eq("active", true)
          .order("order", { ascending: true });
        
        if (data && !error) {
          setBanners(data);
        }
      } catch (err) {
        console.error("Erro ao buscar banners:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfbf9]">
      {/* Hero Section com Gradiente Vivo e Atmosfera Institucional */}
      <section className="relative bg-gradient-to-br from-[#005a8d] via-[#004068] to-[#002845] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-xl">
        {/* Efeitos de luz suaves no fundo */}
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

          {/* Destaques com Visual Moderno e Vidro Fosco */}
          <div className="bg-white/10 border border-white/20 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative">
            <div className="absolute -top-3 -right-3 bg-[#c5a059] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              Destaques
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#c5a059] mb-6 flex items-center gap-2">
              <Church className="w-6 h-6" /> Avisos e Notícias
            </h3>

            {loading ? (
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

      {/* Seção de Pilares e Chamadas com Cores Marcantes e Cards Flutuantes */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#005a8d]">Pilares da nossa Missão</h2>
          <div className="w-24 h-1 bg-[#c5a059] mx-auto rounded-full"></div>
          <p className="text-gray-600">Explore os principais caminhos e atuações da nossa congregação religiosa.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-[#c5a059]/50 hover:-translate-y-1.5 transition-all group">
            <div className="w-14 h-14 bg-gradient-to-br from-[#005a8d] to-[#003859] rounded-2xl flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#005a8d] mb-3">Agenda e Eventos</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Acompanhe as celebrações litúrgicas, encontros espirituais, retiros e programações da nossa congregação.
            </p>
            <Link to="/agenda" className="text-[#e31e24] font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              Ver programação completa <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-[#c5a059]/50 hover:-translate-y-1.5 transition-all group">
            <div className="w-14 h-14 bg-gradient-to-br from-[#e31e24] to-[#a81419] rounded-2xl flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#005a8d] mb-3">Obras e Missões</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Conheça o trabalho social, humanitário e evangelizador desenvolvido com dedicação pelas nossas irmãs.
            </p>
            <Link to="/obras-e-missoes" className="text-[#e31e24] font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              Saiba mais sobre as obras <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-[#c5a059]/50 hover:-translate-y-1.5 transition-all group sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 bg-gradient-to-br from-[#c5a059] to-[#9e7d3c] rounded-2xl flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#005a8d] mb-3">Caminho Vocacional</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Sente o chamado divino para a vida consagrada? Descubra os passos para trilhar este caminho de entrega conosco.
            </p>
            <Link to="/vocacional" className="text-[#e31e24] font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              Quero saber mais <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
