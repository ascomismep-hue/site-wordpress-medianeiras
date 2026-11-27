import React, { useState } from "react";
import { supabase } from "@/api/supabaseClient";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  Building2,
  Mic,
  Cpu,
  CheckCircle2,
  Navigation,
  UserCheck,
  Loader2,
  ExternalLink,
  Download,
  FileText,
  Presentation,
  FileType2,
  Image as ImageIcon,
} from "lucide-react";

function AsteriscoGiratorio({
  className = "",
  duracao = "24s",
  reverso = false,
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{
        animation: `${
          reverso ? "girar-anti-horario" : "girar-horario"
        } ${duracao} linear infinite`,
      }}
      className={`pointer-events-none select-none ${className}`}
    >
      <g stroke="currentColor" strokeWidth="7" strokeLinecap="round">
        <line x1="50" y1="8" x2="50" y2="92" />
        <line x1="8" y1="50" x2="92" y2="50" />
        <line x1="20.3" y1="20.3" x2="79.7" y2="79.7" />
        <line x1="79.7" y1="20.3" x2="20.3" y2="79.7" />
      </g>
    </svg>
  );
}

const UNIDADES_RESULTADOS = [
  { unidade: "Hospital Regional Fernando Bezerra", duracao: "15 minutos" },
  { unidade: "Hospital e Maternidade Santa Maria", duracao: "15 minutos" },
  { unidade: "Hospital Dom Malan", duracao: "15 minutos" },
  { unidade: "UPAE Ouricuri", duracao: "15 minutos" },
  { unidade: "UPA Barra de Jangada", duracao: "15 minutos" },
  { unidade: "UPA Olinda", duracao: "15 minutos" },
];

const UNIDADES_OPCOES = [
  "Hospital e Maternidade Santa Maria",
  "Hospital Regional Fernando Bezerra",
  "Hospital Dom Malan",
  "UPAE Ouricuri",
  "UPA Barra de Jangada",
  "UPA Olinda",
  "Nucleo de Gestão Compartilhada - NGC",
  "Outra unidade",
];

