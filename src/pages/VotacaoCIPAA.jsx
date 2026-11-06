import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { ShieldCheck, UserCheck, Vote, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function VotacaoCIPAA() {
  const [matricula, setMatricula] = useState("");
  const [eleitor, setEleitor] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [votacaoConcluida, setVotacaoConcluida] = useState(false);

  // Carregar candidatos ativos
  useEffect(() => {
    async function carregarCandidatos() {
      const { data } = await supabase.from("cipaa_candidatos").select("*");
      if (data) setCandidatos(data);
    }
    carregarCandidatos();
  }, []);

  // Validar matrícula do colaborador
  const handleValidarMatricula = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      const { data, error } = await supabase
        .from("cipaa_eleitores_aptos")
        .select("*")
        .eq("matricula", matricula.trim())
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
      setErro("Ocorreu um erro ao validar a matrícula.");
    } finally {
      setLoading(false);
    }
  };

  // Confirmar Voto com Sigilo Garantido
  const handleConfirmarVoto = async () => {
    if (!candidatoSelecionado) {
      setErro("Por favor, selecione um candidato antes de confirmar.");
      return;
    }

    setLoading(true);
    setErro("");

    try {
      // 1. Registar o voto na tabela anónima de votos
      const { error: erroVoto } = await supabase
        .from("cipaa_votos")
        .insert([{ candidato_id: candidatoSelecionado }]);

      if (erroVoto) throw erroVoto;

      // 2. Marcar o eleitor como votante (sem ligar a identidade ao voto escolhido)
      const { error: erroEleitor } = await supabase
        .from("cipaa_eleitores_aptos")
        .update({ ja_votou: true })
        .eq("matricula", eleitor.matricula);

      if (erroEleitor) throw erroEleitor;

      setVotacaoConcluida(true);
    } catch (err) {
      console.error("Erro ao votar:", err);
      setErro("Erro ao registar o voto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (votacaoConcluida) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Voto Registado com Sucesso!</h2>
          <p className="text-gray-600 text-sm">
            O seu voto foi computado com total sigilo e segurança para a CIPAA Gestão 2026/2027. Obrigado pela participação!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 sm:p-12 space-y-8">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest bg-blue-50 text-[#005a8d] px-3.5 py-1 rounded-full">
            Eleição CIPAA 2026/2027
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#005a8d]">Votação Eletrônica</h1>
          <p className="text-gray-500 text-sm">Insira a sua matrícula institucional para liberar a cabina de votação.</p>
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
              className="w-full bg-[#005a8d] hover:bg-[#004068] text-white font-bold py-3.5 rounded-2xl transition-colors shadow-sm text-sm flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserCheck className="w-5 h-5" />}
              Aceder à Votação
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Eleitor Identificado:</p>
                <p className="font-bold text-[#005a8d]">{eleitor.nome}</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">Apto para Votar</span>
            </div>

            <h3 className="font-serif font-bold text-lg text-gray-800">Escolha o seu candidato:</h3>

            <div className="grid sm:grid-cols-2 gap-4">
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
                    className="w-16 h-16 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{cand.nome}</h4>
                    <p className="text-xs text-gray-500">Matrícula: {cand.matricula}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleConfirmarVoto}
              disabled={loading || !candidatoSelecionado}
              className="w-full bg-[#c5a059] hover:bg-[#b08c48] text-white font-bold py-4 rounded-2xl transition-all shadow-md text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Vote className="w-5 h-5" />}
              Confirmar Meu Voto Secretamente
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
