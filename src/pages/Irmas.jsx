import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Phone, Mail, Users, CalendarDays, Home } from "lucide-react";

function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("pt-BR");
}

function yearsSince(d) {
  if (!d) return null;
  const y = (new Date() - new Date(d)) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(y);
}

export default function Irmas() {
  const [sisters, setSisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [houses, setHouses] = useState([]);
  const [activeHouse, setActiveHouse] = useState("todas");

  useEffect(() => {
    async function fetchSisters() {
      setLoading(true);
      const { data } = await supabase.from('sisters').select('*');
      if (data) {
        setSisters(data);
        setHouses(["todas", ...new Set(data.map(s => s.house_name).filter(Boolean))]);
      }
      setLoading(false);
    }
    fetchSisters();
  }, []);

  const filtered = activeHouse === "todas" ? sisters : sisters.filter(s => s.house_name === activeHouse);
  const grouped = {};
  filtered.forEach(s => { const h = s.house_name || "Sem casa"; if (!grouped[h]) grouped[h] = []; grouped[h].push(s); });

  return (
    <div>
      <section className="bg-[#005a8d] text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <Users className="w-10 h-10 mx-auto text-[#c5a059] mb-4" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Nossas Irmãs</h1>
          <p className="mt-3 text-white/85">Anuário das irmãs da congregação, organizadas por casa.</p>
        </div>
      </section>

      <section className="py-12 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {houses.length > 2 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {houses.map(h => (
                <button key={h} onClick={() => setActiveHouse(h)} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeHouse === h ? "bg-[#e31e24] text-white" : "bg-white text-[#005a8d] border border-[#c5a059]/20"}`}>
                  {h === "todas" ? "Todas as Casas" : h}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-500 py-12">Carregando...</p>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="text-center py-16"><Users className="w-12 h-12 text-[#c5a059]/30 mx-auto mb-4" /><p className="text-gray-500">Nenhuma irmã cadastrada.</p></div>
          ) : (
            <div className="space-y-12">
              {Object.entries(grouped).map(([house, list]) => (
                <div key={house}>
                  <div className="flex items-center gap-2 mb-5">
                    <Home className="w-5 h-5 text-[#c5a059]" />
                    <h2 className="font-serif text-xl font-bold text-[#005a8d]">{house}</h2>
                    <span className="text-sm text-gray-400">({list.length})</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {list.map(s => {
                      const yrs = yearsSince(s.entrance_date);
                      return (
                        <div key={s.id} className="bg-white rounded-2xl border border-[#c5a059]/15 p-5 hover:shadow-lg transition-shadow flex gap-4">
                          <div className="shrink-0">
                            {s.photo_url ? (
                              <img src={s.photo_url} alt={s.name} className="w-20 h-20 rounded-full object-cover ring-2 ring-[#c5a059]/25" />
                            ) : (
                              <div className="w-20 h-20 rounded-full bg-[#005a8d]/10 flex items-center justify-center font-serif text-2xl font-bold text-[#005a8d]">{s.name.charAt(0)}</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-serif font-bold text-[#005a8d] leading-tight">{s.name}</h3>
                            {s.role && <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-[#e31e24] mt-0.5">{s.role}</span>}
                            {yrs != null && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {yrs} anos de congregação</p>}
                            <div className="mt-2 space-y-1 text-xs text-gray-600">
                              {s.first_vows_date && <p><span className="text-[#c5a059] font-semibold">1ª Votos:</span> {formatDate(s.first_vows_date)}</p>}
                              {s.perpetual_vows_date && <p><span className="text-[#c5a059] font-semibold">Perpétuos:</span> {formatDate(s.perpetual_vows_date)}</p>}
                            </div>
                            <div className="mt-2 flex gap-3 text-[#005a8d]">
                              {s.phone && <a href={`tel:${s.phone}`} title={s.phone} className="hover:text-[#e31e24]"><Phone className="w-4 h-4" /></a>}
                              {s.email && <a href={`mailto:${s.email}`} title={s.email} className="hover:text-[#e31e24]"><Mail className="w-4 h-4" /></a>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
