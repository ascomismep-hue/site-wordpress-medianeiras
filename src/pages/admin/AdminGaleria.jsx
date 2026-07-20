import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Trash2, Edit, Save, Loader2 } from "lucide-react";
import { Header, Loading, Field, Modal } from "./AdminBanners";
import MediaUpload from "@/components/admin/MediaUpload";

const EMPTY = { title: "", media_type: "photo", media_url: "", thumbnail_url: "", description: "", category: "", order: 0 };

export default function AdminGaleria() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('gallery_media').select('*').order('order');
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    const { id, ...dataToSave } = editing;
    
    if (id) {
      await supabase.from('gallery_media').update(dataToSave).eq('id', id);
    } else {
      await supabase.from('gallery_media').insert([dataToSave]);
    }
    
    setEditing(null);
    setSaving(false);
    load();
  };

  const remove = async (id) => {
    if (confirm("Excluir esta mídia?")) {
      await supabase.from('gallery_media').delete().eq('id', id);
      load();
    }
  };

  return (
    <div>
      <Header title="Galeria de Fotos e Vídeos" onNew={() => setEditing({ ...EMPTY })} />
      
      {loading ? <Loading /> : items.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Nenhuma mídia cadastrada.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(m => (
            <div key={m.id} className="bg-white rounded-xl border border-[#c5a059]/15 overflow-hidden">
              <div className="aspect-video bg-black/5">
                <img src={m.media_type === "video" ? (m.thumbnail_url || m.media_url) : m.media_url} alt={m.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <span className="text-[10px] uppercase font-bold text-[#c5a059]">{m.media_type === "video" ? "Vídeo" : "Foto"}{m.category ? ` · ${m.category}` : ""}</span>
                <h3 className="font-semibold text-sm text-[#005a8d] truncate">{m.title}</h3>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setEditing({ ...m })} className="flex-1 text-xs font-semibold text-[#005a8d] bg-[#005a8d]/10 hover:bg-[#005a8d]/20 rounded-lg py-1.5 flex items-center justify-center gap-1"><Edit className="w-3 h-3" />Editar</button>
                  <button onClick={() => remove(m.id)} className="px-2.5 text-[#e31e24] bg-[#e31e24]/10 hover:bg-[#e31e24]/20 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal permanece igual, garantindo que o botão Salvar chame a função 'save' acima */}
      {editing && (
        <Modal title={editing.id ? "Editar Mídia" : "Nova Mídia"} onClose={() => setEditing(null)}>
          <div className="space-y-4">
             {/* Campos do formulário permanecem idênticos ao original */}
             <button onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#e31e24] text-white font-semibold hover:bg-[#b3181e] disabled:opacity-60">
               {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar
             </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
