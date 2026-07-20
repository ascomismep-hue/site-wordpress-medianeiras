import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MapPin } from "lucide-react";

const symbols = [
  { key: "pomba", title: "A Pomba", color: "#e31e24", desc: "Símbolo do Espírito Santo e da paz que ultrapassa toda compreensão." },
  { key: "cruz", title: "A Cruz", color: "#c5a059", desc: "Sinal do amor redentor de Cristo. Nela encontramos o sentido do sacrifício." },
  { key: "globo", title: "O Globo", color: "#005a8d", desc: "A universalidade da missão. Anunciar a paz a toda criatura." },
];

export default function QuemSomos() {
  const [content, setContent] = useState({});
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Busca conteúdos da página
      const { data: pageData } = await supabase.from('page_content').select('section, key, value').eq('page', 'quem_somos');
      
      // Busca comunidades
      const { data: commData } = await supabase.from('communities').select('*');

      if (pageData) {
        const map = {};
        pageData.forEach(item => {
          if (!map[item.section]) map[item.section] = {};
          map[item.section][item.key] = item.value;
        });
        setContent(map);
      }
      
      setCommunities(commData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* Header */}
      <section className="bg-[#005a8d] text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">A Congregação</span>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold">Quem Somos</h1>
          <p className="mt-4 text-white/85 leading-relaxed">{content?.intro?.texto || "Conheça a história e o carisma do Instituto."}</p>
        </div>
      </section>

      {/* História */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-2xl font-bold text-[#005a8d] mb-5">História do Instituto</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content?.historia?.texto || "Carregando história..."}</p>
        </div>
      </section>

      {/* Símbolos */}
      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#005a8d]">Nossos Símbolos</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {symbols.map(s => (
              <div key={s.key} className="bg-white rounded-2xl border border-[#c5a059]/15 p-8 text-center hover:shadow-lg">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: `${s.color}18` }}>
                  <span className="font-serif text-2xl font-bold" style={{ color: s.color }}>{s.title.charAt(1)}</span>
                </div>
                <h3 className="font-serif text-xl font-bold mb-2" style={{ color: s.color }}>{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{content?.simbolos?.[s.key] || s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comunidades */}
      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center mb-12 font-serif text-2xl font-bold text-[#005a8d]">Presença e Comunidades</h2>
          {loading ? <p className="text-center">Carregando...</p> : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {communities.map(c => (
                <div key={c.id} className="bg-white rounded-2xl border border-[#c5a059]/15 p-6">
                  <MapPin className="w-6 h-6 text-[#e31e24] mb-3" />
                  <h3 className="font-serif font-bold text-[#005a8d] text-lg">{c.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{c.city} - {c.state}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
