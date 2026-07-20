import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Heart, CheckCircle2, Loader2 } from "lucide-react";

const ETAPAS = [
  { titulo: "Discernimento", desc: "Encontros vocacionais e acompanhamento espiritual para descobrir o chamado." },
  { titulo: "Aspirantado", desc: "Primeira etapa de formação, iniciando a vida comunitária e a oração." },
  { titulo: "Postulantado", desc: "Aprofundamento da identidade carismática e da vida fraterna." },
  { titulo: "Noviciado", desc: "Tempo forte de formação espiritual e preparação para os votos." },
  { titulo: "Profissão", desc: "Consagração definitiva pelos votos de castidade, pobreza e obediência." },
];

export default function Vocacional() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", age: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Inserção direta no Supabase
    const { error } = await supabase.from('vocation_forms').insert([
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        age: form.age ? parseInt(form.age) : null,
        message: form.message,
        status: 'new'
      }
    ]);

    if (error) {
      alert("Ocorreu um erro ao enviar. Tente novamente.");
    } else {
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", city: "", age: "", message: "" });
    }
    setSubmitting(false);
  };

  return (
    <div>
      <section className="bg-[#e31e24] text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <Heart className="w-10 h-10 mx-auto text-[#c5a059] mb-4" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Vocacional</h1>
          <p className="mt-3 text-white/85">Venha ser uma Medianeira da Paz. Descubra se Deus te chama a esta vida de consagração.</p>
        </div>
      </section>

      {/* Formulário */}
      <section id="formulario" className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#005a8d]">Venha Ser uma Medianeira da Paz</h2>
            <p className="mt-2 text-gray-600">Preencha o formulário e entraremos em contato.</p>
          </div>
          
          {submitted ? (
            <div className="text-center py-12 bg-[#f8f9fa] rounded-2xl border border-[#c5a059]/20">
              <CheckCircle2 className="w-14 h-14 mx-auto text-[#e31e24] mb-4" />
              <h3 className="font-serif text-xl font-bold text-[#005a8d]">Recebemos teu pedido!</h3>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">Nossa equipe vocacional entrará em contato em breve.</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 text-sm font-semibold text-[#e31e24] hover:underline">Enviar outro formulário</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 bg-[#f8f9fa] p-6 sm:p-8 rounded-2xl border border-[#c5a059]/15">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Nome completo *" required value={form.name} onChange={v => setForm({ ...form, name: v })} />
                <Field label="E-mail *" type="email" required value={form.email} onChange={v => setForm({ ...form, email: v })} />
                <Field label="Telefone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
                <Field label="Cidade" value={form.city} onChange={v => setForm({ ...form, city: v })} />
                <Field label="Idade" type="number" value={form.age} onChange={v => setForm({ ...form, age: v })} />
              </div>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} className="w-full rounded-xl border border-[#c5a059]/30 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005a8d]/40" placeholder="Conta-nos um pouco sobre ti..." />
              <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#e31e24] text-white font-semibold hover:bg-[#b3181e] transition-colors disabled:opacity-60">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : "Enviar Pedido Vocacional"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#005a8d] mb-1.5">{label}</label>
      <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-xl border border-[#c5a059]/30 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005a8d]/40" />
    </div>
  );
}
