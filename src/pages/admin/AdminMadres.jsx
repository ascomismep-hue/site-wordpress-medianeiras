import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Trash2, Edit, Save, Loader2 } from "lucide-react";
import { Header, Loading, Field, Modal } from "./AdminBanners";
import MediaUpload from "@/components/admin/MediaUpload";

const EMPTY = { name: "", photo_url: "", start_year: "", end_year: "", bio: "", order: 0 };

export default function AdminMadres() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('mothers').select('*').order('order');
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    // Formata dados para garantir que anos sejam números ou null
    const dataToSave = { 
        ...editing, 
        start_year: editing.start_year ? Number(editing.start_year) : null, 
        end_year: editing.end_year ? Number(editing.end_year) : null 
    };
    
    // Removemos o ID antes de enviar para o update/insert
    const { id, ...dataClean } = dataToSave;

    if (id) {
        await supabase.from('mothers').update(dataClean).eq('id', id);
    } else {
        await supabase.from('mothers').insert([dataClean]);
    }
    
    setEditing(null);
    setSaving(false);
    load();
  };

  const remove = async (id) => {
    if (confirm("Excluir esta madre?")) {
      await supabase.from('mothers').delete().eq('id', id);
      load();
    }
  };

  return (
    <div>
      <Header title="Galeria das Madres" onNew={() => setEditing({ ...EMPTY })} />
      
      {loading ? <Loading /> : items.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Nenhuma madre cadastrada.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(m => (
            <div key={m.id} className="bg-white rounded-xl border border-[#c5a059]/15 p-4 text-center">
              {m.photo_url ? (
                <img src={m.photo_url} alt={m.name} className="w-20 h-20 rounded-full object-cover mx-auto ring-2 ring-[#c5a059]/25" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#005a8d]/10 flex items-center justify-center font-serif text-2xl font-bold text-[#005a8d] mx-auto">{m.name.charAt(0)}</div>
              )}
              <h3 className="font-serif font-bold text-[#005a8d] mt-3 text-sm truncate">{m.name}</h3>
              <p className="text-xs text-[#c5a059] font-semibold">{m.start_year}{!m.end_year ? " — Atual" : ` — ${m.end_year}`}</p>
              <div className="flex gap-2 mt-3 justify-center">
                <button onClick={() => setEditing({ ...m, start_year: String(m.start_year || ""), end_year: String(m.end_year || "") })} className="text-xs font-semibold text-[#005a8d] bg-[#005a8d]/10 hover:bg-[#005a8d]/20 rounded-lg px-2.5 py-1 flex items-center gap-1"><Edit className="w-3 h-3" />Editar</button>
                <button onClick={() => remove(m.id)} className="text-[#e31e24] bg-[#e31e24]/10 hover:bg-[#e31e24]/20 rounded-lg px-2 py-1"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? "Editar Madre" : "Nova Madre"} onClose={() => setEditing(null)}>
          <div className="space-y-3">
            <Field label="Nome" value={editing.name} onChange={v => setEditing({ ...editing, name: v })} />
            <MediaUpload label="Foto da Madre" kind="image" value={editing.photo_url} onChange={v => setEditing({ ...editing, photo_url: v })} hint="600 × 600 px (quadrada)" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ano inicial" type="number" value={String(editing.start_year || "")} onChange={v => setEditing({ ...editing, start_year: v })} />
              <Field label="Ano final (vazio = atual)" type="number" value={String(editing.end_year || "")} onChange={v => setEditing({ ...editing, end_year: v })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#005a8d] mb-1">Biografia</label>
              <textarea value={editing.bio || ""} onChange={e => setEditing({ ...editing, bio: e.target.value })} rows={3} className="w-full rounded-lg border border-[#c5a059]/30 bg-white px-3 py-2 text-sm" />
            </div>
            <button onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#e31e24] text-white font-semibold hover:bg-[#b3181e] disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
