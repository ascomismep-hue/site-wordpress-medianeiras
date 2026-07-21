import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Plus, Trash2, Heart, Building2, CheckCircle2, LogOut } from "lucide-react";

export default function AdminObrasMissoes({ onLogout }) {
  const [subAba, setSubAba] = useState("obras"); // "obras" ou "casas"
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [obrasList, setObrasList] = useState([]);
  const [casasList, setCasasList] = useState([]);

  // Formulário Obra Social
  const [novaObra, setNovaObra] = useState({
    categoria: "educacao",
    titulo: "",
    subtitulo: "",
    descricao: "",
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
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    let { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);

    if (uploadError) {
      alert("Erro ao enviar imagem: " + uploadError.message);
      return;
    }
    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    callbackUrlSetter(data.publicUrl);
  }

  async function handleAddObra(e) {
    e.preventDefault();
    const { error } = await supabase.from("obras_sociais").insert([novaObra]);
    if (!error) {
      setNovaObra({ categoria: "educacao", titulo: "", subtitulo: "", descricao: "", foto_url: "", unidades_escolas: "", ordem: 0 });
      fetchDados();
      triggerSuccess();
    } else alert("Erro ao cadastrar obra social.");
  }

  async function handleAddCasa(e) {
    e.preventDefault();
    const { error } = await supabase.from("casas_missao").insert([novaCasa]);
    if (!error) {
      setNovaCasa({ nome_casa: "", cidade_estado: "", endereco: "", telefone: "", foto_url: "", descricao_breve: "", ordem: 0 });
      fetchDados();
      triggerSuccess();
    } else alert("Erro ao cadastrar casa de missão.");
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#005a8d]">Gerenciamento de Obras e Missões</h1>
          <p className="text-gray-600 text-sm">Cadastre e organize as obras sociais e casas missionárias.</p>
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
          onClick={() => setSubAba("obras")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${subAba === "obras" ? "bg-[#005a8d] text-white shadow-xs" : "text-gray-600"}`}
        >
          Obras Sociais
        </button>
        <button
          onClick={() => setSubAba("casas")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${subAba === "casas" ? "bg-[#005a8d] text-white shadow-xs" : "text-gray-600"}`}
        >
          Casas de Missão
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
        {success && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0" /> Operação realizada com sucesso!
          </div>
        )}

        {subAba === "obras" ? (
          <div className="space-y-8">
            <form onSubmit={handleAddObra} className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
              <h3 className="font-bold text-base text-[#005a8d]">Cadastrar Obra Social</h3>
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
                  <label className="block text-xs font-bold text-gray-500 mb-1">Foto Ilustrativa</label>
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setNovaObra({...novaObra, foto_url: url}))} className="text-xs text-gray-500 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-[#005a8d] file:text-white" />
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
              <button type="submit" className="bg-[#005a8d] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm">
                <Plus className="w-5 h-5" /> Adicionar Obra Social
              </button>
            </form>

            <div>
              <h3 className="font-bold text-lg text-[#005a8d] mb-4">Obras Cadastradas ({obrasList.length})</h3>
              {loading ? (
                <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-[#005a8d]" /></div>
              ) : (
                <div className="space-y-3">
                  {obrasList.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#005a8d] px-2 py-0.5 rounded-full">{item.categoria}</span>
                        <h4 className="font-bold text-gray-800 text-base mt-1">{item.titulo}</h4>
                        <p className="text-xs text-gray-500">{item.subtitulo}</p>
                      </div>
                      <button onClick={() => handleDelete("obras_sociais", item.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <form onSubmit={handleAddCasa} className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4">
              <h3 className="font-bold text-base text-[#005a8d]">Cadastrar Casa de Missão</h3>
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
                  <label className="block text-xs font-bold text-gray-500 mb-1">Telefone (Opcional)</label>
                  <input type="text" placeholder="(74) 90000-0000" value={novaCasa.telefone} onChange={e => setNovaCasa({...novaCasa, telefone: e.target.value})} className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Foto da Casa</label>
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setNovaCasa({...novaCasa, foto_url: url}))} className="text-xs text-gray-500 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-[#005a8d] file:text-white" />
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
              <button type="submit" className="bg-[#005a8d] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm">
                <Plus className="w-5 h-5" /> Adicionar Casa de Missão
              </button>
            </form>

            <div>
              <h3 className="font-bold text-lg text-[#005a8d] mb-4">Casas Cadastradas ({casasList.length})</h3>
              {loading ? (
                <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-[#005a8d]" /></div>
              ) : (
                <div className="space-y-3">
                  {casasList.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-[#c5a059] px-2 py-0.5 rounded-full">{item.cidade_estado}</span>
                        <h4 className="font-bold text-gray-800 text-base mt-1">{item.nome_casa}</h4>
                        <p className="text-xs text-gray-500">{item.endereco}</p>
                      </div>
                      <button onClick={() => handleDelete("casas_missao", item.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
