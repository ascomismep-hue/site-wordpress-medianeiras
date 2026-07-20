import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // Certifique-se de importar seu cliente Supabase
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redireciona para a área administrativa após login com sucesso
      navigate("/admin");
    } catch (err) {
      setError("Credenciais inválidas. Verifique seu e-mail e senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white ring-2 ring-[#F1B434] flex items-center justify-center shadow-md">
              <Lock className="w-7 h-7 text-[#5594C5]" />
            </div>
            <div>
              <div className="font-serif text-xl font-bold text-[#5594C5]">IMPAZ</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#F1B434] font-semibold">Painel Administrativo</div>
            </div>
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-[#F1B434]/15 p-8">
          <h1 className="font-serif text-2xl font-bold text-[#5594C5] mb-1">Entrar</h1>
          <p className="text-sm text-gray-500 mb-6">Acesso restrito à equipe do Instituto.</p>
          
          {error && <div className="mb-4 p-3 rounded-xl bg-[#F25244]/10 text-sm text-[#F25244]">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#5594C5] mb-1.5">E-mail</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-[#F1B434]/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5594C5]/40" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#5594C5] mb-1.5">Senha</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-[#F1B434]/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5594C5]/40" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#5594C5] text-white font-semibold hover:bg-[#2471a3] transition-colors disabled:opacity-60">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</> : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
