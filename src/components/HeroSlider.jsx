import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { Emblem } from "@/components/ui/Emblem";

export default function HeroSlider() {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    base44.entities.Banner.filter({ active: true }, "order")
      .then(items => setBanners(items.filter(b => b.image_url || b.video_url)))
      .catch(() => {});
  }, []);

  const has = banners.length > 0;
  const current = has ? banners[index] : null;

  const next = () => setIndex(i => (i + 1) % (banners.length || 1));
  const prev = () => setIndex(i => (i - 1 + banners.length) % (banners.length || 1));

 useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from('Banner')
        .select('*')
        .eq('active', true) // Filtro de ativos
        .order('order', { ascending: true }); // Ordenação

      if (!error && data) {
        setBanners(data.filter(b => b.image_url || b.video_url));
      }
    };

    fetchBanners();
  }, []);

  if (!has) {
    // Fallback hero estático
    return (
      <section className="relative min-h-[70vh] flex items-center justify-center text-center text-white overflow-hidden bg-gradient-to-br from-[#005a8d] to-[#003355]">
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-24">
          <Emblem className="w-16 h-16 mx-auto mb-6 drop-shadow-lg" />
          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            Sede instrumentos de paz onde houver discórdia, semeando o amor de Cristo.
          </h1>
          <p className="mt-5 text-lg text-white/90 font-light">Instituto Religioso das Medianeiras da Paz</p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/quem-somos" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#e31e24] hover:bg-[#b3181e] text-white font-semibold shadow-lg transition-all hover:scale-105">
              Conheça nossa História <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/doacao" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold ring-1 ring-white/30 transition-all">
              Faça uma Doação
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[78vh] flex items-center justify-center text-center text-white overflow-hidden">
      {current.video_url ? (
        <video key={current.video_url} src={current.video_url} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <img src={current.image_url} alt={current.title} className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-24">
        {current.title && <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight drop-shadow-lg">{current.title}</h1>}
        {current.subtitle && <p className="mt-5 text-lg text-white/90 font-light drop-shadow">{current.subtitle}</p>}
        {(current.link_label || current.link_url) && (
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            {current.link_url && (
              <Link to={current.link_url} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#e31e24] hover:bg-[#b3181e] text-white font-semibold shadow-lg transition-all hover:scale-105">
                {current.link_label || "Saiba mais"} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link to="/doacao" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold ring-1 ring-white/30 transition-all">
              Doe Agora
            </Link>
          </div>
        )}
      </div>

      {banners.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center transition" aria-label="Anterior">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center transition" aria-label="Próximo">
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setIndex(i)} className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-white" : "w-2 bg-white/50"}`} aria-label={`Banner ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