const PROGRAMACAO_OFICIAL = [
  {
    numero: "01",
    etapa: "Abertura",
    titulo: "Abertura institucional às 8h",
    horario: "8h",
    statusHorario: "A partir das 8h • 8h30 / 8h40",
    descricao:
      "Recepção e acolhimento a partir das 8h, com pronunciamento da Presidente e Madre – Ir. Maria Luísa Mota às 8h30 e pronunciamento da Superintendência – Ir. Fátima Alencar às 8h40.",
    detalhes: [
      "Recepção e acolhimento",
      "Às 8h30 Pronunciamento da Presidente e Madre – Ir. Maria Luísa Mota",
      "Às 8h40 Pronunciamento da Superintendência – Ir. Fátima Alencar",
    ],
  },
  {
    numero: "02",
    etapa: "Resultados 2026",
    titulo: "Apresentação dos resultados das unidades – Exercício 2026 às 9h",
    horario: "9h",
    statusHorario: "15 min/unidade • Tempo total: 90 minutos",
    descricao:
      "Cada diretor terá 15 minutos para apresentação dos resultados de sua unidade.",
    unidades: UNIDADES_RESULTADOS,
    tempoTotal: "90 minutos",
    topicosObrigatorios: [
      "Resultados assistenciais e indicadores de desempenho",
      "Resultados administrativos e financeiros",
      "Principais avanços e melhorias implementadas em 2026",
      "Desafios enfrentados 2027",
    ],
  },
  {
    numero: "03",
    etapa: "Palestra",
    titulo: "Palestra institucional às 10h30",
    horario: "10h30",
    statusHorario: "Pe. Tassicio Leal • Duração a definir",
    descricao:
      "Palestra institucional com Pe. Tassicio Leal abordando o tema 'Sua energia define o ritmo da equipe'.",
    detalhes: [
      "Tema: Sua energia define o ritmo da equipe",
      "Palestrante: Pe. Tassicio Leal",
      "Duração: a definir",
    ],
  },
  {
    numero: "04",
    etapa: "Estratégia 2027",
    titulo: "Alinhamento Estratégico Institucional para 2027 às 11h20",
    horario: "11h20",
    statusHorario: "Planejamento estratégico integrado",
    descricao:
      "Cada diretoria e/ou coordenação, considerando sua área de atuação, contribua com a identificação de pelo menos um desafio institucional que necessite de intervenção ou aprimoramento. A iniciativa tem como finalidade promover a construção coletiva das prioridades estratégicas do ISMEP para 2027, transformando os desafios identificados em propostas de soluções e compromissos institucionais. As contribuições deverão ser previamente discutidas e consolidadas, visando à construção de um planejamento estratégico integrado, com foco na sustentabilidade institucional, na eficiência administrativa e financeira e na qualidade dos serviços prestados.",
    topicosTitulo: "Cada diretoria e coordenação deverá apresentar:",
    detalhes: [
      "Tema estratégico a ser trabalhado em 2027",
      "Problema ou desafio institucional identificado",
      "Proposta de intervenção ou melhoria",
      "Resultado esperado para 2027",
      "Indicadores e metas para acompanhamento dos resultados",
    ],
  },
  {
    numero: "05",
    etapa: "Tecnologia",
    titulo:
      "Debate e informação – Bruno – Coordenador de tecnologia da informação às 11h30",
    horario: "11h30",
    statusHorario: "Informações gerenciais e assistenciais",
    descricao:
      "Integração e confiabilidade das informações gerenciais e assistenciais.",
    detalhes: [
      "Integração e confiabilidade das informações gerenciais e assistenciais",
    ],
  },
  {
    numero: "06",
    etapa: "Encerramento",
    titulo: "Considerações finais e encerramento às 12h",
    horario: "12h",
    statusHorario: "Síntese e compromissos para 2027",
    descricao:
      "Síntese dos principais pontos abordados durante o encontro, alinhamento dos compromissos institucionais para 2027 e pronunciamento de encerramento.",
    detalhes: [
      "Síntese dos principais pontos abordados durante o encontro",
      "Alinhamento dos compromissos institucionais para 2027",
      "Pronunciamento de encerramento",
    ],
  },
];

const MATERIAIS_DOWNLOAD = [
  {
    id: "pdf",
    formato: "PDF",
    titulo: "Programação Oficial em PDF",
    descricao: "Documento completo da pauta e diretrizes do encontro.",
    href: "/materiais-encontro-2026/programacao-encontro-2026.pdf",
    downloadName: "programacao-encontro-2026.pdf",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    icon: FileText,
  },
  {
    id: "pptx",
    formato: "PowerPoint",
    titulo: "Slide de Apresentação (PPTX)",
    descricao: "Modelo de slides para apresentação das unidades e alinhamento.",
    href: "/materiais-encontro-2026/apresentacao-encontro-2026.pptx",
    downloadName: "apresentacao-encontro-2026.pptx",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
    icon: Presentation,
  },
  {
    id: "docx",
    formato: "Word",
    titulo: "Documento Editável (DOCX)",
    descricao: "Pauta em formato Word para consulta e registro de contribuições.",
    href: "/materiais-encontro-2026/roteiro-diretores-2026.docx",
    downloadName: "roteiro-diretores-2026.docx",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: FileType2,
  },
  {
    id: "png",
    formato: "PNG",
    titulo: "Arte em Alta Resolução (PNG)",
    descricao: "Imagem em PNG sem perda para compartilhamento e avisos.",
    href: "/materiais-encontro-2026/card-encontro-2026.png",
    downloadName: "card-encontro-2026.png",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: ImageIcon,
  },
  {
    id: "jpeg",
    formato: "JPEG",
    titulo: "Capa / Divulgação (JPEG)",
    descricao: "Imagem oficial da capa do encontro em formato JPEG.",
    href: "/Gemini_Generated_Image_9c2wn39c2wn39c2w.jpg",
    downloadName: "encontro-institucional-2026.jpg",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    icon: ImageIcon,
  },
];

