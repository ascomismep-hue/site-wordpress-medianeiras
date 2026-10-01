import { useState, useEffect } from "react";
import { PlusCircle, Trash2, Calendar, Clock, MapPin, Loader2, CheckCircle2 } from "lucide-react";
// Certifique-se de que o cliente Supabase está configurado corretamente no seu projeto (ex: import { supabase } from "../lib/supabaseClient";)

export default function AdminAgendaPage() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    data_evento: "",
    horario: "",
    local: ""
  });

  // Busca os eventos cadastrados
  async function carregarEventos() {
    setLoading(true);
    try {
      // Exemplo usando Supabase:
      // const { data, error } = await supabase.from('agenda_eventos').select('*').order('data_evento', { ascending: true });
      // if (error) throw error;
      // setEventos(data || []);
    } catch (err) {
      console.error("Erro ao carregar eventos:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarEventos();
  }, []);

  // Cadastra um novo evento
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      // Exemplo de inserção no Supabase:
      // const { error } = await supabase.from('agenda_eventos').insert([{ ...formData, tipo: 'geral' }]);
      // if (error) throw error;

      setSucesso(true);
      setFormData({ titulo: "", descricao: "", data_evento: "", horario: "", local: "" });
      carregarEventos();
      setTimeout(() => setSucesso(false), 4000);
    } catch (err) {
      console.error("Erro ao salvar evento:", err);
      alert("Erro ao salvar evento. Verifique os campos.");
    } finally {
      setSalvando(false);
    }
  };

  // Exclui um evento
  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;
    try {
      // const { error } = await supabase.from('agenda_eventos').delete().eq('id', id);
      // if (error) throw error;
      carregarEventos();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      
      {/* Cabeçalho */}
      <div className="bg-[#005a8d] text-white p-8 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="bg-white/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Painel Restrito</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold mt-2">Administração da Agenda Geral</h1>
        </div>
        <p className="text-xs text-white/80 max-w-xs text-center md:text-right">
          Gerencie os compromissos institucionais em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Formulário de Cadastro */}
        <div className="lg:col-span-5 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
          <h2 className="text-xl font-serif font-bold text-[#005a8d] flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#c5a059]" /> Novo Compromisso
          </h2>

          {sucesso && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              Evento cadastrado com sucesso!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Título do Evento</label>
              <input 
                type="text" 
                required
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                placeholder="Ex: Reunião Pastoral" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#005a8d] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Data</label>
                <input 
                  type="date" 
                  required
                  value={formData.data_evento}
                  onChange={(e) => setFormData({...formData, data_evento: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#005a8d] outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Horário</label>
                <input 
                  type="text" 
                  value={formData.horario}
                  onChange={(e) => setFormData({...formData, horario: e.target.value})}
                  placeholder="Ex: 19:30" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#005a8d] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Local</label>
              <input 
                type="text" 
                value={formData.local}
                onChange={(e) => setFormData({...formData, local: e.target.value})}
                placeholder="Ex: Matriz / Auditório" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#005a8d] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descrição</label>
              <textarea 
                rows="3"
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                placeholder="Detalhes do compromisso..." 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#005a8d] outline-none resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={salvando}
              className="w-full py-3.5 bg-[#005a8d] hover:bg-[#004068] text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
              Cadastrar Evento
            </button>
          </form>
        </div>

        {/* Listagem de Eventos Cadastrados */}
        <div className="lg:col-span-7 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
          <h2 className="text-xl font-serif font-bold text-[#005a8d] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#c5a059]" /> Eventos Cadastrados
          </h2>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#005a8d]" /></div>
          ) : eventos.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs italic bg-gray-50 rounded-2xl border border-gray-100">
              Nenhum evento registrado no banco de dados.
            </div>
          ) : (
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
              {eventos.map((ev) => (
                <div key={ev.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500">{ev.data_evento}</span>
                      {ev.horario && <span className="text-xs text-gray-400">• {ev.horario}</span>}
                    </div>
                    <h3 className="font-serif font-bold text-sm text-gray-900">{ev.titulo}</h3>
                    {ev.local && <p className="text-[11px] text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3 text-[#c5a059]" /> {ev.local}</p>}
                  </div>

                  <button 
                    onClick={() => handleDelete(ev.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Excluir evento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
