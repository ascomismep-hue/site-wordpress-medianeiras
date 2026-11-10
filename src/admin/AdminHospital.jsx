import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { 
  Loader2, 
  Save, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2,
  LogOut,
  Calendar
} from "lucide-react";

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const ANOS = [2025, 2026, 2027];

export default function AdminHospital({ onLogout }) {
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [anoAtivo, setAnoAtivo] = useState(2027);
  const [mesAtivo, setMesAtivo] = useState("JAN");

  const [formEdit, setFormEdit] = useState({
    acidente_automobilistico: 0,
    acidente_domestico: 0,
    acidente_motociclistico: 0,
    acidente_trabalho: 0,
    agressao_fisica: 0,
    consulta_ambulatorial: 0,
    consulta_procedimento: 0,
    cirurgias_eletivas: 0,
    consulta_obstetrica: 0,
    clinica_cirurgica: 0,
    clinica_medica: 0,
    clinica_pediatrica: 0,
    clinica_ortopedica: 0,
    cardiologia: 0,
    saude_mental: 0,
    uti_adulto_1: 0,
    uti_adulto_2: 0,
    uti_neo: 0,
    uti_ped: 0,
    parto_cesariano: 0,
    parto_normal: 0,
    curetagem: 0,
    rx_geral: 0
  });

  const carregarDadosMes = async (ano, mes) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hmsm_indicadores_mensais")
      .select("*")
      .eq("ano", ano)
      .eq("mes", mes)
      .maybeSingle();

    if (!error && data) {
      setFormEdit({
        acidente_automobilistico: data.acidente_automobilistico || 0,
        acidente_domestico: data.acidente_domestico || 0,
        acidente_motociclistico: data.acidente_motociclistico || 0,
        acidente_trabalho: data.acidente_trabalho || 0,
        agressao_fisica: data.agressao_fisica || 0,
        consulta_ambulatorial: data.consulta_ambulatorial || 0,
        consulta_procedimento: data.consulta_procedimento || 0,
        cirurgias_eletivas: data.cirurgias_eletivas || 0,
        consulta_obstetrica: data.consulta_obstetrica || 0,
        clinica_cirurgica: data.clinica_cirurgica || 0,
        clinica_medica: data.clinica_medica || 0,
        clinica_pediatrica: data.clinica_pediatrica || 0,
        clinica_ortopedica: data.clinica_ortopedica || 0,
        cardiologia: data.cardiologia || 0,
        saude_mental: data.saude_mental || 0,
        uti_adulto_1: data.uti_adulto_1 || 0,
        uti_adulto_2: data.uti_adulto_2 || 0,
        uti_neo: data.uti_neo || 0,
        uti_ped: data.uti_ped || 0,
        parto_cesariano: data.parto_cesariano || 0,
        parto_normal: data.parto_normal || 0,
        curetagem: data.curetagem || 0,
        rx_geral: data.rx_geral || 0
      });
    } else {
      setFormEdit({
        acidente_automobilistico: 0,
        acidente_domestico: 0,
        acidente_motociclistico: 0,
        acidente_trabalho: 0,
        agressao_fisica: 0,
        consulta_ambulatorial: 0,
        consulta_procedimento: 0,
        cirurgias_eletivas: 0,
        consulta_obstetrica: 0,
        clinica_cirurgica: 0,
        clinica_medica: 0,
        clinica_pediatrica: 0,
        clinica_ortopedica: 0,
        cardiologia: 0,
        saude_mental: 0,
        uti_adulto_1: 0,
        uti_adulto_2: 0,
        uti_neo: 0,
        uti_ped: 0,
        parto_cesariano: 0,
        parto_normal: 0,
        curetagem: 0,
        rx_geral: 0
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarDadosMes(anoAtivo, mesAtivo);
  }, [anoAtivo, mesAtivo]);

  const handleSalvarDados = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setSucesso(false);

    try {
      const payload = {
        ano: anoAtivo,
        mes: mesAtivo,
        atualizado_em: new Date()
      };

      Object.keys(formEdit).forEach(key => {
        payload[key] = Number(formEdit[key]) || 0;
      });

      const { error } = await supabase
        .from("hmsm_indicadores_mensais")
        .upsert(payload, { onConflict: "ano,mes" });

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

  const updateField = (field, val) => {
    setFormEdit(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
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
              <h1 className="text-xl font-serif font-bold text-white mt-0.5">Alimentação de Dados Mensais</h1>
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

        {/* CONTROLO DE ANO E MÊS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[#e31e24]" />
              <span className="text-sm font-bold uppercase tracking-wider text-[#003b6f]">1. Selecione o Ano:</span>
            </div>
            <div className="flex gap-2">
              {ANOS.map(ano => (
                <button
                  key={ano}
                  type="button"
                  onClick={() => setAnoAtivo(ano)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    anoAtivo === ano ? "bg-[#003b6f] text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {ano}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">2. Selecione o Mês:</span>
            <div className="flex flex-wrap gap-1.5">
              {MESES.map(mes => (
                <button
                  key={mes}
                  type="button"
                  onClick={() => setMesAtivo(mes)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mesAtivo === mes ? "bg-[#e31e24] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {mes}
                </button>
              ))}
            </div>
          </div>
        </div>

        {sucesso && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-sm flex items-center gap-3 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Indicadores do mês de <strong>{mesAtivo}/{anoAtivo}</strong> salvos com sucesso na base de dados!</span>
          </div>
        )}

        {/* FORMULÁRIO COMPLETO COM TODOS OS PARÂMETROS DA PLANILHA */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#003b6f]" /></div>
          ) : (
            <form onSubmit={handleSalvarDados} className="space-y-8">
              
              {/* BLOCO 1: URGÊNCIA E EMERGÊNCIA (UPA) */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-base text-[#003b6f] border-b border-slate-200 pb-2">
                  1. Ocorrências e Consultas - Urgência e Emergência (UPA)
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Acidente Automobilístico</label>
                    <input type="number" value={formEdit.acidente_automobilistico} onChange={e => updateField("acidente_automobilistico", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Acidente Doméstico</label>
                    <input type="number" value={formEdit.acidente_domestico} onChange={e => updateField("acidente_domestico", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Acidente Motociclístico</label>
                    <input type="number" value={formEdit.acidente_motociclistico} onChange={e => updateField("acidente_motociclistico", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Acidente de Trabalho</label>
                    <input type="number" value={formEdit.acidente_trabalho} onChange={e => updateField("acidente_trabalho", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Agressão Física</label>
                    <input type="number" value={formEdit.agressao_fisica} onChange={e => updateField("agressao_fisica", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                </div>
              </div>

              {/* BLOCO 2: AMBULATÓRIO & ATENDIMENTOS */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-base text-[#003b6f] border-b border-slate-200 pb-2">
                  2. Atendimentos Ambulatoriais & Procedimentos
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Consulta Ambulatorial</label>
                    <input type="number" value={formEdit.consulta_ambulatorial} onChange={e => updateField("consulta_ambulatorial", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Consulta c/ Procedimento</label>
                    <input type="number" value={formEdit.consulta_procedimento} onChange={e => updateField("consulta_procedimento", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                </div>
              </div>

              {/* BLOCO 3: INTERNAMENTOS E LEITOS DE UTI */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-base text-[#003b6f] border-b border-slate-200 pb-2">
                  3. Internamentos, Especialidades & Leitos de UTI
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Cirurgias Eletivas</label>
                    <input type="number" value={formEdit.cirurgias_eletivas} onChange={e => updateField("cirurgias_eletivas", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Consulta Obstétrica</label>
                    <input type="number" value={formEdit.consulta_obstetrica} onChange={e => updateField("consulta_obstetrica", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Clínica Cirúrgica</label>
                    <input type="number" value={formEdit.clinica_cirurgica} onChange={e => updateField("clinica_cirurgica", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Clínica Médica</label>
                    <input type="number" value={formEdit.clinica_medica} onChange={e => updateField("clinica_medica", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Clínica Pediátrica</label>
                    <input type="number" value={formEdit.clinica_pediatrica} onChange={e => updateField("clinica_pediatrica", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Clínica Ortopédica</label>
                    <input type="number" value={formEdit.clinica_ortopedica} onChange={e => updateField("clinica_ortopedica", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Cardiologia</label>
                    <input type="number" value={formEdit.cardiologia} onChange={e => updateField("cardiologia", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Saúde Mental</label>
                    <input type="number" value={formEdit.saude_mental} onChange={e => updateField("saude_mental", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">UTI Adulto 1 (Marcos Live)</label>
                    <input type="number" value={formEdit.uti_adulto_1} onChange={e => updateField("uti_adulto_1", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">UTI Adulto 2 (Dom Campelo)</label>
                    <input type="number" value={formEdit.uti_adulto_2} onChange={e => updateField("uti_adulto_2", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">UTI Neo (Ir. Josefa)</label>
                    <input type="number" value={formEdit.uti_neo} onChange={e => updateField("uti_neo", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">UTI Ped (Ir. Minervina)</label>
                    <input type="number" value={formEdit.uti_ped} onChange={e => updateField("uti_ped", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                </div>
              </div>

              {/* BLOCO 4: PARTOS SUS E RX */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-base text-[#003b6f] border-b border-slate-200 pb-2">
                  4. Maternidade (Partos) & Exames de RX
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Parto Cesariano</label>
                    <input type="number" value={formEdit.parto_cesariano} onChange={e => updateField("parto_cesariano", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Parto Normal</label>
                    <input type="number" value={formEdit.parto_normal} onChange={e => updateField("parto_normal", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Curetagem</label>
                    <input type="number" value={formEdit.curetagem} onChange={e => updateField("curetagem", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Exames RX Geral</label>
                    <input type="number" value={formEdit.rx_geral} onChange={e => updateField("rx_geral", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={salvando}
                  className="bg-[#003b6f] hover:bg-[#00284d] text-white font-bold px-8 py-3.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer transition-all shadow-md disabled:opacity-50"
                >
                  {salvando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 text-[#e31e24]" />}
                  Salvar Dados de {mesAtivo}/{anoAtivo}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
