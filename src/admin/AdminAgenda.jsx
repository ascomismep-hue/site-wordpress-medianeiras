import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Plus, Trash2, Calendar, LogOut, CheckCircle2, KeyRound, Clock, MapPin, Filter } from "lucide-react";

export default function AdminAgenda({ onLogout }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agendaList, setAgendaList] = useState([]);
  
  // Estados para alteração de senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [sucessoSenha, setSucessoSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState("");

  // Estados de Filtro do Painel Lateral
  const anoAtualStr = new Date().getFullYear().toString();
  const mesAtualStr = String(new Date().getMonth() + 1).padStart(2, '0');
  const [anoPainel, setAnoPainel] = useState(anoAtualStr);
  const [mesPainel, setMesPainel] = useState(mesAtualStr);

  const [novoEvento, setNovoEvento] = useState({ 
    titulo: "", 
    data_evento: "", 
    horario: "", 
    local: "", 
    descricao: "", 
    tipo: "geral" 
  });

  useEffect(() => {
    fetchAgenda();
  }, []);

  async function fetchAgenda() {
    setLoading(true);
    const { data } = await supabase
      .from("agenda_eventos")
      .select("*")
      .order("data_evento", { ascending: true });
    
    if (data) setAgendaList(data);
    setLoading(false);
  }

  function handleSair() {
    sessionStorage.removeItem("irimep_painel_logado");
    sessionStorage.removeItem("irimep_agenda_auth");
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
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

  // Lista de anos disponíveis para seleção (ex: ano atual até 3 anos à frente)
  const anosDisponiveis = [
    (new Date().getFullYear() - 1).toString(),
    new Date().getFullYear().toString(),
    (new Date().getFullYear() + 1).toString(),
    (new Date().getFullYear() + 2).toString()
  ];

  const mesesDisponiveis = [
    { valor: "01", nome: "Janeiro" },
    { valor: "02", nome: "Fevereiro" },
    { valor: "03", nome: "Março" },
    { valor: "04", nome: "Abril" },
    { valor: "05", nome: "Maio" },
    { valor: "06", nome: "Junho" },
    { valor: "07", nome: "Julho" },
    { valor: "08", nome: "Agosto" },
    { valor: "09", nome: "Setembro" },
    { valor: "10", nome: "Outubro" },
    { valor: "11", nome: "Novembro" },
    { valor: "12", nome: "Dezembro" },
  ];

  // Filtra os eventos do painel lateral baseando-se no Ano e Mês selecionados
  const eventosPainelLateral = agendaList.filter(item => {
    if (!item.data_evento) return false;
    const [anoItem, mesItem] = item.data_evento.split("-");
    return anoItem === anoPainel && mesItem === mesPainel;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-[#005a8d]" />
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#005a8d]">Gerenciamento de Agenda</h1>
            <p className="text-gray-600 text-sm">Adicione e remova compromissos da Agenda Geral e da Madre.</p>
          </div>
        </div>
        <button 
          onClick={handleSair}
          className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-2xl font-bold text-sm transition-colors border border-red-100"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>

      {/* Grid Principal dividida em duas colunas (Esquerda: Conteúdo / Direita: Painel Azul) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* COLUNA ESQUERDA (Formulário, Lista Geral e Senha) */}
        <div className="lg:col-span-2 space-y-8">
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

            {/* Listagem Geral */}
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
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4 pt-6">
              <div className="flex items-center gap-2">
                <KeyRound className="w-6 h-6 text-[#005a8d]" />
                <h3 className="text-xl font-serif font-bold text-[#005a8d]">Alterar Senha da Agenda</h3>
              </div>
              
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

        {/* COLUNA DIREITA: Painel Azul de Resumo Cronológico */}
        <div className="lg:col-span-1">
          <div className="bg-[#005a8d] text-white p-6 rounded-3xl shadow-md sticky top-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#c5a059]" /> Painel Cronológico
              </h3>
            </div>

            {/* Seletores de Ano e Mês */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Selecionar Ano</label>
                <select 
                  value={anoPainel} 
                  onChange={e => setAnoPainel(e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm font-bold focus:outline-none focus:bg-white/20"
                >
                  {anosDisponiveis.map(ano => (
                    <option key={ano} value={ano} className="text-gray-900 bg-white">{ano}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 uppercase tracking-wider mb-1">Selecionar Mês</label>
                <select 
                  value={mesPainel} 
                  onChange={e => setMesPainel(e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm font-bold focus:outline-none focus:bg-white/20"
                >
                  {mesesDisponiveis.map(m => (
                    <option key={m.valor} value={m.valor} className="text-gray-900 bg-white">{m.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lista dos compromissos ordenados do mês/ano escolhido */}
            <div className="space-y-3 pt-2 max-h-[500px] overflow-y-auto pr-1">
              <span className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider block">
                Compromissos ({eventosPainelLateral.length})
              </span>

              {eventosPainelLateral.length === 0 ? (
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center py-8">
                  <p className="text-white/70 text-xs">Nenhum evento neste período.</p>
                </div>
              ) : (
                eventosPainelLateral.map(ev => {
                  const dataFormatada = new Date(ev.data_evento + 'T00:00:00').toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit'
                  });

                  return (
                    <div key={ev.id} className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1.5 backdrop-blur-xs">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#c5a059] bg-black/20 px-2 py-0.5 rounded-md">
                          {dataFormatada} {ev.horario && `• ${ev.horario}`}
                        </span>
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                          {ev.tipo}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{ev.titulo}</h4>
                      {ev.local && (
                        <p className="text-xs text-white/70 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#c5a059]" /> {ev.local}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
