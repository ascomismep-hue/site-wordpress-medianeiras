import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Send, CheckCircle2, BookOpen, HeartHandshake } from "lucide-react";

export default function CausaDomCampelo() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Formulário de graças
  const [form, setForm] = useState({ nome_devoto: "", cidade_estado: "", relato: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchDomCampelo() {
      const { data } = await supabase.from("causa_dom_campelo").select("*").limit(1).single();
      if (data) setData(data);
      setLoading(false);
    }
    fetchDomCampelo();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("gracas_dom_campelo").insert([form]);
    setSubmitting(false);

    if (!error) {
      setSuccess(true);
      setForm({ nome_devoto: "", cidade_estado: "", relato: "" });
      setTimeout(() => setSuccess(false), 5000);
    } else {
      alert("Erro ao enviar o relato. Tente novamente.");
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>;

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#005a8d] mb-4">Causa Dom Campelo</h1>
        <div className="w-24 h-1 bg-[#c5a059] mx-auto rounded"></div>
      </div>

      {data?.foto_url && (
        <div className="mb-10 rounded-3xl overflow-hidden shadow-md max-w-md mx-auto h-80 bg-gray-100">
          <img src={data.foto_url} alt="Dom Campelo" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-6 h-6 text-[#005a8d]" />
            <h2 className="text-2xl font-serif font-bold text-[#005a8d]">História e Biografia</h2>
          </div>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{data?.historia_biografia}</p>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <HeartHandshake className="w-6 h-6 text-[#005a8d]" />
            <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Sobre a Causa</h2>
          </div>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{data?.sobre_a_causa}</p>
        </div>
      </div>

      {/* Formulário de Graças */}
      <div className="bg-[#002845] text-white p-8 sm:p-12 rounded-3xl shadow-lg">
        <h3 className="text-2xl font-serif font-bold text-[#c5a059] mb-2">Compartilhe sua Graça Alcançada</h3>
        <p className="text-white/80 text-sm mb-8">Recebeu uma graça por intercessão de Dom Campelo? Compartilhe seu testemunho conosco.</p>

        {success && (
          <div className="bg-emerald-800 text-emerald-100 p-4 rounded-xl mb-6 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0" /> Seu relato foi enviado com sucesso! Muito obrigado por compartilhar.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">Seu Nome</label>
              <input 
                type="text" 
                required
                value={form.nome_devoto}
                onChange={e => setForm({...form, nome_devoto: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#c5a059]"
                placeholder="Ex: Maria Aparecida"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">Cidade / Estado</label>
              <input 
                type="text" 
                required
                value={form.cidade_estado}
                onChange={e => setForm({...form, cidade_estado: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#c5a059]"
                placeholder="Ex: Salvador - BA"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Relato da Graça Alcançada</label>
            <textarea 
              rows="4" 
              required
              value={form.relato}
              onChange={e => setForm({...form, relato: e.target.value})}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#c5a059] font-sans"
              placeholder="Escreva como ocorreu a graça..."
            />
          </div>
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-[#c5a059] hover:bg-[#b08d4b] text-[#002845] font-bold px-8 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Enviar Testemunho
          </button>
        </form>
      </div>
    </div>
  );
}
