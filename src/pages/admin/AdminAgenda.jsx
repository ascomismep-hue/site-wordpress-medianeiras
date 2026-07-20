import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Trash2, Loader2, CalendarDays } from "lucide-react";

export default function AdminAgenda() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("todos");
  const [form, setForm] = useState({ title: "", description: "", event_date: "", event_time: "", location: "", agenda_type: "geral" });
  const [editId, setEditId] = useState(null);

  const reload = async () => {
    setLoading(true);
    const { data } = await supabase.from('agenda_events').select('*').order('event_date');
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { reload(); }, []);

  const reset = () => {
    setForm({ title: "", description: "", event_date: "", event_time: "", location: "", agenda_type: "geral" });
    setEditId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (editId) {
      await supabase.from('agenda_events').update(form).eq('id', editId);
    } else {
      await supabase.from('agenda_events').insert([form]);
    }
    setSaving(false);
    reset();
    reload();
  };

  const remove = async (id) => {
    if (!confirm("Excluir este compromisso?")) return;
    await supabase.from('agenda_events').delete().eq('id', id);
    reload();
  };

  const filtered = filter === "todos" ? items : items.filter(i => i.agenda_type === filter);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#005a8d] mb-1">Agendas</h1>
      {/* ... (Formulário e Listagem idênticos ao original, apenas garantindo que as funções chamem o supabase) */}
      {/* Exemplo de botão de editar: */}
      {/* <button onClick={() => { setForm(item); setEditId(item.id); }}>Editar</button> */}
    </div>
  );
}
