import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Save, Settings } from "lucide-react";

const KEYS = [
  { key: "endereco", label: "Endereço da Casa Mãe" },
  { key: "telefone", label: "Telefone" },
  { key: "email", label: "E-mail institucional" },
  { key: "instagram", label: "Instagram (URL)" },
  { key: "facebook", label: "Facebook (URL)" },
];

export default function AdminConfig() {
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadConfigs() {
      const { data } = await supabase.from('site_config').select('*');
      if (data) {
        const map = {};
        data.forEach(i => { map[i.key] = { value: i.value || "", id: i.id }; });
        setConfigs(map);
      }
      setLoading(false);
    }
    loadConfigs();
  }, []);

  const handleChange = (key, value) => {
    setConfigs(prev => ({ ...prev, [key]: { ...prev[key], value } }));
  };

  const saveAll = async () => {
    setSaving(true);
    for (const k of KEYS) {
      const val = configs[k.key]?.value || "";
      if (configs[k.key]?.id) {
        await supabase.from('site_config').update({ value: val }).eq('id', configs[k.key].id);
      } else {
        await supabase.from('site_config').insert([{ key: k.key, value: val }]);
      }
    }
    alert("Configurações salvas!");
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#c5a059]" /></div>;

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#005a8d] mb-1">Configurações Gerais</h1>
      <p className="text-gray-500 mb-8">Altere as informações de contato exibidas no site.</p>

      <div className="bg-white rounded-2xl border border-[#c5a059]/15 p-6 max-w-2xl">
        <div className="flex items-center gap-2 mb-5">
          <Settings className="w-5 h-5 text-[#c5a059]" />
          <h2 className="font-serif text-lg font-bold text-[#005a8d]">Informações de Contato</h2>
        </div>
        <div className="space-y-4">
          {KEYS.map(k => (
            <div key={k.key}>
              <label className="block text-sm font-semibold text-[#005a8d] mb-1.5">{k.label}</label>
              <input type="text" value={configs[k.key]?.value || ""} onChange={e => handleChange(k.key, e.target.value)} className="w-full rounded-xl border border-[#c5a059]/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005a8d]/40" />
            </div>
          ))}
        </div>
        <button onClick={saveAll} disabled={saving} className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full bg-[#e31e24] text-white font-semibold text-sm hover:bg-[#b3181e] disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar Configurações
        </button>
      </div>
    </div>
  );
}
