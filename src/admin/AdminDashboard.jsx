import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Save, CheckCircle2, Plus, Trash2, Shield, Calendar, User, Phone, LogOut, KeyRound, Mail, MessageSquare, Edit3, X, Eye } from "lucide-react";

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("sobre");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Estados de Alteração de Senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [sucessoSenha, setSucessoSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState("");

  // Estados dos dados
  const [sobreData, setSobreData] = useState({ id: 1, historia: "", linha_do_tempo: [] });
  const [novoEvento, setNovoEvento] = useState({ ano: "", titulo: "", descricao: "" });

  const [irmasList, setIrmasList] = useState([]);
  const [novaIrma, setNovaIrma] = useState({ nome: "", foto_url: "", data_nascimento: "", local_nascimento: "", primeiros_votos: "", votos_perpetuos: "" });

  const [madresList, setMadresList] = useState([]);
  const [novaMadre, setNovaMadre] = useState({ nome: "", foto_url: "", periodo_mandato: "", biografia: "" });

  // Estados do Memorial (com o campo de enquadramento integrado)
  const [memorialList, setMemorialList] = useState([]);
  const [novoMemorial, setNovoMemorial] = useState({ 
    nome: "", 
    foto_url: "", 
    data_nascimento: "", 
    data_falecimento: "", 
    localizacao: "", 
    biografia_breve: "",
    posicao_foto: "object-top" // Padrão focado no rosto/topo
  });
  const [editandoMemorialId, setEditandoMemorialId] = useState(null);

  const [domCampeloData, setDomCampeloData] = useState({ id: 1, foto_url: "", historia_biografia: "", sobre_a_causa: "" });
  const [gracasList, setGracasList] = useState([]);

  // Estado para as Mensagens de Contato
  const [mensagensList, setMensagensList] = useState([]);
  const [mensagemSelecionada, setMensagemSelecionada] = useState(null);

  useEffect(() => {
    if (activeTab !== "senha") {
      fetchTabData(activeTab);
    }
  }, [activeTab]);

  async function fetchTabData(tab) {
    setLoading(true);
    try {
      if (tab === "sobre") {
        const { data } = await supabase.from("institucional_sobre").select("*").limit(1).single();
        if (data) {
          setSobreData({
            id: data.id || 1,
            historia: data.historia || "",
            linha_do_tempo: Array.isArray(data.linha_do_tempo) ? data.linha_do_tempo : []
          });
        }
      } else if (tab === "irmas") {
        const { data } = await supabase.from("irmas").select("*").order("nome");
        if (data) setIrmasList(data);
      } else if (tab === "madres") {
        const { data } = await supabase.from("madres_gerais").select("*");
        if (data) setMadresList(data);
      } else if (tab === "memorial") {
        const { data } = await supabase.from("memorial_falecidas").select("*").order("nome");
        if (data) setMemorialList(data);
      } else if (tab === "domcampelo") {
        const { data } = await supabase.from("causa_dom_campelo").select("*").limit(1).single();
        if (data) setDomCampeloData(data);
      } else if (tab === "gracas") {
        const { data } = await supabase.from("gracas_dom_campelo").select("*").order("data_envio", { ascending: false });
        if (data) setGracasList(data);
      } else if (tab === "contatos") {
        const { data } = await supabase.from("mensagens_contato").select("*").order("data_envio", { ascending: false });
        if (data) {
          setMensagensList(data);
          if (data.length > 0 && !mensagemSelecionada) {
            setMensagemSelecionada(data[0]);
          }
        }
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
    setLoading(false);
  }

  function handleSair() {
    sessionStorage.removeItem("irimep_painel_logado");
    sessionStorage.removeItem("irimep_auth");
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  }

  async function handleImageUpload(e, callbackUrlSetter) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    let { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);

    if (uploadError) {
      alert("Erro ao fazer upload da imagem: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    callbackUrlSetter(data.publicUrl);
    setUploading(false);
  }

  async function handleSaveSobre() {
    await supabase.from("institucional_sobre").update({ 
      historia: sobreData.historia,
      linha_do_tempo: sobreData.linha_do_tempo
    }).eq("id", sobreData.id);
    triggerSuccess();
  }

  function handleAddEvento() {
    if (!novoEvento.ano || !novoEvento.titulo) {
      alert("Preencha pelo menos o Ano e o Título.");
      return;
    }
    setSobreData({ ...sobreData, linha_do_tempo: [...(sobreData.linha_do_tempo || []), novoEvento] });
    setNovoEvento({ ano: "", titulo: "", descricao: "" });
  }

  function handleRemoveEvento(index) {
    const atualizada = sobreData.linha_do_tempo.filter((_, i) => i !== index);
    setSobreData({ ...sobreData, linha_do_tempo: atualizada });
  }

  async function handleAddIrma(e) {
    e.preventDefault();
    const { error } = await supabase.from("irmas").insert([novaIrma]);
    if (!error) {
      setNovaIrma({ nome: "", foto_url: "", data_nascimento: "", local_nascimento: "", primeiros_votos: "", votos_perpetuos: "" });
      fetchTabData("irmas");
      triggerSuccess();
    } else alert("Erro ao cadastrar irmã.");
  }

  async function handleAddMadre(e) {
    e.preventDefault();
    const { error } = await supabase.from("madres_gerais").insert([novaMadre]);
    if (!error) {
      setNovaMadre({ nome: "", foto_url: "", periodo_mandato: "", biografia: "" });
      fetchTabData("madres");
      triggerSuccess();
    } else alert("Erro ao cadastrar Madre.");
  }

  async function handleSaveMemorial(e) {
    e.preventDefault();
    if (editandoMemorialId) {
      const { error } = await supabase
        .from("memorial_falecidas")
        .update(novoMemorial)
        .eq("id", editandoMemorialId);

      if (!error) {
        alert("Registro atualizado com sucesso!");
        setEditandoMemorialId(null);
        setNovoMemorial({ nome: "", foto_url: "", data_nascimento: "", data_falecimento: "", localizacao: "", biografia_breve: "", posicao_foto: "object-top" });
        fetchTabData("memorial");
        triggerSuccess();
      } else {
        alert("Erro ao atualizar registro: " + error.message);
      }
    } else {
      const { error } = await supabase.from("memorial_falecidas").insert([novoMemorial]);
      if (!error) {
        setNovoMemorial({ nome: "", foto_url: "", data_nascimento: "", data_falecimento: "", localizacao: "", biografia_breve: "", posicao_foto: "object-top" });
        fetchTabData("memorial");
        triggerSuccess();
      } else {
        alert("Erro ao cadastrar registro no memorial: " + error.message);
      }
    }
  }

  function carregarMemorialParaEdicao(item) {
    setEditandoMemorialId(item.id);
    setNovoMemorial({
      nome: item.nome || "",
      foto_url: item.foto_url || "",
      data_nascimento: item.data_nascimento || "",
      data_falecimento: item.data_falecimento || "",
      localizacao: item.localizacao || "",
      biografia_breve: item.biografia_breve || "",
      posicao_foto: item.posicao_foto || "object-top"
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelarEdicaoMemorial() {
    setEditandoMemorialId(null);
    setNovoMemorial({ nome: "", foto_url: "", data_nascimento: "", data_falecimento: "", localizacao: "", biografia_breve: "", posicao_foto: "object-top" });
  }

  async function handleSaveDomCampelo() {
    await supabase.from("causa_dom_campelo").update({
      foto_url: domCampeloData.foto_url,
      historia_biografia: domCampeloData.historia_biografia,
      sobre_a_causa: domCampeloData.sobre_a_causa
    }).eq("id", domCampeloData.id);
    triggerSuccess();
  }

  async function handleDelete(table, id, reloadTab) {
    if (window.confirm("Deseja realmente excluir este registro?")) {
      await supabase.from(table).delete().eq("id", id);
      if (table === "mensagens_contato") {
        setMensagemSelecionada(null);
      }
      fetchTabData(reloadTab);
    }
  }

  async function handleAlterarSenha(e) {
    e.preventDefault();
    setErroSenha("");

    const { data, error: fetchError } = await supabase
      .from("configuracoes_acesso")
      .select("senha")
      .eq("perfil", "institucional")
      .single();

    if (fetchError || !data || data.senha !== senhaAtual) {
      setErroSenha("A senha atual está incorreta.");
      return;
    }

    const { error: updateError } = await supabase
      .from("configuracoes_acesso")
      .update({ senha: novaSenha })
      .eq("perfil", "institucional");

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

  const menuItems = [
    { id: "sobre", label: "Sobre Nós" },
    { id: "irmas", label: "Irmãs" },
    { id: "madres", label: "Madres Gerais" },
    { id: "memorial", label: "Memorial" },
    { id: "domcampelo", label: "Causa Dom Campelo" },
    { id: "gracas", label: "Graças Alcançadas" },
    { id: "contatos", label: "Mensagens de Contato" },
    { id: "senha", label: "Alterar Senha" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#005a8d]" />
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#005a8d]">Painel Administrativo Unificado</h1>
            <p className="text-gray-600 text-sm">Gerencie todo o conteúdo, fotos e mensagens institucionais.</p>
          </div>
        </div>
        <button 
          onClick={handleSair}
          className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-2xl font-bold text-sm transition-colors border border-red-100"
        >
          <LogOut className="w-4 h-4" /> Sair do Painel
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Menu Lateral */}
        <div className="w-full lg:w-72 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2 h-fit">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Seções do Site</span>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-left px-4 py-3 rounded-2xl font-medium transition-all ${
                activeTab === item.id 
                  ? "bg-[#005a8d] text-white shadow-md" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#005a8d]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Área de Conteúdo */}
        <div className="flex-1 bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
          {success && (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl mb-6 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0" /> Operação realizada com sucesso!
            </div>
          )}

          {uploading && (
            <div className="bg-blue-50 text-[#005a8d] p-4 rounded-2xl mb-6 flex items-center gap-2 font-medium">
              <Loader2 className="w-5 h-5 animate-spin" /> Fazendo upload da imagem...
            </div>
          )}

          {loading && activeTab !== "senha" ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>
          ) : (
            <>
              {/* SOBRE NÓS */}
              {activeTab === "sobre" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-[#005a8d] mb-4">Editar Sobre Nós</h2>
                    <label className="block font-semibold text-gray-700 mb-2">Breve História</label>
                    <textarea 
                      rows="8" 
                      value={sobreData.historia || ""} 
                      onChange={e => setSobreData({...sobreData, historia: e.target.value})}
                      className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#005a8d] font-sans text-gray-700 leading-relaxed"
                    />
                  </div>
                  <button onClick={handleSaveSobre} className="bg-[#005a8d] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2">
                    <Save className="w-5 h-5" /> Salvar Alterações
                  </button>
                </div>
              )}

              {/* IRMÃS */}
              {activeTab === "irmas" && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Cadastrar Nova Irmã</h2>
                  <form onSubmit={handleAddIrma} className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input type="text" placeholder="Nome Completo" required value={novaIrma.nome} onChange={e => setNovaIrma({...novaIrma, nome: e.target.value})} className="p-3 rounded-xl border border-gray-300 bg-white" />
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Foto da Irmã</label>
                        <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setNovaIrma({...novaIrma, foto_url: url}))} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#005a8d] file:text-white" />
                      </div>
                      <input type="text" placeholder="Data de Nascimento (Ex: 12/05/1950)" value={novaIrma.data_nascimento} onChange={e => setNovaIrma({...novaIrma, data_nascimento: e.target.value})} className="p-3 rounded-xl border border-gray-300 bg-white" />
                      <input type="text" placeholder="Local de Nascimento (Ex: Petrolina - PE)" value={novaIrma.local_nascimento} onChange={e => setNovaIrma({...novaIrma, local_nascimento: e.target.value})} className="p-3 rounded-xl border border-gray-300 bg-white" />
                      <input type="text" placeholder="Data Primeiros Votos" value={novaIrma.primeiros_votos} onChange={e => setNovaIrma({...novaIrma, primeiros_votos: e.target.value})} className="p-3 rounded-xl border border-gray-300 bg-white" />
                      <input type="text" placeholder="Data Votos Perpétuos" value={novaIrma.votos_perpetuos} onChange={e => setNovaIrma({...novaIrma, votos_perpetuos: e.target.value})} className="p-3 rounded-xl border border-gray-300 bg-white" />
                    </div>
                    <button type="submit" className="bg-[#005a8d] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus className="w-5 h-5" /> Adicionar Irmã</button>
                  </form>

                  <div className="space-y-3">
                    <h3 className="font-bold text-lg text-[#005a8d]">Irmãs Cadastradas ({irmasList.length})</h3>
                    {irmasList.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                            {item.foto_url ? <img src={item.foto_url} alt="" className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-gray-400" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">{item.nome}</h4>
                            <p className="text-xs text-gray-500">Nasc: {item.data_nascimento} ({item.local_nascimento}) • Votos: {item.votos_perpetuos}</p>
                          </div>
                        </div>
                        <button onClick={() => handleDelete("irmas", item.id, "irmas")} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MADRES GERAIS */}
              {activeTab === "madres" && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Cadastrar Madre Geral</h2>
                  <form onSubmit={handleAddMadre} className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input type="text" placeholder="Nome da Madre" required value={novaMadre.nome} onChange={e => setNovaMadre({...novaMadre, nome: e.target.value})} className="p-3 rounded-xl border border-gray-300 bg-white" />
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Foto da Madre</label>
                        <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setNovaMadre({...novaMadre, foto_url: url}))} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#005a8d] file:text-white" />
                      </div>
                      <input type="text" placeholder="Período do Mandato (Ex: 1980 - 1990)" value={novaMadre.periodo_mandato} onChange={e => setNovaMadre({...novaMadre, periodo_mandato: e.target.value})} className="p-3 rounded-xl border border-gray-300 bg-white sm:col-span-2" />
                    </div>
                    <textarea rows="3" placeholder="Biografia..." value={novaMadre.biografia} onChange={e => setNovaMadre({...novaMadre, biografia: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white font-sans" />
                    <button type="submit" className="bg-[#005a8d] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus className="w-5 h-5" /> Adicionar Madre</button>
                  </form>

                  <div className="space-y-3">
                    <h3 className="font-bold text-lg text-[#005a8d]">Madres Cadastradas ({madresList.length})</h3>
                    {madresList.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                            {item.foto_url ? <img src={item.foto_url} alt="" className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-gray-400" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">{item.nome}</h4>
                            <p className="text-xs text-gray-500">Mandato: {item.periodo_mandato}</p>
                          </div>
                        </div>
                        <button onClick={() => handleDelete("madres_gerais", item.id, "madres")} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MEMORIAL - COM MOLDE DE ANTEVISÃO AO VIVO */}
              {activeTab === "memorial" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-serif font-bold text-[#005a8d]">
                      {editandoMemorialId ? "Editar Registro do Memorial" : "Cadastrar Irmã Falecida (Memorial)"}
                    </h2>
                    {editandoMemorialId && (
                      <button onClick={cancelarEdicaoMemorial} className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-xl font-bold text-gray-700 flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> Cancelar Edição
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Formulário de Cadastro/Edição (7 colunas) */}
                    <form onSubmit={handleSaveMemorial} className="lg:col-span-7 bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" placeholder="Nome da Irmã" required value={novoMemorial.nome} onChange={e => setNovoMemorial({...novoMemorial, nome: e.target.value})} className="p-3 rounded-xl border border-gray-300 bg-white sm:col-span-2" />
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Foto</label>
                          <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setNovoMemorial({...novoMemorial, foto_url: url}))} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#005a8d] file:text-white" />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Ajuste de Enquadramento</label>
                          <select 
                            value={novoMemorial.posicao_foto} 
                            onChange={e => setNovoMemorial({...novoMemorial, posicao_foto: e.target.value})} 
                            className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm"
                          >
                            <option value="object-top">Focar no Topo (Rosto)</option>
                            <option value="object-center">Focar no Centro</option>
                            <option value="object-bottom">Focar na Base</option>
                            <option value="object-contain">Exibir Inteira (Sem cortes)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Data de Nascimento</label>
                          <input type="date" value={novoMemorial.data_nascimento} onChange={e => setNovoMemorial({...novoMemorial, data_nascimento: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Data de Falecimento</label>
                          <input type="date" value={novoMemorial.data_falecimento} onChange={e => setNovoMemorial({...novoMemorial, data_falecimento: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" />
                        </div>

                        <input type="text" placeholder="Localização (Ex: Araripina - PE)" value={novoMemorial.localizacao} onChange={e => setNovoMemorial({...novoMemorial, localizacao: e.target.value})} className="p-3 rounded-xl border border-gray-300 bg-white sm:col-span-2" />
                      </div>

                      <textarea rows="3" placeholder="Biografia breve..." value={novoMemorial.biografia_breve} onChange={e => setNovoMemorial({...novoMemorial, biografia_breve: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white font-sans" />
                      
                      <button type="submit" className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-white ${editandoMemorialId ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#005a8d]"}`}>
                        {editandoMemorialId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {editandoMemorialId ? "Salvar Alterações" : "Adicionar ao Memorial"}
                      </button>
                    </form>

                    {/* Molde de Pré-visualização ao Vivo (5 colunas) */}
                    <div className="lg:col-span-5 bg-white p-6 rounded-3xl border-2 border-dashed border-[#c5a059]/40 flex flex-col items-center">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider mb-4">
                        <Eye className="w-4 h-4" /> Molde de Antevisão ao Vivo
                      </div>

                      <div className="w-full max-w-xs bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
                        <div className="h-60 w-full bg-gray-900 flex items-center justify-center overflow-hidden grayscale relative">
                          {novoMemorial.foto_url ? (
                            <img 
                              src={novoMemorial.foto_url} 
                              alt="Antevisão" 
                              className={`w-full h-full object-cover ${novoMemorial.posicao_foto}`} 
                            />
                          ) : (
                            <div className="text-center p-4 text-gray-500 text-xs">
                              <User className="w-12 h-12 mx-auto text-gray-600 mb-1" />
                              Selecione uma foto para ver o enquadramento
                            </div>
                          )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-serif font-bold text-[#005a8d] mb-1 truncate">
                              {novoMemorial.nome || "Nome da Irmã"}
                            </h3>
                            <p className="text-xs text-gray-400 mb-2">{novoMemorial.localizacao || "Localização"}</p>
                            <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                              {novoMemorial.biografia_breve || "A biografia breve aparecerá aqui..."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lista de Registros Existentes */}
                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    <h3 className="font-bold text-lg text-[#005a8d]">Registros no Memorial ({memorialList.length})</h3>
                    {memorialList.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center grayscale">
                            {item.foto_url ? <img src={item.foto_url} alt="" className={`w-full h-full object-cover ${item.posicao_foto || 'object-top'}`} /> : <User className="w-6 h-6 text-gray-400" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">{item.nome}</h4>
                            <p className="text-xs text-gray-500">Falecimento: {item.data_falecimento} {item.localizacao ? `• ${item.localizacao}` : ""}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => carregarMemorialParaEdicao(item)} className="bg-blue-50 text-[#005a8d] hover:bg-blue-100 p-2 rounded-xl" title="Editar registro">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete("memorial_falecidas", item.id, "memorial")} className="text-red-500 hover:text-red-700 p-2" title="Excluir registro">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CAUSA DOM CAMPELO */}
              {activeTab === "domcampelo" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Causa Dom Campelo</h2>
                  <button onClick={handleSaveDomCampelo} className="bg-[#005a8d] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2"><Save className="w-5 h-5" /> Salvar Alterações</button>
                </div>
              )}

              {/* MENSAGENS DE CONTATO */}
              {activeTab === "contatos" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Mensagens de Contato</h2>
                </div>
              )}

              {/* ALTERAR SENHA */}
              {activeTab === "senha" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Alterar Senha</h2>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
