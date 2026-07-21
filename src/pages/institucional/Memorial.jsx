import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Heart, User } from "lucide-react";

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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>;

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#005a8d] mb-4">Memorial</h1>
        <p className="text-gray-600 max-w-xl mx-auto mt-2">Em eterna memória e gratidão às irmãs que concluíram sua jornada terrestre e descansam na paz do Senhor.</p>
        <div className="w-24 h-1 bg-[#c5a059] mx-auto rounded mt-4"></div>
      </div>

      {falecidas.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Nenhum registro no memorial no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {falecidas.map((irma) => (
            <div key={irma.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col opacity-90 hover:opacity-100 transition-opacity">
              <div className="h-64 bg-gray-100 flex items-center justify-center overflow-hidden grayscale">
                {irma.foto_url ? (
                  <img src={irma.foto_url} alt={irma.nome} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-20 h-20 text-gray-300" />
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#005a8d] mb-2">{irma.nome}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#c5a059] font-medium mb-3">
                    <Heart className="w-4 h-4 fill-current" /> {irma.data_nascimento} - {irma.data_falecimento}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{irma.biografia_breve}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
