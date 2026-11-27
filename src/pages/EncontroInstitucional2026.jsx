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
  Utensils,
  Music,
  Navigation,
  UserCheck,
  Loader2,
  ExternalLink,
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
  { unidade: "Hospital Dom Malan", duracao: "15 minutos" },
  { unidade: "UPAE Ouricuri", duracao: "15 minutos" },
  { unidade: "UPA Barra de Jangada", duracao: "15 minutos" },
  { unidade: "UPA Olinda", duracao: "15 minutos" },
];

const UNIDADES_OPCOES = [
  "Hospital e Maternidade Santa Maria (HMSM)",
  "Hospital Regional Fernando Bezerra (HRFB)",
  "Hospital Dom Malan (HDM)",
  "UPAE Ouricuri",
  "UPA Barra de Jangada",
  "UPA Olinda",
  "Sede / Administração Central – ISMEP",
  "Outra unidade",
];

const PROGRAMACAO_OFICIAL = [
  {
    numero: "00",
    etapa: "Recepção",
    titulo: "Recepção e acolhimento",
    horario: "8h",
    descricao:
      "Chegada dos diretores, coordenadores e lideranças, acolhimento inicial e preparação para o início da programação às 9h.",
    detalhes: [
      "Recepção e acolhimento a partir das 8h",
      "Acolhimento e integração inicial das lideranças",
    ],
  },
  {
    numero: "01",
    etapa: "Abertura",
    titulo: "Abertura institucional — Início da programação",
    horario: "A partir das 9h",
    descricao:
      "Início oficial da programação às 9h com acolhimento, pronunciamento da Presidente e Madre – Ir. Maria Luísa Mota e pronunciamento da Superintendência – Ir. Fátima Alencar.",
    detalhes: [
      "Programação iniciando às 9h",
      "Pronunciamento da Presidente e Madre – Ir. Maria Luísa Mota",
      "Pronunciamento da Superintendência – Ir. Fátima Alencar",
    ],
  },
  {
    numero: "02",
    etapa: "Resultados 2026",
    titulo: "Apresentação dos resultados das unidades – Exercício 2026",
    horario: "15 min/unidade (75 min total)",
    descricao:
      "Cada diretor terá 15 minutos para apresentar os resultados de sua unidade, contemplando indicadores assistenciais, desempenho administrativo/financeiro, avanços de 2026 e desafios para 2027.",
    unidades: UNIDADES_RESULTADOS,
    topicosObrigatorios: [
      "Resultados assistenciais e indicadores de desempenho",
      "Resultados administrativos e financeiros",
      "Principais avanços e melhorias implementadas em 2026",
      "Desafios enfrentados / perspectivas para 2027",
    ],
  },
  {
    numero: "03",
    etapa: "Palestra",
    titulo: "Palestra institucional",
    horario: "A definir",
    descricao:
      "Tema, palestrante e duração a definir para aprofundamento institucional durante o encontro.",
    detalhes: [
      "Tema: a definir",
      "Palestrante: a definir",
      "Duração: a definir",
    ],
  },
  {
    numero: "04",
    etapa: "Estratégia 2027",
    titulo: "Alinhamento Estratégico Institucional para 2027",
    horario: "A definir",
    descricao:
      "Construção coletiva das prioridades estratégicas do ISMEP para 2027, com identificação de ao menos um desafio institucional por diretoria/coordenação e transformação em propostas de intervenção, metas e compromissos integrados.",
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
    titulo: "Debate e informação – Bruno – Coordenador de tecnologia da informação",
    horario: "A definir",
    descricao:
      "Integração e confiabilidade das informações gerenciais e assistenciais.",
    detalhes: [
      "Integração e confiabilidade das informações gerenciais e assistenciais",
    ],
  },
  {
    numero: "06",
    etapa: "Almoço",
    titulo: "Almoço de confraternização",
    horario: "A definir",
    descricao:
      "Momento de pausa, alimentação e convivência fraterna entre diretores, coordenadores e lideranças presentes.",
    detalhes: [
      "Almoço e confraternização das lideranças",
      "Troca de experiências entre as unidades",
    ],
  },
  {
    numero: "07",
    etapa: "Encerramento",
    titulo: "Considerações finais e encerramento",
    horario: "A definir",
    descricao:
      "Síntese dos principais pontos abordados durante o encontro, alinhamento dos compromissos institucionais para 2027 e pronunciamento de encerramento.",
    detalhes: [
      "Síntese dos principais pontos abordados durante o encontro",
      "Alinhamento dos compromissos institucionais para 2027",
      "Pronunciamento de encerramento",
    ],
  },
  {
    numero: "08",
    etapa: "Cultural",
    titulo: "Apresentação cultural",
    horario: "Encerramento",
    descricao:
      "Momento cultural de celebração e encerramento do Encontro Institucional de Diretores e Coordenadores 2026.",
    detalhes: [
      "Apresentação cultural ao final do encontro",
      "Celebração e encerramento institucional",
    ],
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
        console.warn("Check-in salvo localmente (tabela pendente):", error.message);
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

      {/* Hero Principal */}
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

          <div className="max-w-5xl space-y-6">
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

            {/* Cards Reorganizados (Data, Local, Horários) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div
                style={{ animationDelay: "340ms" }}
                className="anim-entrada flex items-center gap-3.5 bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl px-4 py-4 transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5"
              >
                <Calendar className="w-5 h-5 text-[#f5a623] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">
                    DATA
                  </p>
                  <p className="text-sm font-bold text-white leading-snug">
                    18 de dezembro de 2026
                  </p>
                </div>
              </div>

              <div
                style={{ animationDelay: "410ms" }}
                className="anim-entrada flex items-center gap-3.5 bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl px-4 py-4 transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5"
              >
                <MapPin className="w-5 h-5 text-[#f5a623] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">
                    LOCAL
                  </p>
                  <p className="text-sm font-bold text-white leading-snug">
                    Auditório do Hospital e Maternidade Santa Maria – Araripina/PE
                  </p>
                </div>
              </div>

              <div
                style={{ animationDelay: "480ms" }}
                className="anim-entrada flex items-center gap-3.5 bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl px-4 py-4 transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5"
              >
                <Clock className="w-5 h-5 text-[#f5a623] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">
                    HORÁRIOS
                  </p>
                  <p className="text-sm font-bold text-white leading-snug">
                    Recepção às 8h • Programação às 9h
                  </p>
                </div>
              </div>
            </div>

            {/* Atalhos Rápidos */}
            <div
              style={{ animationDelay: "530ms" }}
              className="anim-entrada flex flex-wrap gap-3 pt-1"
            >
              <a
                href="#checkin"
                className="inline-flex items-center gap-2 bg-[#f38b1e] hover:bg-[#d97712] text-white text-xs font-extrabold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                Fazer Check-in
              </a>
              <a
                href="#como-chegar"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#ffd166]" />
                Como chegar ao hospital
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Seção de Programação */}
      <main
        id="programacao"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 font-corpo space-y-16"
      >
        <section>
          <div className="anim-entrada flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#f38b1e]/15 text-[#c96a08] text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                <AsteriscoGiratorio
                  duracao="12s"
                  className="w-3.5 h-3.5 text-[#f38b1e]"
                />
                Pauta Oficial
              </div>
              <h2 className="font-naughty text-3xl sm:text-4xl text-[#003682] uppercase">
                Programação do Encontro
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                18 de dezembro de 2026 • Auditório do Hospital e Maternidade
                Santa Maria – Araripina/PE • Recepção às 8h • Programação às 9h
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
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#f38b1e]/12 text-[#b85d00] mb-1">
                        {item.etapa}
                      </span>
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
                              75 minutos
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
                {item.detalhes && (
                  <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700">
                    {item.detalhes.map((detalhe) => (
                      <li
                        key={detalhe}
                        className="flex items-start gap-2 bg-slate-50/90 rounded-xl p-3 border border-slate-200/60"
                      >
                        {item.numero === "03" ? (
                          <Mic className="w-4 h-4 text-[#f38b1e] shrink-0 mt-0.5" />
                        ) : item.numero === "05" ? (
                          <Cpu className="w-4 h-4 text-[#0046a8] shrink-0 mt-0.5" />
                        ) : item.numero === "06" ? (
                          <Utensils className="w-4 h-4 text-[#f38b1e] shrink-0 mt-0.5" />
                        ) : item.numero === "08" ? (
                          <Music className="w-4 h-4 text-[#f38b1e] shrink-0 mt-0.5" />
                        ) : (
                          <Users className="w-4 h-4 text-[#0046a8] shrink-0 mt-0.5" />
                        )}
                        <span>{detalhe}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Check-in do Participante + Como Chegar no Hospital */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Check-in do Participante */}
          <section
            id="checkin"
            className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs"
          >
            <div className="inline-flex items-center gap-2 bg-[#f38b1e]/15 text-[#c96a08] text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              Presença
            </div>
            <h2 className="font-naughty text-2xl sm:text-3xl text-[#003682] uppercase">
              Check-in do Participante
            </h2>
            <p className="text-sm text-slate-600 mt-1 mb-6">
              Confirme sua participação no Encontro Institucional 2026 (recepção a
              partir das 8h).
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
            className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-5"
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
                Araripina – Pernambuco • Recepção a partir das 8h e início da
                programação às 9h.
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
                    Chegue com antecedência a partir das <strong>8h</strong> para
                    recepção, acolhimento e check-in antes das <strong>9h</strong>.
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
            <p className="text-blue-200">Data e Horários:</p>
            <p className="text-sm font-bold text-[#ffd166]">
              18 de dezembro de 2026 • Recepção às 8h • Programação às 9h
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
