import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Plus, Trash2, Edit, Save, X, Loader2, Image as ImageIcon, Video } from "lucide-react";
import MediaUpload from "@/components/admin/MediaUpload";

const EMPTY = { title: "", subtitle: "", image_url: "", video_url: "", link_label: "", link_url: "", active: true, order: 0 };

export default function AdminBanners() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('banners').select('*').order('order');
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    const { id, ...dataToSave } = editing;
    
    if (id) {
      await supabase.from('banners').update(dataToSave).eq('id', id);
    } else {
      await supabase.from('banners').insert([dataToSave]);
    }
    
    setEditing(null);
    setSaving(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Excluir este banner?")) return;
    await supabase.from('banners').delete().eq('id', id);
    load();
  };

  const toggleActive = async (b) => {
    await supabase.from('banners').update({ active: !b.active }).eq('id', b.id);
    load();
  };

  return (
    <div>
      <Header title="Banners da Home" onNew={() => setEditing({ ...EMPTY })} />
      {loading ? <Loading /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(b => (
            <div key={b.id} className="bg-white rounded-2xl border border-[#c5a059]/15 overflow-hidden">
              <div className="relative aspect-video bg-black/5">
                {b.video_url ? (
                  <video src={b.video_url} className="w-full h-full object-cover" muted />
                ) : b.image_url ? (
                  <img src={b.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-10 h-10" /></div>
                )}
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${b.active ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                  {b.active ? "Ativo" : "Inativo"}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-serif font-bold text-[#005a8d] truncate">{b.title}</h3>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setEditing({ ...b })} className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold text-[#005a8d] bg-[#005a8d]/10 hover:bg-[#005a8d]/20 rounded-lg py-2"><Edit className="w-3.5 h-3.5" />Editar</button>
                  <button onClick={() => toggleActive(b)} className="px-3 text-xs font-semibold text-[#c5a059] bg-[#c5a059]/10 hover:bg-[#c5a059]/20 rounded-lg">{b.active ? "Desativar" : "Ativar"}</button>
                  <button onClick={() => remove(b.id)} className="px-3 text-[#e31e24] bg-[#e31e24]/10 hover:bg-[#e31e24]/20 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
          {!loading && items.length === 0 && <p className="col-span-full text-center text-gray-500 py-10">Nenhum banner cadastrado.</p>}
        </div>
      )}

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Editar Banner" : "Novo Banner"}>
          <div className="space-y-4">
            <Field label="Título" value={editing.title} onChange={v => setEditing({ ...editing, title: v })} />
            <Field label="Subtítulo" value={editing.subtitle} onChange={v => setEditing({ ...editing, subtitle: v })} />
            <MediaUpload label="Imagem" kind="image" value={editing.image_url} onChange={v => setEditing({ ...editing, image_url: v })} />
            <MediaUpload label="Vídeo" kind="video" value={editing.video_url} onChange={v => setEditing({ ...editing, video_url: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Texto do botão" value={editing.link_label} onChange={v => setEditing({ ...editing, link_label: v })} />
              <Field label="Link" value={editing.link_url} onChange={v => setEditing({ ...editing, link_url: v })} />
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

// Exportações auxiliares mantidas para compatibilidade com outros arquivos
export function Header({ title, onNew }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="font-serif text-2xl font-bold text-[#005a8d]">{title}</h1>
      {onNew && <button onClick={onNew} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#005a8d] text-white text-sm font-semibold hover:bg-[#4478a8]"><Plus className="w-4 h-4" />Novo</button>}
    </div>
  );
}

export function Loading() { return <div className="flex justify-center py-12"><Loader2 className="w-7 h-7 text-[#005a8d] animate-spin" /></div>; }

export function Field({ label, type = "text", value, onChange }) {
  return (<div><label className="block text-sm font-semibold text-[#005a8d] mb-1">{label}</label><input type={type} value={value || ""} onChange={e => onChange(e.target.value)} className="w-full rounded-lg border border-[#c5a059]/30 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005a8d]/30" /></div>);
}

export function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[#c5a059]/15 sticky top-0 bg-white">
          <h2 className="font-serif font-bold text-[#005a8d]">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
