import { useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { MapPin, Phone, Mail, Send, CheckCircle2, Loader2, Church, Sparkles } from "lucide-react";

export default function Contato() {
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: ""
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);

    try {
      // Salva a mensagem de contato no Supabase (vamos criar a tabela abaixo)
      const { error } = await supabase.from("mensagens_contato").insert([
        {
          nome: form.nome,
          email: form.email,
          telefone: form.telefone,
          assunto: form.assunto,
          mensagem: form.mensagem
        }
      ]);

      if (!error) {
        setEnviado(true);
        setForm({ nome: "", email: "", telefone: "", assunto: "", mensagem: "" });
      } else {
        alert("Erro ao enviar mensagem. Tente novamente mais tarde.");
      }
    } catch (err) {
      console.error("Erro:", err);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfbf9] pb-24">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-[#005a8d] via-[#004068] to-[#002845] text-white py-20 px-4 text-center overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#c5a059]">
            <Sparkles className="w-4 h-4 text-[#c5a059]" /> Fale Conosco
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold">Entre em Contato</h1>
          <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base font-light">
            Estamos de braços abertos para receber sua mensagem, dúvida, pedido de oração ou visita.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Informações de Contato e Endereço da Casa Sede (Ocupa 5 colunas) */}
          <div className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <div>
              <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Casa Sede Geral</span>
              <h2 className="text-2xl font-serif font-bold text-[#005a8d] mt-1">Instituto IRIMEP</h2>
            </div>

            <div className="space-y-6 text-sm text-gray-600">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#005a8d] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-gray-800 block mb-0.5">Endereço:</strong>
                  <span>Rua Edgar Chastinet, 01 - Bairro Santa Mônica<br />Salvador - BA • CEP: 40342-100</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#005a8d] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-gray-800 block mb-0.5">Telefone / Secretaria:</strong>
                  <span>Entre em contato através do nosso canal geral ou redes sociais.</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#005a8d] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-gray-800 block mb-0.5">E-mail Oficial:</strong>
                  <span>contato@irimep.org.br</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 italic">
                "Tudo farei pelos Eleitos" (2 Tm 2,10). Visite-nos ou acompanhe nossas redes oficiais.
              </p>
            </div>
          </div>

          {/* Formulário de Envio de Mensagem (Ocupa 7 colunas) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Envie uma Mensagem</span>
              <h2 className="text-2xl font-serif font-bold text-[#005a8d] mt-1">Como podemos ajudar?</h2>
            </div>

            {enviado ? (
              <div className="bg-emerald-50 text-emerald-800 p-8 rounded-3xl text-center space-y-3 border border-emerald-100">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-2xl font-bold">Mensagem Enviada!</h3>
                <p className="text-sm text-emerald-700 max-w-md mx-auto">
                  Agradecemos o seu contato. Retornaremos sua mensagem o mais breve possível.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Seu Nome</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Nome completo..." 
                      value={form.nome} 
                      onChange={e => setForm({...form, nome: e.target.value})} 
                      className="w-full p-3.5 rounded-2xl border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:border-[#005a8d]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Seu E-mail</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="seuemail@exemplo.com" 
                      value={form.email} 
                      onChange={e => setForm({...form, email: e.target.value})} 
                      className="w-full p-3.5 rounded-2xl border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:border-[#005a8d]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Telefone / WhatsApp</label>
                    <input 
                      type="text" 
                      placeholder="(00) 00000-0000" 
                      value={form.telefone} 
                      onChange={e => setForm({...form, telefone: e.target.value})} 
                      className="w-full p-3.5 rounded-2xl border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:border-[#005a8d]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Assunto</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ex: Pedido de Oração, Visita..." 
                      value={form.assunto} 
                      onChange={e => setForm({...form, assunto: e.target.value})} 
                      className="w-full p-3.5 rounded-2xl border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:border-[#005a8d]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Mensagem</label>
                  <textarea 
                    rows="4" 
                    required 
                    placeholder="Escreva sua mensagem aqui..." 
                    value={form.mensagem} 
                    onChange={e => setForm({...form, mensagem: e.target.value})} 
                    className="w-full p-3.5 rounded-2xl border border-gray-300 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:border-[#005a8d]" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={carregando}
                  className="w-full bg-[#005a8d] hover:bg-[#004068] text-white font-bold py-4 rounded-2xl transition-all shadow-md text-sm flex items-center justify-center gap-2"
                >
                  {carregando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                  {carregando ? "Enviando..." : "Enviar Mensagem"}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* SEÇÃO DO MAPA DA CASA SEDE */}
        <div className="mt-16 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Localização Geográfica</span>
            <h3 className="text-2xl font-serif font-bold text-[#005a8d]">Nossa Localização (Casa Sede)</h3>
            <p className="text-gray-600 text-xs">Rua Edgar Chastinet, 01 - Bairro Santa Mônica, Salvador - BA</p>
          </div>

          <div className="w-full h-96 rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
            <iframe
              title="Mapa Casa Sede IRIMEP"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.457855012345!2d-38.4891234!3d-12.9712345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x71610b000000000%3A0x0!2sR.%20Edgar%20Chastinet%2C%201%20-%20Santa%20M%C3%B4nica%2C%20Salvador%20-%20BA!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}
