import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Plus, Trash2, Edit3, X, CheckCircle2, LogOut, Phone, MapPin, GraduationCap, Stethoscope, Users, Building2 } from "lucide-react";

export default function AdminObrasMissoes({ onLogout }) {
  const [subAba, setSubAba] = useState("obras"); // "obras" ou "casas"
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [obrasList, setObrasList] = useState([]);
  const [casasList, setCasasList] = useState([]);

  // Estados de Edição
  const [editandoObraId, setEditandoObraId] = useState(null);
  const [editandoCasaId, setEditandoCasaId] = useState(null);

  // Formulário Obra Social
  const [novaObra, setNovaObra] = useState({
    categoria: "educacao",
    titulo: "",
    subtitulo: "",
    descricao: "",
    telefone: "",
    foto_url: "",
    unidades_escolas: "",
    ordem: 0
  });

  // Formulário Casa de Missão
  const [novaCasa, setNovaCasa] = useState({
    nome_casa: "",
    cidade_estado: "",
    endereco: "",
    telefone: "",
    foto_url: "",
    descricao_breve: "",
    ordem: 0
  });

  useEffect(() => {
    fetchDados();
  }, []);

  async function fetchDados() {
    setLoading(true);
    const [{ data: obras }, { data: casas }] = await Promise.all([
      supabase.from("obras_sociais").select("*").order("ordem"),
      supabase.from("casas_missao").select("*").order("ordem")
    ]);
    if (obras) setObrasList(obras);
    if (casas) setCasasList(casas);
    setLoading(false);
  }

  async function handleImageUpload(e, callbackUrlSetter) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    let { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);

    if (uploadError) {
      alert("Erro ao enviar imagem: " + uploadError.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    callbackUrlSetter(data.publicUrl);
    setUploading(false);
  }

  async function handleSaveObra(e) {
    e.preventDefault();
    let error;

    if (editandoObraId) {
      const res = await supabase.from("obras_sociais").update(novaObra).eq("id", editandoObraId);
      error = res.error;
    } else {
      const res = await supabase.from("obras_sociais").insert([novaObra]);
      error = res.error;
    }

    if (!error) {
      resetFormObra();
      fetchDados();
      triggerSuccess();
    } else {
      alert("Erro ao salvar obra social.");
    }
  }

  async function handleSaveCasa(e) {
    e.preventDefault();
    let error;

    if (editandoCasaId) {
      const res = await supabase.from("casas_missao").update(novaCasa).eq("id", editandoCasaId);
      error = res.error;
    } else {
      const res = await supabase.from("casas_missao").insert([novaCasa]);
      error = res.error;
    }

    if (!error) {
      resetFormCasa();
      fetchDados();
      triggerSuccess();
    } else {
      alert("Erro ao salvar casa de missão.");
    }
  }

  function iniciarEdicaoObra(item) {
    setEditandoObraId(item.id);
    setNovaObra({
      categoria: item.categoria || "educacao",
      titulo: item.titulo || "",
      subtitulo: item.subtitulo || "",
      descricao: item.descricao || "",
      telefone: item.telefone || "",
      foto_url: item.foto_url || "",
      unidades_escolas: item.unidades_escolas || "",
      ordem: item.ordem || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function iniciarEdicaoCasa(item) {
    setEditandoCasaId(item.id);
    setNovaCasa({
      nome_casa: item.nome_casa || "",
      cidade_estado: item.cidade_estado || "",
      endereco: item.endereco || "",
      telefone: item.telefone || "",
      foto_url: item.foto_url || "",
      descricao_breve: item.descricao_breve || "",
      ordem: item.ordem || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetFormObra() {
    setEditandoObraId(null);
    setNovaObra({ categoria: "educacao", titulo: "", subtitulo: "", descricao: "", telefone: "", foto_url: "", unidades_escolas: "", ordem: 0 });
  }

  function resetFormCasa() {
    setEditandoCasaId(null);
    setNovaCasa({ nome_casa: "", cidade_estado: "", endereco: "", telefone: "", foto_url: "", descricao_breve: "", ordem: 0 });
  }

  async function handleDelete(tabela, id) {
    if (window.confirm("Deseja realmente excluir este item?")) {
      await supabase.from(tabela).delete().eq("id", id);
      fetchDados();
    }
  }

  function triggerSuccess() {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  // Filtragens para os Blocos Coloridos do Painel Lateral
  const obrasEducacao = obrasList.filter(o => o.categoria === "educacao");
  const obrasSaude = obrasList.filter(o => o.categoria === "saude");
  const obrasSocial = obrasList.filter(o => o.categoria === "social");

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#005a8d]">Gerenciamento de Obras e Missões</h1>
          <p className="text-gray-600 text-sm">Cadastre, edite e organize as obras sociais e casas missionárias.</p>
        </div>
        {onLogout && (
          <button onClick={onLogout} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-2xl font-bold text-sm border border-red-100">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        )}
      </div>

      {/* Seletor de Sub-aba */}
      <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => { setSubAba("obras"); resetFormObra(); }}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${subAba === "obras" ? "bg-[#005a8d] text-white shadow-xs" : "text-gray-600"}`}
        >
          Obras Sociais
        </button>
        <button
          onClick={() => { setSubAba("casas"); resetFormCasa(); }}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${subAba === "casas" ? "bg-[#005a8d] text-white shadow-xs" : "text-gray-600"}`}
        >
          Casas de Missão
        </button>
      </div>

      {/* Grid Principal dividida em duas colunas (Esquerda: Formulário / Direita: Quadros Coloridos) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* COLUNA ESQUERDA (Formulário de Cadastro/Edição) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            {success && (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-5 h-5 shrink-0" /> Operação realizada com sucesso!
              </div>
            )}

            {uploading && (
              <div className="bg-blue-50 text-[#005a8d] p-4 rounded-2xl flex items-center gap-2 font-medium">
                <Loader2 className="w-5 h-5 animate-spin" /> Fazendo upload da imagem...
              </div>
            )}

            {subAba === "obras" ? (
              <form onSubmit={handleSaveObra} className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-base text-[#005a8d]">
                    {editandoObraId ? "Editar Obra Social" : "Cadastrar Nova Obra Social"}
                  </h3>
                  {editandoObraId && (
                    <button type="button" onClick={resetFormObra} className="text-xs text-red-600 font-bold flex items-center gap-1 hover:underline">
                      <X className="w-4 h-4" /> Cancelar Edição
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Categoria (Bloco Temático)</label>
                    <select value={novaObra.categoria} onChange={e => setNovaObra({...novaObra, categoria: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm font-medium">
                      <option value="educacao">Educação</option>
                      <option value="saude">Saúde</option>
                      <option value="social">Social</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Título</label>
                    <input type="text" required placeholder="Ex: Escola Santa Mônica" value={novaObra.titulo} onChange={e => setNovaObra({...novaObra, titulo: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Subtítulo / Destaque</label>
                    <input type="text" placeholder="Ex: Ensino Infantil e Fundamental" value={novaObra.subtitulo} onChange={e => setNovaObra({...novaObra, subtitulo: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Telefone de Contato</label>
                    <input type="text" placeholder="(74) 90000-0000" value={novaObra.telefone} onChange={e => setNovaObra({...novaObra, telefone: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Foto Ilustrativa</label>
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setNovaObra({...novaObra, foto_url: url}))} className="text-xs text-gray-500 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-[#005a8d] file:text-white" />
                    {novaObra.foto_url && <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Foto carregada</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Unidades, Escolas ou Projetos Vinculados</label>
                    <input type="text" placeholder="Ex: Unidade Sede, Creche Paroquial..." value={novaObra.unidades_escolas} onChange={e => setNovaObra({...novaObra, unidades_escolas: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Descrição</label>
                  <textarea rows="3" placeholder="Detalhes da obra social..." value={novaObra.descricao} onChange={e => setNovaObra({...novaObra, descricao: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white font-sans text-sm" />
                </div>
                <button type="submit" className="bg-[#005a8d] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm shadow-sm hover:bg-[#004068]">
                  {editandoObraId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-5 h-5" />} 
                  {editandoObraId ? "Salvar Alterações" : "Adicionar Obra Social"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSaveCasa} className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-base text-[#005a8d]">
                    {editandoCasaId ? "Editar Casa de Missão" : "Cadastrar Nova Casa de Missão"}
                  </h3>
                  {editandoCasaId && (
                    <button type="button" onClick={resetFormCasa} className="text-xs text-red-600 font-bold flex items-center gap-1 hover:underline">
                      <X className="w-4 h-4" /> Cancelar Edição
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Nome da Casa</label>
                    <input type="text" required placeholder="Ex: Casa Madre Paulina" value={novaCasa.nome_casa} onChange={e => setNovaCasa({...novaCasa, nome_casa: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Cidade / Estado</label>
                    <input type="text" required placeholder="Ex: Petrolina - PE" value={novaCasa.cidade_estado} onChange={e => setNovaCasa({...novaCasa, cidade_estado: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Telefone de Contato</label>
                    <input type="text" placeholder="(74) 90000-0000" value={novaCasa.telefone} onChange={e => setNovaCasa({...novaCasa, telefone: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Foto da Casa</label>
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setNovaCasa({...novaCasa, foto_url: url}))} className="text-xs text-gray-500 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-[#005a8d] file:text-white" />
                    {novaCasa.foto_url && <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Foto carregada</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Endereço Completo</label>
                    <input type="text" required placeholder="Rua Exemplo, 123 - Bairro" value={novaCasa.endereco} onChange={e => setNovaCasa({...novaCasa, endereco: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Descrição Breve</label>
                  <textarea rows="2" placeholder="Frente de atuação da casa..." value={novaCasa.descricao_breve} onChange={e => setNovaCasa({...novaCasa, descricao_breve: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white font-sans text-sm" />
                </div>
                <button type="submit" className="bg-[#005a8d] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm shadow-sm hover:bg-[#004068]">
                  {editandoCasaId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-5 h-5" />} 
                  {editandoCasaId ? "Salvar Alterações" : "Adicionar Casa de Missão"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* COLUNA DIREITA: Quadros Coloridos por Categoria para Visualização e Edição Rápida */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gray-900 text-white p-5 rounded-3xl shadow-md sticky top-6 space-y-6">
            <h3 className="font-serif font-bold text-base text-[#c5a059] border-b border-white/10 pb-3 flex items-center gap-2">
              <span>🎨 Quadros Temáticos</span>
            </h3>

            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#c5a059]" /></div>
            ) : subAba === "obras" ? (
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-1">
                
                {/* Bloco Educação (Azul) */}
                <div className="bg-blue-950/80 border border-blue-500/30 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-blue-300 font-bold text-sm border-b border-blue-800/50 pb-2">
                    <GraduationCap className="w-4 h-4" /> Educação ({obrasEducacao.length})
                  </div>
                  {obrasEducacao.length === 0 ? (
                    <p className="text-xs text-white/50 italic">Nenhuma obra cadastrada.</p>
                  ) : (
                    obrasEducacao.map(item => (
                      <div key={item.id} className="bg-white/10 p-3 rounded-xl border border-white/10 flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-bold text-white text-xs">{item.titulo}</h4>
                          {item.telefone && <p className="text-[10px] text-blue-200 mt-0.5">📞 {item.telefone}</p>}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => iniciarEdicaoObra(item)} className="p-1.5 text-blue-200 hover:bg-white/20 rounded-lg" title="Editar">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete("obras_sociais", item.id)} className="p-1.5 text-red-300 hover:bg-white/20 rounded-lg" title="Excluir">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Bloco Saúde (Verde) */}
                <div className="bg-emerald-950/80 border border-emerald-500/30 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm border-b border-emerald-800/50 pb-2">
                    <Stethoscope className="w-4 h-4" /> Saúde ({obrasSaude.length})
                  </div>
                  {obrasSaude.length === 0 ? (
                    <p className="text-xs text-white/50 italic">Nenhuma obra cadastrada.</p>
                  ) : (
                    obrasSaude.map(item => (
                      <div key={item.id} className="bg-white/10 p-3 rounded-xl border border-white/10 flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-bold text-white text-xs">{item.titulo}</h4>
                          {item.telefone && <p className="text-[10px] text-emerald-200 mt-0.5">📞 {item.telefone}</p>}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => iniciarEdicaoObra(item)} className="p-1.5 text-emerald-200 hover:bg-white/20 rounded-lg" title="Editar">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete("obras_sociais", item.id)} className="p-1.5 text-red-300 hover:bg-white/20 rounded-lg" title="Excluir">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Bloco Social (Vermelho) */}
                <div className="bg-red-950/80 border border-red-500/30 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-red-300 font-bold text-sm border-b border-red-800/50 pb-2">
                    <Users className="w-4 h-4" /> Social ({obrasSocial.length})
                  </div>
                  {obrasSocial.length === 0 ? (
                    <p className="text-xs text-white/50 italic">Nenhuma obra cadastrada.</p>
                  ) : (
                    obrasSocial.map(item => (
                      <div key={item.id} className="bg-white/10 p-3 rounded-xl border border-white/10 flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-bold text-white text-xs">{item.titulo}</h4>
                          {item.telefone && <p className="text-[10px] text-red-200 mt-0.5">📞 {item.telefone}</p>}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => iniciarEdicaoObra(item)} className="p-1.5 text-red-200 hover:bg-white/20 rounded-lg" title="Editar">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete("obras_sociais", item.id)} className="p-1.5 text-red-300 hover:bg-white/20 rounded-lg" title="Excluir">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            ) : (
              /* Quadro de Casas de Missão */
              <div className="bg-amber-950/80 border border-amber-500/30 p-4 rounded-2xl space-y-3 max-h-[600px] overflow-y-auto">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm border-b border-amber-800/50 pb-2">
                  <Building2 className="w-4 h-4" /> Casas de Missão ({casasList.length})
                </div>
                {casasList.length === 0 ? (
                  <p className="text-xs text-white/50 italic">Nenhuma casa cadastrada.</p>
                ) : (
                  casasList.map(item => (
                    <div key={item.id} className="bg-white/10 p-3 rounded-xl border border-white/10 flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[9px] font-bold text-amber-200 uppercase">{item.cidade_estado}</span>
                        <h4 className="font-bold text-white text-xs">{item.nome_casa}</h4>
                        {item.telefone && <p className="text-[10px] text-amber-200 mt-0.5">📞 {item.telefone}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => iniciarEdicaoCasa(item)} className="p-1.5 text-amber-200 hover:bg-white/20 rounded-lg" title="Editar">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete("casas_missao", item.id)} className="p-1.5 text-red-300 hover:bg-white/20 rounded-lg" title="Excluir">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
