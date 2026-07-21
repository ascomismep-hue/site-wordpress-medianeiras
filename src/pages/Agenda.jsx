import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Calendar, Clock, MapPin, Sparkles } from "lucide-react";

export default function Agenda() {
  const [activeTab, setActiveTab] = useState("geral"); // "geral" ou "madre"
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventos(activeTab);
  }, [activeTab]);

  async function fetchEventos(tipo) {
    setLoading(true);
    const { data } = await supabase
      .from("agenda_eventos")
      .select("*")
      .eq("tipo", tipo)
      .order("data_evento", { ascending: true });
    
    if (data) setEventos(data);
    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6">
      
      {/* Cabeçalho */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#005a8d] mb-3">Agenda Institucional</h1>
        <p className="text-gray-600 max-w-lg mx-auto text-sm sm:text-base">
          Acompanhe os próximos eventos da congregação e os compromissos oficiais.
        </p>
        <div className="w-24 h-1 bg-[#c5a059] mx-auto rounded mt-4"></div>
      </div>

      {/* Abas de Navegação (Agenda Geral / Agenda da Madre) */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-2 border border-gray-200 shadow-xs">
          <button
            onClick={() => setActiveTab("geral")}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === "geral"
                ? "bg-[#005a8d] text-white shadow-md"
                : "text-gray-600 hover:text-[#005a8d]"
            }`}
          >
            Agenda Geral
          </button>
          <button
            onClick={() => setActiveTab("madre")}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === "madre"
                ? "bg-[#005a8d] text-white shadow-md"
                : "text-gray-600 hover:text-[#005a8d]"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#c5a059]" /> Agenda da Madre
          </button>
        </div>
      </div>

      {/* Listagem de Eventos */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>
      ) : eventos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Nenhum evento agendado no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eventos.map((evento) => {
            const dataFormatada = new Date(evento.data_evento + 'T00:00:00').toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            });

            return (
              <div key={evento.id} className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#c5a059] bg-[#c5a059]/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {dataFormatada}
                    </span>
                    {evento.horario && (
                      <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {evento.horario}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-serif font-bold text-[#005a8d] mb-2">{evento.titulo}</h3>
                  
                  {evento.local && (
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-3 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#c5a059]" /> {evento.local}
                    </p>
                  )}

                  <p className="text-gray-600 text-sm leading-relaxed text-justify">{evento.descricao}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
