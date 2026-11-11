import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { 
  ShieldCheck, 
  UserCheck, 
  Vote, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  ShieldAlert, 
  FileX, 
  HelpCircle,
  X,
  Lock
} from "lucide-react";

export default function VotacaoCIPAA() {
  // --- ESTADOS DO COMPONENTE ---
  const [matricula, setMatricula] = useState("");
  const [eleitor, setEleitor] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState(null);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [votacaoConcluida, setVotacaoConcluida] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(10);
  
  // Estados de Status da Eleição: 'verificando', 'aberta', 'bloqueada_manual'
  const [statusEleicao, setStatusEleicao] = useState("verificando");

  // --- EFEITO: CONSULTA O STATUS DA ELEIÇÃO NO PAINEL ADMIN (SUPABASE) ---
  useEffect(() => {
    async function verificarStatusEleicao() {
      try {
        const { data: configData } = await supabase
          .from("cipaa_config")
          .select("eleicao_liberada")
          .eq("id", 1)
          .maybeSingle();

        if (configData && configData.eleicao_liberada === true) {
          setStatusEleicao("aberta");
        } else {
          setStatusEleicao("bloqueada_manual");
        }
      } catch (err) {
        console.error("Erro ao verificar status da eleição:", err);
        setStatusEleicao("bloqueada_manual");
      }
    }

    verificarStatusEleicao();

    // Sincroniza o status a cada 5 segundos
    const interval = setInterval(verificarStatusEleicao, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- EFEITO: CARREGAR CANDIDATOS ATIVOS DO BANCO DE DADOS ---
  useEffect(() => {
    async function carregarCandidatos() {
      const { data, error } = await supabase
        .from("cipaa_candidatos")
        .select("*")
        .order("nome");
        
      if (!error && data) setCandidatos(data);
    }
    carregarCandidatos();
  }, []);

  // --- EFEITO: TEMPORIZADOR DE REINÍCIO DA CABINE APÓS O VOTO ---
  useEffect(() => {
    let timer;
    if (votacaoConcluida && tempoRestante > 0) {
      timer = setInterval(() => {
        setTempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (votacaoConcluida && tempoRestante === 0) {
      setVotacaoConcluida(false);
      setEleitor(null);
      setMatricula("");
      setCandidatoSelecionado(null);
      setMostrarModalConfirmacao(false);
      setTempoRestante(10);
    }
    return () => clearInterval(timer);
  }, [votacaoConcluida, tempoRestante]);

  // --- FUNÇÃO: VALIDAR A MATRÍCULA DO COLABORADOR ---
  const handleValidarMatricula = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const matriculaLimpa = matricula.trim();

    if (!matriculaLimpa) {
      setErro("Por favor, digite uma matrícula válida.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("cipaa_eleitores_aptos")
        .select("*")
        .eq("matricula", matriculaLimpa)
        .single();

      if (error || !data) {
        setErro("Matrícula não encontrada no banco de dados de colaboradores aptos.");
      } else if (data.ja_votou) {
        setErro("Esta matrícula já registrou o seu voto neste processo eleitoral.");
      } else {
        setEleitor(data);
      }
    } catch (err) {
      console.error("Erro na validação:", err);
      setErro("Ocorreu um erro ao validar a matrícula. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // --- FUNÇÃO: ABRIR MODAL DE CONFIRMAÇÃO ---
  const handleIniciarConfirmacao = () => {
    if (!candidatoSelecionado) {
      setErro("Por favor, selecione um candidato ou a opção de Voto em Branco.");
      return;
    }
    setErro("");
    setMostrarModalConfirmacao(true);
  };

  // --- FUNÇÃO: CONFIRMAR VOTO FINAL (GRAVANDO VOTO E DATA/HORA DO ELEITOR) ---
  const handleConfirmarVotoFinal = async () => {
    setLoading(true);
    setErro("");

    try {
      const candidatoIdParaGravar = candidatoSelecionado === "BRANCO" ? null : candidatoSelecionado;

      // 1. Gravar voto anônimo na tabela de votos
      const { error: erroVoto } = await supabase
        .from("cipaa_votos")
        .insert([{ candidato_id: candidatoIdParaGravar }]);

      if (erroVoto) throw erroVoto;

      // 2. Marcar eleitor como 'já votou' E gravar o timestamp (data e hora atuais)
      const { error: erroEleitor } = await supabase
        .from("cipaa_eleitores_aptos")
        .update({ 
          ja_votou: true,
          data_voto: new Date().toISOString() // Registra o momento exato do voto
        })
        .eq("matricula", eleitor.matricula);

      if (erroEleitor) throw erroEleitor;

      setMostrarModalConfirmacao(false);
      setVotacaoConcluida(true);
      setTempoRestante(10);
    } catch (err) {
      console.error("Erro ao gravar voto:", err);
      setErro("Erro ao registrar o voto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // --- TELA 1: CARREGAMENTO INICIAL DO STATUS ---
  if (statusEleicao === "verificando") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" />
      </div>
    );
  }

  // --- TELA 2: ELEIÇÃO BLOQUEADA PELO ADMINISTRADOR ---
  if (statusEleicao === "bloqueada_manual") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Votação Indisponível</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            A eleição da CIPAA encontra-se temporariamente <strong>pausada ou não iniciada</strong> pela Comissão Eleitoral.
          </p>
          <p className="text-xs text-gray-400">Aguarde a liberação oficial no painel para registrar o seu voto.</p>
        </div>
      </div>
    );
  }

  // --- TELA 3: FIM DA VOTAÇÃO E CONTAGEM REGRESSIVA ---
  if (votacaoConcluida) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Voto Registrado com Sucesso!</h2>
            <p className="text-gray-600 text-sm">
              O seu voto foi computado com total sigilo e segurança para a CIPAA Gestão 2026/2027. Obrigado pela participação!
            </p>
          </div>

          <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-2xl">
            <p className="text-xs text-gray-500 font-medium">Reiniciando a cabine de votação em:</p>
            <p className="text-3xl font-bold text-[#005a8d] my-1">{tempoRestante}s</p>
            <p className="text-[11px] text-gray-400">A tela retornará automaticamente ao início para o próximo colaborador.</p>
          </div>
        </div>
      </div>
    );
  }

  const infoCandidato = candidatoSelecionado === "BRANCO" 
    ? { nome: "Voto em Branco", matricula: "N/A" } 
    : candidatos.find(c => c.id === candidatoSelecionado);

  return (
    <div className="min-h-[80vh] py-12 px-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 sm:p-12 space-y-8">
        
        {/* Cabeçalho */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest bg-blue-50 text-[#005a8d] px-3.5 py-1 rounded-full">
            Eleição CIPAA Gestão 2026/2027
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#005a8d]">Votação Eletrônica</h1>
          <p className="text-gray-500 text-sm">Digite a sua matrícula institucional para liberar a cabine de votação.</p>
        </div>

        {/* Mensagem de Erro */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* PASSO 1: Identificação por Matrícula */}
        {!eleitor ? (
          <form onSubmit={handleValidarMatricula} className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Matrícula Institucional
              </label>
              <input
                type="text"
                required
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="Digite sua matrícula..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#005a8d]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#005a8d] hover:bg-[#004068] text-white font-bold py-3.5 rounded-2xl transition-colors shadow-sm text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserCheck className="w-5 h-5" />}
              Acessar a Votação
            </button>
          </form>
        ) : (
          /* PASSO 2: Seleção de Candidato ou Voto em Branco */
          <div className="space-y-6">
            
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Eleitor Identificado:</p>
                <p className="font-bold text-[#005a8d] text-base">{eleitor.nome}</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Apto para Votar
              </span>
            </div>

            <div className="bg-amber-50/60 border border-amber-200/80 p-5 rounded-2xl text-amber-900 text-xs sm:text-sm space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-amber-900 uppercase tracking-wider text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                Garantia de Sigilo Absoluto do Voto
              </div>
              <p>
                Esta votação é <strong>totalmente sigilosa</strong>. A validação da sua matrícula serve unicamente para confirmar que você está apto a votar e evitar votos duplicados.
              </p>
              <p className="text-amber-800/90 text-xs">
                Os relatórios e o banco de dados registram apenas que você já votou e computam o voto de forma anônima, <strong>sem qualquer ligação entre o seu nome/matrícula e
