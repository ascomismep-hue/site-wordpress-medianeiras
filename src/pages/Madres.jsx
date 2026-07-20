import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Star } from "lucide-react";

export default function Madres() {
  const [mothers, setMothers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMothers() {
      setLoading(true);
      // Busca ordenada por start_year ou criado em (ajuste conforme necessário)
      const { data } = await supabase
        .from('mothers')
        .select('*')
        .order('start_year', { ascending: false });
        
      if (data) setMothers(data);
      setLoading(false);
    }
    fetchMothers();
  }, []);

  return (
    <div>
      <section className="bg-[#005a8d] text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <Star className="w-10 h-10 mx-auto text-[#c5a059] mb-4" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Galeria das Madres</h1>
          <p className="mt-3 text-white/85">Todas as Madres Superioras que serviram o Instituto ao longo da história.</p>
        </div>
      </section>

      <section className="py-12 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-gray-500 py-12">Carregando...</p>
          ) : mothers.length === 0 ? (
            <div className="text-center py-16">
              <Star className="w-12 h-12 text-[#c5a059]/30 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma madre cadastrada.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mothers.map(m => {
                const isCurrent = !m.end_year;
                return (
                  <div key={m.id} className="bg-white rounded-2xl border border-[#c5a059]/15 p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="relative w-28 h-28 mx-auto mb-4">
                      {m.photo_url ? (
                        <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover rounded-full ring-4 ring-[#c5a059]/30" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-[#005a8d]/10 flex items-center justify-center font-serif text-3xl font-bold text-[#005a8d]">{m.name.charAt(0)}</div>
                      )}
                      {isCurrent && <span className="absolute -bottom-1 -right-1 bg-[#e31e24] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Atual</span>}
                    </div>
                    <h3 className="font-serif font-bold text-[#005a8d] text-lg">{m.name}</h3>
                    <p className="text-sm text-[#c5a059] font-semibold mt-1">
                      {m.start_year}{isCurrent ? " — Atual" : ` — ${m.end_year || "?"}`}
                    </p>
                    {m.bio && <p className="text-sm text-gray-600 mt-3 leading-relaxed whitespace-pre-line">{m.bio}</p>}
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
