import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Save, CheckCircle2, Plus, Trash2, Shield } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("sobre");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Estados dos dados
  const [sobreData, setSobreData] = useState({ id: 1, historia: "", linha_do_tempo: [] });
  const [irmasList, setIrmasList] = useState([]);
  const [madresList, setMadresList] = useState([]);
  const [memorialList, setMemorialList] = useState([]);
  const [domCampeloData, setDomCampeloData] = useState({ id: 1, historia_biografia: "", sobre_a_causa: "" });
  const [gracasList, setGracasList] = useState([]);

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab]);

  async function fetchTabData(tab) {
    setLoading(true);
    try {
      if (tab === "sobre") {
        const { data } = await supabase.from("institucional_sobre").select("*").limit(1).single();
        if (data) setSobreData(data);
      } else if (tab === "irmas") {
        const { data } = await supabase.from("irmas").select("*");
        if (data) setIrmasList(data);
      } else if (tab === "madres") {
        const { data } = await supabase.from("madres_gerais").select("*");
        if (data) setMadresList(data);
      } else if (tab === "memorial") {
        const { data } = await supabase.from("memorial_falecidas").select("*");
        if (data) setMemorialList(data);
      } else if (tab === "domcampelo") {
        const { data } = await supabase.from("causa_dom_campelo").select("*").limit(1).single();
        if (data) setDomCampeloData(data);
      } else if (tab === "gracas") {
        const { data } = await supabase.from("gracas_dom_campelo").select("*");
        if (data) setGracasList(data);
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
    setLoading(false);
  }

  async function handleSaveSobre() {
    await supabase.from("institucional_sobre").update({ historia: sobreData.historia }).eq("id", sobreData.id);
    triggerSuccess();
  }

  async function handleSaveDomCampelo() {
    await supabase.from("causa_dom_campelo").update({
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
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-[#005a8d]" />
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#005a8d]">Painel Administrativo Unificado</h1>
          <p className="text-gray-600 text-sm">Gerencie todo o conteúdo das páginas institucionais do site.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Menu Lateral de Abas */}
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

        {/* Área de Edição */}
        <div className="flex-1 bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
          {success && (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl mb-6 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0" /> Alterações salvas com sucesso!
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>
          ) : (
            <>
              {/* SOBRE NÓS */}
              {activeTab === "sobre" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Editar Sobre Nós</h2>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Breve História</label>
                    <textarea 
                      rows="10" 
                      value={sobreData.historia || ""} 
                      onChange={e => setSobreData({...sobreData, historia: e.target.value})}
                      className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#005a8d] font-sans text-gray-700 leading-relaxed"
                    />
                  </div>
                  <button onClick={handleSaveSobre} className="bg-[#005a8d] hover:bg-[#004068] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-colors">
                    <Save className="w-5 h-5" /> Salvar História
                  </button>
                </div>
              )}

              {/* CAUSA DOM CAMPELO */}
              {activeTab === "domcampelo" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Editar Causa Dom Campelo</h2>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">História e Biografia</label>
                    <textarea 
                      rows="6" 
                      value={domCampeloData.historia_biografia || ""} 
                      onChange={e => setDomCampeloData({...domCampeloData, historia_biografia: e.target.value})}
                      className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#005a8d] font-sans text-gray-700 leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Sobre a Causa</label>
                    <textarea 
                      rows="6" 
                      value={domCampeloData.sobre_a_causa || ""} 
                      onChange={e => setDomCampeloData({...domCampeloData, sobre_a_causa: e.target.value})}
                      className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#005a8d] font-sans text-gray-700 leading-relaxed"
                    />
                  </div>
                  <button onClick={handleSaveDomCampelo} className="bg-[#005a8d] hover:bg-[#004068] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-colors">
                    <Save className="w-5 h-5" /> Salvar Alterações
                  </button>
                </div>
              )}

              {/* IRMÃS */}
              {activeTab === "irmas" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Gerenciar Irmãs</h2>
                    <span className="text-sm text-gray-500">{irmasList.length} cadastradas</span>
                  </div>
                  <div className="space-y-4">
                    {irmasList.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                          <h3 className="font-bold text-gray-800">{item.nome}</h3>
                          <p className="text-xs text-gray-500">Nascimento: {item.data_nascimento} | Votos: {item.votos_perpetuos}</p>
                        </div>
                        <button onClick={() => handleDelete("irmas", item.id, "irmas")} className="text-red-500 hover:text-red-700 p-2">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {irmasList.length === 0 && <p className="text-gray-500 text-center py-8">Nenhuma irmã cadastrada.</p>}
                  </div>
                </div>
              )}

              {/* MADRES GERAIS */}
              {activeTab === "madres" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Gerenciar Madres Gerais</h2>
                    <span className="text-sm text-gray-500">{madresList.length} cadastradas</span>
                  </div>
                  <div className="space-y-4">
                    {madresList.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                          <h3 className="font-bold text-gray-800">{item.nome}</h3>
                          <p className="text-xs text-gray-500">Mandato: {item.periodo_mandato}</p>
                        </div>
                        <button onClick={() => handleDelete("madres_gerais", item.id, "madres")} className="text-red-500 hover:text-red-700 p-2">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {madresList.length === 0 && <p className="text-gray-500 text-center py-8">Nenhuma Madre cadastrada.</p>}
                  </div>
                </div>
              )}

              {/* MEMORIAL */}
              {activeTab === "memorial" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Gerenciar Memorial</h2>
                    <span className="text-sm text-gray-500">{memorialList.length} cadastradas</span>
                  </div>
                  <div className="space-y-4">
                    {memorialList.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                          <h3 className="font-bold text-gray-800">{item.nome}</h3>
                          <p className="text-xs text-gray-500">Falecimento: {item.data_falecimento}</p>
                        </div>
                        <button onClick={() => handleDelete("memorial_falecidas", item.id, "memorial")} className="text-red-500 hover:text-red-700 p-2">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {memorialList.length === 0 && <p className="text-gray-500 text-center py-8">Nenhum registro no memorial.</p>}
                  </div>
                </div>
              )}

              {/* GRAÇAS ALCANÇADAS */}
              {activeTab === "gracas" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Relatos de Graças Alcançadas</h2>
                    <span className="text-sm text-gray-500">{gracasList.length} relatos</span>
                  </div>
                  <div className="space-y-4">
                    {gracasList.map(item => (
                      <div key={item.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-[#005a8d]">{item.nome_devoto}</h3>
                            <p className="text-xs text-gray-500">{item.cidade_estado} • {new Date(item.data_envio).toLocaleDateString()}</p>
                          </div>
                          <button onClick={() => handleDelete("gracas_dom_campelo", item.id, "gracas")} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-gray-700 text-sm italic bg-white p-3 rounded-xl border border-gray-100">"{item.relato}"</p>
                      </div>
                    ))}
                    {gracasList.length === 0 && <p className="text-gray-500 text-center py-8">Nenhum relato enviado ainda.</p>}
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
