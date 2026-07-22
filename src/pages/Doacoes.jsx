import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Heart, QrCode, Copy, Check, Calendar, User, Phone, Mail, Building2, Sparkles, Loader2, Send } from "lucide-react";

export default function Doacoes() {
  const [causas, setCausas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiadoId, setCopiadoId] = useState(null);

  // Modal / Tela de Doação Selecionada
  const [causaSelecionada, setCausaSelecionada] = useState(null);
  const [tipoDoacao, setTipoDoacao] = useState("unica"); // "unica" ou "mensal"
  const [sucessoDoacao, setSucessoDoacao] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const [formDoador, setFormDoador] = useState({
    nome: "",
    email: "",
    telefone: "",
    data_nascimento: "",
    valor: ""
  });

  useEffect(() => {
    fetchCausas();
  }, []);

  async function fetchCausas() {
    setLoading(true);
    const { data } = await supabase
      .from("causas_doacao")
      .select("*")
      .eq("ativa", true)
      .order("ordem");

    if (data) setCausas(data);
    setLoading(false);
  }

  function handleCopiarChave(texto, id) {
    navigator.clipboard.writeText(texto);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 3000);
  }

  async function handleConfirmarCompromisso(e) {
    e.preventDefault();
    setEnviando(true);

    try {
      // Salva na base de doadores/compromissos mensais para contato em aniversários e pré-doação
      const { error } = await supabase.from("compromissos_doacao").insert([
        {
          causa_id: causaSelecionada.id,
          causa_nome: causaSelecionada.titulo,
          nome: formDoador.nome,
          email: formDoador.email,
          telefone: formDoador.telefone,
          data_nascimento: formDoador.data_nascimento || null,
          tipo: tipoDoacao,
          valor: parseFloat(formDoador.valor) || 0
        }
      ]);

      if (!error) {
        setSucessoDoacao(true);
      } else {
        alert("Erro ao registrar doação. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfbf9] pb-24">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#e31e24] via-[#c9181d] to-[#002845] text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-amber-200">
            <Heart className="w-4 h-4 fill-amber-200" /> Central de Doações - Doe com Amor
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold">Sua Generosidade Transforma Vidas</h1>
          <p className="text-white/90 max-w-xl mx-auto text-sm sm:text-base font-light">
            Conheça nossas frentes missionárias e sociais. Escolha uma causa e contribua para a manutenção e expansão da nossa obra.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-[#e31e24]" /></div>
        ) : causas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500">Nenhuma causa de doação cadastrada no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {causas.map(causa => (
              <div key={causa.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                {causa.foto_url && (
                  <div className="h-52 overflow-hidden bg-gray-100 relative">
                    <img src={causa.foto_url} alt={causa.titulo} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-[#e31e24] px-2.5 py-1 rounded-full inline-block">
                      Causa Social / Missionária
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#005a8d]">{causa.titulo}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{causa.descricao}</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 text-xs space-y-1">
                      <p className="text-gray-500 font-semibold">Chave PIX:</p>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-gray-800 truncate">{causa.chave_pix}</span>
                        <button
                          onClick={() => handleCopiarChave(causa.chave_pix, causa.id)}
                          className="bg-white hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-xl border flex items-center gap-1 font-bold shrink-0 transition-colors"
                        >
                          {copiadoId === causa.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiadoId === causa.id ? "Copiado!" : "Copiar"}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCausaSelecionada(causa);
                        setSucessoDoacao(false);
                      }}
                      className="w-full bg-[#e31e24] hover:bg-[#c9181d] text-white font-bold py-3.5 rounded-2xl transition-all shadow-sm text-sm flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4 fill-white" /> Contribuir com esta Causa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE DOAÇÃO */}
      {causaSelecionada && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-lg w-full p-8 rounded-3xl shadow-2xl space-y-6 relative animate-fadeIn my-8">
            <button
              onClick={() => setCausaSelecionada(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#e31e24] uppercase tracking-wider">Doar com Amor</span>
              <h2 className="text-2xl font-serif font-bold text-[#005a8d]">{causaSelecionada.titulo}</h2>
            </div>

            {sucessoDoacao ? (
              <div className="bg-emerald-50 text-emerald-800 p-6 rounded-3xl text-center space-y-3 border border-emerald-100">
                <Check className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-xl font-bold">Obrigado pela sua Generosidad!</h3>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  {tipoDoacao === "mensal" 
                    ? "Seu compromisso mensal foi registrado com sucesso em nossa base. Entraremos em contato periodicamente."
                    : "Agradecemos sua doação única. Que Deus abençoe sua vida!"}
                </p>
                <button
                  onClick={() => setCausaSelecionada(null)}
                  className="bg-[#005a8d] text-white px-6 py-2.5 rounded-xl font-bold text-xs mt-2"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmarCompromisso} className="space-y-4">
                {/* QR Code se cadastrado */}
                {causaSelecionada.qr_code_url && (
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border">
                    <img src={causaSelecionada.qr_code_url} alt="QR Code PIX" className="w-36 h-36 object-contain mb-2" />
                    <span className="text-[10px] text-gray-500">Escaneie pelo aplicativo do seu banco</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase">Frequência da Doação</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTipoDoacao("unica")}
                      className={`py-3 px-4 rounded-xl font-bold text-xs border transition-all ${
                        tipoDoacao === "unica" ? "bg-[#005a8d] text-white border-[#005a8d]" : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      Doação Única
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipoDoacao("mensal")}
                      className={`py-3 px-4 rounded-xl font-bold text-xs border transition-all ${
                        tipoDoacao === "mensal" ? "bg-[#e31e24] text-white border-[#e31e24]" : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      Doação Mensal (Recorrente)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Seu Nome</label>
                    <input type="text" required placeholder="Nome completo" value={formDoador.nome} onChange={e => setFormDoador({...formDoador, nome: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">E-mail</label>
                    <input type="email" required placeholder="email@exemplo.com" value={formDoador.email} onChange={e => setFormDoador({...formDoador, email: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Telefone / WhatsApp</label>
                    <input type="text" required placeholder="(00) 00000-0000" value={formDoador.telefone} onChange={e => setFormDoador({...formDoador, telefone: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Data de Nascimento (Aniversário)</label>
                    <input type="date" required={tipoDoacao === "mensal"} value={formDoador.data_nascimento} onChange={e => setFormDoador({...formDoador, data_nascimento: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Valor da Contribuição (R$)</label>
                  <input type="number" step="0.01" required placeholder="Ex: 50.00" value={formDoador.valor} onChange={e => setFormDoador({...formDoador, valor: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 text-sm font-bold" />
                </div>

                <div className="bg-blue-50 p-3 rounded-xl text-[11px] text-[#005a8d] leading-relaxed">
                  * Ao selecionar doação mensal, seu cadastro integrará nossa base carinhosa para lembretes automáticos no aniversário e véspera de doação.
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-[#e31e24] hover:bg-[#c9181d] text-white font-bold py-3.5 rounded-2xl transition-all shadow-md text-sm flex items-center justify-center gap-2"
                >
                  {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {enviando ? "Registrando..." : "Confirmar e Registrar Doação"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
