import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  LogOut,
  Building2,
  ListChecks,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  UserCheck,
  RefreshCw,
} from "lucide-react";

const DADOS_INICIAIS = {
  data: "18 de dezembro de 2026",
  horarioInicio: "Recepção às 8h • Programação às 9h",
  local: "Auditório do Hospital e Maternidade Santa Maria – Araripina/PE",
  palestra: {
    tema: "A definir",
    palestrante: "A definir",
    duracao: "A definir",
  },
  unidades: [
    { id: "u1", unidade: "Hospital Regional Fernando Bezerra", duracao: "15 minutos" },
    { id: "u2", unidade: "Hospital Dom Malan", duracao: "15 minutos" },
    { id: "u3", unidade: "UPAE Ouricuri", duracao: "15 minutos" },
    { id: "u4", unidade: "UPA Barra de Jangada", duracao: "15 minutos" },
    { id: "u5", unidade: "UPA Olinda", duracao: "15 minutos" },
  ],
  programacao: [
    {
      id: "p0",
      numero: "00",
      etapa: "Recepção",
      titulo: "Recepção e acolhimento",
      horario: "08h00 – 09h00",
      statusHorario: "Confirmado",
      ordemHora: 800,
      descricao:
        "Chegada dos diretores, coordenadores e lideranças, acolhimento inicial e preparação para o início da programação às 9h.",
      itensTexto:
        "Recepção e acolhimento a partir das 8h\nAcolhimento e integração inicial das lideranças",
    },
    {
      id: "p1",
      numero: "01",
      etapa: "Abertura",
      titulo: "Abertura institucional — Início da programação",
      horario: "09h00 – 09h30",
      statusHorario: "Programação às 9h • Horário previsto",
      ordemHora: 900,
      descricao:
        "Início oficial da programação às 9h com acolhimento, pronunciamento da Presidente e Madre – Ir. Maria Luísa Mota e pronunciamento da Superintendência – Ir. Fátima Alencar.",
      itensTexto:
        "Programação iniciando às 9h\nPronunciamento da Presidente e Madre – Ir. Maria Luísa Mota\nPronunciamento da Superintendência – Ir. Fátima Alencar",
    },
    {
      id: "p2",
      numero: "02",
      etapa: "Resultados 2026",
      titulo: "Apresentação dos resultados das unidades – Exercício 2026",
      horario: "09h30 – 10h45",
      statusHorario: "15 min/unidade (75 min total) • Horário previsto",
      ordemHora: 930,
      descricao:
        "Cada diretor terá 15 minutos para apresentar os resultados de sua unidade, contemplando indicadores assistenciais, desempenho administrativo/financeiro, avanços de 2026 e desafios para 2027.",
      itensTexto:
        "Resultados assistenciais e indicadores de desempenho\nResultados administrativos e financeiros\nPrincipais avanços e melhorias implementadas em 2026\nDesafios enfrentados / perspectivas para 2027",
    },
    {
      id: "p3",
      numero: "03",
      etapa: "Palestra",
      titulo: "Palestra institucional",
      horario: "A definir",
      statusHorario: "A confirmar",
      ordemHora: 1045,
      descricao:
        "Tema, palestrante e duração para aprofundamento institucional durante o encontro.",
      itensTexto: "Tema: a definir\nPalestrante: a definir\nDuração: a definir",
    },
    {
      id: "p4",
      numero: "04",
      etapa: "Estratégia 2027",
      titulo: "Alinhamento Estratégico Institucional para 2027",
      horario: "A definir",
      statusHorario: "A confirmar",
      ordemHora: 1130,
      descricao:
        "Construção coletiva das prioridades estratégicas do ISMEP para 2027, com identificação de ao menos um desafio institucional por diretoria/coordenação e transformação em propostas de intervenção, metas e compromissos integrados.",
      itensTexto:
        "Tema estratégico a ser trabalhado em 2027\nProblema ou desafio institucional identificado\nProposta de intervenção ou melhoria\nResultado esperado para 2027\nIndicadores e metas para acompanhamento dos resultados",
    },
    {
      id: "p5",
      numero: "05",
      etapa: "Tecnologia",
      titulo: "Debate e informação – Bruno – Coordenador de tecnologia da informação",
      horario: "A definir",
      statusHorario: "A confirmar",
      ordemHora: 1200,
      descricao:
        "Integração e confiabilidade das informações gerenciais e assistenciais.",
      itensTexto:
        "Integração e confiabilidade das informações gerenciais e assistenciais",
    },
    {
      id: "p6",
      numero: "06",
      etapa: "Almoço",
      titulo: "Almoço de confraternização",
      horario: "A definir",
      statusHorario: "A confirmar",
      ordemHora: 1230,
      descricao:
        "Momento de pausa, alimentação e convivência fraterna entre diretores, coordenadores e lideranças presentes.",
      itensTexto:
        "Almoço e confraternização das lideranças\nTroca de experiências entre as unidades",
    },
    {
      id: "p7",
      numero: "07",
      etapa: "Encerramento",
      titulo: "Considerações finais e encerramento",
      horario: "A definir",
      statusHorario: "A confirmar",
      ordemHora: 1400,
      descricao:
        "Síntese dos principais pontos abordados durante o encontro, alinhamento dos compromissos institucionais para 2027 e pronunciamento de encerramento.",
      itensTexto:
        "Síntese dos principais pontos abordados durante o encontro\nAlinhamento dos compromissos institucionais para 2027\nPronunciamento de encerramento",
    },
    {
      id: "p8",
      numero: "08",
      etapa: "Cultural",
      titulo: "Apresentação cultural",
      horario: "Ao final",
      statusHorario: "Encerramento do encontro",
      ordemHora: 1500,
      descricao:
        "Momento cultural de celebração e encerramento do Encontro Institucional de Diretores e Coordenadores 2026.",
      itensTexto:
        "Apresentação cultural ao final do encontro\nCelebração e encerramento institucional",
    },
  ],
};

