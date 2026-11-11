import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, User, ChevronDown, ChevronUp } from "lucide-react";

export default function MadresGerais() {
  const [madres, setMadres] = useState([]);
  const [loading, setLoading] = useState(true);
  // Estado para controlar quais biografias estão expandidas (chave: id da madre)
  const [biografiasAbertas, setBiografiasAbertas] = useState({});

  useEffect(() => {
    fetchMadres();
  }, []);

  async function fetchMadres() {
    setLoading(true);
    const { data, error } = await supabase
      .from("madres_gerais")
      .select("*")
      .order("nome");

    if (error) {
      console.error("Erro ao buscar madres gerais:", error);
    } else {
      setMadres(data || []);
    }
    setLoading(false);
  }

  // Função para alternar a visibilidade da biografia de uma madre específica
  const toggleBiografia = (id) => {
    setBiografiasAbertas(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#005a8d]">
          Madres Gerais
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Conheça as irmãs que conduziram com sabedoria, dedicação e fidelidade os rumos da nossa congregação.
        </p>
        <div className="w-20 h-1 bg-[#c5a059] mx-auto rounded-full"></div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" />
        </div>
      ) : madres.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Nenhuma Madre Geral cadastrada no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {madres.map((item) => {
            const isOpen = !!biografiasAbertas[item.id];

            return (
              <div 
                key={item.id} 
                className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-md"
              >
                {/* Contentor da Imagem */}
                <div className="h-80 w-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
                  {item.foto_url ? (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                      <img 
                        src={item.foto_url} 
                        alt={item.nome}
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center top',
                          transform: `translate(${item.pos_x || 0}px, ${item.pos_y || 0}px) scale(${item.zoom || 1})`,
                          transformOrigin: 'center center'
                        }}
                        className="pointer-events-none select-none"
                      />
                    </div>
                  ) : (
                    <div className="text-center p-4 text-gray-400 text-xs">
                      <User className="w-12 h-12 mx-auto text-gray-300 mb-1" />
                      Sem foto
                    </div>
                  )}
                </div>

                {/* Informações da Madre */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-serif font-bold text-[#005a8d]">
                      {item.nome}
                    </h3>
                    {item.periodo_mandato && (
                      <p className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">
                        Mandato: {item.periodo_mandato}
                      </p>
                    )}
                  </div>

                  {/* Biografia Recolhível / Expansível */}
                  {item.biografia && (
                    <div className="space-y-3 pt-2 border-t border-gray-100">
                      <div className={`text-gray-600 text-xs leading-relaxed overflow-hidden transition-all duration-300 ${isOpen ? '' : 'line-clamp-3'}`}>
                        {item.biografia}
                      </div>

                      <button
                        onClick={() => toggleBiografia(item.id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#005a8d] hover:text-[#003b6f] transition-colors pt-1 cursor-pointer focus:outline-none"
                      >
                        {isOpen ? (
                          <>
                            Ver menos <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Ler biografia <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
