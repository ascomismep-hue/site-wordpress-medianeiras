import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Award, User } from "lucide-react";

export default function MadresGerais() {
  const [madres, setMadres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMadres() {
      const { data } = await supabase.from("madres_gerais").select("*");
      if (data) setMadres(data);
      setLoading(false);
    }
    fetchMadres();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>;

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#005a8d] mb-4">Madres Gerais</h1>
        <p className="text-gray-600 max-w-xl mx-auto mt-2">Conheça as irmãs que conduziram com sabedoria, dedicação e fidelidade os rumos da nossa congregação.</p>
        <div className="w-24 h-1 bg-[#c5a059] mx-auto rounded mt-4"></div>
      </div>

      {madres.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Nenhuma Madre cadastrada no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {madres.map((madre) => (
            <div key={madre.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
                {madre.foto_url ? (
                  <img src={madre.foto_url} alt={madre.nome} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-20 h-20 text-gray-300" />
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#005a8d] mb-1">{madre.nome}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#c5a059] font-bold mb-3 uppercase tracking-wider">
                    <Award className="w-4 h-4" /> Mandato: {madre.periodo_mandato}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{madre.biografia}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
