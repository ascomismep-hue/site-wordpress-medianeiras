import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Trash2, Heart, Calendar, Phone, Mail, MapPin, User, LogOut, CheckCircle } from "lucide-react";

export default function AdminVocacional({ onLogout }) {
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecionada, setSelecionada] = useState(null);

  useEffect(() => {
    fetchInscricoes();
  }, []);

  async function fetchInscricoes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("inscricoes_vocacionais")
      .select("*")
      .order("data_inscricao", { ascending: false });

    if (data && !error) {
      setInscricoes(data);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (window.confirm("Deseja realmente excluir esta inscrição vocacional?")) {
      const { error } = await supabase.from("inscricoes_vocacionais").delete().eq("id", id);
      if (!error) {
        if (selecionada?.id === id) setSelecionada(null);
        fetchInscricoes();
      } else {
        alert("Erro ao excluir inscrição.");
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#005a8d]">Acompanhamento Vocacional</h1>
          <p className="text-gray-600 text-sm">Gerencie as fichas enviadas pelas candidatas interessadas na vida religiosa.</p>
        </div>
        {onLogout && (
          <button onClick={onLogout} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-2xl font-bold text-sm border border-red-100">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Lista de Inscrições */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-base text-[#005a8d] border-b pb-3 flex items-center justify-between">
            <span>Candidatas Inscritas</span>
            <span className="bg-[#005a8d]/10 text-[#005a8d] text-xs px-2.5 py-1 rounded-full font-bold">{inscricoes.length}</span>
          </h3>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#005a8d]" /></div>
          ) : inscricoes.length === 0 ? (
            <p className="text-gray-500 text-xs text-center py-8">Nenhuma inscrição vocacional recebida até o momento.</p>
          ) : (
            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
              {inscricoes.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelecionada(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selecionada?.id === item.id 
                      ? "bg-[#005a8d] text-white border-[#005a8d] shadow-sm" 
                      : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm">{item.nome}</h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${selecionada?.id === item.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"}`}>
                      {item.idade} anos
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${selecionada?.id === item.id ? "text-white/80" : "text-gray-500"}`}>{item.cidade_estado}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalhes da Candidata Selecionada */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          {selecionada ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">Ficha Vocacional</span>
                  <h2 className="text-2xl font-serif font-bold text-[#005a8d] mt-1">{selecionada.nome}</h2>
                </div>
                <button 
                  onClick={() => handleDelete(selecionada.id)}
                  className="bg-red-50 text-red-600 hover:bg-red-100 p-2.5 rounded-2xl transition-colors border border-red-100 flex items-center gap-1.5 text-xs font-bold"
                  title="Excluir ficha"
                >
                  <Trash2 className="w-4 h-4" /> Excluir
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-2.5 text-gray-700">
                  <User className="w-4 h-4 text-[#005a8d]" />
                  <span><strong>Idade:</strong> {selecionada.idade} anos</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700">
                  <MapPin className="w-4 h-4 text-[#005a8d]" />
                  <span><strong>Local:</strong> {selecionada.cidade_estado}</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700">
                  <Phone className="w-4 h-4 text-[#005a8d]" />
                  <span><strong>Telefone/WhatsApp:</strong> {selecionada.telefone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700">
                  <Mail className="w-4 h-4 text-[#005a8d]" />
                  <span><strong>E-mail:</strong> {selecionada.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700 sm:col-span-2">
                  <Calendar className="w-4 h-4 text-[#005a8d]" />
                  <span><strong>Data da Inscrição:</strong> {new Date(selecionada.data_inscricao).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-[#005a8d]">Relato e Desejo Vocacional:</h4>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {selecionada.testemunho}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 space-y-3">
              <Heart className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-gray-700">Nenhuma candidata selecionada</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">Selecione uma ficha ao lado para visualizar os detalhes completos do discernimento vocacional.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
