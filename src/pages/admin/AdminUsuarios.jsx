import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Users, UserPlus, Loader2, Shield } from "lucide-react";

export default function AdminUsuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  const reload = async () => {
    setLoading(true);
    // Busca os perfis da tabela customizada
    const { data } = await supabase.from('profiles').select('*');
    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => { reload(); }, []);

  const invite = async (e) => {
    e.preventDefault();
    setInviting(true);
    
    // Convite via Supabase Auth
    const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { role: role } // Passamos o cargo nos metadados
    });

    if (error) {
      alert("Erro ao convidar: " + error.message);
    } else {
      alert("Convite enviado com sucesso!");
      setEmail("");
      reload();
    }
    setInviting(false);
  };

  const changeRole = async (u, newRole) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', u.id);
    if (error) alert("Erro ao alterar permissão.");
    else reload();
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#005a8d] mb-1">Usuários</h1>
      <p className="text-gray-500 mb-8">Convide membros da equipe e defina suas permissões.</p>

      {/* Formulário de convite */}
      <div className="bg-white rounded-2xl border border-[#c5a059]/15 p-6 mb-8 max-w-xl">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-[#c5a059]" />
          <h2 className="font-serif text-lg font-bold text-[#005a8d]">Convidar Novo Usuário</h2>
        </div>
        <form onSubmit={invite} className="flex flex-col sm:flex-row gap-3">
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail do convidado" className="flex-1 rounded-xl border border-[#c5a059]/30 px-4 py-2.5 text-sm" />
          <select value={role} onChange={e => setRole(e.target.value)} className="rounded-xl border border-[#c5a059]/30 px-4 py-2.5 text-sm bg-white">
            <option value="user">Publicador</option>
            <option value="admin">Administrador</option>
          </select>
          <button type="submit" disabled={inviting} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#e31e24] text-white font-semibold text-sm">
            {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} Convidar
          </button>
        </form>
      </div>

      {/* Lista de usuários */}
      <div className="space-y-2">
        {loading ? <p>Carregando...</p> : users.map(u => (
          <div key={u.id} className="bg-white rounded-xl border border-[#c5a059]/15 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#005a8d]/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#005a8d]" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[#005a8d]">{u.email}</div>
            </div>
            <select value={u.role} onChange={e => changeRole(u, e.target.value)} className="text-xs rounded-lg border border-[#c5a059]/30 px-3 py-1.5">
              <option value="user">Publicador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