function extrairMinutos(duracaoTexto = "") {
  const match = String(duracaoTexto).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function extrairPesoHorario(horario = "", fallback = 9999) {
  const match = String(horario).match(/(\d{1,2})[h:](\d{2})?/i);
  if (!match) return fallback;
  const horas = parseInt(match[1], 10);
  const minutos = match[2] ? parseInt(match[2], 10) : 0;
  return horas * 100 + minutos;
}

export default function AdminEncontro2026({ onLogout }) {
  const [abaAtiva, setAbaAtiva] = useState("geral");
  const [dados, setDados] = useState(DADOS_INICIAIS);
  const [checkins, setCheckins] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoCheckins, setCarregandoCheckins] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [novaUnidade, setNovaUnidade] = useState({
    unidade: "",
    duracao: "15 minutos",
  });

  useEffect(() => {
    carregarDados();
    carregarCheckins();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    setFeedback(null);
    try {
      const { data, error } = await supabase
        .from("encontro_2026_config")
        .select("dados")
        .eq("id", "encontro_institucional_2026")
        .maybeSingle();

      if (!error && data?.dados) {
        setDados({
          ...DADOS_INICIAIS,
          ...data.dados,
          palestra: {
            ...DADOS_INICIAIS.palestra,
            ...(data.dados.palestra || {}),
          },
          unidades: Array.isArray(data.dados.unidades)
            ? data.dados.unidades
            : DADOS_INICIAIS.unidades,
          programacao: Array.isArray(data.dados.programacao)
            ? data.dados.programacao
            : DADOS_INICIAIS.programacao,
        });
      }
    } catch (err) {
      console.error("Erro ao carregar dados do encontro:", err);
    } finally {
      setCarregando(false);
    }
  }

  async function carregarCheckins() {
    setCarregandoCheckins(true);
    try {
      const { data, error } = await supabase
        .from("encontro_2026_checkins")
        .select("*")
        .order("confirmado_em", { ascending: false });

      if (!error && Array.isArray(data)) {
        setCheckins(data);
      } else {
        const locais = JSON.parse(
          localStorage.getItem("irimep_encontro_2026_checkins") || "[]"
        );
        setCheckins(locais);
      }
    } catch (err) {
      console.error("Erro ao carregar check-ins:", err);
      const locais = JSON.parse(
        localStorage.getItem("irimep_encontro_2026_checkins") || "[]"
      );
      setCheckins(locais);
    } finally {
      setCarregandoCheckins(false);
    }
  }

  async function handleSalvar() {
    setSalvando(true);
    setFeedback(null);
    try {
      const programacaoPreparada = dados.programacao.map((item, idx) => ({
        ...item,
        ordemHora: extrairPesoHorario(item.horario, (idx + 1) * 100),
      }));

      const payload = {
        ...dados,
        programacao: programacaoPreparada,
      };

      const { error } = await supabase
        .from("encontro_2026_config")
        .upsert(
          {
            id: "encontro_institucional_2026",
            dados: payload,
            atualizado_em: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

      if (error) throw error;

      setDados(payload);
      setFeedback({
        tipo: "sucesso",
        mensagem:
          "Alterações do Encontro Institucional 2026 guardadas com sucesso.",
      });
    } catch (err) {
      console.error("Erro ao guardar:", err);
      setFeedback({
        tipo: "erro",
        mensagem:
          "Não foi possível guardar no Supabase. Verifica se a tabela 'encontro_2026_config' está criada e acessível.",
      });
    } finally {
      setSalvando(false);
    }
  }

  function handleRestaurarPadrao() {
    setDados(DADOS_INICIAIS);
    setFeedback({
      tipo: "sucesso",
      mensagem:
        "Dados padrão restaurados no formulário. Clica em 'Guardar alterações' para publicar.",
    });
  }

  function atualizarCampoGeral(campo, valor) {
    setDados((prev) => ({ ...prev, [campo]: valor }));
  }

  function atualizarPalestra(campo, valor) {
    setDados((prev) => ({
      ...prev,
      palestra: { ...prev.palestra, [campo]: valor },
    }));
  }

  function atualizarUnidade(id, campo, valor) {
    setDados((prev) => ({
      ...prev,
      unidades: prev.unidades.map((u) =>
        u.id === id ? { ...u, [campo]: valor } : u
      ),
    }));
  }

  function adicionarUnidade(e) {
    e.preventDefault();
    if (!novaUnidade.unidade.trim()) return;
    setDados((prev) => ({
      ...prev,
      unidades: [
        ...prev.unidades,
        {
          id: `u_${Date.now()}`,
          unidade: novaUnidade.unidade.trim(),
          duracao: novaUnidade.duracao.trim() || "15 minutos",
        },
      ],
    }));
    setNovaUnidade({ unidade: "", duracao: "15 minutos" });
  }

  function removerUnidade(id) {
    setDados((prev) => ({
      ...prev,
      unidades: prev.unidades.filter((u) => u.id !== id),
    }));
  }

  function atualizarEtapa(id, campo, valor) {
    setDados((prev) => ({
      ...prev,
      programacao: prev.programacao.map((item) => {
        if (item.id !== id) return item;
        const atualizado = { ...item, [campo]: valor };
        if (campo === "horario") {
          atualizado.ordemHora = extrairPesoHorario(
            valor,
            item.ordemHora || 9999
          );
          if (String(valor).toLowerCase().includes("definir")) {
            atualizado.statusHorario = "A confirmar";
          } else if (atualizado.statusHorario === "A confirmar") {
            atualizado.statusHorario = "Horário definido";
          }
        }
        return atualizado;
      }),
    }));
  }

  function ordenarProgramacaoPorHorario() {
    setDados((prev) => {
      const ordenada = [...prev.programacao]
        .map((item, idx) => ({
          ...item,
          ordemHora: extrairPesoHorario(item.horario, (idx + 1) * 100),
        }))
        .sort((a, b) => a.ordemHora - b.ordemHora)
        .map((item, idx) => ({
          ...item,
          numero: String(idx).padStart(2, "0"),
        }));
      return { ...prev, programacao: ordenada };
    });
    setFeedback({
      tipo: "sucesso",
      mensagem:
        "Programação reordenada pelos horários. Clica em 'Guardar alterações' para publicar.",
    });
  }

  function adicionarEtapa() {
    const proximoNumero = String(dados.programacao.length).padStart(2, "0");
    setDados((prev) => ({
      ...prev,
      programacao: [
        ...prev.programacao,
        {
          id: `p_${Date.now()}`,
          numero: proximoNumero,
          etapa: "Nova Etapa",
          titulo: "Novo ponto da programação",
          horario: "A definir",
          statusHorario: "A confirmar",
          ordemHora: (prev.programacao.length + 1) * 100,
          descricao: "",
          itensTexto: "",
        },
      ],
    }));
  }

  function removerEtapa(id) {
    setDados((prev) => {
      const filtrada = prev.programacao.filter((item) => item.id !== id);
      const renumerada = filtrada.map((item, idx) => ({
        ...item,
        numero: String(idx).padStart(2, "0"),
      }));
      return { ...prev, programacao: renumerada };
    });
  }

  const totalMinutosUnidades = dados.unidades.reduce(
    (acc, u) => acc + extrairMinutos(u.duracao),
    0
  );

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 pb-16">
      {/* Cabeçalho do Painel */}
      <div className="bg-gradient-to-r from-[#003682] via-[#0046a8] to-[#002257] text-white border-b-4 border-[#f38b1e]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-[#ffd166] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Painel Administrativo • Encontro 2026
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Gestão do Encontro Institucional de Diretores e Coordenadores
            </h1>
            <p className="text-sm text-blue-100 mt-1">
              {dados.data} • {dados.horarioInicio} • {dados.local}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleRestaurarPadrao}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restaurar base
            </button>

            <button
              type="button"
              onClick={handleSalvar}
              disabled={salvando}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#f38b1e] hover:bg-[#d97712] text-white shadow-sm transition-colors disabled:opacity-60"
            >
              {salvando ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Guardar alterações
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-red-600/90 hover:bg-red-600 text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-2xl border flex items-start gap-3 text-sm font-medium ${
              feedback.tipo === "sucesso"
                ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {feedback.tipo === "sucesso" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <span>{feedback.mensagem}</span>
          </div>
        )}

        {/* Navegação por Abas */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setAbaAtiva("geral")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
              abaAtiva === "geral"
                ? "bg-[#003682] text-white border-[#003682] shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Dados Gerais & Palestra
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva("unidades")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
              abaAtiva === "unidades"
                ? "bg-[#003682] text-white border-[#003682] shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Unidades ({dados.unidades.length})
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva("programacao")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
              abaAtiva === "programacao"
                ? "bg-[#003682] text-white border-[#003682] shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Programação ({dados.programacao.length} etapas)
          </button>

          <button
            type="button"
            onClick={() => {
              setAbaAtiva("checkins");
              carregarCheckins();
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
              abaAtiva === "checkins"
                ? "bg-[#003682] text-white border-[#003682] shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Check-ins ({checkins.length})
          </button>
        </div>

        {carregando ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 flex items-center justify-center gap-3 text-slate-600">
            <Loader2 className="w-5 h-5 animate-spin text-[#003682]" />
            <span className="text-sm font-medium">A carregar configurações...</span>
          </div>
        ) : abaAtiva === "geral" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações Gerais */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-[#003682] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#f38b1e]" />
                Informações do Encontro
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Data
                </label>
                <input
                  type="text"
                  value={dados.data}
                  onChange={(e) => atualizarCampoGeral("data", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0046a8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Horários (Recepção / Programação)
                </label>
                <input
                  type="text"
                  value={dados.horarioInicio}
                  onChange={(e) =>
                    atualizarCampoGeral("horarioInicio", e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0046a8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Local
                </label>
                <input
                  type="text"
                  value={dados.local}
                  onChange={(e) => atualizarCampoGeral("local", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0046a8]"
                />
              </div>
            </section>

            {/* Palestra Institucional */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-[#003682] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#f38b1e]" />
                Palestra Institucional (Etapa 03)
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Tema da Palestra
                </label>
                <input
                  type="text"
                  value={dados.palestra.tema}
                  onChange={(e) => atualizarPalestra("tema", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0046a8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Palestrante
                </label>
                <input
                  type="text"
                  value={dados.palestra.palestrante}
                  onChange={(e) =>
                    atualizarPalestra("palestrante", e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0046a8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Duração
                </label>
                <input
                  type="text"
                  value={dados.palestra.duracao}
                  onChange={(e) => atualizarPalestra("duracao", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0046a8]"
                />
              </div>
            </section>
          </div>
        ) : abaAtiva === "unidades" ? (
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#003682] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#f38b1e]" />
                  Apresentação de Resultados das Unidades – Exercício 2026
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tempo total calculado:{" "}
                  <strong className="text-slate-800">
                    {totalMinutosUnidades} minutos
                  </strong>
                </p>
              </div>
            </div>

            <form
              onSubmit={adicionarUnidade}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/70"
            >
              <input
                type="text"
                placeholder="Nome da unidade (ex.: UPAE / Hospital)"
                value={novaUnidade.unidade}
                onChange={(e) =>
                  setNovaUnidade((prev) => ({ ...prev, unidade: e.target.value }))
                }
                className="sm:col-span-7 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-[#0046a8]"
              />
              <input
                type="text"
                placeholder="Duração (ex.: 15 minutos)"
                value={novaUnidade.duracao}
                onChange={(e) =>
                  setNovaUnidade((prev) => ({ ...prev, duracao: e.target.value }))
                }
                className="sm:col-span-3 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-[#0046a8]"
              />
              <button
                type="submit"
                className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#003682] hover:bg-[#0046a8] text-white text-xs font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </form>

            <div className="space-y-3">
              {dados.unidades.map((u) => (
                <div
                  key={u.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300"
                >
                  <input
                    type="text"
                    value={u.unidade}
                    onChange={(e) =>
                      atualizarUnidade(u.id, "unidade", e.target.value)
                    }
                    className="sm:col-span-7 px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium"
                  />
                  <input
                    type="text"
                    value={u.duracao}
                    onChange={(e) =>
                      atualizarUnidade(u.id, "duracao", e.target.value)
                    }
                    className="sm:col-span-4 px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removerUnidade(u.id)}
                      title="Remover unidade"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : abaAtiva === "programacao" ? (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-sm font-bold text-[#003682]">
                <ListChecks className="w-4 h-4 text-[#f38b1e]" />
                Etapas da Programação (Ordenação por Horário)
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={ordenarProgramacaoPorHorario}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 text-[#f38b1e]" />
                  Ordenar por horário
                </button>
                <button
                  type="button"
                  onClick={adicionarEtapa}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#003682] hover:bg-[#0046a8] text-white text-xs font-bold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Nova etapa
                </button>
              </div>
            </div>

            {dados.programacao.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#003682]">
                    <span className="w-7 h-7 rounded-lg bg-[#003682] text-white flex items-center justify-center">
                      {item.numero}
                    </span>
                    Etapa {item.numero} • {item.horario}
                  </span>

                  <button
                    type="button"
                    onClick={() => removerEtapa(item.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remover
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Horário (ex.: 08h00 – 09h00 ou A definir)
                    </label>
                    <input
                      type="text"
                      value={item.horario}
                      onChange={(e) =>
                        atualizarEtapa(item.id, "horario", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Tag / Categoria
                    </label>
                    <input
                      type="text"
                      value={item.etapa}
                      onChange={(e) =>
                        atualizarEtapa(item.id, "etapa", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      value={item.titulo}
                      onChange={(e) =>
                        atualizarEtapa(item.id, "titulo", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Status do Horário
                    </label>
                    <input
                      type="text"
                      value={item.statusHorario || ""}
                      onChange={(e) =>
                        atualizarEtapa(item.id, "statusHorario", e.target.value)
                      }
                      placeholder="Ex.: Confirmado, Horário previsto, A confirmar"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Descrição
                  </label>
                  <textarea
                    rows={2}
                    value={item.descricao}
                    onChange={(e) =>
                      atualizarEtapa(item.id, "descricao", e.target.value)
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Tópicos / Itens (um por linha)
                  </label>
                  <textarea
                    rows={3}
                    value={item.itensTexto}
                    onChange={(e) =>
                      atualizarEtapa(item.id, "itensTexto", e.target.value)
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono"
                  />
                </div>
              </div>
            ))}
          </section>
        ) : (
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-[#003682] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#f38b1e]" />
                  Participantes com Check-in Confirmado ({checkins.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lista de confirmações enviadas pela página pública do encontro.
                </p>
              </div>

              <button
                type="button"
                onClick={carregarCheckins}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    carregandoCheckins ? "animate-spin" : ""
                  }`}
                />
                Atualizar
              </button>
            </div>

            {checkins.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">
                Nenhum check-in registrado até o momento.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#003682] text-white text-xs uppercase tracking-wider">
                      <th className="py-3 px-4 font-bold">Nome</th>
                      <th className="py-3 px-4 font-bold">Unidade</th>
                      <th className="py-3 px-4 font-bold">Cargo / Função</th>
                      <th className="py-3 px-4 font-bold text-right">
                        Data/Hora
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {checkins.map((c, idx) => (
                      <tr key={c.id || idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {c.nome}
                        </td>
                        <td className="py-3 px-4 text-slate-700">{c.unidade}</td>
                        <td className="py-3 px-4 text-slate-600">
                          {c.cargo || "Participante"}
                        </td>
                        <td className="py-3 px-4 text-right text-xs text-slate-500">
                          {c.confirmado_em
                            ? new Date(c.confirmado_em).toLocaleString("pt-BR")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
