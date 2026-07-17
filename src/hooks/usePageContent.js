import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/api/supabaseClient";

export function usePageContent() {
  const [contents, setContents] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    // Busca todos os registros da tabela PageContent
    const { data, error } = await supabase.from('PageContent').select('*');

    if (!error && data) {
      const map = {};
      data.forEach(item => {
        if (!map[item.page]) map[item.page] = {};
        if (!map[item.page][item.section]) map[item.page][item.section] = {};
        map[item.page][item.section][item.key] = { 
          content: item.content, 
          image_url: item.image_url, 
          _id: item.id 
        };
      });
      setContents(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const get = (page, section, key, fallback = "") => {
    const v = contents?.[page]?.[section]?.[key]?.content;
    return v && v.trim() ? v : fallback;
  };

  const getImage = (page, section, key, fallback = "") => {
    const v = contents?.[page]?.[section]?.[key]?.image_url;
    return v || fallback;
  };

  return { contents, loading, get, getImage };
}
