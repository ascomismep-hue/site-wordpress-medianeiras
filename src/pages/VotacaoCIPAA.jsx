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
  Clock,
  HelpCircle
} from "lucide-react";

export default function VotacaoCIPAA() {
  const [matricula, setMatricula] = useState("");
  const [eleitor, setEleitor] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState(null);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [votacaoConcluida, setVotacaoConcluida] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(10);
  
  // Regra 1: Controlo de Horário do Edital (10/12/2026 das 07h às 17h)
  const [statusEleicao, setStatusEleicao] = useState("verificando");

  useEffect(() => {
    function verificarHorarioEleicao() {
      const agora = new Date();
      
      // Início: 10 de Dezembro de 2026 às 07:00:00 (Mês 11 = Dezembro em JS)
      const inicioEleicao = new Date(2026, 11, 10, 7, 0, 0);
      
      // Término: 10 de Dezembro de 2026 às 17:00:00
      const fimEleicao = new Date(2026, 11, 10, 17, 0, 0);

      // ⚠️ PARA PRODUÇÃO: Descomente a validação abaixo para travar por horário real
      /*
      if (agora < inicioEleicao) {
        setStatusEleicao("futura");
      } else if (agora > fimEleicao) {
        setStatusEleicao("encerrada");
      } else {
        setStatusEleicao("aberta");
      }
      */

      // Modo de Desenvolvimento/Testes (Mantém sempre aberta por padrão)
      setStatusEleicao("aberta");
    }

    verificarHorarioEleicao();
  }, []);

  // Carregar candidatos ativos da base de dados
  useEffect(() => {
    async function carregarCandidatos() {
      const { data, error } = await supabase.from("cipaa_candidatos").select("*").order("nome");
      if (!error && data) setCandidatos(data);
    }
    carregarCandidatos();
  }, []);

  // Regra 2: Temporizador de 10 segundos para reiniciar a cabina para o próximo colaborador
  useEffect(() => {
    let timer;
    if (votacaoConcluida && tempoRestante > 0) {
      timer = setInterval(() => {
        setTempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (votacaoConcluida && tempoRestante === 0) {
      // Reset completo do estado
      setVotacaoConcluida(false);
      setEleitor(null);
      setMatricula("");
      setCandidatoSelecionado(null);
      setMostrarModalConfirmacao(false);
      setTempoRestante(10);
    }
    return () => clearInterval(timer);
  }, [votacaoConcluida, tempoRestante]);

  // Regra 3: Validar e higienizar a matrícula do colaborador
  const handleValidarMatricula = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const matriculaLimpa = matricula.trim();

    if (!matriculaLimpa) {
      setErro("Por favor, introduza uma matrícula válida.");
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
        setErro("Matrícula não encontrada na base de dados de colaboradores aptos.");
      } else if (data.ja_votou) {
        setErro("Esta matrícula já registou o seu voto neste processo eleitoral.");
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

  // Abrir Modal de Confirmação
  const handleIniciarConfirmacao = () => {
    if (!candidatoSelecionado) {
      setErro("Por favor, selecione um candidato ou a opção de Voto em Branco.");
      return;
    }
    setErro("");
    setMostrarModalConfirmacao(true);
  };

  // Regra 4: Confirmar Voto com Sigilo Garantido
  const handleConfirmarVotoFinal = async () => {
    setLoading(true);
    setErro("");

    try {
      // Se for "BRANCO", grava candidato_id como NULL na tabela anónima
      const candidatoIdParaGravar = candidatoSelecionado === "BRANCO" ? null : candidatoSelecionado;

      // 1. Inserir na tabela anónima de votos
      const { error: erroVoto } = await supabase
        .from("cipaa_votos")
        .insert([{ candidato_id: candidatoIdParaGravar }]);

      if (erroVoto) throw erroVoto;

      // 2. Marcar eleitor como votante (sem relacionar ao candidato)
      const { error: erroEleitor } = await supabase
        .from("cipaa_eleitores_aptos")
        .update({ ja_votou: true })
        .eq("matricula", eleitor.matricula);

      if (erroEleitor) throw erroEleitor;

      setMostrarModalConfirmacao(false);
      setVotacaoConcluida(true);
      setTempoRestante(10);
    } catch (err) {
      console.error("Erro ao gravar voto:", err);
      setErro("Erro ao registar o voto. Tente novamente.");
    } finally {
      setLoading(false);
    }
