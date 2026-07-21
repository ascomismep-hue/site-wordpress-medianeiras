import { useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Shield, Lock, Calendar, Church, Heart, Loader2 } from "lucide-react";
import AdminDashboard from "./AdminDashboard";
import AdminAgenda from "./AdminAgenda";
import AdminObrasMissoes from "./AdminObrasMissoes"; // Importa o painel de Obras e Missões

export default function LoginUnificado() {
  const [tipoPainel, setTipoPainel] = useState("institucional");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [logado, setLogado] = useState(() => {
    const saved = sessionStorage.getItem("irimep_painel_logado");
    return saved ? JSON.parse(saved) : null;
  });

  async function handleLogin(e) {
    e.preventDefault();
    setCarregando(true);
    setErro(false);

    try {
      // Busca a senha cadastrada no Supabase para o perfil escolhido
      const { data, error } = await supabase
        .from("configuracoes_acesso")
        .select("senha")
        .eq("perfil", tipoPainel)
        .single();

      if (error || !data) {
        setErro(true);
      } else if (senha === data.senha) {
        const sessaoInfo = { tipo: tipoPainel };
        sessionStorage.setItem("irimep_painel_logado", JSON.stringify(sessaoInfo));
        setLogado(sessaoInfo);
      } else {
        setErro(true);
        setSenha("");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setErro(true);
    }
    setCarregando(false);
  }

  function handleLogout() {
    sessionStorage.removeItem("irimep_painel_logado");
    sessionStorage.removeItem("irimep_auth");
    sessionStorage.removeItem("irimep_agenda_auth");
    setLogado(null);
    setSenha("");
    window.location.reload();
  }

  if (logado) {
    if (logado.tipo === "institucional") {
      return <AdminDashboard onLogout={handleLogout} />;
    } else if (logado.tipo === "agenda") {
      return <AdminAgenda onLogout={handleLogout} />;
    } else if (logado.tipo === "obras") {
      return <AdminObrasMissoes onLogout={handleLogout} />;
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-[#005a8d]/10 text-[#005a8d] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-serif font-bold text-[#005a8d] mb-2">Área Restrita</h1>
        <p className="text-gray-500 text-sm mb-6">Selecione o painel que deseja gerenciar e digite sua senha.</p>

        {erro && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-xl mb-6 text-sm font-medium border border-red-100">
            Senha incorreta para o painel selecionado. Tente novamente.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Selecione o Painel</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setTipoPainel("institucional"); setErro(false); }}
                className={`py-3 px-2 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center gap-1.5 border transition-all ${
                  tipoPainel === "institucional" 
                    ? "bg-[#005a8d] text-white border-[#005a8d] shadow-sm" 
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Church className="w-4 h-4" /> Institucional
              </button>
              <button
                type="button"
                onClick={() => { setTipoPainel("agenda"); setErro(false); }}
                className={`py-3 px-2 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center gap-1.5 border transition-all ${
                  tipoPainel === "agenda" 
                    ? "bg-[#005a8d] text-white border-[#005a8d] shadow-sm" 
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Calendar className="w-4 h-4" /> Agenda
              </button>
              <button
                type="button"
                onClick={() => { setTipoPainel("obras"); setErro(false); }}
                className={`py-3 px-2 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center gap-1.5 border transition-all ${
                  tipoPainel === "obras" 
                    ? "bg-[#005a8d] text-white border-[#005a8d] shadow-sm" 
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Heart className="w-4 h-4" /> Obras & Missões
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Senha de Acesso</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input 
                type="password" 
                placeholder="Digite a senha..."
                value={senha}
                onChange={e => { setSenha(e.target.value); setErro(false); }}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#005a8d] focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={carregando}
            className="w-full bg-[#005a8d] hover:bg-[#004068] text-white font-bold py-3.5 rounded-2xl transition-colors shadow-sm text-sm flex items-center justify-center gap-2"
          >
            {carregando ? <Loader2 className="w-5 h-5 animate-spin" /> : "Acessar Painel"}
          </button>
        </form>
      </div>
    </div>
  );
}
