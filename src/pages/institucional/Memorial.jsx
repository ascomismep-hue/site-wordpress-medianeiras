import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, User } from "lucide-react";

export default function Memorial() {
  const [falecidas, setFalecidas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemorial();
  }, []);

  async function fetchMemorial() {
    setLoading(true);
    const { data, error } = await supabase
      .from("memorial_falecidas")
      .select("*")
      .order("nome");

    if (error) {
      console.error("Erro ao buscar memorial:", error);
    } else {
      setFalecidas(data || []);
    }
    setLoading(false);
  }

  function formatarDataVisual(dataString) {
    if (!dataString) return "";
    if (dataString.includes("-")) {
      return dataString.split("-").reverse().join("/");
    }
    return dataString;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#005a8d]">
          Memorial
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Em eterna memória e gratidão às irmãs que concluíram sua jornada terrestre e descansam na paz do Senhor.
        </p>
        <div className="w-20 h-1 bg-[#c5a059] mx-auto rounded-full"></div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" />
        </div>
      ) : falecidas.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Nenhum registro encontrado no memorial.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {falecidas.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-md"
            >
              {/* Contentor da Imagem com suporte a Posição e Zoom */}
              <div className="h-80 w-full bg-gray-900 flex items-center justify-center overflow-hidden relative">
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
                        transform: `translate(${item.pos_x || 0}px, ${item.pos_y || 0}px) scale(${item.zoom || 1})`,
                        transformOrigin: 'center center'
                      }}
                      className="pointer-events-none select-none"
                    />
                  </div>
                ) : (
                  <div className="text-center p-4 text-gray-500 text-xs">
                    <User className="w-12 h-12 mx-auto text-gray-600 mb-1" />
                    Sem foto
                  </div>
                )}
              </div>

              {/* Informações da Irmã Falecida */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-bold text-[#005a8d]">
                    {item.nome}
                  </h3>
                  {item.localizacao && (
                    <p className="text-xs text-gray-400 font-medium">
                      {item.localizacao}
                    </p>
                  )}
                </div>

                <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  {item.data_nascimento && (
                    <p>⭐ Nascimento: {formatarDataVisual(item.data_nascimento)}</p>
                  )}
                  {item.data_falecimento && (
                    <p>✝️ Falecimento: {formatarDataVisual(item.data_falecimento)}</p>
                  )}
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
