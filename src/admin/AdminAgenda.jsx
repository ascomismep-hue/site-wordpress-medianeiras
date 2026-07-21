import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Plus, Trash2, Calendar, Lock, LogOut, CheckCircle2 } from "lucide-react";

export default function AdminAgenda({ onLogout }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [senhaInput, setSenhaInput] = useState("");
  const [erroLogin, setErroLogin] = useState(false);
  const [carregandoLogin, setCarregandoLogin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agendaList, setAgendaList] = useState([]);
  
  // Estados para alteração de senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [sucessoSenha, setSucessoSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState("");

  const [novoEvento, setNovoEvento] = useState({ 
    titulo: "", 
    data_evento: "", 
    horario: "", 
    local: "", 
    descricao: "", 
    tipo: "geral" 
  });

  useEffect(() => {
    const auth = sessionStorage.getItem("irimep_agenda_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchAgenda();
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setCarregandoLogin(true);
    setErroLogin(false);

    try {
      // Busca a senha cadastrada no Supabase para a agenda
      const { data, error } = await supabase
        .from("configuracoes_acesso")
        .select("senha")
        .eq("perfil", "agenda")
        .single();

      if (error || !data) {
        setErroLogin(true);
      } else if (senhaInput === data.senha) {
        sessionStorage.setItem("irimep_agenda_auth", "true");
        setIsAuthenticated(true);
        fetchAgenda();
      } else {
        setErroLogin(true);
        setSenhaInput("");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setErroLogin(true);
    }
    setCarregandoLogin(false);
  }

  function handleLogoutApp() {
    sessionStorage.removeItem("irimep_agenda_auth");
    if (onLogout) {
      onLogout();
    } else {
      setIsAuthenticated(false);
    }
  }

  async function fetchAgenda() {
    setLoading(true);
    const { data } = await supabase.from("agenda_eventos").select("*").order("data_evento");
    if (data) setAgendaList(data);
    setLoading(false);
  }

  async function handleAddEvento(e) {
    e.preventDefault();
    const { error } = await supabase.from("agenda_eventos").insert([novoEvento]);
    if (!error) {
      setNovoEvento({ titulo: "", data_evento: "", horario: "", local: "", descricao: "", tipo: "geral" });
      fetchAgenda();
      triggerSuccess();
    } else {
      alert("Erro ao cadastrar evento.");
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Deseja realmente excluir este evento?")) {
      await supabase.from("agenda_eventos").delete().eq("id", id);
      fetchAgenda();
    }
  }

  async function handleAlterarSenha(e) {
    e.preventDefault();
    setErroSenha("");

    const { data, error: fetchError } = await supabase
      .from("configuracoes_acesso")
      .select("senha")
      .eq("perfil", "agenda")
      .single();

    if (fetchError || !data || data.senha !== senhaAtual) {
      setErroSenha("A senha atual está incorreta.");
      return;
    }

    const { error: updateError } = await supabase
      .from("configuracoes_acesso")
      .update({ senha: novaSenha })
      .eq("perfil", "agenda");

    if (!updateError) {
      setSucessoSenha(true);
      setSenhaAtual("");
      setNovaSenha("");
      setTimeout(() => setSucessoSenha(false), 4000);
    } else {
      setErroSenha("Erro ao atualizar a senha no banco.");
    }
  }

  function triggerSuccess() {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  // --- TELA DE LOGIN DA AGENDA ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-[#005a8d]/10 text-[#005a8d] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8" />
          </div>
          
          <h1 className="text-2xl font-serif font-bold text-[#005a8d] mb-2">Painel da Agenda</h1>
          <p className="text-gray-500 text-sm mb-8">Digite a senha para gerenciar a agenda e eventos.</p>

          {erroLogin && (
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
                  value={senhaInput}
                  onChange={e => { setSenhaInput(e.target.value); setErroLogin(false); }}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#005a8d] focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={carregandoLogin}
              className="w-full bg-[#005a8d] hover:bg-[#004068] text-white font-bold py-3.5 rounded-2xl transition-colors shadow-sm text-sm flex items-center justify-center gap-2"
            >
              {carregandoLogin ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar no Painel da Agenda"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- PAINEL DE GERENCIAMENTO DA AGENDA ---
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-[#005a8d]" />
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#005a8d]">Gerenciamento de Agenda</h1>
            <p className="text-gray-600 text-sm">Adicione e remova compromissos da Agenda Geral e da Madre.</p>
          </div>
        </div>
        <button 
          onClick={handleLogoutApp}
          className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-2xl font-bold text-sm transition-colors border border-red-100"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
        {success && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0" /> Evento cadastrado com sucesso!
          </div>
        )}

        {/* Formulário de Cadastro */}
        <form onSubmit={handleAddEvento} className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
          <h3 className="font-bold text-base text-[#005a8d]">Cadastrar Novo Evento</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Título do Evento</label>
              <input type="text" required placeholder="Ex: Retiro Anual" value={novoEvento.titulo} onChange={e => setNovoEvento({...novoEvento, titulo: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Tipo de Agenda</label>
              <select value={novoEvento.tipo} onChange={e => setNovoEvento({...novoEvento, tipo: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white font-medium text-sm">
                <option value="geral">Agenda Geral</option>
                <option value="madre">Agenda da Madre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Data do Evento</label>
              <input type="date" required value={novoEvento.data_evento} onChange={e => setNovoEvento({...novoEvento, data_evento: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Horário (Opcional)</label>
              <input type="text" placeholder="Ex: 14:00" value={novoEvento.horario} onChange={e => setNovoEvento({...novoEvento, horario: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1">Local (Opcional)</label>
              <input type="text" placeholder="Ex: Capela Sede - Salvador/BA" value={novoEvento.local} onChange={e => setNovoEvento({...novoEvento, local: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Descrição</label>
            <textarea rows="3" placeholder="Detalhes do compromisso..." value={novoEvento.descricao} onChange={e => setNovoEvento({...novoEvento, descricao: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white font-sans text-sm" />
          </div>

          <button type="submit" className="bg-[#005a8d] hover:bg-[#004068] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm transition-colors">
            <Plus className="w-5 h-5" /> Adicionar à Agenda
          </button>
        </form>

        {/* Listagem */}
        <div>
          <h3 className="font-bold text-lg text-[#005a8d] mb-4">Eventos Cadastrados ({agendaList.length})</h3>
          
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#005a8d]" /></div>
          ) : agendaList.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">Nenhum evento cadastrado.</p>
          ) : (
            <div className="space-y-3">
              {agendaList.map(item => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${item.tipo === 'madre' ? 'bg-[#c5a059]/20 text-[#c5a059]' : 'bg-[#005a8d]/10 text-[#005a8d]'}`}>
                        {item.tipo === 'madre' ? 'Agenda da Madre' : 'Agenda Geral'}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">{item.data_evento} {item.horario && `• ${item.horario}`}</span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-base">{item.titulo}</h4>
                    {item.local && <p className="text-xs text-gray-500">{item.local}</p>}
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-2" title="Excluir evento">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Seção de Alterar Senha */}
        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4 pt-6 mt-10">
          <h3 className="text-xl font-serif font-bold text-[#005a8d]">Alterar Senha da Agenda</h3>
          
          {sucessoSenha && (
            <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> Senha alterada com sucesso no Supabase!
            </div>
          )}

          {erroSenha && (
            <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm font-medium border border-red-100">
              {erroSenha}
            </div>
          )}

          <form onSubmit={handleAlterarSenha} className="space-y-3 max-w-md">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Senha Atual</label>
              <input 
                type="password" 
                placeholder="Digite a senha atual" 
                value={senhaAtual} 
                onChange={e => setSenhaAtual(e.target.value)} 
                required
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Nova Senha</label>
              <input 
                type="password" 
                placeholder="Digite a nova senha" 
                value={novaSenha} 
                onChange={e => setNovaSenha(e.target.value)} 
                required
                className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm"
              />
            </div>
            <button type="submit" className="bg-[#005a8d] hover:bg-[#004068] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
              Atualizar Senha
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
