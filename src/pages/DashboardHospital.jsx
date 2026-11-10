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
  Loader2,
  TrendingUp,
  FileSpreadsheet,
  Stethoscope,
  ShieldAlert,
  HeartPulse,
  Baby
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
  const [abaAtiva, setAbaAtiva] = useState("geral"); // 'geral', 'setores' ou 'comparativo'
  const [loading, setLoading] = useState(true);
  const [dadosMensaisBanco, setDadosMensaisBanco] = useState([]);
  const [dados2025Banco, setDados2025Banco] = useState([]);
  const [dados2026Banco, setDados2026Banco] = useState([]);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const dashboardRef = useRef(null);

  useEffect(() => {
    carregarTodosOsDados();
  }, []);

  async function carregarTodosOsDados() {
    setLoading(true);
    const { data, error } = await supabase
      .from("hmsm_indicadores_mensais")
      .select("*");

    if (!error && data) {
      setDadosMensaisBanco(data.filter(d => d.ano === anoSelecionado));
      setDados2025Banco(data.filter(d => d.ano === 2025));
      setDados2026Banco(data.filter(d => d.ano === 2026));
    }
    setLoading(false);
  }

  useEffect(() => {
    carregarDadosAno(anoSelecionado);
  }, [anoSelecionado]);

  async function carregarDadosAno(ano) {
    const { data } = await supabase
      .from("hmsm_indicadores_mensais")
      .select("*")
      .eq("ano", ano);
    if (data) setDadosMensaisBanco(data);
  }

  // Acumulados gerais
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

  // Somatórios Setoriais Detalhados para a nova aba "Setores"
  const somarSetor = (campo) => dadosMensaisBanco.reduce((acc, curr) => acc + (mesSelecionado === "TODOS" ? (curr[campo] || 0) : (dadosMensaisBanco.find(d => d.mes === mesSelecionado)?.[campo] || 0)), 0);

  const setorUpaDetalhes = [
    { nome: "Acidente Motociclístico", qtd: somarSetor("acidente_motociclistico") },
    { nome: "Agressão Física", qtd: somarSetor("agressao_fisica") },
    { nome: "Acidente Automobilístico", qtd: somarSetor("acidente_automobilistico") },
    { nome: "Acidente de Trabalho", qtd: somarSetor("acidente_trabalho") },
    { nome: "Acidente Doméstico", qtd: somarSetor("acidente_domestico") }
  ];

  const setorUtiDetalhes = [
    { nome: "UTI Adulto 2 (Dom Campelo)", qtd: somarSetor("uti_adulto_2") },
    { nome: "UTI Pediátrica (Ir. Minervina)", qtd: somarSetor("uti_ped") },
    { nome: "UTI Neonatal (Ir. Josefa)", qtd: somarSetor("uti_neo") },
    { nome: "UTI Adulto 1 (Marcos Live)", qtd: somarSetor("uti_adulto_1") }
  ];

  const setorClinicasDetalhes = [
    { nome: "Clínica Cirúrgica", qtd: somarSetor("clinica_cirurgica") },
    { nome: "Clínica Médica", qtd: somarSetor("clinica_medica") },
    { nome: "Clínica Ortopédica", qtd: somarSetor("clinica_ortopedica") },
    { nome: "Clínica Pediátrica", qtd: somarSetor("clinica_pediatrica") },
    { nome: "Cardiologia", qtd: somarSetor("cardiologia") },
    { nome: "Saúde Mental", qtd: somarSetor("saude_mental") }
  ];

  const setorMaternidadeDetalhes = [
    { nome: "Parto Normal", qtd: somarSetor("parto_normal") },
    { nome: "Parto Cesariano", qtd: somarSetor("parto_cesariano") },
    { nome: "Curetagem", qtd: somarSetor("curetagem") },
    { nome: "Consulta Obstétrica", qtd: somarSetor("consulta_obstetrica") }
  ];

  // Gráficos de Pizza Gerais
  const dadosPizzaUpa = setorUpaDetalhes.map(i => ({ name: i.nome, value: i.qtd || 1 }));
  const dadosPizzaUti = setorUtiDetalhes.map(i => ({ name: i.nome, value: i.qtd || 1 }));

  const dadosBarraMensal = MESES.map(mesStr => {
    const m = dadosMensaisBanco.find(d => d.mes === mesStr);
    return {
      mes: mesStr,
      procedimentos: m ? (m.consulta_ambulatorial + m.consulta_procedimento) : 0,
      rx: m ? m.rx_geral : 0,
      partos: m ? (m.parto_cesariano + m.parto_normal + m.curetagem) : 0
    };
  });

  // Comparativo Anual
  const somarAnoCompleto = (arr) => arr.reduce((acc, curr) => ({
    urgencias: acc.urgencias + (curr.acidente_automobilistico + curr.acidente_domestico + curr.acidente_motociclistico + curr.acidente_trabalho + curr.agressao_fisica),
    ambulatorio: acc.ambulatorio + curr.consulta_ambulatorial + curr.consulta_procedimento,
    cirurgias: acc.cirurgias + curr.cirurgias_eletivas,
    internamentos: acc.internamentos + (curr.clinica_cirurgica + curr.clinica_medica + curr.clinica_pediatrica + curr.clinica_ortopedica + curr.cardiologia + curr.saude_mental + curr.uti_adulto_1 + curr.uti_adulto_2 + curr.uti_neo + curr.uti_ped),
    partos: acc.partos + (curr.parto_cesariano + curr.parto_normal + curr.curetagem),
    rx: acc.rx + curr.rx_geral,
    total: 0
  }), { urgencias: 0, ambulatorio: 0, cirurgias: 0, internamentos: 0, partos: 0, rx: 0, total: 0 });

  const totais2025 = somarAnoCompleto(dados2025Banco);
  totais2025.total = totais2025.urgencias + totais2025.ambulatorio + totais2025.cirurgias + totais2025.internamentos + totais2025.partos + totais2025.rx;

  const totais2026 = somarAnoCompleto(dados2026Banco);
  totais2026.total = totais2026.urgencias + totais2026.ambulatorio + totais2026.cirurgias + totais2026.internamentos + totais2026.partos + totais2026.rx;

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

        {/* NAVEGAÇÃO DE ABAS (GERAL, SETORES ESPECÍFICOS, COMPARATIVO) */}
        <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto flex-wrap gap-1">
          <button
            onClick={() => setAbaAtiva("geral")}
            className={`flex-1 min-w-[140px] py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              abaAtiva === "geral" ? "bg-[#003b6f] text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Visão Geral
          </button>
          <button
            onClick={() => setAbaAtiva("setores")}
            className={`flex-1 min-w-[140px] py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              abaAtiva === "setores" ? "bg-[#003b6f] text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Stethoscope className="w-4 h-4 text-[#e31e24]" /> Setores Separados
          </button>
          <button
            onClick={() => setAbaAtiva("comparativo")}
            className={`flex-1 min-w-[140px] py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              abaAtiva === "comparativo" ? "bg-[#003b6f] text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Comparativo Anual
          </button>
        </div>

        {/* FILTRO DE ANO E MÊS (Comum para Geral e Setores) */}
        {abaAtiva !== "comparativo" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-50 text-[#003b6f] rounded-2xl flex items-center justify-center border border-blue-100">
                <Calendar className="w-5 h-5 text-[#e31e24]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#003b6f]">Filtro de Indicadores Assistenciais</h3>
                <p className="text-xs text-slate-500">Selecione o ano e o mês para visualizar as realizações detalhadas do HMSM.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
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
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#003b6f]" /></div>
        ) : (
          <>
            {/* ABA 1: VISÃO GERAL */}
            {abaAtiva === "geral" && (
              <div className="space-y-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-3xl border-t-4 border-[#003b6f] shadow-sm space-y-2">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Realizações ({mesSelecionado === "TODOS" ? anoSelecionado : `${mesSelecionado}/${anoSelecionado}`})</span>
                    <h3 className="text-3xl font-serif font-bold text-[#003b6f]">{totalAtendimentosGeral.toLocaleString("pt-BR")}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Assistência SUS Consolidada</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border-t-4 border-[#e31e24] shadow-sm space-y-2">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Consultas & Procedimentos</span>
                    <h3 className="text-3xl font-serif font-bold text-slate-800">{(dadosFiltrados.ambulatorio + dadosFiltrados.procedimentos).toLocaleString("pt-BR")}</h3>
                    <p className="text-[11px] text-[#e31e24] font-bold">Atendimentos Ambulatoriais</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border-t-4 border-[#003b6f] shadow-sm space-y-2">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Internamentos & Especialidades</span>
                    <h3 className="text-3xl font-serif font-bold text-slate-800">{dadosFiltrados.internamentos.toLocaleString("pt-BR")}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Leitos de Alta Complexidade</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border-t-4 border-[#e31e24] shadow-sm space-y-2">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Partos Realizados</span>
                    <h3 className="text-3xl font-serif font-bold text-[#e31e24]">{dadosFiltrados.partos.toLocaleString("pt-BR")}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Maternidade HMSM</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="font-serif font-bold text-base text-[#003b6f] border-b pb-3">Distribuição de Urgências / UPA (Realizações)</h4>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={dadosPizzaUpa} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                            {dadosPizzaUpa.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS_UPA[index % COLORS_UPA.length]} />)}
                          </Pie>
                          <Tooltip /><Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "11px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="font-serif font-bold text-base text-[#003b6f] border-b pb-3">Ocupação e Perfil de UTI (Realizações)</h4>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={dadosPizzaUti} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                            {dadosPizzaUti.map((entry, index) => <Cell key={`cell-uti-${index}`} fill={COLORS_UTI[index % COLORS_UTI.length]} />)}
                          </Pie>
                          <Tooltip /><Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "11px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-serif font-bold text-base text-[#003b6f] border-b pb-3">Evolução Mensal de Realizações ({anoSelecionado})</h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dadosBarraMensal}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="mes" style={{ fontSize: '11px' }} />
                        <YAxis style={{ fontSize: '11px' }} />
                        <Tooltip /><Legend wrapperStyle={{ fontSize: "11px" }} />
                        <Bar dataKey="procedimentos" name="Consultas / Procedimentos" fill="#003b6f" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="rx" name="Exames RX Geral" fill="#e31e24" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="partos" name="Partos Realizados" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: SETORES SEPARADOS (DESTRINCHADO) */}
            {abaAtiva === "setores" && (
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-serif font-bold text-lg text-[#003b6f] mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-[#e31e24]" /> 1. Setor de Urgência & Emergência (UPA) - Detalhado
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {setorUpaDetalhes.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">{item.nome}</span>
                        <h4 className="text-2xl font-serif font-bold text-[#003b6f]">{item.qtd.toLocaleString("pt-BR")}</h4>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-serif font-bold text-lg text-[#003b6f] mb-4 flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-[#003b6f]" /> 2. Setor de Unidades de Terapia Intensiva (UTI) - Detalhado
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {setorUtiDetalhes.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">{item.nome}</span>
                        <h4 className="text-2xl font-serif font-bold text-[#e31e24]">{item.qtd.toLocaleString("pt-BR")}</h4>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-serif font-bold text-lg text-[#003b6f] mb-4 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-[#003b6f]" /> 3. Setor de Clínicas e Especialidades Médicas - Detalhado
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {setorClinicasDetalhes.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">{item.nome}</span>
                        <h4 className="text-2xl font-serif font-bold text-[#003b6f]">{item.qtd.toLocaleString("pt-BR")}</h4>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-serif font-bold text-lg text-[#003b6f] mb-4 flex items-center gap-2">
                    <Baby className="w-5 h-5 text-[#f59e0b]" /> 4. Setor de Maternidade & Obstetrícia - Detalhado
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {setorMaternidadeDetalhes.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">{item.nome}</span>
                        <h4 className="text-2xl font-serif font-bold text-[#e31e24]">{item.qtd.toLocaleString("pt-BR")}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ABA 3: COMPARATIVO ANUAL */}
            {abaAtiva === "comparativo" && (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-4">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#003b6f]">Tabela de Comparativo Anual (2025 vs 2026)</h3>
                    <p className="text-xs text-slate-500 mt-1">Análise consolidada de realizações por grandes grupos de assistência hospitalar.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl text-xs font-bold text-[#003b6f]">
                    <TrendingUp className="w-4 h-4 text-[#e31e24]" /> Indicador Oficial HMSM
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#003b6f] text-white text-xs uppercase tracking-wider">
                        <th className="p-4 rounded-l-xl">Grupo de Serviço Assistencial</th>
                        <th className="p-4 text-center">Realizações 2025</th>
                        <th className="p-4 text-center">Realizações 2026</th>
                        <th className="p-4 text-center rounded-r-xl">Variação Volumétrica</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      <tr className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-700">Urgência e Emergência (UPA)</td>
                        <td className="p-4 text-center">{totais2025.urgencias.toLocaleString("pt-BR")}</td>
                        <td className="p-4 text-center">{totais2026.urgencias.toLocaleString("pt-BR")}</td>
                        <td className="p-4 text-center font-bold text-[#003b6f]">
                          {(((totais2026.urgencias - totais2025.urgencias) / (totais2025.urgencias || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-700">Atendimentos Ambulatoriais & Procedimentos</td>
                        <td className="p-4 text-center">{totais2025.ambulatorio.toLocaleString("pt-BR")}</td>
                        <td className="p-4 text-center">{totais2026.ambulatorio.toLocaleString("pt-BR")}</td>
                        <td className="p-4 text-center font-bold text-[#003b6f]">
                          {(((totais2026.ambulatorio - totais2025.ambulatorio) / (totais2025.ambulatorio || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-700">Cirurgias Eletivas</td>
                        <td className="p-4 text-center">{totais2025.cirurgias.toLocaleString("pt-BR")}</td>
                        <td className="p-4 text-center">{totais2026.cirurgias.toLocaleString("pt-BR")}</td>
                        <td className="p-4 text-center font-bold text-[#003b6f]">
                          {(((totais2026.cirurgias - totais2025.cirurgias) / (totais2025.cirurgias || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-700">Internamentos & Leitos Especializados (UTI)</td>
                        <td className="p-4 text-center">{totais2025.internamentos.toLocaleString("pt-BR")}</td>
                        <td className="p-4 text-center">{totais2026.internamentos.toLocaleString("pt-BR")}</td>
                        <td className="p-4 text-center font-bold text-[#003b6f]">
                          {(((totais2026.internamentos - totais2025.internamentos) / (totais2025.internamentos || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-700">Maternidade (Partos & Curetagem)</td>
                        <td className="p-4 text-center">{totais2025.partos.toLocaleString("pt-BR")}</td>
                        <td className="p-4 text-center">{totais2026.partos.toLocaleString("pt-BR")}</td>
                        <td className="p-4 text-center font-bold text-[#003b6f]">
                          {(((totais2026.partos - totais2025.partos) / (totais2025.partos || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-700">Exames RX Geral</td>
                        <td className="p-4 text-center">{totais2025.rx.toLocaleString("pt-BR")}</td>
                        <td className="p-4 text-center">{totais2026.rx.toLocaleString("pt-BR")}</td>
                        <td className="p-4 text-center font-bold text-[#003b6f]">
                          {(((totais2026.rx - totais2025.rx) / (totais2025.rx || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="bg-blue-50/50 font-bold text-[#003b6f]">
                        <td className="p-4 text-base">TOTAL GERAL DE REALIZAÇÕES</td>
                        <td className="p-4 text-center text-base">{totais2025.total.toLocaleString("pt-BR")}</td>
                        <td className="p-4 text-center text-base">{totais2026.total.toLocaleString("pt-BR")}</td>
                        <td className="p-4 text-center text-base text-[#e31e24]">
                          {(((totais2026.total - totais2025.total) / (totais2025.total || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}
