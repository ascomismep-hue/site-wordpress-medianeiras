import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Plus, Trash2, Save, CheckCircle2 } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("sobre");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Estados dos formulários
  const [sobreData, setSobreData] = useState({ historia: "" });
  const [irmasList, setIrmasList] = useState([]);
  const [madresList, setMadresList] = useState([]);
  const [memorialList, setMemorialList] = useState([]);
  const [domCampeloData, setDomCampeloData] = useState({ historia_biografia: "", sobre_a_causa: "" });
  const [gracasList, setGracasList] = useState([]);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  async function fetchData(tab) {
    setLoading(true);
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

  function triggerSuccess() {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Menu Lateral do Admin */}
      <div className="w-full md:w-64 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
        <h2 className="font-serif font-bold text-lg text-[#005a8d] mb-4 px-2">Painel Admin</h2>
        {[
          { id: "sobre", label: "Sobre Nós" },
          { id: "irmas", label: "Irmãs" },
          { id: "madres", label: "Madres Gerais" },
          { id: "memorial", label: "Memorial" },
          { id: "domcampelo", label: "Causa Dom Campelo" },
          { id: "gracas", label: "Graças Alcançadas" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-left px-4 py-2.5 rounded-xl font-medium transition-colors ${
              activeTab === tab.id ? "bg-[#005a8d] text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da Aba Ativa */}
      <div className="flex-1 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        {success && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl mb-6 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5" /> Dados salvos com sucesso!
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>
        ) : (
          <>
            {activeTab === "sobre" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#005a8d] mb-4">Editar Sobre Nós e Linha do Tempo</h3>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Breve História</label>
                  <textarea 
                    rows="8" 
                    value={sobreData.historia || ""} 
                    onChange={e => setSobreData({...sobreData, historia: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-300 font-sans"
                  />
                </div>
                <button onClick={handleSaveSobre} className="bg-[#005a8d] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">
                  <Save className="w-4 h-4" /> Salvar Alterações
                </button>
              </div>
            )}

            {activeTab === "domcampelo" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#005a8d] mb-4">Editar Causa Dom Campelo</h3>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">História e Biografia</label>
                  <textarea 
                    rows="5" 
                    value={domCampeloData.historia_biografia || ""} 
                    onChange={e => setDomCampeloData({...domCampeloData, historia_biografia: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-300 font-sans"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Sobre a Causa</label>
                  <textarea 
                    rows="5" 
                    value={domCampeloData.sobre_a_causa || ""} 
                    onChange={e => setDomCampeloData({...domCampeloData, sobre_a_causa: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-300 font-sans"
                  />
                </div>
                <button onClick={handleSaveDomCampelo} className="bg-[#005a8d] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">
                  <Save className="w-4 h-4" /> Salvar Alterações
                </button>
              </div>
            )}

            {/* Outras abas (Irmãs, Madres, Memorial, Graças) podem seguir o mesmo padrão de listagem e cadastro */}
            {["irmas", "madres", "memorial", "gracas"].includes(activeTab) && (
              <div>
                <h3 className="text-xl font-bold text-[#005a8d] mb-4 capitalize">Gerenciar {activeTab}</h3>
                <p className="text-gray-600">Listagem de registros cadastrados no banco de dados para esta seção.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
