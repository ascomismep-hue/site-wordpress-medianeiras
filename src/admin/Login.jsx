import { useState } from "react";
import { Shield, Lock, KeyRound, CheckCircle2 } from "lucide-react";

export default function Login({ onLoginSuccess }) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);

  // Defina a senha de acesso da congregação aqui (ou use variável de ambiente)
  const SENHA_ADMIN = "irimep2026"; 

  function handleLogin(e) {
    e.preventDefault();
    if (senha === SENHA_ADMIN) {
      sessionStorage.setItem("irimep_auth", "true");
      onLoginSuccess();
    } else {
      setErro(true);
      setSenha("");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-[#005a8d]/10 text-[#005a8d] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-serif font-bold text-[#005a8d] mb-2">Área Restrita</h1>
        <p className="text-gray-500 text-sm mb-8">Digite a senha de acesso para gerenciar o conteúdo do site.</p>

        {erro && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-xl mb-6 text-sm font-medium border border-red-100">
            Senha incorreta. Tente novamente.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
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
            className="w-full bg-[#005a8d] hover:bg-[#004068] text-white font-bold py-3.5 rounded-2xl transition-colors shadow-sm text-sm"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
}
