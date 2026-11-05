import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Church, Calendar, ArrowLeft, Share2, Check } from "lucide-react";

export default function Noticias() {
  const { id } = useParams(); // Captura o ID da notícia na URL, se houver
  const navigate = useNavigate();

  const [noticias, setNoticias] = useState([]);
  const [noticiaUnica, setNoticiaUnica] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    async function fetchDados() {
      setLoading(true);

      if (id) {
        // Se houver um ID na URL, busca apenas essa notícia específica
        const { data, error } = await supabase
          .from("noticias")
          .select("*")
          .eq("id", id)
          .single();

        if (data) setNoticiaUnica(data);
        else setNoticiaUnica(null);
      } else {
        // Caso contrário, busca todas as notícias ativas
        const { data } = await supabase
          .from("noticias")
          .select("*")
          .eq("active", true)
          .order("data_publicacao", { ascending: false });

        if (data) setNoticias(data);
      }
      setLoading(false);
    }
    fetchDados();
  }, [id]);

  // Função para formatar data de "AAAA-MM-DD" para exibição amigável
  function formatarData(dataString) {
    if (!dataString) return "";
    return new Date(dataString + 'T00:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  // Copiar link individual da notícia
  function handleCopiarLink(noticiaId) {
    const url = `${window.location.origin}/#/noticias/${noticiaId}`;
    navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  }

  // Filtrar notícias pela data selecionada no calendário
  const noticiasFiltradas = dataSelecionada
    ? noticias.filter(item => item.data_publicacao === dataSelecionada)
    : noticias;

  // Extrair datas disponíveis para o filtro de calendário
  const datasDisponiveis = [...new Set(noticias.map(item => item.data_publicacao))];

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" />
      </div>
    );
  }

  // --- MODO DE VISUALIZAÇÃO DE UMA NOTÍCIA ESPECÍFICA (LINK INDIVIDUAL) ---
  if (id) {
    if (!noticiaUnica) {
      return (
        <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-4">
          <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Notícia não encontrada</h2>
          <p className="text-gray-600 text-sm">O comunicado que procura pode ter sido removido ou o link está incorreto.</p>
          <button 
            onClick={() => navigate("/noticias")}
            className="px-6 py-3 bg-[#005a8d] text-white rounded-xl font-bold text-sm inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Ver todas as notícias
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 space-y-8">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate("/noticias")}
            className="text-xs font-bold text-[#005a8d] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para Notícias
          </button>

          <button 
            onClick={() => handleCopiarLink(noticiaUnica.id)}
            className="text-xs font-bold text-[#c5a059] bg-[#c5a059]/10 hover:bg-[#c5a059]/20 px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition-colors"
          >
            {copiado ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            {copiado ? "Link Copiado!" : "Compartilhar Notícia"}
          </button>
        </div>

        <article className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059]">
              <Calendar className="w-3.5 h-3.5" /> {formatarData(noticiaUnica.data_publicacao)}
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#005a8d]">{noticiaUnica.titulo}</h1>
            {noticiaUnica.subtitulo && <p className="text-lg font-semibold text-gray-700">{noticiaUnica.subtitulo}</p>}
          </div>

          {noticiaUnica.foto_url && (
            <div className="h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
              <img src={noticiaUnica.foto_url} alt={noticiaUnica.titulo} className="w-full h-full object-cover" />
            </div>
          )}

          <div 
            className="prose prose-blue max-w-none text-gray-700 leading-relaxed text-justify space-y-4 pt-4"
            dangerouslySetInnerHTML={{ __html: noticiaUnica.conteudo }}
          />
        </article>
      </div>
    );
  }

  // --- MODO DE LISTAGEM GERAL COM CALENDÁRIO / ARQUIVO POR DIA ---
  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#005a8d] mb-3">Avisos e Notícias Oficiais</h1>
        <p className="text-gray-600 max-w-lg mx-auto text-sm sm:text-base">
          Fique por dentro de todos os comunicados e notícias recentes da congregação.
        </p>
        <div className="w-24 h-1 bg-[#c5a059] mx-auto rounded mt-4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Coluna Principal: Lista de Notícias */}
        <div className="lg:col-span-8 space-y-8">
          {noticiasFiltradas.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <Church className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Nenhuma notícia encontrada para esta data.</p>
            </div>
          ) : (
            noticiasFiltradas.map((item) => (
              <article key={item.id} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059]">
                      <Calendar className="w-3.5 h-3.5" /> {formatarData(item.data_publicacao)}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#005a8d]">{item.titulo}</h2>
                  </div>

                  <button 
                    onClick={() => handleCopiarLink(item.id)}
                    className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-colors shrink-0"
                    title="Copiar link da notícia"
                  >
                    <Share2 className="w-4 h-4 text-[#005a8d]" />
                  </button>
                </div>

                {item.subtitulo && <p className="text-sm font-semibold text-gray-700">{item.subtitulo}</p>}

                {item.foto_url && (
                  <div className="h-60 rounded-2xl overflow-hidden bg-gray-100">
                    <img src={item.foto_url} alt={item.titulo} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => navigate(`/noticias/${item.id}`)}
                    className="px-5 py-2.5 bg-[#005a8d] hover:bg-[#004068] text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Ler Notícia Completa &rarr;
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Coluna Lateral: Calendário / Filtro por Dia */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 sticky top-6">
          <h3 className="font-serif font-bold text-lg text-[#005a8d] flex items-center gap-2 border-b pb-3">
            <Calendar className="w-5 h-5 text-[#c5a059]" /> Filtrar por Dia
          </h3>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500">Selecione uma data:</label>
            <input 
              type="date" 
              value={dataSelecionada} 
              onChange={e => setDataSelecionada(e.target.value)} 
              className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:border-[#005a8d]"
            />
          </div>

          {dataSelecionada && (
            <button 
              onClick={() => setDataSelecionada("")}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
            >
              Mostrar Todas as Notícias
            </button>
          )}

          <div className="pt-4 border-t">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Dias com Publicações:</span>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {datasDisponiveis.map(data => (
                <button
                  key={data}
                  onClick={() => setDataSelecionada(data)}
                  className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors ${
                    dataSelecionada === data 
                      ? "bg-[#005a8d] text-white" 
                      : "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-[#005a8d]"
                  }`}
                >
                  {formatarData(data)}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
