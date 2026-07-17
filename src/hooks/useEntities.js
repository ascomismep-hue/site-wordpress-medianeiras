import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/api/supabaseClient";

export function useEntities(entityName, { sort = "created_at", ascending = false, limit = 100 } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // useCallback garante que a função de reload não seja recriada desnecessariamente
  const reload = useCallback(async () => {
    setLoading(true);
    
    // Consulta dinâmica usando o nome da tabela (entityName)
    const { data, error } = await supabase
      .from(entityName)
      .select('*')
      .order(sort.replace('-', ''), { ascending: ascending })
      .limit(limit);

    if (error) {
      console.error("Erro ao buscar entidades:", error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  }, [entityName, sort, ascending, limit]);

  useEffect(() => { 
    reload(); 
  }, [reload]);

  return { items, loading, setItems, reload };
}
