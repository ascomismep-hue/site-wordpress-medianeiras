import { useState, useRef } from "react";
import { supabase } from "@/api/supabaseClient";
import { 
  Building2, 
  Activity, 
  Bed, 
  Baby, 
  ShieldCheck, 
  Settings, 
  Download, 
  Calendar,
  PieChart as PieIcon,
  BarChart2,
  FileCheck
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Cores Institucionais HMSM / ISMEP
const COLORS_UPA = ["#005a8d", "#c5a059", "#e31e24", "#10b981", "#6b7280"];
const COLORS_UTI = ["#005a8d", "#0284c7", "#06b6d4", "#c5a059"];
const COLORS_PARTOS = ["#ec4899", "#8b5cf6", "#f43f5e"];

export default function DashboardHospital() {
  const [modoAdmin, setModoAdmin] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("dashboard"); // "dashboard", "historia", "comparativo"
  const [mesSelecionado, setMesSelecionado] = useState("TODOS");
  const [gerandoPdf, setGerandoPdf] = useState(false);

  // Referência do Contentor do Dashboard para exportação do PDF
  const dashboardRef = useRef(null);

  // Dados Assistenciais Mensais de 2026 (Extraídos dos Relatórios do HMSM)
  const dadosMensais2026 = [
    { mes: "JAN", urgencias: 156, ambulatorio: 1155, procedimentos: 3205, uti: 98, partos: 155, rx: 1683 },
    { mes: "FEV", urgencias: 143, ambulatorio: 1394, procedimentos: 2169, uti: 106, partos: 191, rx: 1455 },
    { mes: "MAR", urgencias: 140, ambulatorio: 1330, procedimentos: 2831, uti: 112, partos: 185, rx: 1440 },
    { mes: "ABR", urgencias: 165, ambulatorio: 1200, procedimentos: 3430, uti: 94, partos: 198, rx: 1445 },
    { mes: "MAI", urgencias: 125, ambulatorio: 1223, procedimentos: 3590, uti: 89, partos: 194, rx: 1646 },
    { mes: "JUN", urgencias: 180, ambulatorio: 1166, procedimentos: 3239, uti: 91, partos: 173, rx: 1656 },
    { mes: "JUL", urgencias: 114, ambulatorio: 1176, procedimentos: 2643, uti: 87, partos: 142, rx: 1457 },
    { mes: "AGO", urgencias: 103, ambulatorio: 826, procedimentos: 2477, uti: 84, partos: 177, rx: 1518 },
    { mes: "SET", urgencias: 142, ambulatorio: 807, procedimentos: 2711, uti: 79, partos: 179, rx: 1369 }
  ];

  // Dados para Gráficos de Pizza (Distribuição de Serviços do HMSM)
  const dadosPizzaUpa = [
    { name: "Acidente Motociclístico", value: 827 },
    { name: "Agressão Física", value: 277 },
    { name: "Acidente Automobilístico", value: 92 },
    { name: "Acidente de Trabalho", value: 55 },
    { name: "Acidente Doméstico", value: 17 }
  ];

  const dadosPizzaUti = [
    { name: "UTI Adulto 2 (Dom Campelo)", value: 268 },
    { name: "UTI Pediátrica (Ir. Minervina)", value: 235 },
    { name: "UTI Neonatal (Ir. Josefa)", value: 191 },
    { name: "UTI Adulto 1 (Marcos Live)", value: 138 }
  ];

  const dadosPizzaPartos = [
    { name: "Parto Normal", value: 743 },
    { name: "Parto Cesariano", value: 740 },
    { name: "Curetagem", value: 111 }
  ];

  // Filtragem dinâmica de valores com base no mês selecionado
  const dadosFiltrados = mesSelecionado === "TODOS"
    ? dadosMensais2026.reduce((acc, curr) => ({
        urgencias: acc.urgencias + curr.urgencias,
        ambulatorio: acc.ambulatorio + curr.ambulatorio,
        procedimentos: acc.procedimentos + curr.procedimentos,
        uti: acc.uti + curr.uti,
        partos: acc.partos + curr.partos,
        rx: acc.rx + curr.rx
      }), { urgencias: 0, ambulatorio: 0, procedimentos: 0, uti: 0, partos: 0, rx: 0 })
    : dadosMensais2026.find(d => d.mes === mesSelecionado) || { urgencias: 0, ambulatorio: 0, procedimentos: 0, uti: 0, partos: 0, rx: 0 };

  const totalAtendimentosFiltrados = 
    dadosFiltrados.urgencias + 
    dadosFiltrados.ambulatorio + 
    dadosFiltrados.procedimentos + 
    dadosFiltrados.uti + 
    dadosFiltrados.partos + 
    dadosFiltrados.rx;

  // Função para Exportar o Dashboard em PDF
  const exportarDashboardPDF = async () => {
    if (!dashboardRef.current) return;
    setGerandoPdf(true);

    try {
      const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // Largura A4 em mm
      const pageHeight = 295; // Altura A4 em mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Dashboard_HMSM_Indicadores_${mesSelecionado}_2026.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Erro ao exportar o relatório em PDF.");
    } finally {
      setGerandoPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* CABEÇALHO INSTITUCIONAL */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
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

          {/* Abas de Navegação */}
          <nav className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setAbaAtiva("dashboard")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                abaAtiva === "dashboard" ? "bg-[#005a8d] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Dashboard Dinâmico
            </button>
            <button
              onClick={() => setAbaAtiva("historia")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                abaAtiva === "historia" ? "bg-[#005a8d] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              História & Missão
            </button>
          </nav>

          {/* Botões de Ação: Exportar PDF e ADM */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportarDashboardPDF}
              disabled={gerandoPdf}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {gerandoPdf ? "A gerar PDF..." : "Baixar Gráficos (PDF)"}
            </button>

            <button
              onClick={() => setModoAdmin(!modoAdmin)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 text-[#005a8d]" />
              {modoAdmin ? "Fechar ADM" : "Painel ADM"}
            </button>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8" ref={dashboardRef}>

        {/* CONTROLO DINÂMICO DE MESES DO ANO */}
        {abaAtiva === "dashboard" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-[#005a8d] rounded-2xl flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#005a8d]">Filtrar Indicadores por Mês</h3>
                <p className="text-xs text-slate-500">Selecione o mês para atualizar os gráficos e métricas assistenciais.</p>
              </div>
            </div>

            {/* Seletor Dinâmico por Mês */}
            <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setMesSelecionado("TODOS")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mesSelecionado === "TODOS" ? "bg-[#005a8d] text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                Ano Acumulado
              </button>
              {dadosMensais2026.map((d) => (
                <button
                  key={d.mes}
                  onClick={() => setMesSelecionado(d.mes)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mesSelecionado === d.mes ? "bg-[#005a8d] text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {d.mes}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DASHBOARD DINÂMICO DE NÚMEROS E GRÁFICOS PIZZA */}
        {abaAtiva === "dashboard" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Cards de Métricas do Mês Selecionado */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Atendimentos ({mesSelecionado})</span>
                <h3 className="text-3xl font-serif font-bold text-[#005a8d]">{totalAtendimentosFiltrados.toLocaleString("pt-BR")}</h3>
                <p className="text-[11px] text-slate-400">Assistência SUS Consolidada</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Consultas & Procedimentos</span>
                <h3 className="text-3xl font-serif font-bold text-slate-800">
                  {(dadosFiltrados.ambulatorio + dadosFiltrados.procedimentos).toLocaleString("pt-BR")}
                </h3>
                <p className="text-[11px] text-emerald-700 font-medium">Atendimentos Ambulatoriais</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Internações & UTI</span>
                <h3 className="text-3xl font-serif font-bold text-slate-800">{dadosFiltrados.uti.toLocaleString("pt-BR")}</h3>
                <p className="text-[11px] text-slate-400">Leitos de Alta Complexidade</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Partos Realizados</span>
                <h3 className="text-3xl font-serif font-bold text-[#c5a059]">{dadosFiltrados.partos.toLocaleString("pt-BR")}</h3>
                <p className="text-[11px] text-amber-800">Maternidade HMSM</p>
              </div>
            </div>

            {/* SEÇÃO DE GRÁFICOS PIZZA E BARRAS */}
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Gráfico 1: Pizza - Ocorrências UPA */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-5 h-5 text-[#005a8d]" />
                  <h4 className="font-serif font-bold text-base text-[#005a8d]">Distribuição de Urgências / UPA (Gráfico Pizza)</h4>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosPizzaUpa}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {dadosPizzaUpa.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_UPA[index % COLORS_UPA.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "11px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfico 2: Pizza - Distribuição de Leitos de UTI */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-[#005a8d]" />
                  <h4 className="font-serif font-bold text-base text-[#005a8d]">Ocupação e Perfil de UTI (Gráfico Pizza)</h4>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosPizzaUti}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {dadosPizzaUti.map((entry, index) => (
                          <Cell key={`cell-uti-${index}`} fill={COLORS_UTI[index % COLORS_UTI.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "11px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Gráfico 3: Evolução Mensal em Barras (2026) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#005a8d]" />
                <h4 className="font-serif font-bold text-base text-[#005a8d]">Evolução de Atendimentos Mensais (2026)</h4>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosMensais2026}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" style={{ fontSize: '11px' }} />
                    <YAxis style={{ fontSize: '11px' }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="procedimentos" name="Consultas / Procedimentos" fill="#005a8d" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="rx" name="Exames RX Geral" fill="#c5a059" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="partos" name="Partos Realizados" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
