import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import {
  Download,
  RefreshCw,
  LogOut,
  UserCheck,
  Loader2,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  FileText,
} from "lucide-react";

const MATERIAIS_PADRAO = [
  {
    id: "m_pdf",
    formato: "PDF",
    titulo: "Programação Oficial em PDF",
    descricao: "Documento completo da pauta e diretrizes do encontro.",
    href: "/materiais-encontro-2026/programacao-encontro-2026.pdf",
    downloadName: "programacao-encontro-2026.pdf",
  },
  {
    id: "m_pptx",
    formato: "PowerPoint",
    titulo: "Slide de Apresentação (PPTX)",
    descricao: "Modelo de slides para apresentação das unidades e alinhamento.",
    href: "/materiais-encontro-2026/apresentacao-encontro-2026.pptx",
    downloadName: "apresentacao-encontro-2026.pptx",
  },
  {
    id: "m_docx",
    formato: "Word",
    titulo: "Documento Editável (DOCX)",
    descricao: "Pauta em formato Word para consulta e registro de contribuições.",
    href: "/materiais-encontro-2026/roteiro-diretores-2026.docx",
    downloadName: "roteiro-diretores-2026.docx",
  },
  {
    id: "m_png",
    formato: "PNG",
    titulo: "Arte em Alta Resolução (PNG)",
    descricao: "Imagem em PNG sem perda para compartilhamento e avisos.",
    href: "/materiais-encontro-2026/card-encontro-2026.png",
    downloadName: "card-encontro-2026.png",
  },
  {
    id: "m_jpeg",
    formato: "JPEG",
    titulo: "Arte Oficial da Capa (JPEG)",
    descricao: "Arte oficial do encontro em formato JPEG.",
    href: "/ENCONTRO GERAL 2026.jpg",
    downloadName: "ENCONTRO GERAL 2026.jpg",
  },
];

