import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { 
  Building2, 
  Activity, 
  Bed, 
  Calendar,
  BarChart2,
  Download,
  Settings,
  Loader2
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

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const ANOS = [2025, 2026, 2027];

const COLORS_UPA = ["#003b6f", "#e31e24", "#0284c7", "#f59e0b", "#10b981"];
const COLORS_UTI = ["#003b6f", "#e31e24", "#06b6d4", "#f59e0b"];

export default function DashboardHospital() {
  const [anoSelecionado, setAnoSelecionado] = useState(2026);
  const [mesSelecionado, setMesSelecionado] = useState("TODOS");
  const [loading, setLoading] = useState(true);
  const [dadosMensaisBanco, setDadosMensaisBanco] = useState([]);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const dashboardRef = useRef(null);

  useEffect(() => {
    carregarDadosAno(anoSelecionado);
  }, [anoSelecionado]);

  async function carregarDadosAno(ano) {
    setLoading(true);
    // Consulta diretamente a tabela correta alimentada no painel ADM
    const { data, error } = await supabase
      .from("hmsm_indicadores_mensais")
      .select("*")
      .eq("ano", ano);

    if (!error && data) {
      setDadosMensaisBanco(data);
    } else {
      setDadosMensaisBanco([]);
    }
    setLoading(false);
  }

  // Filtrar ou acumular dados conforme o mês selecionado
  const dadosFiltrados = mesSelecionado === "TODOS"
    ? dadosMensaisBanco.reduce((acc, curr) => ({
        urgencias: acc.urgencias + (curr.acidente_automobilistico + curr.acidente_domestico + curr.acidente_motociclistico + curr.acidente_trabalho + curr.agressao_fisica),
        ambulatorio: acc.ambulatorio + curr.consulta_ambulatorial,
        procedimentos: acc.procedimentos + curr.consulta_procedimento,
        internamentos: acc.internamentos + (curr.clinica_cirurgica + curr.clinica_medica + curr.clinica_pediatrica + curr.clinica_ortopedica + curr.cardiologia + curr.saude_mental + curr.uti_adulto_1 + curr.uti_adulto_2 + curr.uti_neo + curr.uti_ped),
        partos: acc.partos + (curr.parto_cesariano + curr.parto_normal + curr.curetagem),
        rx: acc.rx + curr.rx_geral,
        cirurgias: acc.cirurgias + curr.cirurgias_eletivas
      }), { urgencias: 0, ambulatorio: 0, procedimentos: 0, internamentos: 0, partos: 0, rx: 0, cirurgias: 0 })
    : (() => {
        const m = dadosMensaisBanco.find(d => d.mes === mesSelecionado);
        if (!m) return { urgencias: 0, ambulatorio: 0, procedimentos: 0, internamentos: 0, partos: 0, rx: 0, cirurgias: 0 };
        return {
          urgencias: m.acidente_automobilistico + m.acidente_domestico + m.acidente_motociclistico + m.acidente_trabalho + m.agressao_fisica,
          ambulatorio: m.consulta_ambulatorial,
          procedimentos: m.consulta_procedimento,
          internamentos: m.clinica_cirurgica + m.clinica_medica + m.clinica_pediatrica + m.clinica_ortopedica + m.cardiologia + m.saude_mental + m.uti_adulto_1 + m.uti_adulto_2 + m.uti_neo + m.uti_ped,
          partos: m.parto_cesariano + m.parto_normal + m.curetagem,
          rx: m.rx_geral,
          cirurgias: m.cirurgias_eletivas
        };
      })();

  const totalAtendimentosGeral = 
    dadosFiltrados.urgencias + 
    dadosFiltrados.ambulatorio + 
    dadosFiltrados.procedimentos + 
    dadosFiltrados.internamentos + 
    dadosFiltrados.partos + 
    dadosFiltrados.rx +
    dadosFiltrados.cirurgias;

  // Somatório para Gráfico de Pizza UPA
  const somaUpaTotal = dadosMensaisBanco.reduce((acc, curr) => ({
    moto: acc.moto + curr.acidente_motociclistico,
    agressao: acc.agressao + curr.agressao_fisica,
    auto: acc.auto + curr.acidente_automobilistico,
    trabalho: acc.trabalho + curr.acidente_trabalho,
    domestico: acc.domestico + curr.acidente_domestico
  }), { moto: 0, agressao: 0, auto: 0, trabalho: 0, domestico: 0 });

  const dadosPizzaUpa = [
    { name: "Acidente Motociclístico", value: somaUpaTotal.moto || 1 },
    { name: "Agressão Física", value: somaUpaTotal.agressao || 1 },
    { name: "Acidente Automobilístico", value: somaUpaTotal.auto || 1 },
    { name: "Acidente de Trabalho", value: somaUpaTotal.trabalho || 1 },
    { name: "Acidente Doméstico", value: somaUpaTotal.domestico || 1 }
  ];

  // Somatório para Gráfico de Pizza UTI
  const somaUtiTotal = dadosMensaisBanco.reduce((acc, curr) => ({
    uti2: acc.uti2 + curr.uti_adulto_2,
    utip: acc.utip + curr.uti_ped,
    otineo: acc.otineo + curr.uti_neo,
    uti1: acc.uti1 + curr.uti_adulto_1
  }), { uti2: 0, utip: 0, otineo: 0, uti1: 0 });

  const dadosPizzaUti = [
    { name: "UTI Adulto 2 (Dom Campelo)", value: somaUtiTotal.uti2 || 1 },
    { name: "UTI Pediátrica (Ir. Minervina)", value: somaUtiTotal.utip || 1 },
    { name: "UTI Neonatal (Ir. Josefa)", value: somaUtiTotal.otineo || 1 },
    { name: "UTI Adulto 1 (Marcos Live)", value: somaUtiTotal.uti1 || 1 }
  ];

  // Dados para o Gráfico de Barras Mensal
  const dadosBarraMensal = MESES.map(mesStr => {
    const m = dadosMensaisBanco.find(d => d.mes === mesStr);
    return {
      mes: mesStr,
      procedimentos: m ? (m.consulta_ambulatorial + m.consulta_procedimento) : 0,
      rx: m ? m.rx_geral : 0,
      partos: m ? (m.parto_cesariano + m.parto_normal + m.curetagem) : 0
    };
  });

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
      pdf.save(`Dashboard_HMSM_${anoSelecionado}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setGerandoPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      
      {/* CABEÇALHO COM LOGOMARCA OFICIAL */}
      <header className="bg-gradient-to-r from-[#003b6f] to-[#005a8d] text-white border-b-4 border-[#e31e24] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 bg-white rounded-2xl p-1.5 flex items-center justify-center shadow-md border-2 border-[#e31e24]">
              <img 
                src="/LOGO MARCA HOSPITAL - OFICIAL DIVULGAÇÃO.png" 
                alt="Logótipo HMSM" 
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none'; }} 
              />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-[#e31e24] text-white px-2.5 py-0.5 rounded-full shadow-sm">
                ISMEP • Medianeiras da Paz
              </span>
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
              to="/admin"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Settings className="w-4 h-4 text-[#e31e24]" />
              Painel ADM
            </Link>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8" ref={dashboardRef}>

        {/* SELETOR DE ANO E MÊS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-50 text-[#003b6f] rounded-2xl flex items-center justify-center border border-blue-100">
              <Calendar className="w-5 h-5 text-[#e31e24]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#003b6f]">Filtro de Indicadores Assistenciais</h3>
              <p className="text-xs text-slate-500">Selecione o ano e o mês para visualizar os demonstrativos do HMSM.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Seletor de Ano */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              {ANOS.map(ano => (
                <button
                  key={ano}
                  onClick={() => { setAnoSelecionado(ano); setMesSelecionado("TODOS"); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    anoSelecionado === ano ? "bg-[#003b6f] text-white shadow-md" : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {ano}
                </button>
              ))}
            </div>

            {/* Seletor de Mês */}
            <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setMesSelecionado("TODOS")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mesSelecionado === "TODOS" ? "bg-[#e31e24] text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                Acumulado
              </button>
              {MESES.map((mesStr) => (
                <button
                  key={mesStr}
                  onClick={() => setMesSelecionado(mesStr)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mesSelecionado === mesStr ? "bg-[#e31e24] text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {mesStr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#003b6f]" /></div>
        ) : (
          <>
            {/* CARDS DE MÉTRICAS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border-t-4 border-[#003b6f] shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Atendimentos ({mesSelecionado === "TODOS" ? anoSelecionado : `${mesSelecionado}/${anoSelecionado}`})</span>
                <h3 className="text-3xl font-serif font-bold text-[#003b6f]">
                  {totalAtendimentosGeral.toLocaleString("pt-BR")}
                </h3>
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
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Internamentos & Leitos</span>
                <h3 className="text-3xl font-serif font-bold text-slate-800">{dadosFiltrados.internamentos.toLocaleString("pt-BR")}</h3>
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
                <h4 className="font-serif font-bold text-base text-[#003b6f]">Evolução de Atendimentos Mensais ({anoSelecionado})</h4>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosBarraMensal}>
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
          </>
        )}

      </main>
    </div>
  );
}
