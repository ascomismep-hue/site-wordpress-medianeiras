import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Church, Calendar, ArrowRight } from "lucide-react";

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNoticias() {
      const { data } = await supabase
        .from("noticias")
        .select("*")
        .eq("active", true)
        .order("data_publicacao", { ascending: false });

      if (data) setNoticias(data);
      setLoading(false);
    }
    fetchNoticias();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#005a8d] mb-3">Avisos e Notícias Oficiais</h1>
        <p className="text-gray-600 max-w-lg mx-auto text-sm sm:text-base">
          Fique por dentro de todos os comunicados, avisos e notícias recentes da congregação.
        </p>
        <div className="w-24 h-1 bg-[#c5a059] mx-auto rounded mt-4"></div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>
      ) : noticias.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Church className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Nenhuma notícia publicada no momento.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {noticias.map((item) => {
            const dataFormatada = new Date(item.data_publicacao + 'T00:00:00').toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            });

            return (
              <div key={item.id} className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow">
                {item.foto_url && (
                  <div className="w-full md:w-72 h-48 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                    <img src={item.foto_url} alt={item.titulo} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059]">
                    <Calendar className="w-3.5 h-3.5" /> {dataFormatada}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#005a8d]">{item.titulo}</h3>
                  {item.subtitulo && <p className="text-sm font-semibold text-gray-700">{item.subtitulo}</p>}
                  {item.conteudo && <p className="text-gray-600 text-sm leading-relaxed">{item.conteudo}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
