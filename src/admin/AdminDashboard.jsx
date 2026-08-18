import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Save, CheckCircle2, Plus, Trash2, Shield, Calendar, User, Phone, LogOut, KeyRound, Mail, MessageSquare, Edit3, X, Move, ZoomIn } from "lucide-react";

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("sobre");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Estados de Senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [sucessoSenha, setSucessoSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState("");

  // Dados do Sobre
  const [sobreData, setSobreData] = useState({ id: 1, historia: "", linha_do_tempo: [] });
  const [novoEvento, setNovoEvento] = useState({ ano: "", titulo: "", descricao: "" });

  // Listas
  const [irmasList, setIrmasList] = useState([]);
  const [novaIrma, setNovaIrma] = useState({ nome: "", foto_url: "", data_nascimento: "", local_nascimento: "", primeiros_votos: "", votos_perpetuos: "" });

  const [madresList, setMadresList] = useState([]);
  const [novaMadre, setNovaMadre] = useState({ nome: "", foto_url: "", periodo_mandato: "", biografia: "" });

  // Memorial com Posição e Zoom
  const [memorialList, setMemorialList] = useState([]);
  const [novoMemorial, setNovoMemorial] = useState({ 
    nome: "", 
    foto_url: "", 
    data_nascimento: "", 
    data_falecimento: "", 
    localizacao: "", 
    biografia_breve: "",
    pos_x: 0,
    pos_y: 0,
    zoom: 1
  });
  const [editandoMemorialId, setEditandoMemorialId] = useState(null);

  // Controle de Arraste (Drag)
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [domCampeloData, setDomCampeloData] = useState({ id: 1, foto_url: "", historia_biografia: "", sobre_a_causa: "" });
  const [gracasList, setGracasList] = useState([]);
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
    // Reinicia posição e zoom ao enviar nova foto
    setNovoMemorial(prev => ({ ...prev, pos_x: 0, pos_y: 0, zoom: 1 }));
    setUploading(false);
  }

  // Lógica do Mouse Drag
  function handleMouseDown(e) {
    if (!novoMemorial.foto_url) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - novoMemorial.pos_x, y: e.clientY - novoMemorial.pos_y });
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setNovoMemorial(prev => ({ ...prev, pos_x: newX, pos_y: newY }));
  }

  function handleMouseUp() {
    setIsDragging(false);
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
        setNovoMemorial({ nome: "", foto_url: "", data_nascimento: "", data_falecimento: "", localizacao: "", biografia_breve: "", pos_x: 0, pos_y: 0, zoom: 1 });
        fetchTabData("memorial");
        triggerSuccess();
      } else {
        alert("Erro ao atualizar registro: " + error.message);
      }
    } else {
      const { error } = await supabase.from("memorial_falecidas").insert([novoMemorial]);
      if (!error) {
        setNovoMemorial({ nome: "", foto_url: "", data_nascimento: "", data_falecimento: "", localizacao: "", biografia_breve: "", pos_x: 0, pos_y: 0, zoom: 1 });
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
      pos_x: item.pos_x || 0,
      pos_y: item.pos_y || 0,
      zoom: item.zoom || 1
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelarEdicaoMemorial() {
    setEditandoMemorialId(null);
    setNovoMemorial({ nome: "", foto_url: "", data_nascimento: "", data_falecimento: "", localizacao: "", biografia_breve: "", pos_x: 0, pos_y: 0, zoom: 1 });
  }

  async function handleDelete(table, id, reloadTab) {
    if (window.confirm("Deseja realmente excluir este registro?")) {
      await supabase.from(table).delete().eq("id", id);
      fetchTabData(reloadTab);
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
        <button onClick={handleSair} className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-2xl font-bold text-sm transition-colors border border-red-100">
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
              className={`text-left px-4 py-3 rounded-2xl font-medium transition-all ${activeTab === item.id ? "bg-[#005a8d] text-white shadow-md" : "text-gray-600 hover:bg-gray-50 hover:text-[#005a8d]"}`}
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

          {loading && activeTab !== "senha" ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>
          ) : (
            <>
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
                    {/* Formulário (7 colunas) */}
                    <form onSubmit={handleSaveMemorial} className="lg:col-span-7 bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" placeholder="Nome da Irmã" required value={novoMemorial.nome} onChange={e => setNovoMemorial({...novoMemorial, nome: e.target.value})} className="p-3 rounded-xl border border-gray-300 bg-white sm:col-span-2" />
                        
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-gray-500 mb-1">Foto da Irmã</label>
                          <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setNovoMemorial({...novoMemorial, foto_url: url}))} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#005a8d] file:text-white w-full" />
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

                    {/* Molde Interativo de Arraste e Zoom (5 colunas) */}
                    <div className="lg:col-span-5 bg-white p-6 rounded-3xl border-2 border-dashed border-[#c5a059]/40 flex flex-col items-center select-none">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider mb-2">
                        <Move className="w-4 h-4" /> Enquadramento em Tempo Real
                      </div>
                      <p className="text-[11px] text-gray-400 mb-3 text-center">Clique e arraste a imagem para posicionar o rosto.</p>

                      {/* Controle de Zoom Slider */}
                      {novoMemorial.foto_url && (
                        <div className="w-full max-w-xs mb-3 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                          <ZoomIn className="w-4 h-4 text-gray-500 shrink-0" />
                          <input 
                            type="range" 
                            min="1" 
                            max="3" 
                            step="0.05" 
                            value={novoMemorial.zoom} 
                            onChange={e => setNovoMemorial({...novoMemorial, zoom: parseFloat(e.target.value)})}
                            className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#005a8d]" 
                          />
                          <span className="text-[11px] font-bold text-gray-600 w-8 text-right">{Math.round(novoMemorial.zoom * 100)}%</span>
                        </div>
                      )}

                      {/* Cartão Molde */}
                      <div className="w-full max-w-xs bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
                        <div 
                          className="h-64 w-full bg-gray-900 flex items-center justify-center overflow-hidden grayscale relative cursor-grab active:cursor-grabbing"
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                        >
                          {novoMemorial.foto_url ? (
                            <img 
                              src={novoMemorial.foto_url} 
                              alt="Antevisão" 
                              style={{ 
                                transform: `translate(${novoMemorial.pos_x}px, ${novoMemorial.pos_y}px) scale(${novoMemorial.zoom})`,
                                transformOrigin: 'center center',
                                transition: isDragging ? 'none' : 'transform 0.05s ease-out'
                              }}
                              className="max-w-none pointer-events-none" 
                            />
                          ) : (
                            <div className="text-center p-4 text-gray-500 text-xs pointer-events-none">
                              <User className="w-12 h-12 mx-auto text-gray-600 mb-1" />
                              Envie uma foto para ver o molde
                            </div>
                          )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between pointer-events-none">
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

                  {/* Lista de Registros */}
                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    <h3 className="font-bold text-lg text-[#005a8d]">Registros no Memorial ({memorialList.length})</h3>
                    {memorialList.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center grayscale relative">
                            {item.foto_url ? (
                              <img 
                                src={item.foto_url} 
                                alt="" 
                                style={{ 
                                  transform: `translate(${item.pos_x || 0}px, ${item.pos_y || 0}px) scale(${item.zoom || 1})`,
                                  transformOrigin: 'center center'
                                }}
                                className="max-w-none" 
                              />
                            ) : <User className="w-6 h-6 text-gray-400" />}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
