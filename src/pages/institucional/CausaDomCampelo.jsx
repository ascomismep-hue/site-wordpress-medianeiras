import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Church, Heart, Send, CheckCircle2, BookOpen } from "lucide-react";

export default function CausaDomCampelo() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Formulário de Graças
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [relato, setRelato] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    async function fetchDomCampelo() {
      const { data } = await supabase.from("causa_dom_campelo").select("*").limit(1).single();
      if (data) setData(data);
      setLoading(false);
    }
    fetchDomCampelo();
  }, []);

  async function handleSubmitGraça(e) {
    e.preventDefault();
    if (!nome || !telefone || !relato) {
      alert("Por favor, preencha o Nome, o Telefone e o Relato.");
      return;
    }

    setEnviando(true);
    const { error } = await supabase.from("gracas_dom_campelo").insert([
      { 
        nome_devoto: nome, 
        telefone: telefone, 
        cidade_estado: cidade, 
        relato: relato 
      }
    ]);

    setEnviando(false);
    if (!error) {
      setSucesso(true);
      setNome("");
      setTelefone("");
      setCidade("");
      setRelato("");
      setTimeout(() => setSucesso(false), 5000);
    } else {
      alert("Erro ao enviar testemunho. Tente novamente.");
    }
  }

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>;

  return (
    <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6">
      
      {/* Cabeçalho da Página */}
      <div className="text-center mb-14">
        <span className="text-xs font-bold uppercase tracking-widest text-[#c5a059] bg-[#c5a059]/10 px-3.5 py-1.5 rounded-full">Processo de Beatificação</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#005a8d] mt-3 mb-3">Causa Dom Campelo</h1>
        <div className="w-24 h-1 bg-[#c5a059] mx-auto rounded"></div>
      </div>

      {/* Foto em Destaque com Moldura Elegante */}
      {data?.foto_url && (
        <div className="flex justify-center mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#c5a059] to-[#005a8d] rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
              <img src={data.foto_url} alt="Dom Antônio Campelo de Aragão" className="w-full h-full object-cover object-top" />
            </div>
          </div>
        </div>
      )}

      {/* Seção: História e Biografia & Sobre a Causa */}
      <div className="space-y-10 mb-20">
        
        {/* História e Biografia */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#005a8d]/5 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#005a8d]/10 text-[#005a8d] rounded-2xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#005a8d]">História e Biografia</h2>
          </div>
          <p className="whitespace-pre-line text-gray-700 text-lg leading-relaxed text-justify">
            {data?.historia_biografia || "Informações biográficas em breve."}
          </p>
        </div>

        {/* Sobre a Causa */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/10 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#c5a059]/10 text-[#c5a059] rounded-2xl">
              <Church className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Sobre a Causa</h2>
          </div>
          <p className="whitespace-pre-line text-gray-700 text-lg leading-relaxed text-justify">
            {data?.sobre_a_causa || "Detalhes sobre a causa em breve."}
          </p>
        </div>

      </div>

      {/* Seção: Compartilhe sua Graça Alcançada */}
      <div className="bg-[#002845] text-white p-8 sm:p-14 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#c5a059]/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2.5 text-[#c5a059] font-medium text-sm mb-2 uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-current" /> Testemunho de Fé
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">Compartilhe sua Graça Alcançada</h3>
          <p className="text-white/80 text-sm mb-8 leading-relaxed">
            Recebeu uma graça por intercessão de Dom Campelo? Compartilhe seu testemunho conosco para honra e glória de Deus.
          </p>

          {sucesso && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 p-4 rounded-2xl mb-6 flex items-center gap-3 font-medium text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" /> Testemunho enviado com sucesso! Muito obrigado por compartilhar sua fé.
            </div>
          )}

          <form onSubmit={handleSubmitGraça} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Seu Nome *</label>
                <input 
                  type="text" 
                  placeholder="Ex: Maria Aparecida" 
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Telefone / WhatsApp *</label>
                <input 
                  type="text" 
                  placeholder="Ex: (71) 99999-9999" 
                  value={telefone}
                  onChange={e => setTelefone(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Cidade / Estado</label>
              <input 
                type="text" 
                placeholder="Ex: Salvador - BA" 
                value={cidade}
                onChange={e => setCidade(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Relato da Graça Alcançada *</label>
              <textarea 
                rows="4" 
                placeholder="Escreva como ocorreu a graça..." 
                value={relato}
                onChange={e => setRelato(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white placeholder-white/40 focus:outline-none focus:border-[#c5a059] transition-colors text-sm font-sans"
              />
            </div>

            <button 
              type="submit" 
              disabled={enviando}
              className="bg-[#c5a059] hover:bg-[#b08d4b] text-[#002845] font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 text-sm tracking-wide"
            >
              {enviando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Enviar Testemunho</span>
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
