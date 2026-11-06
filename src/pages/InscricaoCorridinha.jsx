import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Calendar, MapPin, Clock, CheckCircle2, Loader2, ArrowLeft, Heart, Phone } from "lucide-react";

export default function InscricaoCorridinha() {
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  const [formData, setFormData] = useState({
    nome_crianca: "",
    data_nascimento: "",
    nome_responsavel: "",
    whatsapp: "",
    forma_participacao: "Caminhando ou correndo",
    outro_meio: "",
    acessibilidade: "",
    declaracao: false
  });

  // Prazo limite de inscrição: 17 de novembro de 2026
  const dataLimite = new Date("2026-11-17T23:59:59");
  const hoje = new Date();
  const inscricoesEncerradas = hoje > dataLimite;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.declaracao) {
      setErro("Deve confirmar a declaração de responsabilidade para prosseguir.");
      return;
    }

    setLoading(true);
    setErro("");

    try {
      const { error } = await supabase.from("inscricoes_corridinha").insert([
        {
          nome_crianca: formData.nome_crianca,
          data_nascimento: formData.data_nascimento,
          nome_responsavel: formData.nome_responsavel,
          whatsapp: formData.whatsapp,
          forma_participacao: formData.forma_participacao === "Outro meio" ? `Outro: ${formData.outro_meio}` : formData.forma_participacao,
          acessibilidade: formData.acessibilidade,
          declaracao_aceita: formData.declaracao
        }
      ]);

      if (error) throw error;
      setSucesso(true);
    } catch (err) {
      console.error("Erro ao realizar inscrição:", err);
      setErro("Ocorreu um erro ao enviar a sua inscrição. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Botão Voltar */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#005a8d] hover:text-[#c5a059] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar para a Página Inicial
          </Link>
        </div>

        {/* Cabeçalho do Evento */}
        <div className="bg-gradient-to-r from-purple-900 via-[#002845] to-purple-950 text-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl text-center relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Heart className="w-40 h-40 text-white" />
          </div>
          
          <span className="text-xs font-bold uppercase tracking-widest bg-purple-500/30 text-amber-200 px-4 py-1.5 rounded-full border border-white/20 inline-block mb-4">
            Novembro Roxo • Mês da Sensibilização da Prematuridade
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-4">I Corridinha da Prematuridade</h1>
          <p className="text-white/90 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6">
            UTI Neonatal Irmã Josefa — Um encontro cheio de amor e alegria para nossos pequenos guerreiros[cite: 11]!
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm font-medium pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
              <Calendar className="w-4 h-4 text-[#c5a059]" /> 29/11/2026[cite: 11]
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
              <Clock className="w-4 h-4 text-[#c5a059]" /> 07h[cite: 11]
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
              <MapPin className="w-4 h-4 text-[#c5a059]" /> Praça do Hospital[cite: 11]
            </div>
          </div>
        </div>

        {/* Formulário ou Mensagem de Sucesso */}
        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
          
          {sucesso ? (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#005a8d]">Inscrição Realizada com Sucesso!</h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                Não importa quem chega primeiro, todos vocês já são vencedores! Aguardamos a sua presença.
              </p>
              <div className="pt-6">
                <Link to="/" className="bg-[#005a8d] hover:bg-[#004068] text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-md transition-all inline-block">
                  Voltar ao Início
                </Link>
              </div>
            </div>
          ) : inscricoesEncerradas ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Inscrições Encerradas</h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
                O período de inscrições encerrou-se a 17 de novembro. Agradecemos imenso o carinho e participação de todos!
              </p>
              <p className="text-xs text-gray-500 pt-4 flex items-center justify-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#c5a059]" /> Dúvidas? Contacte: 87 98809-1422[cite: 10]
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-serif font-bold text-[#005a8d]">Formulário de Inscrição</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Preencha os dados abaixo de acordo com o formulário oficial.</p>
              </div>

              {erro && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs sm:text-sm">
                  {erro}
                </div>
              )}

              {/* 1. Nome completo da criança */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">1. Nome completo da criança *</label>
                <input 
                  type="text" 
                  name="nome_crianca" 
                  required 
                  value={formData.nome_crianca} 
                  onChange={handleChange}
                  placeholder="Nome completo da criança"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005a8d]"
                />
              </div>

              {/* 2. Data de nascimento */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">2. Data de nascimento *</label>
                <input 
                  type="date" 
                  name="data_nascimento" 
                  required 
                  value={formData.data_nascimento} 
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005a8d]"
                />
              </div>

              {/* 3. Nome completo do responsável */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">3. Nome completo do responsável *</label>
                <input 
                  type="text" 
                  name="nome_responsavel" 
                  required 
                  value={formData.nome_responsavel} 
                  onChange={handleChange}
                  placeholder="Nome completo do responsável"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005a8d]"
                />
              </div>

              {/* 4. WhatsApp do responsável */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">4. WhatsApp do responsável *</label>
                <input 
                  type="text" 
                  name="whatsapp" 
                  required 
                  value={formData.whatsapp} 
                  onChange={handleChange}
                  placeholder="(87) 98888-8888"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005a8d]"
                />
              </div>

              {/* 5. Como a criança participará? */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">5. Como a criança participará? *</label>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                  {["Caminhando ou correndo", "No colo do responsável", "Carrinho de bebê", "Cadeira de rodas", "Velocípede ou triciclo", "Outro meio"].map((opcao) => (
                    <label key={opcao} className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <input 
                        type="radio" 
                        name="forma_participacao" 
                        value={opcao}
                        checked={formData.forma_participacao === opcao}
                        onChange={handleChange}
                        className="text-[#005a8d] focus:ring-[#005a8d]"
                      />
                      <span>{opcao}</span>
                    </label>
                  ))}
                </div>
                {formData.forma_participacao === "Outro meio" && (
                  <input 
                    type="text" 
                    name="outro_meio" 
                    value={formData.outro_meio}
                    onChange={handleChange}
                    placeholder="Especifique o outro meio de deslocamento"
                    className="w-full mt-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005a8d]"
                  />
                )}
              </div>

              {/* 6. A criança precisa de alguma adaptação ou apoio de acessibilidade? */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  6. A criança precisa de alguma adaptação ou apoio de acessibilidade? <span className="text-gray-400 font-normal">(Opcional)</span>
                </label>
                <p className="text-xs text-gray-500">Informe apenas o necessário para organizarmos a participação.</p>
                <textarea 
                  name="acessibilidade" 
                  rows="3"
                  value={formData.acessibilidade} 
                  onChange={handleChange}
                  placeholder="Detalhes de acessibilidade ou apoio necessário..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005a8d]"
                ></textarea>
              </div>

              {/* Declaração */}
              <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-2xl">
                <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-gray-700">
                  <input 
                    type="checkbox" 
                    name="declaracao" 
                    required 
                    checked={formData.declaracao}
                    onChange={handleChange}
                    className="mt-1 text-[#005a8d] focus:ring-[#005a8d] rounded"
                  />
                  <span>
                    <strong>DECLARAÇÃO:</strong> Estou ciente de que a criança deverá participar acompanhada de um responsável e utilizar um meio de deslocamento adequado à sua idade e às suas necessidades. *[cite: 11]
                  </span>
                </label>
              </div>

              <div className="pt-4 text-center">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#c5a059] hover:bg-[#b08c48] text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50 cursor-pointer"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  Efetuar Inscrição
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
