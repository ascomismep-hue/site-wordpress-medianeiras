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
  const [matricula, setMatricula] = useState("");
  const [eleitor, setEleitor] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState(null);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [votacaoConcluida, setVotacaoConcluida] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(10);
  
  // Estados de Status: 'verificando', 'aberta', 'bloqueada_manual'
  const [statusEleicao, setStatusEleicao] = useState("verificando");

  // Regra Simplificada: Controle 100% Manual via Painel Administrativo (Supabase)
  useEffect(() => {
    async function verificarStatusEleicao() {
      try {
        // Consultar o estado do botão no painel admin (tabela cipaa_config)
        const { data: configData } = await supabase
          .from("cipaa_config")
          .select("eleicao_liberada")
          .eq("id", 1)
          .maybeSingle();

        // Se estiver liberada no painel, abre a votação; caso contrário, bloqueia
        if (configData && configData.eleicao_liberada === true) {
          setStatusEleicao("aberta");
        } else {
          setStatusEleicao("bloqueada_manual");
        }
      } catch (err) {
        console.error("Erro ao verificar status da eleição:", err);
        // Em caso de falha de conexão, mantém a tela de bloqueio por segurança
        setStatusEleicao("bloqueada_manual");
      }
    }

    verificarStatusEleicao();

    // Sincroniza o status a cada 5 segundos para responder rapidamente às alterações do admin
    const interval = setInterval(verificarStatusEleicao, 5000);
    return () => clearInterval(interval);
  }, []);

  // Carregar candidatos ativos da base de dados
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

  // Temporizador de 10 segundos para reiniciar a cabine após o voto
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

  // Validar e higienizar a matrícula do colaborador
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

  // Abrir Modal de Confirmação
  const handleIniciarConfirmacao = () => {
    if (!candidatoSelecionado) {
      setErro("Por favor, selecione um candidato ou a opção de Voto em Branco.");
      return;
    }
    setErro("");
    setMostrarModalConfirmacao(true);
  };

  // Confirmar Voto com Sigilo Garantido
  const handleConfirmarVotoFinal = async () => {
    setLoading(true);
    setErro("");

    try {
      const candidatoIdParaGravar = candidatoSelecionado === "BRANCO" ? null : candidatoSelecionado;

      const { error: erroVoto } = await supabase
        .from("cipaa_votos")
        .insert([{ candidato_id: candidatoIdParaGravar }]);

      if (erroVoto) throw erroVoto;

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
      setErro("Erro ao registrar o voto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Tela de Carregamento Inicial
  if (statusEleicao === "verificando") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" />
      </div>
    );
  }

  // Tela exibida quando a eleição está BLOQUEADA MANUALMENTE no painel
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

  // Tela de Voto Registrado com Sucesso
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
        
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest bg-blue-50 text-[#005a8d] px-3.5 py-1 rounded-full">
            Eleição CIPAA Gestão 2026/2027
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#005a8d]">Votação Eletrônica</h1>
          <p className="text-gray-500 text-sm">Insira a sua matrícula institucional para liberar a cabine de votação.</p>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {!eleitor ? (
          <form onSubmit={handleValidarMatricula} className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Matrícula Institucional</label>
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
                Esta votação é <strong>totalmente sigilosa</strong>. A validação da sua matrícula serve unicamente para confirmar que está apto a votar e evitar votos duplicados.
              </p>
              <p className="text-amber-800/90 text-xs">
                Os relatórios e o banco de dados registram apenas que você já votou e computam o voto de forma anônima, <strong>sem qualquer ligação entre o seu nome/matrícula e o candidato escolhido</strong>.
              </p>
            </div>

            <h3 className="font-serif font-bold text-lg text-gray-800 pt-2">Escolha o seu candidato ou opção:</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div
                onClick={() => setCandidatoSelecionado("BRANCO")}
                className={`border-2 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all ${
                  candidatoSelecionado === "BRANCO"
                    ? "border-gray-500 bg-gray-100 shadow-sm"
                    : "border-gray-100 hover:border-gray-200 bg-white"
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200 shrink-0">
                  <FileX className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Votar em Branco</h4>
                  <p className="text-xs text-gray-500">Não escolher nenhum candidato</p>
                </div>
              </div>

              {candidatos.map((cand) => (
                <div
                  key={cand.id}
                  onClick={() => setCandidatoSelecionado(cand.id)}
                  className={`border-2 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all ${
                    candidatoSelecionado === cand.id
                      ? "border-[#005a8d] bg-blue-50/30 shadow-sm"
                      : "border-gray-100 hover:border-gray-200 bg-white"
                  }`}
                >
                  <img
                    src={cand.foto_url || "https://via.placeholder.com/150"}
                    alt={cand.nome}
                    className="w-16 h-16 rounded-full object-cover border border-gray-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{cand.nome}</h4>
                    <p className="text-xs text-gray-500">Matrícula: {cand.matricula}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleIniciarConfirmacao}
              disabled={loading || !candidatoSelecionado}
              className="w-full bg-[#c5a059] hover:bg-[#b08c48] text-white font-bold py-4 rounded-2xl transition-all shadow-md text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Vote className="w-5 h-5" />
              {candidatoSelecionado === "BRANCO" ? "Confirmar Voto em Branco" : "Confirmar Meu Voto Secretamente"}
            </button>
          </div>
        )}

      </div>

      {mostrarModalConfirmacao && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setMostrarModalConfirmacao(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <HelpCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#005a8d]">Confirme a sua Escolha</h3>
              <p className="text-xs text-gray-500">
                Tem certeza de que deseja registrar o seu voto na seguinte opção?
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-center space-y-1">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Opção Selecionada:</p>
              <p className="font-bold text-[#005a8d] text-lg">{infoCandidato?.nome}</p>
              {infoCandidato?.matricula !== "N/A" && (
                <p className="text-xs text-gray-500">Matrícula: {infoCandidato?.matricula}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setMostrarModalConfirmacao(false)}
                disabled={loading}
                className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl text-sm transition-all cursor-pointer"
              >
                Corrigir Escolha
              </button>
              <button
                onClick={handleConfirmarVotoFinal}
                disabled={loading}
                className="w-1/2 bg-[#005a8d] hover:bg-[#004068] text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Vote className="w-4 h-4" />}
                Sim, Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
