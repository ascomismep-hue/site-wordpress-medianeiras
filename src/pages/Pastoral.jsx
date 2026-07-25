import { useState } from "react";
import Head from "next/head";
import { Heart, Shield, Sparkles, CheckCircle2, Send, Users, Church, Flame } from "lucide-react";

export default function PastoralPage() {
  const [mensagemEnviada, setMensagemEnviada] = useState(false);
  const [formData, setFormData] = useState({ nome: "", email: "", telefone: "", grupo: "JUME" });

  const imagemVaticano = "https://previews.123rf.com/images/karakotsya/karakotsya1411/karakotsya141100256/33261436-st-peter-s-cathedral-rome-vatican-italy-hand-drawing-on-grunge-paper-background-saint-pietro.jpg";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.nome && formData.email) {
      setMensagemEnviada(true);
      setTimeout(() => setMensagemEnviada(false), 5000);
      setFormData({ nome: "", email: "", telefone: "", grupo: "JUME" });
    }
  };

  return (
    <>
      <Head>
        <title>Pastoral, Servos e Servas e JUME | Família Medianeira</title>
        <meta name="description" content="Conheça nossa Pastoral, os Servos e Servas Medianeiros da Paz e a Juventude Medianeira (JUME)." />
      </Head>

      <main className="min-h-screen bg-gray-50 text-gray-950">
        
        {/* HERO SECTION (Topo) */}
        <section className="w-full bg-[#005a8d] text-white py-24 px-4 sm:px-8 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: `url(${imagemVaticano})` }}
          ></div>

          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
              Nossa Comunidade & Carisma
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">
              Família Medianeira da Paz
            </h1>
            <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto leading-relaxed">
              "Tudo fazer para que a paz de Cristo reine entre os irmãos, sendo presença viva de mediação, acolhimento e amor no mundo."
            </p>
          </div>
        </section>

        {/* CONTEÚDO PRINCIPAL - OS TRÊS GRANDES BLOCOS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-10 relative z-20 pb-20 space-y-16">
          
          {/* ==========================================
              BLOCO 1: PASTORAL
             ========================================== */}
          <section className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-gray-100 space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6">
              <div className="w-16 h-16 bg-[#005a8d] text-white rounded-3xl flex items-center justify-center shadow-md shrink-0">
                <Church className="w-8 h-8" />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Acolhimento e Cuidado Eclesial</span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#005a8d]">Nossa Pastoral</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                <p>
                  A <strong>Pastoral</strong> é o coração pulsante da nossa comunidade. É através dela que exercemos o mandamento maior do amor ao próximo, cuidando espiritualmente e humanamente de cada família, dos enfermos, dos enlutados e daqueles que buscam um recomeço na fé.
                </p>
                <p>
                  Promovemos a formação continuada, a catequese, as celebrações litúrgicas vibrantes e ações sociais concretas que transformam realidades e levam a esperança cristã aos corações aflitos.
                </p>
              </div>

              {/* Galeria de Fotos - Pastoral */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden shadow-md h-48 bg-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80" 
                    alt="Celebração Litúrgica" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md h-48 bg-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80" 
                    alt="Ação Comunitária" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </section>


          {/* ==========================================
              BLOCO 2: SERVOS E SERVAS
             ========================================== */}
          <section className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-gray-100 space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6">
              <div className="w-16 h-16 bg-amber-700 text-white rounded-3xl flex items-center justify-center shadow-md shrink-0">
                <Shield className="w-8 h-8" />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Vocação, Doação e Testemunho</span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-900">Servos e Servas Medianeiros(as) da Paz</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Galeria de Fotos - Servos e Servas */}
              <div className="grid grid-cols-2 gap-4 order-2 lg:order-1">
                <div className="rounded-2xl overflow-hidden shadow-md h-48 bg-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=600&q=80" 
                    alt="Membros em Oração" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md h-48 bg-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80" 
                    alt="Partilha Fraterna" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed order-1 lg:order-2">
                <p>
                  Os <strong>Servos e Servas Medianeiros(as) da Paz</strong> formam um grupo dedicado de leigos e leigas que assumem com firmeza o compromisso de viver e irradiar o carisma da reconciliação em suas famílias, locais de trabalho e na sociedade.
                </p>
                <p>
                  Através de uma intensa vida de oração, estudo da Palavra e amor aos irmãos, eles atuam como pontes de concórdia, serenidade e fé firme diante dos desafios dos tempos atuais.
                </p>
              </div>
            </div>
          </section>


          {/* ==========================================
              BLOCO 3: JUVENTUDE MEDIANEIRA (JUME)
             ========================================== */}
          <section className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-gray-100 space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6">
              <div className="w-16 h-16 bg-emerald-700 text-white rounded-3xl flex items-center justify-center shadow-md shrink-0">
                <Flame className="w-8 h-8" />
              </div>
              <div className="space-y-1 text-center md:text-left">
                <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Fé, Alegria e Protagonismo</span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-900">JUME - Juventude Medianeira</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                <p>
                  O <strong>JUME (Juventude Medianeira)</strong> é o espaço dinâmico e vibrante onde os jovens encontram um ambiente seguro, alegre e cativante para viver sua fé sem medos. 
                </p>
                <p>
                  Com encontros semanais repletos de música, partilhas sinceras, retiros marcantes e ações missionárias, o JUME desafia a juventude a ser protagonista na construção de um mundo mais fraterno, tendo Cristo como o centro de suas vidas.
                </p>
              </div>

              {/* Galeria de Fotos - JUME */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden shadow-md h-48 bg-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80" 
                    alt="Jovens em Encontro" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md h-48 bg-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80" 
                    alt="Amizade e Comunhão" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </section>


          {/* ==========================================
              SEÇÃO FINAL: CONVITE / FAÇA PARTE
             ========================================== */}
          <section className="bg-gradient-to-br from-emerald-900 via-[#005a8d] to-gray-900 text-white rounded-[2.5rem] p-8 sm:p-14 shadow-2xl relative overflow-hidden text-center space-y-8">
            
            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
                Venha Caminhar Conosco
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold">
                Faça parte da nossa Família Medianeira
              </h2>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                Seja na Pastoral, no grupo de Servos e Servas ou na Juventude Medianeira (JUME), há um lugar especial guardado para você. Preencha o formulário abaixo e venha somar forças conosco!
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 text-gray-900 shadow-2xl relative z-10">
              {mensagemEnviada ? (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2 text-emerald-900">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-base">Inscrição enviada com sucesso!</h4>
                  <p className="text-xs text-emerald-700">Seja muito bem-vindo(a)! Entraremos em contato em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Seu Nome Completo</label>
                    <input 
                      type="text" 
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      placeholder="Nome completo" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#005a8d] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">E-mail</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="seu@email.com" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#005a8d] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">WhatsApp</label>
                      <input 
                        type="text" 
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        placeholder="(00) 00000-0000" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#005a8d] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Onde deseja participar?</label>
                    <select 
                      value={formData.grupo}
                      onChange={(e) => setFormData({...formData, grupo: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#005a8d] outline-none bg-white"
                    >
                      <option value="JUME">JUME (Juventude Medianeira)</option>
                      <option value="Servos">Servos e Servas Medianeiros(as) da Paz</option>
                      <option value="Pastoral">Pastoral Paroquial / Geral</option>
                      <option value="Todos">Quero conhecer todos!</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-[#005a8d] hover:bg-[#004068] text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Quero Fazer Parte
                  </button>
                </form>
              )}
            </div>

          </section>

        </div>
      </main>
    </>
  );
}
