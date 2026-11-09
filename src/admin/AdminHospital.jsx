import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { 
  Loader2, 
  Save, 
  ShieldCheck, 
  ArrowLeft, 
  Building2,
  CheckCircle2
} from "lucide-react";

export default function AdminHospital() {
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const [formEdit, setFormEdit] = useState({
    urgencia_upa: 0,
    consultas_ambulatoriais: 0,
    procedimentos_consultas: 0,
    cirurgias_eletivas: 0,
    internamentos_total: 0,
    partos_total: 0,
    exames_rx: 0
  });

  const carregarDados = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hmsm_indicadores")
      .select("*")
      .eq("ano", 2026)
      .single();

    if (!error && data) {
      setFormEdit({
        urgencia_upa: data.urgencia_upa,
        consultas_ambulatoriais: data.consultas_ambulatoriais,
        procedimentos_consultas: data.procedimentos_consultas,
        cirurgias_eletivas: data.cirurgias_eletivas,
        internamentos_total: data.internamentos_total,
        partos_total: data.partos_total,
        exames_rx: data.exames_rx
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleSalvarDados = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setSucesso(false);

    try {
      const { error } = await supabase
        .from("hmsm_indicadores")
        .update({
          urgencia_upa: Number(formEdit.urgencia_upa),
          consultas_ambulatoriais: Number(formEdit.consultas_ambulatoriais),
          procedimentos_consultas: Number(formEdit.procedimentos_consultas),
          cirurgias_eletivas: Number(formEdit.cirurgias_eletivas),
          internamentos_total: Number(formEdit.internamentos_total),
          partos_total: Number(formEdit.partos_total),
          exames_rx: Number(formEdit.exames_rx),
          atualizado_em: new Date()
        })
        .eq("ano", 2026);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#003b6f]" />
      </div>
    );
  }

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
                Área Restrita
              </span>
              <h1 className="text-xl font-serif font-bold text-white mt-0.5">Gestão de Indicadores - HMSM (2026)</h1>
            </div>
          </div>

          <Link
            to="/hospital"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/25 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
          </Link>
        </div>

        {sucesso && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-sm flex items-center gap-3 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Indicadores assistenciais atualizados com sucesso na base de dados!</span>
          </div>
        )}

        {/* Formulário de Edição */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Internamentos Totais</label>
              <input
                type="number"
                value={formEdit.internamentos_total}
                onChange={(e) => setFormEdit({ ...formEdit, internamentos_total: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003b6f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Partos Realizados</label>
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
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
