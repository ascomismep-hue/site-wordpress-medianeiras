import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Save, CheckCircle2, Plus, Trash2, Shield, Calendar, User, Phone, LogOut, KeyRound } from "lucide-react";

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

  const [memorialList, setMemorialList] = useState([]);
  const [novoMemorial, setNovoMemorial] = useState({ nome: "", foto_url: "", data_nascimento: "", data_falecimento: "", biografia_breve: "" });

  const [domCampeloData, setDomCampeloData] = useState({ id: 1, foto_url: "", historia_biografia: "", sobre_a_causa: "" });
  const [gracasList, setGracasList] = useState([]);

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
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
    setLoading(false);
  }

  // Upload integrado usando o bucket "images"
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

  async function handleAddMemorial(e) {
    e.preventDefault();
    const { error } = await supabase.from("memorial_falecidas").insert([novoMemorial]);
    if (!error) {
      setNovoMemorial({ nome: "", foto_url: "", data_nascimento: "", data_falecimento: "", biografia_breve: "" });
      fetchTabData("memorial");
      triggerSuccess();
    } else alert("Erro ao cadastrar registro no memorial.");
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
    { id: "senha", label: "Alterar Senha" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#005a8d]" />
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#005a8d]">Painel Administrativo Unificado</h1>
            <p className="text-gray-600 text-sm">Gerencie todo o conteúdo, fotos e históricos das páginas institucionais.</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
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
              {/* SOBRE NÓS & LINHA DO TEMPO */}
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

                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-xl font-serif font-bold text-[#005a8d] mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5" /> Linha do Tempo
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3 mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input type="text" placeholder="Ano (ex: 1968)" value={novoEvento.ano} onChange={e => setNovoEvento({...novoEvento, ano: e.target.value})} className="p-3 rounded-xl border border-gray-300 text-sm bg-white" />
                        <input type="text" placeholder="Título" value={novoEvento.titulo} onChange={e => setNovoEvento({...novoEvento, titulo: e.target.value})} className="p-3 rounded-xl border border-gray-300 text-sm bg-white sm:col-span-2" />
                      </div>
                      <textarea rows="2" placeholder="Descrição..." value={novoEvento.descricao} onChange={e => setNovoEvento({...novoEvento, descricao: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 text-sm bg-white font-sans" />
                      <button type="button" onClick={handleAddEvento} className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Adicionar Evento
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(sobreData.linha_do_tempo || []).map((item, index) => (
                        <div key={index} className="flex justify-between items-start p-4 bg-white rounded-2xl border border-gray-200">
                          <div>
                            <span className="text-xs font-bold text-[#c5a059] bg-[#c5a059]/10 px-2.5 py-1 rounded-full">{item.ano}</span>
                            <h4 className="font-bold text-[#005a8d] mt-1">{item.titulo}</h4>
                            <p className="text-gray-600 text-sm mt-0.5">{item.descricao}</p>
                          </div>
                          <button type="button" onClick={() => handleRemoveEvento(index)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
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

              {/* MEMORIAL */}
              {activeTab === "memorial" && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Cadastrar Irmã Falecida (Memorial)</h2>
                  <form onSubmit={handleAddMemorial} className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input type="text" placeholder="Nome da Irmã" required value={novoMemorial.nome} onChange={e => setNovoMemorial({...novoMemorial, nome: e.target.value})} className="p-3 rounded-xl border border-gray-300 bg-white" />
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Foto</label>
                        <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setNovoMemorial({...novoMemorial, foto_url: url}))} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#005a8d] file:text-white" />
                      </div>
                      <input type="text" placeholder="Data de Nascimento" value={novoMemorial.data_nascimento} onChange={e => setNovoMemorial({...novoMemorial, data_nascimento: e.target.value})} className="p-3 rounded-xl border border-gray-300 bg-white" />
                      <input type="text" placeholder="Data de Falecimento" value={novoMemorial.data_falecimento} onChange={e => setNovoMemorial({...novoMemorial, data_falecimento: e.target.value})} className="p-3 rounded-xl border border-gray-300 bg-white" />
                    </div>
                    <textarea rows="3" placeholder="Biografia breve..." value={novoMemorial.biografia_breve} onChange={e => setNovoMemorial({...novoMemorial, biografia_breve: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white font-sans" />
                    <button type="submit" className="bg-[#005a8d] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Plus className="w-5 h-5" /> Adicionar ao Memorial</button>
                  </form>

                  <div className="space-y-3">
                    <h3 className="font-bold text-lg text-[#005a8d]">Registros no Memorial ({memorialList.length})</h3>
                    {memorialList.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center grayscale">
                            {item.foto_url ? <img src={item.foto_url} alt="" className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-gray-400" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">{item.nome}</h4>
                            <p className="text-xs text-gray-500">Falecimento: {item.data_falecimento}</p>
                          </div>
                        </div>
                        <button onClick={() => handleDelete("memorial_falecidas", item.id, "memorial")} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CAUSA DOM CAMPELO */}
              {activeTab === "domcampelo" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Causa Dom Campelo</h2>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Foto de Dom Campelo</label>
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setDomCampeloData({...domCampeloData, foto_url: url}))} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#005a8d] file:text-white mb-4" />
                    {domCampeloData.foto_url && <img src={domCampeloData.foto_url} alt="" className="w-32 h-32 object-cover rounded-2xl mb-4 border" />}
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">História e Biografia</label>
                    <textarea rows="5" value={domCampeloData.historia_biografia || ""} onChange={e => setDomCampeloData({...domCampeloData, historia_biografia: e.target.value})} className="w-full p-4 rounded-2xl border border-gray-200 font-sans" />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Sobre a Causa</label>
                    <textarea rows="5" value={domCampeloData.sobre_a_causa || ""} onChange={e => setDomCampeloData({...domCampeloData, sobre_a_causa: e.target.value})} className="w-full p-4 rounded-2xl border border-gray-200 font-sans" />
                  </div>
                  <button onClick={handleSaveDomCampelo} className="bg-[#005a8d] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2"><Save className="w-5 h-5" /> Salvar Alterações</button>
                </div>
              )}

              {/* GRAÇAS ALCANÇADAS */}
              {activeTab === "gracas" && (
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#005a8d] mb-6">Relatos de Graças Alcançadas ({gracasList.length})</h2>
                  <div className="space-y-4">
                    {gracasList.map(item => (
                      <div key={item.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-[#005a8d]">{item.nome_devoto}</h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                              {item.telefone && (
                                <span className="flex items-center gap-1 font-medium text-[#005a8d]">
                                  <Phone className="w-3.5 h-3.5" /> {item.telefone}
                                </span>
                              )}
                              <span>{item.cidade_estado}</span>
                              <span>• {new Date(item.data_envio).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <button onClick={() => handleDelete("gracas_dom_campelo", item.id, "gracas")} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <p className="text-gray-700 text-sm italic bg-white p-3 rounded-xl border border-gray-100">"{item.relato}"</p>
                      </div>
                    ))}
                    {gracasList.length === 0 && <p className="text-gray-500 text-center py-8">Nenhum relato enviado ainda.</p>}
                  </div>
                </div>
              )}

              {/* ALTERAR SENHA */}
              {activeTab === "senha" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <KeyRound className="w-7 h-7 text-[#005a8d]" />
                    <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Alterar Senha do Painel Institucional</h2>
                  </div>

                  {sucessoSenha && (
                    <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-5 h-5 shrink-0" /> Senha alterada com sucesso no Supabase!
                    </div>
                  )}

                  {erroSenha && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl font-medium border border-red-100">
                      {erroSenha}
                    </div>
                  )}

                  <form onSubmit={handleAlterarSenha} className="bg-gray-50 p-6 sm:p-8 rounded-3xl border border-gray-200 space-y-4 max-w-xl">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Senha Atual</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="Digite a senha atual" 
                        value={senhaAtual} 
                        onChange={e => setSenhaAtual(e.target.value)} 
                        className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Nova Senha</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="Digite a nova senha" 
                        value={novaSenha} 
                        onChange={e => setNovaSenha(e.target.value)} 
                        className="w-full p-3.5 rounded-xl border border-gray-300 bg-white text-sm"
                      />
                    </div>
                    <button type="submit" className="bg-[#005a8d] hover:bg-[#004068] text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm">
                      Atualizar Senha
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
