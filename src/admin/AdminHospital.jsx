import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { 
  Loader2, 
  Save, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2,
  LogOut
} from "lucide-react";

export default function AdminHospital({ onLogout }) {
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [anoAtivo, setAnoAtivo] = useState(2026);

  const [formEdit, setFormEdit] = useState({
    urgencia_upa: 0,
    consultas_ambulatoriais: 0,
    procedimentos_consultas: 0,
    cirurgias_eletivas: 0,
    internamentos_total: 0,
    partos_total: 0,
    exames_rx: 0
  });

  const carregarDados = async (ano) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hmsm_indicadores")
      .select("*")
      .eq("ano", ano)
      .single();

    if (!error && data) {
      setFormEdit({
        urgencia_upa: data.urgencia_upa || 0,
        consultas_ambulatoriais: data.consultas_ambulatoriais || 0,
        procedimentos_consultas: data.procedimentos_consultas || 0,
        cirurgias_eletivas: data.cirurgias_eletivas || 0,
        internamentos_total: data.internamentos_total || 0,
        partos_total: data.partos_total || 0,
        exames_rx: data.exames_rx || 0
      });
    } else {
      setFormEdit({
        urgencia_upa: 0,
        consultas_ambulatoriais: 0,
        procedimentos_consultas: 0,
        cirurgias_eletivas: 0,
        internamentos_total: 0,
        partos_total: 0,
        exames_rx: 0
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarDados(anoAtivo);
  }, [anoAtivo]);

  const handleSalvarDados = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setSucesso(false);

    try {
      const { error } = await supabase
        .from("hmsm_indicadores")
        .upsert({
          ano: anoAtivo,
          urgencia_upa: Number(formEdit.urgencia_upa),
          consultas_ambulatoriais: Number(formEdit.consultas_ambulatoriais),
          procedimentos_consultas: Number(formEdit.procedimentos_consultas),
          cirurgias_eletivas: Number(formEdit.cirurgias_eletivas),
          internamentos_total: Number(formEdit.internamentos_total),
          partos_total: Number(formEdit.partos_total),
          exames_rx: Number(formEdit.exames_rx),
          atualizado_em: new Date()
        }, { onConflict: "ano" });

      if (error) throw error;

      setSucesso(true);
      setTimeout(() => setSucesso(false), 4000);
    } catch (err) {
      console.error("Erro ao atualizar dados:", err);
      alert("Erro ao atualizar os indicadores na base de dados.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Cabeçalho da ADM */}
        <div className="bg-gradient-to-r from-[#003b6f] to-[#005a8d] text-white p-6 rounded-3xl shadow-md flex flex-wrap justify-between items-center gap-4 border-b-4 border-[#e31e24]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#003b6f] font-bold shadow">
              <ShieldCheck className="w-6 h-6 text-[#e31e24]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-[#e31e24] px-2.5 py-0.5 rounded-full text-white">
                Painel Gestor HMSM
              </span>
              <h1 className="text-xl font-serif font-bold text-white mt-0.5">Alimentação de Dados Assistenciais</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/hospital"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/25 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-white/20"
            >
              <ArrowLeft className="w-4 h-4" /> Ver Portal Público
            </Link>
            {onLogout && (
              <button onClick={onLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">
                <LogOut className="w-4 h-4" /> Sair
              </button>
            )}
          </div>
        </div>

        {/* Seletor de Ano para Edição */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Selecione o Ano para Alimentação:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAnoAtivo(2025)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                anoAtivo === 2025 ? "bg-[#003b6f] text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              2025
            </button>
            <button
              type="button"
              onClick={() => setAnoAtivo(2026)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                anoAtivo === 2026 ? "bg-[#003b6f] text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              2026
            </button>
          </div>
        </div>

        {sucesso && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-sm flex items-center gap-3 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Indicadores do ano {anoAtivo} salvos com sucesso na base de dados!</span>
          </div>
        )}

        {/* Formulário de Edição com os Campos da Planilha */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#003b6f]" /></div>
          ) : (
            <form onSubmit={handleSalvarDados} className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Urgência / UPA</label>
                <input
                  type="number"
                  value={formEdit.urgencia_upa}
                  onChange={(e) => setFormEdit({ ...formEdit, urgencia_upa: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003b6f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Consultas Ambulatoriais</label>
                <input
                  type="number"
                  value={formEdit.consultas_ambulatoriais}
                  onChange={(e) => setFormEdit({ ...formEdit, consultas_ambulatoriais: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003b6f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Consultas c/ Procedimento</label>
                <input
                  type="number"
                  value={formEdit.procedimentos_consultas}
                  onChange={(e) => setFormEdit({ ...formEdit, procedimentos_consultas: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003b6f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Cirurgias Eletivas</label>
                <input
                  type="number"
                  value={formEdit.cirurgias_eletivas}
                  onChange={(e) => setFormEdit({ ...formEdit, cirurgias_eletivas: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003b6f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Internamentos Totais (Clínica & UTI)</label>
                <input
                  type="number"
                  value={formEdit.internamentos_total}
                  onChange={(e) => setFormEdit({ ...formEdit, internamentos_total: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003b6f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Partos Realizados (Maternidade)</label>
                <input
                  type="number"
                  value={formEdit.partos_total}
                  onChange={(e) => setFormEdit({ ...formEdit, partos_total: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003b6f]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Exames RX Geral</label>
                <input
                  type="number"
                  value={formEdit.exames_rx}
                  onChange={(e) => setFormEdit({ ...formEdit, exames_rx: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003b6f]"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={salvando}
                  className="bg-[#003b6f] hover:bg-[#00284d] text-white font-bold px-8 py-3.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer transition-all shadow-md disabled:opacity-50"
                >
                  {salvando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 text-[#e31e24]" />}
                  Salvar Dados do Ano {anoAtivo}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