export default function AdminEncontro2026({ onLogout }) {
  const [materiais, setMateriais] = useState(MATERIAIS_PADRAO);
  const [checkins, setCheckins] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [salvandoMateriais, setSalvandoMateriais] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [novoMaterial, setNovoMaterial] = useState({
    formato: "PDF",
    titulo: "",
    descricao: "",
    href: "",
    downloadName: "",
  });

  useEffect(() => {
    carregarTudo();
  }, []);

  async function carregarTudo(mostrarSpinnerAtualizar = false) {
    if (mostrarSpinnerAtualizar) {
      setAtualizando(true);
    } else {
      setCarregando(true);
    }
    setFeedback(null);

    try {
      const [{ data: configData }, { data: checkinsData, error: checkinsErr }] =
        await Promise.all([
          supabase
            .from("encontro_2026_config")
            .select("dados")
            .eq("id", "encontro_institucional_2026")
            .maybeSingle(),
          supabase
            .from("encontro_2026_checkins")
            .select("*")
            .order("confirmado_em", { ascending: false }),
        ]);

      if (
        Array.isArray(configData?.dados?.materiais) &&
        configData.dados.materiais.length > 0
      ) {
        setMateriais(configData.dados.materiais);
      } else {
        const materiaisLocais = JSON.parse(
          localStorage.getItem("irimep_encontro_2026_materiais") || "null"
        );
        if (Array.isArray(materiaisLocais) && materiaisLocais.length > 0) {
          setMateriais(materiaisLocais);
        }
      }

      if (!checkinsErr && Array.isArray(checkinsData)) {
        setCheckins(checkinsData);
      } else {
        const locais = JSON.parse(
          localStorage.getItem("irimep_encontro_2026_checkins") || "[]"
        );
        setCheckins(locais);
        if (checkinsErr) {
          setFeedback({
            tipo: "alerta",
            mensagem:
              "Exibindo check-ins salvos localmente neste navegador (tabela remota indisponível ou sem acesso).",
          });
        }
      }
    } catch (err) {
      console.error("Erro ao carregar dados do admin:", err);
      const locais = JSON.parse(
        localStorage.getItem("irimep_encontro_2026_checkins") || "[]"
      );
      setCheckins(locais);
      setFeedback({
        tipo: "alerta",
        mensagem:
          "Não foi possível consultar o servidor; exibindo dados locais disponíveis.",
      });
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  function adicionarMaterial(e) {
    e.preventDefault();
    if (!novoMaterial.titulo.trim() || !novoMaterial.href.trim()) {
      setFeedback({
        tipo: "erro",
        mensagem: "Informe pelo menos o título e o caminho/URL do arquivo.",
      });
      return;
    }

    const caminhoLimpo = novoMaterial.href.trim();
    const nomeArquivo =
      novoMaterial.downloadName.trim() ||
      caminhoLimpo.split("/").pop() ||
      "material";

    const item = {
      id: `mat_${Date.now()}`,
      formato: novoMaterial.formato.trim() || "Arquivo",
      titulo: novoMaterial.titulo.trim(),
      descricao: novoMaterial.descricao.trim(),
      href: caminhoLimpo,
      downloadName: nomeArquivo,
    };

    const atualizados = [...materiais, item];
    setMateriais(atualizados);
    localStorage.setItem(
      "irimep_encontro_2026_materiais",
      JSON.stringify(atualizados)
    );
    setNovoMaterial({
      formato: "PDF",
      titulo: "",
      descricao: "",
      href: "",
      downloadName: "",
    });
    setFeedback({
      tipo: "sucesso",
      mensagem: "Material adicionado. Clique em 'Salvar materiais' para publicar.",
    });
  }

  function atualizarMaterial(id, campo, valor) {
    setMateriais((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [campo]: valor } : m))
    );
  }

  function removerMaterial(id) {
    setMateriais((prev) => prev.filter((m) => m.id !== id));
  }

  async function handleSalvarMateriais() {
    setSalvandoMateriais(true);
    setFeedback(null);

    try {
      localStorage.setItem(
        "irimep_encontro_2026_materiais",
        JSON.stringify(materiais)
      );

      const { data: atual } = await supabase
        .from("encontro_2026_config")
        .select("dados")
        .eq("id", "encontro_institucional_2026")
        .maybeSingle();

      const dadosMesclados = {
        ...(atual?.dados || {}),
        materiais,
      };

      const { error } = await supabase
        .from("encontro_2026_config")
        .upsert(
          {
            id: "encontro_institucional_2026",
            dados: dadosMesclados,
            atualizado_em: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

      if (error) throw error;

      setFeedback({
        tipo: "sucesso",
        mensagem: "Materiais disponibilizados e salvos com sucesso.",
      });
    } catch (err) {
      console.error("Erro ao salvar materiais:", err);
      setFeedback({
        tipo: "alerta",
        mensagem:
          "Materiais salvos localmente neste navegador. Verifique a tabela 'encontro_2026_config' no Supabase para sincronização remota.",
      });
    } finally {
      setSalvandoMateriais(false);
    }
  }

  function baixarArquivo(conteudo, nomeArquivo, tipoMime) {
    const blob = new Blob([conteudo], { type: tipoMime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function handleDownloadCSV() {
    const escapar = (valor) =>
      `"${String(valor ?? "").replace(/"/g, '""')}"`;

    const linhas = [
      ["Nome", "Unidade", "Cargo / Função", "Confirmado em"],
      ...checkins.map((c) => [
        c.nome || "",
        c.unidade || "",
        c.cargo || "Participante",
        c.confirmado_em
          ? new Date(c.confirmado_em).toLocaleString("pt-BR")
          : "",
      ]),
    ];

    const csvComBom =
      "\uFEFF" +
      linhas.map((colunas) => colunas.map(escapar).join(";")).join("\n");

    baixarArquivo(
      csvComBom,
      "checkins-encontro-2026.csv",
      "text/csv;charset=utf-8;"
    );
  }

  function handleDownloadJSON() {
    const payload = {
      evento: "Encontro Institucional de Diretores e Coordenadores 2026",
      gerado_em: new Date().toISOString(),
      total_checkins: checkins.length,
      checkins,
    };

    baixarArquivo(
      JSON.stringify(payload, null, 2),
      "checkins-encontro-2026.json",
      "application/json;charset=utf-8;"
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 pb-14">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-[#003682] via-[#0046a8] to-[#002257] text-white border-b-4 border-[#f38b1e]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#ffd166]">
              Admin • Encontro 2026
            </p>
            <h1 className="text-xl sm:text-2xl font-bold mt-1">
              Materiais e Check-ins
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => carregarTudo(true)}
              disabled={atualizando}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${atualizando ? "animate-spin" : ""}`}
              />
              Atualizar
            </button>

            <button
              type="button"
              onClick={handleDownloadCSV}
              disabled={checkins.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#f38b1e] hover:bg-[#d97712] text-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              CSV Check-ins
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              disabled={checkins.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-[#003682] hover:bg-blue-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <FileJson className="w-3.5 h-3.5" />
              JSON Check-ins
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-red-600/90 hover:bg-red-600 text-white transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {feedback && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
              feedback.tipo === "sucesso"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : feedback.tipo === "alerta"
                ? "bg-amber-50 border-amber-200 text-amber-900"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {feedback.tipo === "sucesso" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{feedback.mensagem}</span>
          </div>
        )}

        {carregando ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 flex items-center justify-center gap-2 text-slate-600 text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-[#003682]" />
            Carregando materiais e check-ins...
          </div>
        ) : (
          <>
            {/* Disponibilização de Materiais */}
            <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-[#003682] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#f38b1e]" />
                    Disponibilização de Materiais ({materiais.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gerencie os arquivos em PDF, PowerPoint, Word, PNG, JPEG ou
                    outros formatos.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSalvarMateriais}
                  disabled={salvandoMateriais}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003682] hover:bg-[#0046a8] text-white text-xs font-bold transition-colors disabled:opacity-60 cursor-pointer self-start sm:self-center"
                >
                  {salvandoMateriais ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  Salvar materiais
                </button>
              </div>

              {/* Adicionar Material */}
              <form
                onSubmit={adicionarMaterial}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/70"
              >
                <select
                  value={novoMaterial.formato}
                  onChange={(e) =>
                    setNovoMaterial((prev) => ({
                      ...prev,
                      formato: e.target.value,
                    }))
                  }
                  className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                >
                  <option value="PDF">PDF</option>
                  <option value="PowerPoint">PowerPoint</option>
                  <option value="Word">Word</option>
                  <option value="PNG">PNG</option>
                  <option value="JPEG">JPEG</option>
                  <option value="ZIP">ZIP</option>
                  <option value="Outro">Outro</option>
                </select>

                <input
                  type="text"
                  placeholder="Título do material *"
                  value={novoMaterial.titulo}
                  onChange={(e) =>
                    setNovoMaterial((prev) => ({
                      ...prev,
                      titulo: e.target.value,
                    }))
                  }
                  className="sm:col-span-4 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                />

                <input
                  type="text"
                  placeholder="Caminho / URL (ex.: /materiais-encontro-2026/arquivo.pdf) *"
                  value={novoMaterial.href}
                  onChange={(e) =>
                    setNovoMaterial((prev) => ({
                      ...prev,
                      href: e.target.value,
                    }))
                  }
                  className="sm:col-span-4 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                />

                <button
                  type="submit"
                  className="sm:col-span-2 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-[#f38b1e] hover:bg-[#d97712] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>

                <input
                  type="text"
                  placeholder="Descrição breve (opcional)"
                  value={novoMaterial.descricao}
                  onChange={(e) =>
                    setNovoMaterial((prev) => ({
                      ...prev,
                      descricao: e.target.value,
                    }))
                  }
                  className="sm:col-span-7 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                />

                <input
                  type="text"
                  placeholder="Nome ao baixar (opcional)"
                  value={novoMaterial.downloadName}
                  onChange={(e) =>
                    setNovoMaterial((prev) => ({
                      ...prev,
                      downloadName: e.target.value,
                    }))
                  }
                  className="sm:col-span-5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                />
              </form>

              {/* Lista de Materiais */}
              <div className="space-y-3">
                {materiais.map((mat) => (
                  <div
                    key={mat.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/40"
                  >
                    <input
                      type="text"
                      value={mat.formato}
                      onChange={(e) =>
                        atualizarMaterial(mat.id, "formato", e.target.value)
                      }
                      className="md:col-span-2 px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={mat.titulo}
                      onChange={(e) =>
                        atualizarMaterial(mat.id, "titulo", e.target.value)
                      }
                      className="md:col-span-3 px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={mat.href}
                      onChange={(e) =>
                        atualizarMaterial(mat.id, "href", e.target.value)
                      }
                      className="md:col-span-4 px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                    />
                    <div className="md:col-span-3 flex items-center justify-end gap-2">
                      <a
                        href={mat.href}
                        download={mat.downloadName || true}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#003682] hover:bg-[#0046a8] text-white text-xs font-bold transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Baixar
                      </a>
                      <button
                        type="button"
                        onClick={() => removerMaterial(mat.id)}
                        title="Remover material"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Visualização dos Check-ins */}
            <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-[#003682] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#f38b1e]" />
                  Check-ins Registrados ({checkins.length})
                </h2>

                <button
                  type="button"
                  onClick={handleDownloadCSV}
                  disabled={checkins.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#003682] hover:bg-[#0046a8] text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Exportar CSV
                </button>
              </div>

              {checkins.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">
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
                          Confirmado em
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {checkins.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {item.nome}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {item.unidade}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {item.cargo || "Participante"}
                          </td>
                          <td className="py-3 px-4 text-right text-xs text-slate-500">
                            {item.confirmado_em
                              ? new Date(item.confirmado_em).toLocaleString(
                                  "pt-BR"
                                )
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
