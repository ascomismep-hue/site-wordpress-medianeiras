import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient"; // Importando o novo cliente

export function useAgendaEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const today = new Date().toISOString().slice(0, 10);

      // Consulta ao Supabase
      const { data, error } = await supabase
        .from('AgendaEvent') // Nome da sua tabela no Supabase
        .select('*')
        .gte('event_date', today) // Filtra direto no banco (mais performático)
        .order('event_date', { ascending: true }); // Ordena pelo banco

      if (!error && data) {
        setEvents(data);
      }
      
      setLoading(false);
    };

    fetchEvents();
  }, []);

  return { events, loading };
}

export default useAgendaEvents;
