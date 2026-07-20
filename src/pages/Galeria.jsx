import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Play, X, Images } from "lucide-react";

export default function Galeria() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    async function fetchMedia() {
      setLoading(true);
      const { data } = await supabase
        .from('gallery_media')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setItems(data);
      setLoading(false);
    }
    fetchMedia();
  }, []);

  const filtered = filter === "todos" ? items : items.filter(i => i.media_type === filter);

  return (
    <div>
      <section className="bg-[#005a8d] text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <Images className="w-10 h-10 mx-auto text-[#c5a059] mb-4" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Galeria de Fotos e Vídeos</h1>
          <p className="mt-3 text-white/85">Momentos da nossa vida comunitária, missões e celebrações.</p>
        </div>
      </section>

      <section className="py-12 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-2 mb-10">
            {[{ id: "todos", label: "Todos" }, { id: "photo", label: "Fotos" }, { id: "video", label: "Vídeos" }].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${filter === f.id ? "bg-[#e31e24] text-white shadow-md" : "bg-white text-[#005a8d] border border-[#c5a059]/20 hover:border-[#e31e24]"}`}>
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-gray-500 py-12">Carregando...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16"><Images className="w-12 h-12 text-[#c5a059]/30 mx-auto mb-4" /><p className="text-gray-500">Nenhuma mídia cadastrada.</p></div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(m => (
                <button key={m.id} onClick={() => setActive(m)} className="group relative aspect-video rounded-2xl overflow-hidden bg-black/5 ring-1 ring-[#c5a059]/15 hover:ring-[#e31e24]/50 transition-all">
                  {m.media_type === "video" ? (
                    <>
                      <img src={m.thumbnail_url || m.media_url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Play className="w-12 h-12 text-white drop-shadow-lg" fill="white" /></div>
                    </>
                  ) : (
                    <img src={m.media_url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  )}
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-left">
                    <h3 className="text-white font-serif font-bold text-sm">{m.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de Visualização */}
      {active && (
        <div className="fixed inset-0 z-[60] bg-black/85 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <button className="absolute top-5 right-5 text-white/80 hover:text-white" onClick={() => setActive(null)}><X className="w-8 h-8" /></button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            {active.media_type === "video" ? (
              <video src={active.media_url} controls autoPlay className="w-full max-h-[80vh] rounded-xl" />
            ) : (
              <img src={active.media_url} alt={active.title} className="w-full max-h-[80vh] object-contain rounded-xl" />
            )}
            <div className="mt-3 text-white text-center">
              <h3 className="font-serif font-bold">{active.title}</h3>
              {active.description && <p className="text-white/70 text-sm mt-1">{active.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