export default function EncontroInstitucional2026({
  programacao = PROGRAMACAO_OFICIAL,
  onVoltar,
}) {
  const [filtroEtapa, setFiltroEtapa] = useState("Todas");

  // Estado do Check-in do Participante
  const [checkinForm, setCheckinForm] = useState({
    nome: "",
    unidade: UNIDADES_OPCOES[0],
    cargo: "",
  });
  const [enviandoCheckin, setEnviandoCheckin] = useState(false);
  const [checkinConfirmado, setCheckinConfirmado] = useState(null);
  const [erroCheckin, setErroCheckin] = useState("");

  const etapas = [
    "Todas",
    ...Array.from(new Set(programacao.map((item) => item.etapa))),
  ];

  const itensFiltrados =
    filtroEtapa === "Todas"
      ? programacao
      : programacao.filter((item) => item.etapa === filtroEtapa);

  function irParaSecao(idSecao) {
    const elemento = document.getElementById(idSecao);
    if (elemento) {
      elemento.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  async function handleCheckinSubmit(e) {
    e.preventDefault();
    setErroCheckin("");

    if (!checkinForm.nome.trim() || !checkinForm.unidade.trim()) {
      setErroCheckin("Preencha o seu nome completo e a unidade.");
      return;
    }

    setEnviandoCheckin(true);
    const registro = {
      nome: checkinForm.nome.trim(),
      unidade: checkinForm.unidade.trim(),
      cargo: checkinForm.cargo.trim() || "Participante",
      confirmado_em: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from("encontro_2026_checkins")
        .insert([registro]);

      if (error) {
        console.warn(
          "Check-in salvo localmente (tabela pendente):",
          error.message
        );
      }

      const historicoLocal = JSON.parse(
        localStorage.getItem("irimep_encontro_2026_checkins") || "[]"
      );
      historicoLocal.unshift(registro);
      localStorage.setItem(
        "irimep_encontro_2026_checkins",
        JSON.stringify(historicoLocal)
      );

      setCheckinConfirmado(registro);
      setCheckinForm({
        nome: "",
        unidade: UNIDADES_OPCOES[0],
        cargo: "",
      });
    } catch (err) {
      console.error("Erro ao realizar check-in:", err);
      setErroCheckin("Não foi possível concluir o check-in. Tente novamente.");
    } finally {
      setEnviandoCheckin(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 overflow-x-clip">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

        @font-face {
          font-family: 'Naughty Monster';
          src: local('Naughty Monster'), local('NaughtyMonster');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }

        .font-naughty {
          font-family: 'Naughty Monster', 'Montserrat', sans-serif !important;
          font-weight: 400 !important;
          letter-spacing: 0.02em;
        }

        .font-corpo {
          font-family: 'Montserrat', sans-serif;
        }

        @keyframes girar-horario {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes girar-anti-horario {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes entrar-subindo {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.985);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes entrar-faixa {
          0% {
            opacity: 0;
            transform: translateX(-22px) rotate(-1deg);
          }
          100% {
            opacity: 1;
            transform: translateX(0) rotate(0deg);
          }
        }

        .anim-entrada {
          animation: entrar-subindo 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .anim-faixa {
          animation: entrar-faixa 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-entrada,
          .anim-faixa {
            animation: none !important;
          }
        }
      `}</style>

      {/* Hero / Capa Principal */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#0046a8] via-[#003682] to-[#002257] text-white font-corpo">
        {/* Elementos de asterisco girando */}
        <AsteriscoGiratorio
          duracao="26s"
          className="hidden sm:block absolute -top-10 -right-8 w-40 h-40 md:w-52 md:h-52 text-[#f5a623]/90"
        />
        <AsteriscoGiratorio
          duracao="32s"
          reverso
          className="hidden md:block absolute bottom-4 left-6 w-28 h-28 text-[#f38b1e]/80"
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {onVoltar && (
            <button
              type="button"
              onClick={onVoltar}
              className="anim-entrada mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-white transition-colors"
            >
              ← Voltar ao portal
            </button>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div
                style={{ animationDelay: "60ms" }}
                className="anim-entrada inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-[#ffd166]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                ENCONTRO INSTITUCIONAL • ISMEP 2026
              </div>

              <div className="space-y-2">
                <div
                  style={{ animationDelay: "120ms" }}
                  className="anim-faixa inline-block bg-[#f38b1e] text-white px-4 py-1.5 shadow-sm transition-transform duration-300 hover:translate-x-1"
                >
                  <h1 className="font-naughty text-2xl sm:text-4xl md:text-5xl uppercase leading-none">
                    ENCONTRO INSTITUCIONAL
                  </h1>
                </div>
                <br />
                <div
                  style={{ animationDelay: "200ms" }}
                  className="anim-faixa inline-block bg-[#f38b1e] text-white px-4 py-1.5 shadow-sm transition-transform duration-300 hover:translate-x-1"
                >
                  <p className="font-naughty text-2xl sm:text-4xl md:text-5xl uppercase leading-none">
                    DE DIRETORES E
                  </p>
                </div>
                <br />
                <div
                  style={{ animationDelay: "280ms" }}
                  className="anim-faixa inline-flex items-center gap-3 bg-[#f38b1e] text-white px-4 py-1.5 shadow-sm transition-transform duration-300 hover:translate-x-1"
                >
                  <p className="font-naughty text-2xl sm:text-4xl md:text-5xl uppercase leading-none">
                    COORDENADORES 2026
                  </p>
                  <AsteriscoGiratorio
                    duracao="14s"
                    className="w-7 h-7 sm:w-9 sm:h-9 text-[#ffd166] shrink-0"
                  />
                </div>
              </div>

              <div
                style={{ animationDelay: "310ms" }}
                className="anim-entrada bg-white/10 border-l-4 border-[#f5a623] rounded-r-2xl px-4 py-3 text-sm sm:text-base text-white"
              >
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ffd166] block mb-0.5">
                  Tema
                </span>
                <strong>Resultados, desafios e perspectivas para 2027</strong>
              </div>

              {/* Cards Reorganizados (Data, Local, Horário) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                <div
                  style={{ animationDelay: "340ms" }}
                  className="anim-entrada flex items-center gap-3 bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl px-3.5 py-3.5 transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5"
                >
                  <Calendar className="w-5 h-5 text-[#f5a623] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">
                      DATA
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                      18 de dezembro de 2026
                    </p>
                  </div>
                </div>

                <div
                  style={{ animationDelay: "410ms" }}
                  className="anim-entrada flex items-center gap-3 bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl px-3.5 py-3.5 transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5"
                >
                  <MapPin className="w-5 h-5 text-[#f5a623] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">
                      LOCAL
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                      Auditório do Hospital e Maternidade Santa Maria –
                      Araripina/PE
                    </p>
                  </div>
                </div>

                <div
                  style={{ animationDelay: "480ms" }}
                  className="anim-entrada flex items-center gap-3 bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl px-3.5 py-3.5 transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5"
                >
                  <Clock className="w-5 h-5 text-[#f5a623] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">
                      HORÁRIO
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                      A partir das 8h
                    </p>
                  </div>
                </div>
              </div>

              {/* Atalhos Rápidos */}
              <div
                style={{ animationDelay: "530ms" }}
                className="anim-entrada flex flex-wrap gap-3 pt-1"
              >
                <button
                  type="button"
                  onClick={() => irParaSecao("checkin")}
                  className="inline-flex items-center gap-2 bg-[#f38b1e] hover:bg-[#d97712] text-white text-xs font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  Fazer Check-in
                </button>
                <button
                  type="button"
                  onClick={() => irParaSecao("materiais")}
                  className="inline-flex items-center gap-2 bg-white text-[#003682] hover:bg-blue-50 text-xs font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#f38b1e]" />
                  Materiais para Download
                </button>
                <button
                  type="button"
                  onClick={() => irParaSecao("como-chegar")}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-[#ffd166]" />
                  Como chegar ao hospital
                </button>
              </div>
            </div>

            {/* Imagem da Capa */}
            <div
              style={{ animationDelay: "220ms" }}
              className="anim-entrada lg:col-span-5"
            >
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-[#002257]">
                <img
                  src="/Gemini_Generated_Image_9c2wn39c2wn39c2w.jpg"
                  alt="Encontro Institucional de Diretores e Coordenadores – ISMEP 2026"
                  className="w-full h-72 sm:h-96 lg:h-[420px] object-cover object-center block"
                />
                <div className="bg-[#001d4a]/90 backdrop-blur-xs px-4 py-3 border-t border-white/15 flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-[#ffd166] uppercase tracking-wider">
                    18 de dezembro de 2026
                  </span>
                  <span className="text-blue-100 font-semibold">
                    A partir das 8h • Araripina/PE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main
        id="programacao"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 font-corpo space-y-16"
      >
        {/* Programação */}
        <section>
          <div className="anim-entrada flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#f38b1e]/15 text-[#c96a08] text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                <AsteriscoGiratorio
                  duracao="12s"
                  className="w-3.5 h-3.5 text-[#f38b1e]"
                />
                Pauta Oficial • Tema: Resultados, desafios e perspectivas para 2027
              </div>
              <h2 className="font-naughty text-3xl sm:text-4xl text-[#003682] uppercase">
                Programação do Encontro
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                18 de dezembro de 2026 • Auditório do Hospital e Maternidade
                Santa Maria – Araripina/PE • A partir das 8h
              </p>
            </div>

            {/* Filtros por Etapa */}
            <div className="flex flex-wrap gap-2">
              {etapas.map((etapa) => {
                const ativa = filtroEtapa === etapa;
                return (
                  <button
                    key={etapa}
                    type="button"
                    onClick={() => setFiltroEtapa(etapa)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border active:scale-95 ${
                      ativa
                        ? "bg-[#003682] text-white border-[#003682] shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:border-[#003682]/40 hover:text-[#003682]"
                    }`}
                  >
                    {etapa}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lista de Itens da Programação */}
          <div className="space-y-5">
            {itensFiltrados.map((item, index) => (
              <article
                key={`${item.numero}-${filtroEtapa}`}
                style={{ animationDelay: `${Math.min(index * 70, 480)}ms` }}
                className="anim-entrada bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-2xs hover:border-[#0046a8]/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3.5">
                    <span className="w-10 h-10 rounded-xl bg-[#003682] text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                      {item.numero}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#f38b1e]/12 text-[#b85d00]">
                          {item.etapa}
                        </span>
                        {item.statusHorario && (
                          <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {item.statusHorario}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                        {item.titulo}
                      </h3>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003682] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full shrink-0 self-start">
                    <Clock className="w-3.5 h-3.5 text-[#f38b1e]" />
                    {item.horario}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                  {item.descricao}
                </p>

                {/* Tabela de Unidades quando for a Etapa 02 */}
                {item.unidades && (
                  <div className="mt-5 space-y-4">
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-[#003682] text-white text-xs uppercase tracking-wider">
                            <th className="py-3 px-4 font-bold">Unidade</th>
                            <th className="py-3 px-4 font-bold text-right">
                              Duração
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {item.unidades.map((u) => (
                            <tr
                              key={u.unidade}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <td className="py-3 px-4 font-semibold text-slate-800 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-[#0046a8] shrink-0" />
                                {u.unidade}
                              </td>
                              <td className="py-3 px-4 text-right font-bold text-[#003682]">
                                {u.duracao}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-amber-50/70 font-extrabold text-slate-900 border-t border-slate-200">
                            <td className="py-3 px-4">Tempo total</td>
                            <td className="py-3 px-4 text-right text-[#b85d00]">
                              {item.tempoTotal || "90 minutos"}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {item.topicosObrigatorios && (
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#003682] mb-2.5">
                          As apresentações deverão contemplar:
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                          {item.topicosObrigatorios.map((topico) => (
                            <li key={topico} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#f38b1e] shrink-0 mt-0.5" />
                              <span>{topico}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Lista de Itens / Diretrizes da Etapa */}
                {item.detalhes && item.detalhes.length > 0 && (
                  <div className="mt-4 space-y-2.5">
                    {item.topicosTitulo && (
                      <p className="text-xs font-bold uppercase tracking-wider text-[#003682]">
                        {item.topicosTitulo}
                      </p>
                    )}
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700">
                      {item.detalhes.map((detalhe) => (
                        <li
                          key={detalhe}
                          className="flex items-start gap-2 bg-slate-50/90 rounded-xl p-3 border border-slate-200/60"
                        >
                          {item.numero === "03" ? (
                            <Mic className="w-4 h-4 text-[#f38b1e] shrink-0 mt-0.5" />
                          ) : item.numero === "05" ? (
                            <Cpu className="w-4 h-4 text-[#0046a8] shrink-0 mt-0.5" />
                          ) : (
                            <Users className="w-4 h-4 text-[#0046a8] shrink-0 mt-0.5" />
                          )}
                          <span>{detalhe}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Área de Material para Download */}
        <section
          id="materiais"
          className="scroll-mt-24 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#f38b1e]/15 text-[#c96a08] text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                <Download className="w-3.5 h-3.5" />
                Arquivos do Encontro
              </div>
              <h2 className="font-naughty text-2xl sm:text-3xl text-[#003682] uppercase">
                Material para Download
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Baixe os materiais disponíveis em PDF, PowerPoint, Word, PNG e
                JPEG.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MATERIAIS_DOWNLOAD.map((mat) => {
              const Icone = mat.icon;
              return (
                <a
                  key={mat.id}
                  href={mat.href}
                  download={mat.downloadName}
                  className="group flex flex-col justify-between p-5 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-[#0046a8]/40 hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="w-10 h-10 rounded-xl bg-[#003682]/10 text-[#003682] flex items-center justify-center">
                        <Icone className="w-5 h-5" />
                      </span>
                      <span
                        className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${mat.badgeClass}`}
                      >
                        {mat.formato}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#003682] transition-colors">
                        {mat.titulo}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {mat.descricao}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs font-bold text-[#003682]">
                    <span>Baixar {mat.formato}</span>
                    <Download className="w-4 h-4 text-[#f38b1e] group-hover:translate-y-0.5 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Check-in do Participante + Como Chegar no Hospital */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24">
          {/* Check-in do Participante */}
          <section
            id="checkin"
            className="scroll-mt-24 lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs"
          >
            <div className="inline-flex items-center gap-2 bg-[#f38b1e]/15 text-[#c96a08] text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              Presença
            </div>
            <h2 className="font-naughty text-2xl sm:text-3xl text-[#003682] uppercase">
              Check-in do Participante
            </h2>
            <p className="text-sm text-slate-600 mt-1 mb-6">
              Confirme sua participação no Encontro Institucional 2026 (a partir
              das 8h).
            </p>

            {checkinConfirmado && (
              <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm">
                <p className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Check-in registrado com sucesso!
                </p>
                <p className="text-xs mt-1 text-emerald-800">
                  <strong>{checkinConfirmado.nome}</strong> •{" "}
                  {checkinConfirmado.unidade} ({checkinConfirmado.cargo})
                </p>
              </div>
            )}

            {erroCheckin && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {erroCheckin}
              </div>
            )}

            <form onSubmit={handleCheckinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Digite seu nome completo"
                  value={checkinForm.nome}
                  onChange={(e) =>
                    setCheckinForm((prev) => ({ ...prev, nome: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-sm focus:outline-none focus:bg-white focus:border-[#0046a8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Unidade *
                </label>
                <select
                  value={checkinForm.unidade}
                  onChange={(e) =>
                    setCheckinForm((prev) => ({
                      ...prev,
                      unidade: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-sm focus:outline-none focus:bg-white focus:border-[#0046a8] transition-colors"
                >
                  {UNIDADES_OPCOES.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Cargo / Função
                </label>
                <input
                  type="text"
                  placeholder="Ex.: Diretor(a), Coordenador(a), Gerente..."
                  value={checkinForm.cargo}
                  onChange={(e) =>
                    setCheckinForm((prev) => ({
                      ...prev,
                      cargo: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-sm focus:outline-none focus:bg-white focus:border-[#0046a8] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={enviandoCheckin}
                className="w-full bg-[#003682] hover:bg-[#0046a8] text-white font-bold py-3.5 px-5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {enviandoCheckin ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registrando presença...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 text-[#ffd166]" />
                    Confirmar Check-in
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Como Chegar no Hospital */}
          <section
            id="como-chegar"
            className="scroll-mt-24 lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-5"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-[#003682]/10 text-[#003682] text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                <Navigation className="w-3.5 h-3.5 text-[#f38b1e]" />
                Localização e Acesso
              </div>
              <h2 className="font-naughty text-2xl sm:text-3xl text-[#003682] uppercase">
                Como Chegar no Hospital
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Auditório do Hospital e Maternidade Santa Maria – Araripina/PE.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-sm">
              <p className="font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#f38b1e] shrink-0" />
                Hospital e Maternidade Santa Maria
              </p>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
                Araripina – Pernambuco • A partir das 8h.
              </p>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <p className="font-bold uppercase tracking-wider text-[11px] text-[#003682]">
                Orientações de chegada
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2.5 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                  <Clock className="w-4 h-4 text-[#f38b1e] shrink-0 mt-0.5" />
                  <span>
                    Abertura institucional a partir das <strong>8h</strong>, com
                    recepção e acolhimento e pronunciamentos às{" "}
                    <strong>8h30</strong> e <strong>8h40</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                  <Building2 className="w-4 h-4 text-[#0046a8] shrink-0 mt-0.5" />
                  <span>
                    Siga a sinalização interna até o{" "}
                    <strong>Auditório do Hospital e Maternidade Santa Maria</strong>.
                  </span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Hospital+e+Maternidade+Santa+Maria+Araripina+PE"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#003682] hover:bg-[#0046a8] text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors"
              >
                Abrir no Google Maps
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://waze.com/ul?q=Hospital%20e%20Maternidade%20Santa%20Maria%20Araripina%20PE&navigate=yes"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#f38b1e] hover:bg-[#d97712] text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors"
              >
                Abrir rota no Waze
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </section>
        </div>
      </main>

      {/* Rodapé Institucional */}
      <footer className="bg-[#002b6b] text-white font-corpo border-t-4 border-[#f5a623]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-sm text-white">
              Instituto Social das Medianeiras da Paz (ISMEP)
            </p>
            <p className="text-blue-200">
              Auditório do Hospital e Maternidade Santa Maria – Araripina/PE
            </p>
          </div>

          <div className="text-left md:text-right space-y-1">
            <p className="text-blue-200">Data e Horário:</p>
            <p className="text-sm font-bold text-[#ffd166]">
              18 de dezembro de 2026 • A partir das 8h
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
