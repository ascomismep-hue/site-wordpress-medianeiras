import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, User } from "lucide-react";

export default function Memorial() {
  const [falecidas, setFalecidas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMemorial() {
      const { data } = await supabase.from("memorial_falecidas").select("*").order("nome");
      if (data) setFalecidas(data);
      setLoading(false);
    }
    fetchMemorial();
  }, []);

  // Função auxiliar para formatar datas de "AAAA-MM-DD" para "DD/MM/AAAA"
  function formatarData(dataString) {
    if (!dataString) return "";
    if (dataString.includes("-")) {
      return dataString.split("-").reverse().join("/");
    }
    return dataString;
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>;

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#005a8d] mb-4">Memorial</h1>
        <p className="text-gray-600 text-sm max-w-xl mx-auto mb-4">
          Em eterna memória e gratidão às irmãs que concluíram sua jornada terrestre e descansam na paz do Senhor.
        </p>
        <div className="w-24 h-1 bg-[#c5a059] mx-auto rounded"></div>
      </div>

      {falecidas.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Nenhum registro encontrado no memorial.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {falecidas.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              
              {/* Moldura com altura ajustada (h-64) para um card mais compacto e proporcional */}
              <div className="h-64 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                {item.foto_url ? (
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <img 
                      src={item.foto_url} 
                      alt={item.nome}
                      style={{ 
                        maxWidth: 'none',
                        maxHeight: 'none',
                        width: 'auto',
                        height: '100%',
                        filter: 'grayscale(100%)', // Mantém o memorial em preto e branco clássico
                        transform: `translate(${item.pos_x || 0}px, ${item.pos_y || 0}px) scale(${item.zoom || 1})`,
                        transformOrigin: 'center center'
                      }}
                      className="pointer-events-none select-none"
                    />
                  </div>
                ) : (
                  <User className="w-16 h-16 text-gray-300" />
                )}
              </div>

              {/* Conteúdo com espaçamento otimizado */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#005a8d] mb-1">{item.nome}</h3>
                  {item.localizacao && (
                    <p className="text-xs text-gray-400 font-medium mb-2.5">{item.localizacao}</p>
                  )}
                  
                  <div className="space-y-1 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
                    {item.data_nascimento && (
                      <p><strong className="text-gray-800">Nascimento:</strong> {formatarData(item.data_nascimento)}</p>
                    )}
                    {item.data_falecimento && (
                      <p><strong className="text-gray-800">Falecimento:</strong> {formatarData(item.data_falecimento)}</p>
                    )}
                  </div>
                </div>

                {item.biografia_breve && (
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {item.biografia_breve}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
