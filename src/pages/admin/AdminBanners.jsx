import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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

  // ... (O restante da UI, Header, Loading, Field e Modal permanecem iguais)
  return (
    <div>
      <Header title="Banners da Home" onNew={() => setEditing({ ...EMPTY })} />
      {loading ? <Loading /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(b => (
            <div key={b.id} className="bg-white rounded-2xl border border-[#c5a059]/15 overflow-hidden">
              {/* ... conteúdo do card mantido, chamando as novas funções save/remove/toggleActive */}
              <div className="p-4">
                <h3 className="font-serif font-bold text-[#005a8d] truncate">{b.title}</h3>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setEditing({ ...b })} className="flex-1 text-xs font-semibold text-[#005a8d] bg-[#005a8d]/10 rounded-lg py-2">Editar</button>
                  <button onClick={() => toggleActive(b)} className="px-3 text-xs font-semibold text-[#c5a059] bg-[#c5a059]/10 rounded-lg">{b.active ? "Desativar" : "Ativar"}</button>
                  <button onClick={() => remove(b.id)} className="px-3 text-[#e31e24] bg-[#e31e24]/10 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* ... (Modal de edição mantido com a chamada de 'save') */}
    </div>
  );
}
