import { useState } from "react";
import { 
  Building2, 
  Activity, 
  Stethoscope, 
  Bed, 
  Baby, 
  FileText, 
  ShieldCheck, 
  Settings, 
  Save, 
  HeartPulse,
  BarChart3,
  Calendar,
  Users
} from "lucide-react";

export default function DashboardHospital() {
  const [modoAdmin, setModoAdmin] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("historia"); // "historia", "dashboard", "comparativo"

  // Dados reais consolidados dos relatórios assistenciais (2025 e 2026)
  const [dadosAssistenciais, setDadosAssistenciais] = useState({
    ano2025: {
      urgenciaUpa: 2217,
      consultasAmbulatoriais: 16192,
      procedimentosConsultas: 34286,
      cirurgiasEletivas: 2002,
      internamentosTotal: 8077,
      partosTotal: 2163,
      examesRx: 15181,
      totalGeral: 85242
    },
    ano2026: {
      urgenciaUpa: 1268,
      consultasAmbulatoriais: 10277,
      procedimentosConsultas: 26295,
      cirurgiasEletivas: 1696,
      internamentosTotal: 5547,
      partosTotal: 1594,
      examesRx: 13669,
      totalGeral: 63910
    }
  });

  const [formEdit, setFormEdit] = useState({ ...dadosAssistenciais.ano2026 });

  const handleSalvarDados = (e) => {
    e.preventDefault();
    setDadosAssistenciais(prev => ({
      ...prev,
      ano2026: { ...formEdit }
    }));
    setModoAdmin(false);
    alert("Indicadores assistenciais de 2026 atualizados com sucesso!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-[#005a8d] selection:text-white">
      
      {/* CABEÇALHO COM IDENTIDADE VISUAL DO HOSPITAL */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logótipo e Identidade */}
          <div className="flex items-center gap-3">
            {/* Espaço reservado para o Logótipo Oficial */}
            <div className="w-12 h-12 bg-[#005a8d] rounded-2xl flex items-center justify-center shadow-md text-white font-bold text-lg">
              HSM
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                ISMEP • Medianeiras da Paz
              </span>
              <h1 className="text-lg md:text-xl font-serif font-bold text-[#005a8d]">Hospital e Maternidade Santa Maria</h1>
            </div>
          </div>

          {/* Navegação de Abas */}
          <nav className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setAbaAtiva("historia")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                abaAtiva === "historia" ? "bg-[#005a8d] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              História & Missão
            </button>
            <button
              onClick={() => setAbaAtiva("dashboard")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                abaAtiva === "dashboard" ? "bg-[#005a8d] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Números Assistenciais
            </button>
            <button
              onClick={() => setAbaAtiva("comparativo")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                abaAtiva === "comparativo" ? "bg-[#005a8d] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Comparativo 2025/2026
            </button>
          </nav>

          {/* Botão ADM */}
          <button
            onClick={() => setModoAdmin(!modoAdmin)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#005a8d]" />
            {modoAdmin ? "Fechar ADM" : "Painel Gestor ADM"}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* PAINEL ADMINISTRATIVO ADM */}
        {modoAdmin && (
          <div className="bg-white border border-[#005a8d]/30 rounded-3xl p-6 space-y-6 shadow-xl animate-in fade-in duration-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <ShieldCheck className="w-6 h-6 text-[#005a8d]" />
              <div>
                <h2 className="text-lg font-serif font-bold text-[#005a8d]">Painel Administrativo - Atualizar Indicadores 2026</h2>
                <p className="text-xs text-slate-500">Altere os totais assistenciais para refletir no portal público instantaneamente.</p>
              </div>
            </div>

            <form onSubmit={handleSalvarDados} className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Urgência / UPA</label>
                <input
                  type="number"
                  value={formEdit.urgenciaUpa}
                  onChange={(e) => setFormEdit({ ...formEdit, urgenciaUpa: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005a8d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Consultas Ambulatoriais</label>
                <input
                  type="number"
                  value={formEdit.consultasAmbulatoriais}
                  onChange={(e) => setFormEdit({ ...formEdit, consultasAmbulatoriais: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005a8d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Cirurgias Eletivas</label>
                <input
                  type="number"
                  value={formEdit.cirurgiasEletivas}
                  onChange={(e) => setFormEdit({ ...formEdit, cirurgiasEletivas: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005a8d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Internamentos Totais</label>
                <input
                  type="number"
                  value={formEdit.internamentosTotal}
                  onChange={(e) => setFormEdit({ ...formEdit, internamentosTotal: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005a8d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Partos Realizados</label>
                <input
                  type="number"
                  value={formEdit.partosTotal}
                  onChange={(e) => setFormEdit({ ...formEdit, partosTotal: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005a8d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Exames RX Geral</label>
                <input
                  type="number"
                  value={formEdit.examesRx}
                  onChange={(e) => setFormEdit({ ...formEdit, examesRx: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005a8d]"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-4 flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-[#005a8d] hover:bg-[#004068] text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md"
                >
                  <Save className="w-4 h-4" /> Guardar Dados no Sistema
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ABA 1: HISTÓRIA E MISSÃO */}
        {abaAtiva === "historia" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
              <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">Tradição & Cuidado Humanizado</span>
              <h2 className="text-3xl font-serif font-bold text-[#005a8d]">Hospital e Maternidade Santa Maria (HMSM)</h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-4xl">
                O <strong>Hospital e Maternidade Santa Maria</strong>, gerido pelo <strong>Instituto Social Medianeiras da Paz (ISMEP)</strong>, constitui-se como o pilar central de referência em saúde pública para Araripina e toda a Região do Araripe. Oferecendo assistência 100% integrada ao Sistema Único de Saúde (SUS), o complexo hospitalar destaca-se pelo atendimento humanizado em urgência e emergência, centro cirúrgico, maternidade de referência e suporte intensivo em UTIs adulto, neonatal e pediátrica.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 bg-blue-50 text-[#005a8d] rounded-2xl flex items-center justify-center">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-[#005a8d] text-base">Missão Social & Humanização</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Compromisso inegociável com a excelência no acolhimento à população, garantindo segurança clínica e dignidade no atendimento materno-infantil.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 bg-amber-50 text-[#c5a059] rounded-2xl flex items-center justify-center">
                  <Bed className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-[#005a8d] text-base">Retaguarda em UTI</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Estrutura avançada com unidades de terapia intensiva adulta (Marcos Live e Dom Campelo), além das UTIs Neonatal e Pediátrica Ir. Josefa e Ir. Minervina.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-[#005a8d] text-base">Abrangência Regional</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Atendimento de alta capilaridade para os municípios circunvizinhos, assegurando cobertura preventiva, diagnóstica e cirúrgica de urgência.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: NÚMEROS ASSISTENCIAIS */}
        {abaAtiva === "dashboard" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total de Atendimentos</span>
                <h3 className="text-3xl font-serif font-bold text-[#005a8d]">{dadosAssistenciais.ano2026.totalGeral.toLocaleString("pt-BR")}</h3>
                <p className="text-[11px] text-slate-400">Consolidado SUS 2026</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Consultas & Procedimentos</span>
                <h3 className="text-3xl font-serif font-bold text-slate-800">
                  {(dadosAssistenciais.ano2026.consultasAmbulatoriais + dadosAssistenciais.ano2026.procedimentosConsultas).toLocaleString("pt-BR")}
                </h3>
                <p className="text-[11px] text-emerald-700 font-medium">Atendimentos Ambulatoriais</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Internamentos Hospitalares</span>
                <h3 className="text-3xl font-serif font-bold text-slate-800">{dadosAssistenciais.ano2026.internamentosTotal.toLocaleString("pt-BR")}</h3>
                <p className="text-[11px] text-slate-400">Clínica & UTI</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Partos Realizados</span>
                <h3 className="text-3xl font-serif font-bold text-[#c5a059]">{dadosAssistenciais.ano2026.partosTotal.toLocaleString("pt-BR")}</h3>
                <p className="text-[11px] text-amber-800">Cesarianos & Normais</p>
              </div>
            </div>

            {/* Demonstrativo em Tabela */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#005a8d]">Demonstrativo por Especialidade e Serviço (2026)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b">
                    <tr>
                      <th className="p-4">Serviço / Setor</th>
                      <th className="p-4">Total de Atendimentos</th>
                      <th className="p-4">Participação Relativa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    <tr>
                      <td className="p-4 font-bold text-[#005a8d]">Consultas com Procedimento</td>
                      <td className="p-4 font-bold text-slate-800">{dadosAssistenciais.ano2026.procedimentosConsultas.toLocaleString("pt-BR")}</td>
                      <td className="p-4 text-slate-500">41.1%</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-[#005a8d]">Exames de RX Geral</td>
                      <td className="p-4 font-bold text-slate-800">{dadosAssistenciais.ano2026.examesRx.toLocaleString("pt-BR")}</td>
                      <td className="p-4 text-slate-500">21.4%</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-[#005a8d]">Consultas Ambulatoriais</td>
                      <td className="p-4 font-bold text-slate-800">{dadosAssistenciais.ano2026.consultasAmbulatoriais.toLocaleString("pt-BR")}</td>
                      <td className="p-4 text-slate-500">16.1%</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-[#005a8d]">Internações Gerais (Clínicas e UTIs)</td>
                      <td className="p-4 font-bold text-slate-800">{dadosAssistenciais.ano2026.internamentosTotal.toLocaleString("pt-BR")}</td>
                      <td className="p-4 text-slate-500">8.7%</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-[#005a8d]">Cirurgias Eletivas</td>
                      <td className="p-4 font-bold text-slate-800">{dadosAssistenciais.ano2026.cirurgiasEletivas.toLocaleString("pt-BR")}</td>
                      <td className="p-4 text-slate-500">2.7%</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-[#005a8d]">Partos Realizados (Maternidade)</td>
                      <td className="p-4 font-bold text-[#c5a059]">{dadosAssistenciais.ano2026.partosTotal.toLocaleString("pt-BR")}</td>
                      <td className="p-4 text-slate-500">2.5%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ABA 3: COMPARATIVO ANUAL */}
        {abaAtiva === "comparativo" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#005a8d]">Comparativo Anual Consolidado (2025 vs 2026)</h3>
                <p className="text-xs text-slate-500">Evolução oficial do volume assistencial prestado à comunidade.</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Ocorrências Urgência / UPA</span>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">2025 (12 Meses)</p>
                      <p className="text-xl font-bold text-slate-700">{dadosAssistenciais.ano2025.urgenciaUpa.toLocaleString("pt-BR")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#005a8d] uppercase font-bold">2026 (Acumulado)</p>
                      <p className="text-xl font-bold text-[#005a8d]">{dadosAssistenciais.ano2026.urgenciaUpa.toLocaleString("pt-BR")}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Consultas Ambulatoriais</span>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">2025 (12 Meses)</p>
                      <p className="text-xl font-bold text-slate-700">{dadosAssistenciais.ano2025.consultasAmbulatoriais.toLocaleString("pt-BR")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#005a8d] uppercase font-bold">2026 (Acumulado)</p>
                      <p className="text-xl font-bold text-[#005a8d]">{dadosAssistenciais.ano2026.consultasAmbulatoriais.toLocaleString("pt-BR")}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Internações em Clínicas & UTI</span>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">2025 (12 Meses)</p>
                      <p className="text-xl font-bold text-slate-700">{dadosAssistenciais.ano2025.internamentosTotal.toLocaleString("pt-BR")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#005a8d] uppercase font-bold">2026 (Acumulado)</p>
                      <p className="text-xl font-bold text-[#005a8d]">{dadosAssistenciais.ano2026.internamentosTotal.toLocaleString("pt-BR")}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
