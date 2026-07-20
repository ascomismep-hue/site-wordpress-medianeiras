import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Trash2, Loader2, Newspaper, Pencil } from "lucide-react";

export default function AdminNoticias() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", image_url: "", published_date: new Date().toISOString().slice(0, 10), category: "", author: "" });
  const [editId, setEditId] = useState(null);

  const reload = async () => {
    setLoading(true);
    const { data } = await supabase.from('news').select('*').order('published_date', { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { reload(); }, []);

  const reset = () => {
    setForm({ title: "", content: "", image_url: "", published_date: new Date().toISOString().slice(0, 10), category: "", author: "" });
    setEditId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (editId) {
      await supabase.from('news').update(form).eq('id', editId);
    } else {
      await supabase.from('news').insert([form]);
    }
    reset();
    reload();
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Excluir esta notícia?")) return;
    await supabase.from('news').delete().eq('id', id);
    reload();
  };

  // Função para upload de imagem no Supabase Storage
  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    const { data, error } = await supabase.storage.from('news-images').upload(fileName, file);
    
    if (!error) {
      const { data: publicUrlData } = supabase.storage.from('news-images').getPublicUrl(fileName);
      setForm(prev => ({ ...prev, image_url: publicUrlData.publicUrl }));
    }
    setSaving(false);
  };

  // ... rest of the UI implementation (remains consistent with your original structure)
  return (
      // Certifique-se de que os campos de input chamem as funções 'submit', 'remove', etc.
      <div>{/* UI igual à original... */}</div>
  );
}
