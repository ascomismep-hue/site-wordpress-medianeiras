import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Plus, Trash2, Edit, Save, Loader2 } from "lucide-react";
import { Header, Loading, Field, Modal } from "@/pages/admin/AdminBanners";
import MediaUpload from "@/components/admin/MediaUpload";

const EMPTY = { name: "", house_name: "", role: "", photo_url: "", phone: "", email: "", birth_date: "", entrance_date: "", first_vows_date: "", perpetual_vows_date: "", bio: "", order: 0 };

export default function AdminIrmas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('sisters').select('*').order('order');
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    const { id, ...dataToSave } = editing;
    
    if (id) {
      await supabase.from('sisters').update(dataToSave).eq('id', id);
    } else {
      await supabase.from('sisters').insert([dataToSave]);
    }
    
    setEditing(null);
    setSaving(false);
    load();
  };

  const remove = async (id) => {
    if (confirm("Excluir esta irmã?")) {
      await supabase.from('sisters').delete().eq('id', id);
      load();
    }
  };

  return (
    <div>
      <Header title="Irmãs (Anuário)" onNew={() => setEditing({ ...EMPTY })} />
      
      {loading ? <Loading /> : items.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Nenhuma irmã cadastrada.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(s => (
            <div key={s.id} className="flex gap-3 bg-white rounded-xl border border-[#c5a059]/15 p-4">
              {s.photo_url ? (
                <img src={s.photo_url} alt={s.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-[#c5a059]/25 shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#005a8d]/10 flex items-center justify-center font-serif text-lg font-bold text-[#005a8d] shrink-0">{s.name.charAt(0)}</div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-[#005a8d] truncate">{s.name}</h3>
                {s.role && <span className="text-[10px] uppercase font-bold text-[#e31e24]">{s.role}</span>}
                <p className="text-xs text-gray-500 truncate">{s.house_name || "Sem casa"}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setEditing({ ...s })} className="text-xs font-semibold text-[#005a8d] bg-[#005a8d]/10 hover:bg-[#005a8d]/20 rounded-lg px-2.5 py-1 flex items-center gap-1"><Edit className="w-3 h-3" />Editar</button>
                  <button onClick={() => remove(s.id)} className="text-[#e31e24] bg-[#e31e24]/10 hover:bg-[#e31e24]/20 rounded-lg px-2 py-1"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? "Editar Irmã" : "Nova Irmã"} onClose={() => setEditing(null)}>
          <div className="space-y-3">
            <Field label="Nome completo" value={editing.name} onChange={v => setEditing({ ...editing, name: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Casa / Comunidade" value={editing.house_name} onChange={v => setEditing({ ...editing, house_name: v })} />
              <Field label="Cargo (ex.: Madre Superiora)" value={editing.role} onChange={v => setEditing({ ...editing, role: v })} />
            </div>
            <MediaUpload label="Foto de perfil" kind="image" value={editing.photo_url} onChange={v => setEditing({ ...editing, photo_url: v })} hint="600 × 600 px (quadrada)" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Telefone / WhatsApp" value={editing.phone} onChange={v => setEditing({ ...editing, phone: v })} />
              <Field label="E-mail" value={editing.email} onChange={v => setEditing({ ...editing, email: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Data de nascimento" type="date" value={editing.birth_date} onChange={v => setEditing({ ...editing, birth_date: v })} />
              <Field label="Data de entrada" type="date" value={editing.entrance_date} onChange={v => setEditing({ ...editing, entrance_date: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Primeiros votos" type="date" value={editing.first_vows_date} onChange={v => setEditing({ ...editing, first_vows_date: v })} />
              <Field label="Votos perpétuos" type="date" value={editing.perpetual_vows_date} onChange={v => setEditing({ ...editing, perpetual_vows_date: v })} />
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
