import { useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Heart, Sparkles, CheckCircle2, Send, Users, Flame, BookOpen, Compass, ShieldCheck, Loader2 } from "lucide-react";

export default function Vocacional() {
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erroSexo, setErroSexo] = useState("");

  const [form, setForm] = useState({
    nome: "",
    idade: "",
    cidade_estado: "",
    telefone: "",
    email: "",
    sexo: "", // Usado para garantir que apenas meninas preencham
    testemunho: ""
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setErroSexo("");

    // Validação restrita apenas para o público feminino
    if (form.sexo.toLowerCase() !== "feminino") {
      setErroSexo("O Instituto Religioso das Medianeiras da Paz é uma congregação religiosa feminina. O processo vocacional destina-se exclusivamente a candidatas do sexo feminino.");
      return;
    }

    setCarregando(true);

    try {
      // Salva os dados do discernimento vocacional no Supabase (vamos criar a tabela abaixo)
      const { error } = await supabase.from("inscricoes_vocacionais").insert([
        {
          nome: form.nome,
          idade: form.idade,
          cidade_estado: form.cidade_estado,
          telefone: form.telefone,
          email: form.email,
          testemunho: form.testemunho
        }
      ]);

      if (!error) {
        setEnviado(true);
        setForm({ nome: "", idade: "", cidade_estado: "", telefone: "", email: "", sexo: "", testemunho: "" });
      } else {
        alert("Erro ao enviar formulário. Tente novamente mais tarde.");
      }
    } catch (err) {
      console.error("Erro:", err);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfbf9] pb-24">
      {/* Hero Section Jovem e Inspiradora */}
      <section className="relative bg-gradient-to-br from-[#005a8d] via-[#004068] to-[#002845] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#e31e24]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-[#c5a059] backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#c5a059]" /> Caminho Vocacional IRIMEP
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Venha ser <span className="text-[#c5a059]">Medianeira</span> da Paz!
            </h1>

            <p className="text-lg text-white/90 leading-relaxed font-light">
              "Não tenhais medo!" Sente que Deus te chama para algo maior? Descubra a alegria de entregar sua vida, sua juventude e seus sonhos ao serviço do Reino de Deus.
            </p>

            <div className="pt-2">
              <a 
                href="#formulario" 
                className="bg-[#e31e24] hover:bg-[#c9181d] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-red-600/30 inline-flex items-center gap-2"
              >
                Quero fazer parte <Flame className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Destaque Visual Jovem */}
          <div className="bg-white/10 border border-white/20 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative text-center space-y-4">
            <div className="w-20 h-20 bg-[#c5a059]/20 text-[#c5a059] rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Compass className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">O Chamado</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              "Antes que no ventre te formasses, eu te conheci; antes que saísses do seio, eu te consagrei." (Jeremias 1:5)
            </p>
          </div>
        </div>
      </section>

      {/* Seção: Como Funciona o Vocacional e Espiritualidade */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#005a8d]">Como Funciona o Caminho Vocacional?</h2>
          <div className="w-24 h-1 bg-[#c5a059] mx-auto rounded-full"></div>
          <p className="text-gray-600">Um itinerário de escuta, discernimento e aprofundamento na espiritualidade da paz e do serviço.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4 hover:border-[#c5a059] transition-all">
            <div className="w-14 h-14 bg-blue-50 text-[#005a8d] rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs">
              1
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#005a8d]">O Primeiro Contato</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Você preenche o formulário de discernimento abaixo. A partir daí, nossa equipe vocacional entrará em contato para iniciar um acompanhamento online ou presencial.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4 hover:border-[#c5a059] transition-all">
            <div className="w-14 h-14 bg-amber-50 text-[#c5a059] rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs">
              2
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#005a8d]">Encontros e Retiros</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Participação em encontros vocacionais periódicos, vivência comunitária temporária e retiros espirituais voltados para a escuta da vontade de Deus.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4 hover:border-[#c5a059] transition-all">
            <div className="w-14 h-14 bg-red-50 text-[#e31e24] rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs">
              3
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#005a8d]">A Formação</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Ingresso nas etapas formativas (Aspirantado e Postulado), aprofundando os votos religiosos, a vida de oração e o carisma de amor ao próximo.
            </p>
          </div>
        </div>
      </section>

      {/* Formulário de Inscrição Vocacional Exclusivo para Meninas */}
      <section id="formulario" className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Dê o Primeiro Passo</span>
            <h2 className="text-3xl font-serif font-bold text-[#005a8d]">Formulário de Acompanhamento Vocacional</h2>
            <p className="text-gray-600 text-sm">Preencha seus dados para conversarmos sobre o seu chamado.</p>
          </div>

          {enviado ? (
            <div className="bg-emerald-50 text-emerald-800 p-8 rounded-3xl text-center space-y-3 border border-emerald-100">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-2xl font-bold">Inscrição Enviada com Sucesso!</h3>
              <p className="text-sm text-emerald-700 max-w-md mx-auto">
                Agradecemos sua coragem e abertura de coração. Entraremos em contato em breve para iniciar seu acompanhamento vocacional.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {erroSexo && (
                <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-medium border border-red-100">
                  {erroSexo}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nome Completo</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Seu nome..." 
                    value={form.nome} 
                    onChange={e => setForm({...form, nome: e.target.value})} 
                    className="w-full p-3.5 rounded-2xl border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:border-[#005a8d]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Idade</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="Sua idade..." 
                    value={form.idade} 
                    onChange={e => setForm({...form, idade: e.target.value})} 
                    className="w-full p-3.5 rounded-2xl border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:border-[#005a8d]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Cidade / Estado</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ex: Araripina - PE" 
                    value={form.cidade_estado} 
                    onChange={e => setForm({...form, cidade_estado: e.target.value})} 
                    className="w-full p-3.5 rounded-2xl border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:border-[#005a8d]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="(00) 00000-0000" 
                    value={form.telefone} 
                    onChange={e => setForm({...form, telefone: e.target.value})} 
                    className="w-full p-3.5 rounded-2xl border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:border-[#005a8d]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">E-mail</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="seuemail@exemplo.com" 
                    value={form.email} 
                    onChange={e => setForm({...form, email: e.target.value})} 
                    className="w-full p-3.5 rounded-2xl border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:border-[#005a8d]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Sexo (Validação)</label>
                  <select 
                    required 
                    value={form.sexo} 
                    onChange={e => setForm({...form, sexo: e.target.value})} 
                    className="w-full p-3.5 rounded-2xl border border-gray-300 bg-gray-50 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#005a8d]"
                  >
                    <option value="">Selecione...</option>
                    <option value="feminino">Feminino</option>
                    <option value="masculino">Masculino</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Fale um pouco sobre sua caminhada e desejo vocacional</label>
                <textarea 
                  rows="4" 
                  required 
                  placeholder="Como sentiu o chamado? Participa de alguma paróquia ou movimento?" 
                  value={form.testemunho} 
                  onChange={e => setForm({...form, testemunho: e.target.value})} 
                  className="w-full p-3.5 rounded-2xl border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:border-[#005a8d]" 
                />
              </div>

              <button 
                type="submit" 
                disabled={carregando}
                className="w-full bg-[#005a8d] hover:bg-[#004068] text-white font-bold py-4 rounded-2xl transition-all shadow-md text-sm flex items-center justify-center gap-2"
              >
                {carregando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                {carregando ? "Enviando..." : "Enviar Inscrição Vocacional"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
