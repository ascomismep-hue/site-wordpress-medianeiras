import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Plus, Trash2, Loader2, Newspaper, Pencil } from "lucide-react";

// Componentes auxiliares (Header, Input, etc)
const Label = ({ children }) => <label className="block text-sm font-semibold text-[#005a8d] mb-1.5">{children}</label>;
const Input = ({ label, type = "text", value, onChange, required, placeholder, className }) => (
  <div className={className}>
    <Label>{label}</Label>
    <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-[#c5a059]/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005a8d]/40" />
  </div>
);

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
    if (editId) await supabase.from('news').update(form).eq('id', editId);
    else await supabase.from('news').insert([form]);
    reset();
    reload();
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Excluir esta notícia?")) return;
    await supabase.from('news').delete().eq('id', id);
    reload();
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#005a8d] mb-1">Notícias e Eventos</h1>
      <form onSubmit={submit} className="bg-white rounded-2xl border border-[#c5a059]/15 p-6 mb-8">
        <h2 className="font-serif text-lg font-bold text-[#005a8d] mb-4">{editId ? "Editar Notícia" : "Nova Notícia"}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Título *" required value={form.title} onChange={v => setForm({ ...form, title: v })} />
          <Input label="Categoria" value={form.category} onChange={v => setForm({ ...form, category: v })} />
          <Input label="Autor" value={form.author} onChange={v => setForm({ ...form, author: v })} />
          <Input label="Data de Publicação" type="date" value={form.published_date} onChange={v => setForm({ ...form, published_date: v })} />
        </div>
        <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} className="w-full mt-4 rounded-xl border border-[#c5a059]/30 px-4 py-2.5 text-sm" placeholder="Conteúdo da notícia..." />
        <div className="flex gap-3 mt-5">
          <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-full bg-[#e31e24] text-white font-semibold text-sm hover:bg-[#b3181e] disabled:opacity-60 flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} {editId ? "Salvar" : "Publicar"}
          </button>
          {editId && <button type="button" onClick={reset} className="px-6 py-2.5 rounded-full bg-gray-100 text-gray-600 font-semibold text-sm">Cancelar</button>}
        </div>
      </form>

      {loading ? <p>Carregando...</p> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-[#c5a059]/15 p-4">
              <h3 className="font-bold text-[#005a8d]">{item.title}</h3>
              <div className="flex gap-2 mt-3">
                <button onClick={() => { setForm(item); setEditId(item.id); }} className="text-xs px-3 py-1.5 rounded-lg bg-[#005a8d]/10 text-[#005a8d] font-semibold"><Pencil className="w-3 h-3" /> Editar</button>
                <button onClick={() => remove(item.id)} className="text-xs px-3 py-1.5 rounded-lg bg-[#e31e24]/10 text-[#e31e24] font-semibold"><Trash2 className="w-3 h-3" /> Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
