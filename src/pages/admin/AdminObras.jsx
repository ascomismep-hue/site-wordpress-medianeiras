import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Trash2, Loader2, MapPin } from "lucide-react";

export default function AdminObras() {
  const [tab, setTab] = useState("obras");
  const [works, setWorks] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workForm, setWorkForm] = useState({ title: "", description: "", order: 0 });
  const [commForm, setCommForm] = useState({ name: "", city: "", state: "", country: "Brasil" });
  const [editWorkId, setEditWorkId] = useState(null);

  const reload = async () => {
    setLoading(true);
    const [{ data: w }, { data: c }] = await Promise.all([
      supabase.from("social_works").select("*").order("order"),
      supabase.from("communities").select("*")
    ]);
    setWorks(w || []);
    setCommunities(c || []);
    setLoading(false);
  };

  useEffect(() => { reload(); }, []);

  const submitWork = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (editWorkId) await supabase.from("social_works").update(workForm).eq("id", editWorkId);
    else await supabase.from("social_works").insert([workForm]);
    setEditWorkId(null);
    setWorkForm({ title: "", description: "", order: 0 });
    reload();
    setSaving(false);
  };

  const submitComm = async (e) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from("communities").insert([commForm]);
    setCommForm({ name: "", city: "", state: "", country: "Brasil" });
    reload();
    setSaving(false);
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#005a8d] mb-8">Obras e Comunidades</h1>
      
      <div className="flex gap-2 mb-6">
        {[{ id: "obras", label: "Obras" }, { id: "comunidades", label: "Comunidades" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-5 py-2 rounded-full text-sm font-semibold ${tab === t.id ? "bg-[#005a8d] text-white" : "bg-white border"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "obras" ? (
        <form onSubmit={submitWork} className="bg-white p-6 rounded-2xl border mb-6">
          <input className="w-full mb-3 p-2 border rounded" placeholder="Título da Obra" value={workForm.title} onChange={e => setWorkForm({...workForm, title: e.target.value})} />
          <button className="bg-[#e31e24] text-white px-6 py-2 rounded-full text-sm">Salvar Obra</button>
        </form>
      ) : (
        <form onSubmit={submitComm} className="bg-white p-6 rounded-2xl border mb-6">
          <input className="w-full mb-3 p-2 border rounded" placeholder="Nome da Comunidade" value={commForm.name} onChange={e => setCommForm({...commForm, name: e.target.value})} />
          <button className="bg-[#e31e24] text-white px-6 py-2 rounded-full text-sm">Salvar Comunidade</button>
        </form>
      )}

      <div className="space-y-2">
        {(tab === "obras" ? works : communities).map(item => (
          <div key={item.id} className="p-4 bg-white border rounded-lg flex justify-between">
            {item.title || item.name}
            <button onClick={() => tab === "obras" ? supabase.from("social_works").delete().eq("id", item.id).then(reload) : supabase.from("communities").delete().eq("id", item.id).then(reload)} className="text-red-500">Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}
