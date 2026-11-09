import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Activity, 
  Bed, 
  Calendar,
  PieChart as PieIcon,
  BarChart2,
  Download,
  ShieldAlert,
  ArrowLeft,
  Settings
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

// Paleta Oficial: Azul Institucional com Vermelho Clínico (Logótipo HMSM)
const COLOR_AZUL_PRINCIPAL = "#003b6f";
const COLOR_VERMELHO_DESTAQUE = "#e31e24";
const COLORS_UPA = ["#003b6f", "#e31e24", "#0284c7", "#f59e0b", "#10b981"];
const COLORS_UTI = ["#003b6f", "#e31e24", "#06b6d4", "#f59e0b"];
const COLORS_PARTOS = ["#e31e24", "#003b6f", "#f43f5e"];

export default function DashboardHospital() {
  const [mesSelecionado, setMesSelecionado] = useState("TODOS");
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const dashboardRef = useRef(null);

  // Dados Assistenciais Mensais de 2026
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

  const exportarDashboardPDF = async () => {
    if (!dashboardRef.current) return;
    setGerandoPdf(true);

    try {
      const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
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
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      
      {/* CABEÇALHO DO HOSPITAL (AZUL COM VERMELHO) */}
      <header className="bg-gradient-to-r from-[#003b6f] to-[#005a8d] text-white border-b-4 border-[#e31e24] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-[#e31e24]">
              <Building2 className="w-7 h-7 text-[#003b6f]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-[#e31e24] text-white px-2.5 py-0.5 rounded-full shadow-sm">
                  ISMEP • Medianeiras da Paz
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-white mt-0.5">Hospital e Maternidade Santa Maria</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportarDashboardPDF}
              disabled={gerandoPdf}
              className="flex items-center gap-2 bg-[#e31e24] hover:bg-[#c9181d] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {gerandoPdf ? "A gerar PDF..." : "Baixar Gráficos (PDF)"}
            </button>

            <Link
              to="/admin/hospital"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Settings className="w-4 h-4 text-[#e31e24]" />
              Painel ADM
            </Link>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8" ref={dashboardRef}>

        {/* FILTRAGEM DINÂMICA DE MESES */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-50 text-[#003b6f] rounded-2xl flex items-center justify-center border border-blue-100">
              <Calendar className="w-5 h-5 text-[#e31e24]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#003b6f]">Filtrar Indicadores por Mês</h3>
              <p className="text-xs text-slate-500">Selecione o período para atualizar os gráficos assistenciais do HMSM.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setMesSelecionado("TODOS")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mesSelecionado === "TODOS" ? "bg-[#003b6f] text-white shadow-md" : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              Ano Acumulado
            </button>
            {dadosMensais2026.map((d) => (
              <button
                key={d.mes}
                onClick={() => setMesSelecionado(d.mes)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mesSelecionado === d.mes ? "bg-[#003b6f] text-white shadow-md" : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                {d.mes}
              </button>
            ))}
          </div>
        </div>

        {/* CARDS DE MÉTRICAS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border-t-4 border-[#003b6f] shadow-sm space-y-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Atendimentos ({mesSelecionado})</span>
            <h3 className="text-3xl font-serif font-bold text-[#003b6f]">{totalAtendimentosFiltrados.toLocaleString("pt-BR")}</h3>
            <p className="text-[11px] text-slate-400 font-medium">Assistência SUS Consolidada</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-t-4 border-[#e31e24] shadow-sm space-y-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Consultas & Procedimentos</span>
            <h3 className="text-3xl font-serif font-bold text-slate-800">
              {(dadosFiltrados.ambulatorio + dadosFiltrados.procedimentos).toLocaleString("pt-BR")}
            </h3>
            <p className="text-[11px] text-[#e31e24] font-bold">Atendimentos Ambulatoriais</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-t-4 border-[#003b6f] shadow-sm space-y-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Internações & UTI</span>
            <h3 className="text-3xl font-serif font-bold text-slate-800">{dadosFiltrados.uti.toLocaleString("pt-BR")}</h3>
            <p className="text-[11px] text-slate-400 font-medium">Leitos de Alta Complexidade</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-t-4 border-[#e31e24] shadow-sm space-y-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Partos Realizados</span>
            <h3 className="text-3xl font-serif font-bold text-[#e31e24]">{dadosFiltrados.partos.toLocaleString("pt-BR")}</h3>
            <p className="text-[11px] text-slate-500 font-medium">Maternidade HMSM</p>
          </div>
        </div>

        {/* GRÁFICOS DE PIZZA */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-3 h-3 rounded-full bg-[#e31e24]"></div>
              <h4 className="font-serif font-bold text-base text-[#003b6f]">Distribuição de Urgências / UPA (Gráfico Pizza)</h4>
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
                    paddingAngle={4}
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

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-3 h-3 rounded-full bg-[#003b6f]"></div>
              <h4 className="font-serif font-bold text-base text-[#003b6f]">Ocupação e Perfil de UTI (Gráfico Pizza)</h4>
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

        {/* EVOLUÇÃO MENSAL EM BARRAS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <BarChart2 className="w-5 h-5 text-[#e31e24]" />
            <h4 className="font-serif font-bold text-base text-[#003b6f]">Evolução de Atendimentos Mensais (2026)</h4>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosMensais2026}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" style={{ fontSize: '11px' }} />
                <YAxis style={{ fontSize: '11px' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="procedimentos" name="Consultas / Procedimentos" fill="#003b6f" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rx" name="Exames RX Geral" fill="#e31e24" radius={[4, 4, 0, 0]} />
                <Bar dataKey="partos" name="Partos Realizados" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </main>
    </div>
  );
}
