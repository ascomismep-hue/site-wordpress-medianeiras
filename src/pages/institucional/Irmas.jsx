import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, User } from "lucide-react";

export default function Irmas() {
  const [irmas, setIrmas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIrmas() {
      const { data } = await supabase.from("irmas").select("*").order("nome");
      if (data) setIrmas(data);
      setLoading(false);
    }
    fetchIrmas();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>;

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#005a8d] mb-4">Nossas Irmãs</h1>
        <div className="w-24 h-1 bg-[#c5a059] mx-auto rounded"></div>
      </div>

      {irmas.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Nenhuma irmã cadastrada no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {irmas.map((irma) => (
            <div key={irma.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
                {irma.foto_url ? (
                  <img src={irma.foto_url} alt={irma.nome} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-20 h-20 text-gray-300" />
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#005a8d] mb-3">{irma.nome}</h3>
                  <div className="space-y-1.5 text-sm text-gray-600">
                    <p><strong className="text-gray-800">Nascimento:</strong> {irma.data_nascimento} {irma.local_nascimento && `(${irma.local_nascimento})`}</p>
                    <p><strong className="text-gray-800">Primeiros Votos:</strong> {irma.primeiros_votos}</p>
                    <p><strong className="text-gray-800">Votos Perpétuos:</strong> {irma.votos_perpetuos}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
