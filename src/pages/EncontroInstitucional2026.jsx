import React, { useState } from "react";
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
} from "lucide-react";

const UNIDADES_RESULTADOS = [
  { unidade: "Hospital Regional Fernando Bezerra", duracao: "15 minutos" },
  { unidade: "Hospital Dom Malan", duracao: "15 minutos" },
  { unidade: "UPAE Ouricuri", duracao: "15 minutos" },
  { unidade: "UPA Barra de Jangada", duracao: "15 minutos" },
  { unidade: "UPA Olinda", duracao: "15 minutos" },
];

const PROGRAMACAO_OFICIAL = [
  {
    numero: "01",
    etapa: "Abertura",
    titulo: "Abertura institucional",
    horario: "A partir das 9h",
    descricao:
      "Recepção e acolhimento; pronunciamento da Presidente e Madre – Ir. Maria Luísa Mota; e pronunciamento da Superintendência – Ir. Fátima Alencar.",
    detalhes: [
      "Recepção e acolhimento",
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
];

export default function EncontroInstitucional2026({
  programacao = PROGRAMACAO_OFICIAL,
  onVoltar,
}) {
  const [filtroEtapa, setFiltroEtapa] = useState("Todas");

  const etapas = [
    "Todas",
    ...Array.from(new Set(programacao.map((item) => item.etapa))),
  ];

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

          <div className="max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-[#ffd166]">
              <Sparkles className="w-3.5 h-3.5" />
              ENCONTRO INSTITUCIONAL • ISMEP 2026
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
                <span className="text-[#ffd166] text-2xl sm:text-3xl leading-none">
                  ✳
                </span>
              </div>
            </div>

            {/* Informações Oficiais */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3.5">
                <Calendar className="w-5 h-5 text-[#f5a623] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">
                    Data
                  </p>
                  <p className="text-sm font-bold text-white">
                    18 de dezembro de 2026
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
                    Auditório do Hospital e Maternidade Santa Maria – Araripina/PE
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3.5">
                <Clock className="w-5 h-5 text-[#f5a623] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">
                    Horário
                  </p>
                  <p className="text-sm font-bold text-white">A partir das 9h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Seção de Programação */}
      <main
        id="programacao"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 font-corpo"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="inline-block bg-[#f38b1e]/15 text-[#c96a08] text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              Pauta Oficial
            </span>
            <h2 className="font-naughty text-3xl sm:text-4xl text-[#003682] uppercase">
              Programação do Encontro
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              18 de dezembro de 2026 • Auditório do Hospital e Maternidade Santa
              Maria – Araripina/PE • A partir das 9h
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

        {/* Lista de Itens da Programação */}
        <div className="space-y-5">
          {itensFiltrados.map((item) => (
            <article
              key={item.numero}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-2xs hover:border-[#0046a8]/30 hover:shadow-md transition-all"
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
              18 de dezembro de 2026 • A partir das 9h
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
