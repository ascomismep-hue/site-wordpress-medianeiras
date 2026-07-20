import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Heart, Mail, Inbox } from "lucide-react";

export default function AdminMensagens() {
  const [tab, setTab] = useState("prayers");
  const [prayers, setPrayers] = useState([]);
  const [vocations, setVocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    // Buscamos dados das duas tabelas
    const [ { data: p }, { data: v } ] = await Promise.all([
      supabase.from("prayer_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("vocation_forms").select("*").order("created_at", { ascending: false })
    ]);
    
    setPrayers(p || []);
    setVocations(v || []);
    setLoading(false);
  };

  useEffect(() => { reload(); }, []);

  // Função genérica de atualização de status
  const updateStatus = async (table, id, status) => {
    await supabase.from(table).update({ status }).eq("id", id);
    reload();
  };

  const tabs = [
    { id: "prayers", label: "Pedidos de Oração", count: prayers.length, icon: Heart, color: "#e31e24" },
    { id: "vocations", label: "Contatos Vocacionais", count: vocations.length, icon: Mail, color: "#8e44ad" },
  ];

  const list = tab === "prayers" ? prayers : vocations;

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#005a8d] mb-1">Mensagens Recebidas</h1>
      <p className="text-gray-500 mb-8">Acesse os pedidos de oração e contatos vocacionais.</p>

      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button 
            key={t.id} 
            onClick={() => setTab(t.id)} 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${tab === t.id ? "text-white shadow-md" : "bg-white text-[#005a8d] border border-[#c5a059]/20"}`}
            style={tab === t.id ? { backgroundColor: t.color } : {}}
          >
            <t.icon className="w-4 h-4" /> {t.label} 
            <span className={`text-xs px-2 py-0.5 rounded-full ${tab === t.id ? "bg-white/25" : "bg-gray-100"}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : list.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#c5a059]/15">
          <Inbox className="w-10 h-10 mx-auto text-[#c5a059]/30 mb-3" />
          <p className="text-gray-500">Nenhuma mensagem recebida.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(item => {
            const statusColors = { new: "bg-[#e31e24]/15 text-[#e31e24]", contacted: "bg-[#c5a059]/15 text-[#c5a059]", prayed: "bg-green-100 text-green-700", closed: "bg-gray-100 text-gray-500" };
            const statusLabel = { new: "Nova", contacted: "Em contato", prayed: "Rezada", closed: "Concluída" };
            
            return (
              <div key={item.id} className="bg-white rounded-xl border border-[#c5a059]/15 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-[#005a8d]">{item.name}</h3>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${statusColors[item.status] || statusColors.new}`}>
                        {statusLabel[item.status] || "Nova"}
                      </span>
                    </div>
                    {tab === "vocations" ? (
                      <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                        {item.email && <div>✉ {item.email}</div>}
                        <div>{[item.phone, item.city, item.age ? `${item.age} anos` : null].filter(Boolean).join(" • ")}</div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 mt-1">
                        {item.request_type === "missa" ? "Intenção de Missa" : "Prece / Intenção"}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {tab === "prayers" ? (
                      <>
                        {item.status === "new" && <button onClick={() => updateStatus("prayer_requests", item.id, "prayed")} className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 font-semibold">Marcar rezada</button>}
                        <button onClick={() => updateStatus("prayer_requests", item.id, "closed")} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 font-semibold">Concluir</button>
                      </>
                    ) : (
                      <>
                        {item.status === "new" && <button onClick={() => updateStatus("vocation_forms", item.id, "contacted")} className="text-xs px-3 py-1.5 rounded-lg bg-[#c5a059]/15 text-[#c5a059] font-semibold">Marcar contatado</button>}
                        <button onClick={() => updateStatus("vocation_forms", item.id, "closed")} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 font-semibold">Concluir</button>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-3 bg-[#f8f9fa] p-3 rounded-xl">{tab === "prayers" ? item.intention : item.message || "—"}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
