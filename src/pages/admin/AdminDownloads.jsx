import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Plus, Trash2, Edit, Save, Loader2 } from "lucide-react";
import { Header, Loading, Field, Modal } from "@/pages/admin/AdminBanners";
import MediaUpload from "@/components/admin/MediaUpload";

const EMPTY = { title: "", description: "", file_url: "", file_type: "", category: "", order: 0 };

export default function AdminDownloads() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('download_files').select('*').order('order');
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    const { id, ...dataToSave } = editing;
    
    if (id) {
      await supabase.from('download_files').update(dataToSave).eq('id', id);
    } else {
      await supabase.from('download_files').insert([dataToSave]);
    }
    
    setEditing(null);
    setSaving(false);
    load();
  };

  const remove = async (id) => {
    if (confirm("Excluir este arquivo?")) {
      await supabase.from('download_files').delete().eq('id', id);
      load();
    }
  };

  return (
    <div>
      <Header title="Arquivos para Download" onNew={() => setEditing({ ...EMPTY })} />
      
      {loading ? <Loading /> : items.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Nenhum arquivo cadastrado.</p>
      ) : (
        <div className="space-y-3">
          {items.map(f => (
            <div key={f.id} className="flex items-center gap-4 bg-white rounded-xl border border-[#c5a059]/15 p-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-[#005a8d] truncate">{f.title}</h3>
                {f.description && <p className="text-xs text-gray-500 truncate">{f.description}</p>}
                <p className="text-[10px] text-gray-400 mt-0.5">{f.category || "Sem categoria"}{f.file_type ? ` · ${f.file_type}` : ""}</p>
              </div>
              <button onClick={() => setEditing({ ...f })} className="text-xs font-semibold text-[#005a8d] bg-[#005a8d]/10 hover:bg-[#005a8d]/20 rounded-lg px-3 py-1.5 flex items-center gap-1"><Edit className="w-3 h-3" />Editar</button>
              <button onClick={() => remove(f.id)} className="text-[#e31e24] bg-[#e31e24]/10 hover:bg-[#e31e24]/20 rounded-lg px-2.5 py-1.5"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Edição */}
      {editing && (
        <Modal title={editing.id ? "Editar Arquivo" : "Novo Arquivo"} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <Field label="Título" value={editing.title} onChange={v => setEditing({ ...editing, title: v })} />
            <div>
              <label className="block text-sm font-semibold text-[#005a8d] mb-1">Descrição</label>
              <textarea value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={2} className="w-full rounded-lg border border-[#c5a059]/30 bg-white px-3 py-2 text-sm" />
            </div>
            <MediaUpload label="Arquivo para download" kind="file" value={editing.file_url} onChange={v => setEditing({ ...editing, file_url: v, file_type: (v.split(".").pop() || "").toUpperCase() })} />
            <Field label="Tipo/extensão (ex.: PDF)" value={editing.file_type} onChange={v => setEditing({ ...editing, file_type: v })} />
            <Field label="Categoria" value={editing.category} onChange={v => setEditing({ ...editing, category: v })} />
            <Field label="Ordem" type="number" value={String(editing.order)} onChange={v => setEditing({ ...editing, order: Number(v) })} />
            <button onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#e31e24] text-white font-semibold hover:bg-[#b3181e] disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
