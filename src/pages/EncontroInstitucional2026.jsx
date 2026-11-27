import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Target,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const PROGRAMACAO_PADRAO = [
  {
    hora: "08:00",
    titulo: "Credenciamento e Café de Boas-Vindas",
    descricao:
      "Recepção de diretores, coordenadores e lideranças das unidades com integração inicial.",
    etapa: "Abertura",
  },
  {
    hora: "08:45",
    titulo: "Abertura Oficial e Palavra Institucional",
    descricao:
      "Boas-vindas da Congregação Irmãs Medianeiras da Paz e do Instituto Social das Medianeiras da Paz (ISMEP).",
    etapa: "Institucional",
  },
  {
    hora: "09:30",
    titulo: "Alinhar o Presente: Balanço 2026 e Indicadores",
    descricao:
      "Apresentação dos principais resultados, desafios superados e avanços assistenciais e administrativos do ano.",
    etapa: "Diagnóstico",
  },
  {
    hora: "11:00",
    titulo: "Intervalo e Integração das Lideranças",
    descricao: "Pausa para troca de experiências entre coordenações e equipes.",
    etapa: "Intervalo",
  },
  {
    hora: "11:20",
    titulo: "Construir 2027: Propósito, Resultados e Ação Integrada",
    descricao:
      "Diretrizes estratégicas, metas compartilhadas e alinhamento entre unidades e áreas de apoio para 2027.",
    etapa: "Planejamento",
  },
  {
    hora: "12:30",
    titulo: "Almoço de Confraternização",
    descricao: "Momento de convivência e fortalecimento de vínculos entre as lideranças.",
    etapa: "Confraternização",
  },
  {
    hora: "14:00",
    titulo: "Oficina de Alinhamento e Planos de Ação",
    descricao:
      "Dinâmica prática por frentes de atuação para desdobrar prioridades, fluxos de comunicação e resultados esperados.",
    etapa: "Ação Integrada",
  },
  {
    hora: "16:00",
    titulo: "Síntese dos Compromissos e Encerramento",
    descricao:
      "Consolidação dos encaminhamentos para 2027, mensagem final e encerramento do encontro.",
    etapa: "Encerramento",
  },
];

