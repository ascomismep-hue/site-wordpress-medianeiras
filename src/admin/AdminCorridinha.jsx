import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Download, Users, RefreshCw, LogOut } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AdminCorridinha({ onLogout }) {
  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscar dados da tabela do Supabase
  const fetchInscritos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("inscricoes_corridinha")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInscritos(data || []);
    } catch (err) {
      console.error("Erro ao carregar inscritos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInscritos();
  }, []);

  // Função para gerar e descarregar o PDF consolidado
  const exportarPDF = () => {
    const doc = new jsPDF();

    // Título e Cabeçalho do Relatório PDF
    doc.setFontSize(16);
    doc.setTextColor(0, 40, 69); // Azul escuro institucional (#002845)
    doc.text("I Corridinha da Prematuridade - UTI Neonatal Irmã Josefa", 14, 15);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Relatório Consolidado de Inscritos — Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 22);
    doc.text(`Total de Inscritos: ${inscritos.length}`, 14, 27);

    // Mapeamento das colunas da tabela PDF
    const tableColumn = ["#", "Criança", "Nascimento", "Responsável", "WhatsApp", "Como participará", "Acessibilidade"];
    const tableRows = [];

    inscritos.forEach((item, index) => {
      const dataNasc = item.data_nascimento 
        ? new Date(item.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR')
        : '-';

      const rowData = [
        index + 1,
        item.nome_crianca || "-",
        dataNasc,
        item.nome_responsavel || "-",
        item.whatsapp || "-",
        item.forma_participacao || "-",
        item.acessibilidade || "Nenhuma"
      ];
      tableRows.push(rowData);
    });

    // Gerar tabela estilizada no documento PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 32,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [0, 90, 141], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    });

    // Fazer download do ficheiro
    doc.save(`Inscritos_Corridinha_Prematuridade_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho do Painel com Botão de Sair */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Painel Administrativo</span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#005a8d]">Inscritos — I Corridinha da Prematuridade</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchInscritos}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-2xl transition-all"
              title="Atualizar lista"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={exportarPDF}
              disabled={inscritos.length === 0}
              className="bg-[#005a8d] hover:bg-[#004068] text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Baixar PDF Consolidado
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-2xl transition-all flex items-center gap-2 font-bold text-sm"
                title="Sair do painel"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            )}
          </div>
        </div>

        {/* Métrica Rápida */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-[#005a8d] rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total de Inscritos</p>
              <h3 className="text-2xl font-bold text-[#005a8d]">{inscritos.length}</h3>
            </div>
          </div>
        </div>

        {/* Tabela de Inscritos */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" />
            </div>
          ) : inscritos.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm">
              Nenhuma inscrição realizada até ao momento.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="p-4 pl-6">#</th>
                    <th className="p-4">Criança</th>
                    <th className="p-4">Nascimento</th>
                    <th className="p-4">Responsável</th>
                    <th className="p-4">WhatsApp</th>
                    <th className="p-4">Forma de Participação</th>
                    <th className="p-4">Acessibilidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-700">
                  {inscritos.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-gray-400">{index + 1}</td>
                      <td className="p-4 font-bold text-[#005a8d]">{item.nome_crianca}</td>
                      <td className="p-4">
                        {item.data_nascimento 
                          ? new Date(item.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR')
                          : '-'}
                      </td>
                      <td className="p-4 font-medium">{item.nome_responsavel}</td>
                      <td className="p-4 font-semibold text-emerald-700">{item.whatsapp}</td>
                      <td className="p-4">
                        <span className="bg-blue-50 text-[#005a8d] px-3 py-1 rounded-full text-[11px] font-bold inline-block">
                          {item.forma_participacao}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{item.acessibilidade || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
