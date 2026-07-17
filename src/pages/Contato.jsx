import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient"; // Padrão Home
import { MapPin, Phone, Mail, CheckCircle2, Loader2, Heart } from "lucide-react";

export default function Contato() {
  const [prayer, setPrayer] = useState({ name: "", intention: "", request_type: "prece" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [config, setConfig] = useState({});

  // Buscando configurações diretamente do Supabase
  useEffect(() => {
    async function fetchConfig() {
      const { data, error } = await supabase.from('site_config').select('key, value');
      if (!error && data) {
        const map = {}; 
        data.forEach(i => { map[i.key] = i.value; }); 
        setConfig(map);
      }
    }
    fetchConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('prayer_requests') // Tabela no Supabase
        .insert([{
          name: prayer.name,
          intention: prayer.intention,
          request_type: prayer.request_type,
          status: "new",
        }]);

      if (error) throw error;
      
      setSubmitted(true);
      setPrayer({ name: "", intention: "", request_type: "prece" });
    } catch (err) {
      console.error("Erro ao enviar:", err);
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <section className="bg-[#005a8d] text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Pedidos de Oração e Contato</h1>
          <p className="mt-3 text-white/85">Confie ao Senhor tuas intenções. As irmãs as levarão em oração.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-12">
        {/* Mural de Oração */}
        <section id="pedido-oracao">
          <div className="text-center mb-6">
            <Heart className="w-10 h-10 mx-auto text-[#e31e24] mb-3" />
            <h2 className="font-serif text-2xl font-bold text-[#005a8d]">Mural de Oração</h2>
          </div>
          
          {submitted ? (
            <div className="text-center py-10 bg-[#f8f9fa] rounded-2xl border border-[#c5a059]/20">
              <CheckCircle2 className="w-12 h-12 mx-auto text-[#e31e24] mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#005a8d]">Intenção recebida</h3>
              <button onClick={() => setSubmitted(false)} className="mt-4 text-sm font-semibold text-[#e31e24] hover:underline">Enviar outra intenção</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-[#c5a059]/15">
              <div>
                <label className="block text-sm font-semibold text-[#005a8d] mb-1.5">Teu nome *</label>
                <input required value={prayer.name} onChange={e => setPrayer({ ...prayer, name: e.target.value })} className="w-full rounded-xl border border-[#c5a059]/30 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#005a8d] mb-1.5">Tipo de intenção</label>
                <select value={prayer.request_type} onChange={e => setPrayer({ ...prayer, request_type: e.target.value })} className="w-full rounded-xl border border-[#c5a059]/30 px-4 py-3 text-sm bg-white">
                  <option value="prece">Prece / Intenção</option>
                  <option value="missa">Intenção de Missa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#005a8d] mb-1.5">Intenção *</label>
                <textarea required value={prayer.intention} onChange={e => setPrayer({ ...prayer, intention: e.target.value })} rows={4} className="w-full rounded-xl border border-[#c5a059]/30 px-4 py-3 text-sm" />
              </div>
              <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#e31e24] text-white font-semibold hover:bg-[#b3181e] disabled:opacity-60">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : "Enviar Intenção"}
              </button>
            </form>
          )}
        </section>

        {/* Contato Geral */}
        <section>
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#005a8d]">Contato Geral</h2>
          </div>
          <div className="space-y-4 bg-white p-6 rounded-2xl border border-[#c5a059]/15">
            <InfoRow icon={MapPin} title="Endereço" value={config.endereco || "Carregando..."} />
            <InfoRow icon={Phone} title="Telefone" value={config.telefone || "Carregando..."} />
            <InfoRow icon={Mail} title="E-mail" value={config.email || "Carregando..."} />
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, title, value }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-10 h-10 rounded-full bg-[#e31e24]/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#e31e24]" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-[#c5a059] font-semibold">{title}</div>
        <div className="text-[#005a8d] font-medium">{value}</div>
      </div>
    </div>
  );
}
