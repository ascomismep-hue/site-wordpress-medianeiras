import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Emblem } from "@/components/ui/Emblem";
import { ChevronRight, Calendar, Heart, ArrowRight, Loader2 } from "lucide-react";

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
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      {/* Seção de Destaque / Banners com Logo Original */}
      <section className="relative bg-[#005a8d] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Efeito de fundo sutil com a logo */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <img src="/logo.png" alt="" className="w-full h-full object-cover" />
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            {/* Logo Original */}
            <div className="bg-white/10 p-4 rounded-3xl inline-block border border-white/20 shadow-inner">
              <img 
                src="/logo.png" 
                alt="Instituto Religioso das Irmãs Medianeiras da Paz - IRIMEP" 
                className="h-20 sm:h-24 w-auto object-contain brightness-0 invert" 
              />
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#c5a059]">
              Consagradas à paz, à oração e ao serviço.
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Bem-vindo ao portal oficial do IRIMEP. Conheça nossa história de fé, nossas obras sociais, a agenda e o caminho vocacional.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/quem-somos"
                className="bg-[#e31e24] hover:bg-[#b3181e] text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-lg"
              >
                Conheça Nossa História <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/agenda"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Ver Agenda
              </Link>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm shadow-xl">
            <h3 className="font-serif text-2xl font-bold text-[#c5a059] mb-6">Destaques Recentes</h3>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-[#c5a059]" />
              </div>
            ) : banners.length > 0 ? (
              <div className="space-y-4">
                {banners.slice(0, 2).map((banner) => (
                  <div key={banner.id} className="bg-white/10 p-5 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
                    <h4 className="font-bold text-lg text-white">{banner.title}</h4>
                    <p className="text-sm text-white/80 mt-1 line-clamp-2">{banner.subtitle}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/70 py-6 text-center">Nenhum banner ativo no momento.</p>
            )}
          </div>
        </div>
      </section>

      {/* Seção de Chamadas Rápidas */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#c5a059]/20 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#005a8d]/10 rounded-2xl flex items-center justify-center text-[#005a8d] mb-6">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#005a8d] mb-2">Agenda e Eventos</h3>
            <p className="text-gray-600 text-sm mb-4">Acompanhe as celebrações, encontros e programações da nossa congregação.</p>
            <Link to="/agenda" className="text-[#e31e24] font-semibold text-sm flex items-center gap-1 hover:underline">
              Ver programação <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#c5a059]/20 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#005a8d]/10 rounded-2xl flex items-center justify-center text-[#005a8d] mb-6">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#005a8d] mb-2">Obras e Missões</h3>
            <p className="text-gray-600 text-sm mb-4">Conheça o trabalho social e evangelizador desenvolvido pelas nossas irmãs.</p>
            <Link to="/obras-e-missoes" className="text-[#e31e24] font-semibold text-sm flex items-center gap-1 hover:underline">
              Saiba mais <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#c5a059]/20 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-[#005a8d]/10 rounded-2xl flex items-center justify-center text-[#005a8d] mb-6">
              <Emblem className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#005a8d] mb-2">Caminho Vocacional</h3>
            <p className="text-gray-600 text-sm mb-4">Sente o chamado para a vida consagrada? Descubra como trilhar este caminho conosco.</p>
            <Link to="/vocacional" className="text-[#e31e24] font-semibold text-sm flex items-center gap-1 hover:underline">
              Quero saber mais <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
