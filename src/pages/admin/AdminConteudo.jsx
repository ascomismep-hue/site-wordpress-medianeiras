import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, Save, FileText } from "lucide-react";

// (Mantemos a constante PAGES igual ao original)

export default function AdminConteudo() {
  const [activePage, setActivePage] = useState(PAGES[0].id);
  const [contents, setContents] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);

  useEffect(() => {
    async function loadContent() {
      const { data } = await supabase.from('page_content').select('*');
      if (data) {
        const map = {};
        data.forEach(i => { 
          map[`${i.page}|${i.section}|${i.key}`] = { content: i.content || "", id: i.id }; 
        });
        setContents(map);
      }
      setLoading(false);
    }
    loadContent();
  }, []);

  const page = PAGES.find(p => p.id === activePage);

  const saveField = async (sectionId, field) => {
    const key = `${activePage}|${sectionId}|${field.key}`;
    const value = contents[key]?.content || "";
    setSavingKey(key);
    
    try {
      const existingId = contents[key]?.id;
      if (existingId) {
        await supabase.from('page_content').update({ content: value }).eq('id', existingId);
      } else {
        const { data } = await supabase
          .from('page_content')
          .insert([{ page: activePage, section: sectionId, key: field.key, content: value }])
          .select()
          .single();
        if (data) setContents(prev => ({ ...prev, [key]: { content: value, id: data.id } }));
      }
    } catch (err) {
      alert("Erro ao salvar.");
    } finally {
      setTimeout(() => setSavingKey(null), 1200);
    }
  };

  const handleChange = (key, value) => {
    setContents(prev => ({
      ...prev,
      [key]: { ...prev[key], content: value, id: prev[key]?.id },
    }));
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#c5a059]" /></div>;

  return (
    // (A estrutura JSX permanece idêntica ao seu original, 
    // apenas garantindo que as chamadas saveField e handleChange 
    // interagem com o state gerenciado pelo Supabase acima)
    <div>
       {/* ... restante do seu código ... */}
    </div>
  );
}
