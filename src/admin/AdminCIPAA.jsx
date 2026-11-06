import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Download, Users, BarChart3, PlusCircle, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AdminCIPAA({ onLogout }) {
  const [candidatos, setCandidatos] = useState([]);
  const [votos, setVotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form de cadastro de novo candidato
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  const carregarDados = async () => {
    setLoading(true);
    const { data: candData } = await supabase.from("cipaa_candidatos").select("*");
    const { data: votoData } = await supabase.from("cipaa_votos").select("*");
    setCandidatos(candData || []);
    setVotos(votoData || []);
    setLoading(false);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCadastrarCandidato = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("cipaa_candidatos").insert([{ nome, matricula, foto_url: fotoUrl }]);
    if (!error) {
      setNome("");
      setMatricula("");
      setFotoUrl("");
      carregarDados();
    } else {
      alert("Erro ao cadastrar candidato (verifique se a matrícula já existe).");
    }
  };

  const handleExcluirCandidato = async (id) => {
    if (confirm("Tem certeza que deseja remover este candidato?")) {
      await supabase.from("cipaa_candidatos").delete().eq("id", id);
      carregarDados();
    }
  };

  // Consolidar contagem de votos por candidato (Mantendo Sigilo Absoluto)
  const resultados = candidatos.map((cand) => {
    const totalVotos = votos.filter((v) => v.candidato_id === cand.id).length;
    return { ...cand, totalVotos };
  }).sort((a, b) => b.totalVotos - a.totalVotos);

  const totalGeralVotos = votos.length;

  // Exportar PDF Consolidado
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.setTextColor(0, 40, 69);
    doc.text("Relatório Consolidado - Eleição CIPAA Gestão 2026/2027", 14, 15);
    doc.setFontSize(10);
    doc.text(`Total de Votos Computados: ${totalGeralVotos}`, 14, 22);

    const tableColumn = ["Classificação", "Candidato", "Matrícula", "Total de Votos"];
    const tableRows = resultados.map((res, index) => [
      index + 1,
      res.nome,
      res.matricula,
      res.totalVotos
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      headStyles: { fillColor: [0, 90, 141] }
    });

    doc.save(`Resultado_CIPAA_2026_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      
      {/* Cabeçalho */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Painel Administrativo</span>
          <h1 className="text-2xl font-serif font-bold text-[#005a8d]">Gestão e Apuração da CIPAA</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={exportarPDF} className="bg-[#005a8d] hover:bg-[#004068] text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-md flex items-center gap-2">
            <Download className="w-4 h-4" /> Baixar PDF Consolidado
          </button>
          {onLogout && (
            <button onClick={onLogout} className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl font-bold text-sm">Sair</button>
          )}
        </div>
      </div>

      {/* Métricas do Dashboard */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#005a8d] rounded-2xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total de Votos Registados</p>
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
      </div>

      {/* Tabela de Resultados (Garantindo Sigilo: Sem mostrar quem votou) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#005a8d]">Apuração Parcial / Final (Classificação)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-[11px] font-bold text-gray-500 uppercase">
                <th className="p-4">Classificação</th>
                <th className="p-4">Candidato</th>
                <th className="p-4">Matrícula</th>
                <th className="p-4">Total de Votos</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {resultados.map((res, index) => (
                <tr key={res.id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-400">#{index + 1}</td>
                  <td className="p-4 font-bold text-[#005a8d]">{res.nome}</td>
                  <td className="p-4">{res.matricula}</td>
                  <td className="p-4 font-bold text-emerald-700">{res.totalVotos} votos</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gestão de Candidatos */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
        <h3 className="font-serif font-bold text-lg text-[#005a8d]">Cadastrar Novo Candidato</h3>
        <form onSubmit={handleCadastrarCandidato} className="grid sm:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Nome Completo"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm"
          />
          <input
            type="text"
            placeholder="Matrícula"
            required
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm"
          />
          <input
            type="url"
            placeholder="URL da Foto (opcional)"
            value={fotoUrl}
            onChange={(e) => setFotoUrl(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm"
          />
          <button type="submit" className="bg-[#005a8d] hover:bg-[#004068] text-white font-bold rounded-2xl px-4 py-3 text-sm flex items-center justify-center gap-2">
            <PlusCircle className="w-4 h-4" /> Cadastrar
          </button>
        </form>

        <div className="grid sm:grid-cols-3 gap-4 pt-4">
          {candidatos.map((c) => (
            <div key={c.id} className="border border-gray-200 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={c.foto_url || "https://via.placeholder.com/150"} alt={c.nome} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-xs text-gray-800">{c.nome}</p>
                  <p className="text-[10px] text-gray-500">Mat: {c.matricula}</p>
                </div>
              </div>
              <button onClick={() => handleExcluirCandidato(c.id)} className="text-red-500 hover:text-red-700 p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
