import { useState, useMemo } from "react";
import { useAgendaEvents } from "@/hooks/useAgendaEvents"; // Certifique-se de que este hook usa o supabaseClient
import EventCard from "@/components/EventCard";
import { CalendarDays } from "lucide-react";

export default function Agenda() {
  const { events, loading } = useAgendaEvents();
  const [filter, setFilter] = useState("todos"); // todos | madre | geral

  // Filtra os eventos baseados na escolha do usuário
  const filtered = useMemo(() => {
    return filter === "todos" 
      ? events 
      : events.filter(e => e.agenda_type === filter);
  }, [events, filter]);

  // Agrupa os eventos por mês usando useMemo para performance
  const groups = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    const g = {};
    sorted.forEach(e => {
      if (!e.event_date) return;
      const d = new Date(e.event_date + "T00:00:00");
      const key = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      if (!g[key]) g[key] = [];
      g[key].push(e);
    });
    return g;
  }, [filtered]);

  return (
    <div>
      {/* HEADER */}
      <section className="bg-[#005a8d] text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <CalendarDays className="w-10 h-10 mx-auto text-[#c5a059] mb-4" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Agenda da Congregação</h1>
          <p className="mt-3 text-white/85">Consulte os compromissos oficiais e as atividades do Instituto.</p>
        </div>
      </section>

      {/* FILTROS E LISTAGEM */}
      <section className="py-12 bg-[#f8f9fa]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-center gap-2 mb-10">
            {[
              { id: "todos", label: "Todas" },
              { id: "madre", label: "Agenda da Madre" },
              { id: "geral", label: "Agenda Geral" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  filter === f.id 
                    ? "bg-[#e31e24] text-white shadow-md" 
                    : "bg-white text-[#005a8d] border border-[#c5a059]/20 hover:border-[#e31e24]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-gray-500 py-12">Carregando eventos...</p>
          ) : Object.keys(groups).length === 0 ? (
            <div className="text-center py-16">
              <CalendarDays className="w-12 h-12 text-[#c5a059]/30 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum compromisso programado.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(groups).map(([month, evs]) => (
                <div key={month}>
                  <h2 className="font-serif text-lg font-bold text-[#c5a059] capitalize mb-4 pb-2 border-b border-[#c5a059]/20">
                    {month}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {evs.map(e => <EventCard key={e.id} event={e} />)}
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
