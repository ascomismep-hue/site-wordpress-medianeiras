import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { 
  Loader2, 
  Download, 
  Users, 
  BarChart3, 
  PlusCircle, 
  Trash2, 
  UserCheck, 
  FileCheck, 
  FileX,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Power,
  Clock,
  Search
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AdminCIPAA({ onLogout }) {
  const [candidatos, setCandidatos] = useState([]);
  const [votos, setVotos] = useState([]);
  const [eleitores, setEleitores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [buscaVotante, setBuscaVotante] = useState("");

  // Estado da Liberação Manual da Eleição
  const [eleicaoLiberada, setEleicaoLiberada] = useState(false);
  const [atualizandoStatus, setAtualizandoStatus] = useState(false);

  // Form de cadastro de novo candidato
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [fotoFile, setFotoFile] = useState(null);

  // Controle de Quórum Eleitoral (Edital Seção 8)
  const [diaVotacao, setDiaVotacao] = useState(1); // 1 = 1º Dia (50%), 2 = 2º Dia (33.33%), 3 = 3º Dia (Livre)

  // Função para carregar os dados com indicador visual inicial
  const carregarDadosInicial = async () => {
    setLoading(true);
    await buscarDadosDoBanco();
    setLoading(false);
  };

  // Função silenciosa para atualização em segundo plano (sem piscar a tela)
  const buscarDadosDoBanco = async () => {
    try {
      const { data: candData } = await supabase.from("cipaa_candidatos").select("*");
      const { data: votoData } = await supabase.from("cipaa_votos").select("*");
      const { data: eleitorData } = await supabase.from("cipaa_eleitores_aptos").select("*").order("nome");
      const { data: configData } = await supabase.from("cipaa_config").select("*").eq("id", 1).maybeSingle();

      setCandidatos(candData || []);
      setVotos(votoData || []);
      setEleitores(eleitorData || []);
      
      if (configData) {
        setEleicaoLiberada(configData.eleicao_liberada);
      }
    } catch (err) {
      console.error("Erro ao sincronizar dados do painel:", err);
    }
  };

  useEffect(() => {
    carregarDadosInicial();

    // 1. Inscrição em Tempo Real via WebSocket do Supabase
    const channel = supabase
      .channel('admin_cipaa_realtime_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cipaa_votos' }, () => buscarDadosDoBanco())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cipaa_eleitores_aptos' }, () => buscarDadosDoBanco())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cipaa_config' }, () => buscarDadosDoBanco())
      .subscribe();

    // 2. Intervalo de segurança (Polling de 3 em 3 segundos para garantir atualização sem F5)
    const interval = setInterval(() => {
      buscarDadosDoBanco();
    }, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  // Alternar a Liberação Manual da Eleição (Ativar / Desativar)
  const handleToggleEleicao = async () => {
    setAtualizandoStatus(true);
    const novoStatus = !eleicaoLiberada;

    try {
      const { error } = await supabase
        .from("cipaa_config")
        .upsert({ id: 1, eleicao_liberada: novoStatus, updated_at: new Date() });

      if (error) throw error;
      setEleicaoLiberada(novoStatus);
    } catch (err) {
      console.error("Erro ao alterar status da eleição:", err);
      alert("Erro ao alterar o status da eleição. Tente novamente.");
    } finally {
      setAtualizandoStatus(false);
    }
  };

  // Conversão de segurança para Base64 se o storage falhar
  const converterParaBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Cadastrar Candidato com upload seguro
  const handleCadastrarCandidato = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let fotoUrl = "";

      if (fotoFile) {
        try {
          const fileExt = fotoFile.name.split(".").pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `candidatos/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("cipaa-fotos")
            .upload(filePath, fotoFile, { upsert: true });

          if (!uploadError) {
            const { data: publicURLData } = supabase.storage
              .from("cipaa-fotos")
              .getPublicUrl(filePath);
            fotoUrl = publicURLData.publicUrl;
          } else {
            fotoUrl = await converterParaBase64(fotoFile);
          }
        } catch (storageErr) {
          console.warn("Erro no storage, usando Base64:", storageErr);
          fotoUrl = await converterParaBase64(fotoFile);
        }
      }

      const { error } = await supabase.from("cipaa_candidatos").insert([
        { nome, matricula, foto_url: fotoUrl }
      ]);

      if (error) throw error;

      setNome("");
      setMatricula("");
      setFotoFile(null);
      buscarDadosDoBanco();
    } catch (err) {
      console.error("Erro ao cadastrar candidato:", err);
      alert("Erro ao cadastrar candidato. Verifique os dados inseridos.");
    } finally {
      setUploading(false);
    }
  };

  const handleExcluirCandidato = async (id) => {
    if (confirm("Deseja remover este candidato?")) {
      await supabase.from("cipaa_candidatos").delete().eq("id", id);
      buscarDadosDoBanco();
    }
  };

  // --- CÁLCULOS DE APURAÇÃO E QUÓRUM ---
  const totalGeralVotos = votos.length;
  
  // Eleitores que já votaram
  const eleitoresVotantes = eleitores.filter(
    (e) => e.ja_votou === true || e.ja_votou === "true" || e.ja_votou === 1
  );
  
  const totalEleitoresAptos = eleitores.length;

  const percentualParticipacao = totalEleitoresAptos > 0 
    ? (eleitoresVotantes.length / totalEleitoresAptos) * 100 
    : 0;

  const metaQuorumPercentual = diaVotacao === 1 ? 50 : diaVotacao === 2 ? 33.33 : 0;
  const quorumAtingido = diaVotacao === 3 ? true : percentualParticipacao >= metaQuorumPercentual;

  const resultadosCandidatos = candidatos.map((cand) => {
    const totalVotos = votos.filter((v) => v.candidato_id === cand.id).length;
    return { ...cand, totalVotos };
  }).sort((a, b) => b.totalVotos - a.totalVotos);

  const totalVotosBrancos = votos.filter((v) => !v.candidato_id).length;

  // Filtragem de votantes para busca na tabela de acompanhamento
  const eleitoresVotantesFiltrados = eleitoresVotantes.filter(
    (e) => e.nome.toLowerCase().includes(buscaVotante.toLowerCase()) || e.matricula.includes(buscaVotante)
  );

  // Formatação amigável de Data e Hora no padrão pt-BR
  const formatarDataHora = (isoString) => {
    if (!isoString) return "Horário não registrado";
    const data = new Date(isoString);
    if (isNaN(data.getTime())) return "Horário inválido";
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  // Exportar PDF da Lista de Presença com Horários
  const exportarPDFListaPresenca = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.setTextColor(0, 40, 69);
    doc.text("Lista de Presença / Votantes - Eleição CIPAA 2026/2027", 14, 15);
    doc.setFontSize(10);
    doc.text(`Total de Colaboradores Participantes: ${eleitoresVotantes.length} de ${totalEleitoresAptos}`, 14, 22);

    const tableColumn = ["Nº", "Nome do Colaborador", "Matrícula", "Horário do Voto"];
    const tableRows = eleitoresVotantes.map((el, index) => [
      index + 1,
      el.nome,
      el.matricula,
      formatarDataHora(el.data_voto)
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save(`Lista_Presenca_Votantes_CIPAA_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Exportar PDF de Apuração Consolidado
  const exportarPDFResultados = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.setTextColor(0, 40, 69);
    doc.text("Relatório Consolidado de Apuração - CIPAA 2026/2027", 14, 15);
    
    doc.setFontSize(10);
    doc.text(`Total de Eleitores Aptos: ${totalEleitoresAptos}`, 14, 22);
    doc.text(`Total de Votos Computados: ${totalGeralVotos} (${percentualParticipacao.toFixed(2)}% de participação)`, 14, 27);
    
    doc.setTextColor(quorumAtingido ? 16 : 185, quorumAtingido ? 185 : 28, quorumAtingido ? 129 : 28);
    const textoQuorum = quorumAtingido 
      ? `STATUS DO QUÓRUM (${diaVotacao}º Dia): ATINGIDO (${percentualParticipacao.toFixed(2)}% >= Meta ${metaQuorumPercentual}%)`
      : `STATUS DO QUÓRUM (${diaVotacao}º Dia): NÃO ATINGIDO (${percentualParticipacao.toFixed(2)}% < Meta ${metaQuorumPercentual}%). PRORROGAR VOTAÇÃO.`;
    doc.text(textoQuorum, 14, 32);

    doc.setTextColor(0, 40, 69);
    const tableColumn = ["Classificação", "Candidato / Opção", "Matrícula", "Total de Votos"];
    
    const tableRows = resultadosCandidatos.map((res, index) => [
      `#${index + 1}`,
      res.nome,
      res.matricula,
      `${res.totalVotos} voto(s)`
    ]);

    tableRows.push(["-", "Votos em Branco", "N/A", `${totalVotosBrancos} voto(s)`]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 38,
      headStyles: { fillColor: [0, 90, 141] }
    });

    doc.save(`Apuracao_CIPAA_Dia_${diaVotacao}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      
      {/* Cabeçalho */}
      <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Painel Administrativo</span>
          <h1 className="text-2xl font-serif font-bold text-[#005a8d]">Gestão e Apuração da CIPAA</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={exportarPDFListaPresenca} 
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-3 rounded-2xl font-bold text-sm shadow-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <FileCheck className="w-4 h-4" /> Baixar Lista de Presença (PDF)
          </button>
          <button 
            onClick={exportarPDFResultados} 
            className="bg-[#005a8d] hover:bg-[#004068] text-white px-4 py-3 rounded-2xl font-bold text-sm shadow-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4" /> Baixar Resultado Final (PDF)
          </button>
          {onLogout && (
            <button onClick={onLogout} className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl font-bold text-sm cursor-pointer">Sair</button>
          )}
        </div>
      </div>

      {/* CONTROLE MANUAL DE LIBERAÇÃO DA ELEIÇÃO */}
      <div className={`p-6 rounded-3xl border shadow-sm transition-all flex flex-wrap items-center justify-between gap-4 ${
        eleicaoLiberada 
          ? "bg-emerald-50/60 border-emerald-200" 
          : "bg-rose-50/60 border-rose-200"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
            eleicaoLiberada ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
          }`}>
            {eleicaoLiberada ? <Unlock className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Controle de Acesso ao Pleito</span>
            <h3 className={`text-lg font-serif font-bold ${
              eleicaoLiberada ? "text-emerald-900" : "text-rose-900"
            }`}>
              {eleicaoLiberada ? "Eleição LIBERADA para Votação" : "Eleição BLOQUEADA / Encerrada"}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {eleicaoLiberada 
                ? "Os colaboradores podem acessar a urna e registrar o voto normalmente." 
                : "A votação está pausada. Os colaboradores não conseguirão votar até que seja liberada."}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleEleicao}
          disabled={atualizandoStatus}
          className={`px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
            eleicaoLiberada 
              ? "bg-rose-600 hover:bg-rose-700 text-white" 
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {atualizandoStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
          {eleicaoLiberada ? "Bloquear Votação Agora" : "Liberar Votação Agora"}
        </button>
      </div>

      {/* Validação de Quórum Eleitoral (Edital Seção 8) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#005a8d]">Validação de Quórum Eleitoral (Edital Seção 8)</h3>
            <p className="text-xs text-gray-500">Selecione o dia do pleito para verificar a validade do quórum legal.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
            <button 
              onClick={() => setDiaVotacao(1)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                diaVotacao === 1 ? "bg-[#005a8d] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              1º Dia (Mín. 50%)
            </button>
            <button 
              onClick={() => setDiaVotacao(2)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                diaVotacao === 2 ? "bg-[#005a8d] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              2º Dia (Mín. 1/3)
            </button>
            <button 
              onClick={() => setDiaVotacao(3)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                diaVotacao === 3 ? "bg-[#005a8d] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              3º Dia (Qualquer N.º)
            </button>
          </div>
        </div>

        <div className={`p-5 rounded-2xl flex items-center justify-between border ${
          quorumAtingido 
            ? "bg-emerald-50/70 border-emerald-200 text-emerald-900" 
            : "bg-amber-50/70 border-amber-200 text-amber-900"
        }`}>
          <div className="flex items-center gap-3">
            {quorumAtingido ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
            )}
            <div>
              <h4 className="font-bold text-sm">
                {quorumAtingido 
                  ? `Quórum Legal Atingido (${percentualParticipacao.toFixed(1)}% de participação)` 
                  : `Quórum Insuficiente (${percentualParticipacao.toFixed(1)}% de participação)`
                }
              </h4>
              <p className="text-xs opacity-90 mt-0.5">
                {diaVotacao === 1 && (quorumAtingido ? "O pleito atingiu os 50% necessários no 1º dia. A apuração pode ser concluída." : "Falta atingir 50% dos colaboradores. Conforme o edital, a votação deve ser prorrogada para o dia seguinte.")}
                {diaVotacao === 2 && (quorumAtingido ? "O pleito atingiu 1/3 (33,33%) de participação no 2º dia. Apuração válida." : "Falta atingir 1/3 dos colaboradores no 2º dia. A votação deve ser prorrogada para o 3º dia.")}
                {diaVotacao === 3 && "No 3º dia a votação é válida com qualquer número de participantes."}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xl font-bold">{percentualParticipacao.toFixed(1)}%</span>
            <p className="text-[10px] opacity-75">Meta: {metaQuorumPercentual === 0 ? "Livre" : `${metaQuorumPercentual}%`}</p>
          </div>
        </div>
      </div>

      {/* Métricas do Dashboard */}
      <div className="grid sm:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#005a8d] rounded-2xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total de Votos</p>
            <h3 className="text-2xl font-bold text-[#005a8d]">{totalGeralVotos}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-700 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Candidatos Inscritos</p>
            <h3 className="text-2xl font-bold text-purple-900">{candidatos.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center">
            <FileX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Votos em Branco</p>
            <h3 className="text-2xl font-bold text-gray-700">{totalVotosBrancos}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Votantes / Aptos</p>
            <h3 className="text-2xl font-bold text-emerald-900">{eleitoresVotantes.length} / {totalEleitoresAptos}</h3>
          </div>
        </div>
      </div>

      {/* --- NOVA SEÇÃO: ACOMPANHAMENTO EM TEMPO REAL DOS ELEITORES VOTANTES --- */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-gray-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Atualização em Tempo Real
            </span>
            <h3 className="font-serif font-bold text-lg text-[#005a8d] mt-1">Acompanhamento dos Colaboradores que já Votaram</h3>
            <p className="text-xs text-gray-500">Lista oficial com os horários exatos dos votos registrados para acompanhamento do pleito.</p>
          </div>

          {/* Campo de Busca por Nome ou Matrícula */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Buscar por nome ou matrícula..."
              value={buscaVotante}
              onChange={(e) => setBuscaVotante(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#005a8d]"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-gray-50 shadow-xs">
              <tr className="border-b text-[11px] font-bold text-gray-500 uppercase">
                <th className="p-4">Nº</th>
                <th className="p-4">Nome do Colaborador</th>
                <th className="p-4">Matrícula</th>
                <th className="p-4">Horário do Voto</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {eleitoresVotantesFiltrados.length > 0 ? (
                eleitoresVotantesFiltrados.map((el, index) => (
                  <tr key={el.matricula} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-400">#{index + 1}</td>
                    <td className="p-4 font-bold text-gray-800">{el.nome}</td>
                    <td className="p-4 text-gray-600">{el.matricula}</td>
                    <td className="p-4 text-gray-700 font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#005a8d]" />
                      {formatarDataHora(el.data_voto)}
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Voto Registrado
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400 text-sm">
                    {eleitoresVotantes.length === 0 
                      ? "Nenhum colaborador votou até o momento nesta eleição." 
                      : "Nenhum colaborador encontrado com os termos pesquisados."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apuração Parcial / Final (Classificação dos Candidatos) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#005a8d]">Apuração Parcial / Final (Classificação)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-[11px] font-bold text-gray-500 uppercase">
                <th className="p-4">Classificação</th>
                <th className="p-4">Candidato / Opção</th>
                <th className="p-4">Matrícula</th>
                <th className="p-4">Total de Votos</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {resultadosCandidatos.map((res, index) => (
                <tr key={res.id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-400">#{index + 1}</td>
                  <td className="p-4 font-bold text-[#005a8d] flex items-center gap-3">
                    <img src={res.foto_url || "https://via.placeholder.com/150"} alt="" className="w-8 h-8 rounded-full object-cover border" />
                    {res.nome}
                  </td>
                  <td className="p-4">{res.matricula}</td>
                  <td className="p-4 font-bold text-emerald-700">{res.totalVotos} votos</td>
                </tr>
              ))}

              <tr className="bg-gray-50/70 hover:bg-gray-100/70">
                <td className="p-4 font-bold text-gray-400">-</td>
                <td className="p-4 font-bold text-gray-600 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <FileX className="w-4 h-4" />
                  </div>
                  Votos em Branco
                </td>
                <td className="p-4 text-gray-400">N/A</td>
                <td className="p-4 font-bold text-gray-600">{totalVotosBrancos} votos</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cadastrar Novo Candidato */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
        <h3 className="font-serif font-bold text-lg text-[#005a8d]">Cadastrar Novo Candidato</h3>
        <form onSubmit={handleCadastrarCandidato} className="grid sm:grid-cols-4 gap-4 items-center">
          <input
            type="text"
            placeholder="Nome Completo"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005a8d]"
          />
          <input
            type="text"
            placeholder="Matrícula"
            required
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#005a8d]"
          />
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFotoFile(e.target.files[0])}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#005a8d] file:text-white hover:file:bg-[#004068] cursor-pointer"
            />
          </div>
          <button 
            type="submit" 
            disabled={uploading}
            className="bg-[#005a8d] hover:bg-[#004068] text-white font-bold rounded-2xl px-4 py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
            {uploading ? "Enviando..." : "Cadastrar"}
          </button>
        </form>

        <div className="grid sm:grid-cols-3 gap-4 pt-4">
          {candidatos.map((c) => (
            <div key={c.id} className="border border-gray-200 p-4 rounded-2xl flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <img src={c.foto_url || "https://via.placeholder.com/150"} alt={c.nome} className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm" />
                <div>
                  <p className="font-bold text-xs text-gray-800">{c.nome}</p>
                  <p className="text-[10px] text-gray-500">Mat: {c.matricula}</p>
                </div>
              </div>
              <button onClick={() => handleExcluirCandidato(c.id)} className="text-red-500 hover:text-red-700 p-2 cursor-pointer" title="Excluir candidato">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