export default function EncontroInstitucional2026({
  programacao = PROGRAMACAO_PADRAO,
  onVoltar,
}) {
  const [filtroEtapa, setFiltroEtapa] = useState("Todas");

  const etapas = ["Todas", ...Array.from(new Set(programacao.map((item) => item.etapa)))];

  const itensFiltrados =
    filtroEtapa === "Todas"
      ? programacao
      : programacao.filter((item) => item.etapa === filtroEtapa);

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

        @font-face {
          font-family: 'Naughty Monster';
          src: local('Naughty Monster'), local('NaughtyMonster');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        .font-naughty {
          font-family: 'Naughty Monster', 'Montserrat', sans-serif;
          letter-spacing: 0.02em;
        }

        .font-corpo {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>

      {/* Hero Principal */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#0046a8] via-[#003682] to-[#002257] text-white font-corpo">
        {/* Asteriscos decorativos inspirados na arte */}
        <span
          aria-hidden="true"
          className="pointer-events-none select-none hidden sm:block absolute -top-6 right-10 text-[150px] leading-none font-light text-[#f5a623]/90"
        >
          ✳
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none select-none hidden md:block absolute bottom-6 left-8 text-[110px] leading-none font-light text-[#f38b1e]/80"
        >
          ✳
        </span>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {onVoltar && (
            <button
              type="button"
              onClick={onVoltar}
              className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-white transition-colors"
            >
              ← Voltar ao portal
            </button>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-[#ffd166]">
                <Sparkles className="w-3.5 h-3.5" />
                ENCONTRO INSTITUCIONAL • EDIÇÃO 2026
              </div>

              <div className="space-y-2">
                <div className="inline-block bg-[#f38b1e] text-white px-4 py-1.5 shadow-sm">
                  <h1 className="font-naughty text-3xl sm:text-5xl md:text-6xl uppercase leading-none">
                    ENCONTRO INSTITUCIONAL
                  </h1>
                </div>
                <br />
                <div className="inline-block bg-[#f38b1e] text-white px-4 py-1.5 shadow-sm">
                  <p className="font-naughty text-2xl sm:text-4xl md:text-5xl uppercase leading-none">
                    DE DIRETORES E
                  </p>
                </div>
                <br />
                <div className="inline-flex items-center gap-3 bg-[#f38b1e] text-white px-4 py-1.5 shadow-sm">
                  <p className="font-naughty text-2xl sm:text-4xl md:text-5xl uppercase leading-none">
                    COORDENADORES 2026
                  </p>
                  <span className="text-[#ffd166] text-2xl sm:text-3xl leading-none">✳</span>
                </div>
              </div>

              {/* Tema Central */}
              <div className="pt-2 max-w-2xl">
                <p className="text-xs uppercase tracking-widest text-[#ffd166] font-bold mb-1.5">
                  Tema do Encontro
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  Alinhar o presente construir 2027:{" "}
                  <span className="font-normal text-blue-100">
                    propósito, resultados e ação integrada.
                  </span>
                </p>
              </div>

              {/* Data e Local */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-2xl">
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3.5">
                  <Calendar className="w-5 h-5 text-[#f5a623] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">
                      Data e Horário
                    </p>
                    <p className="text-sm font-bold text-white">
                      18 de Dezembro • a partir das 8h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3.5">
                  <MapPin className="w-5 h-5 text-[#f5a623] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">
                      Local
                    </p>
                    <p className="text-sm font-bold text-white">
                      Hospital e Maternidade Santa Maria — Araripina-PE
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Lateral de Síntese do Tema */}
            <div className="lg:col-span-4">
              <div className="bg-white text-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl border-t-4 border-[#f38b1e]">
                <div className="flex items-center gap-2.5 text-[#0046a8] font-bold text-sm uppercase tracking-wider mb-4">
                  <Target className="w-5 h-5 text-[#f38b1e]" />
                  Eixos do Tema
                </div>

                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0046a8] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Propósito</p>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Reafirmar a missão institucional e o cuidado humanizado em cada unidade.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0046a8] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Resultados</p>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Avaliar entregas de 2026 e definir metas claras e mensuráveis para 2027.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0046a8] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Ação Integrada</p>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Fortalecer o trabalho conjunto entre lideranças, áreas técnicas e gestão.
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                    <Users className="w-4 h-4 text-[#0046a8]" />
                    Diretores e Coordenadores
                  </span>
                  <a
                    href="#programacao"
                    className="font-bold text-[#0046a8] hover:text-[#f38b1e] inline-flex items-center gap-1 transition-colors"
                  >
                    Ver agenda <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Seção de Programação */}
      <main id="programacao" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 font-corpo">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="inline-block bg-[#f38b1e]/15 text-[#c96a08] text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              Cronograma do Dia
            </span>
            <h2 className="font-naughty text-3xl sm:text-4xl text-[#003682] uppercase">
              Programação do Encontro
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              18 de dezembro, a partir das 8h • Hospital e Maternidade Santa Maria (Araripina-PE)
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
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

        {/* Lista de Atividades */}
        <div className="space-y-4">
          {itensFiltrados.map((item, idx) => (
            <article
              key={`${item.hora}-${item.titulo}-${idx}`}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs hover:border-[#0046a8]/30 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
            >
              <div className="shrink-0 flex sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-2 sm:w-28 sm:border-r sm:border-slate-100 sm:pr-4">
                <span className="inline-flex items-center gap-1.5 text-lg font-extrabold text-[#003682]">
                  <Clock className="w-4 h-4 text-[#f38b1e]" />
                  {item.hora}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#f38b1e]/12 text-[#b85d00]">
                  {item.etapa}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {item.titulo}
                </h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {item.descricao}
                </p>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Rodapé Institucional */}
      <footer className="bg-[#002b6b] text-white font-corpo border-t-4 border-[#f5a623]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-sm text-white">
              Congregação Irmãs Medianeiras da Paz • Instituto Social das Medianeiras da Paz (ISMEP)
            </p>
            <p className="text-blue-200">
              Hospital e Maternidade Santa Maria — Araripina-PE
            </p>
          </div>

          <div className="text-left md:text-right space-y-1">
            <p className="text-blue-200">Saiba mais em:</p>
            <a
              href="https://irimep.com.br"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-[#ffd166] hover:underline"
            >
              irimep.com.br
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
