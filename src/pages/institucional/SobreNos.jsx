import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Church, Calendar } from "lucide-react";

export default function SobreNos() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSobre() {
      const { data } = await supabase.from("institucional_sobre").select("*").limit(1).single();
      if (data) setData(data);
      setLoading(false);
    }
    fetchSobre();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>;

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#005a8d] mb-4">Sobre Nós</h1>
        <div className="w-24 h-1 bg-[#c5a059] mx-auto rounded"></div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-12 leading-relaxed text-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Church className="w-8 h-8 text-[#005a8d]" />
          <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Nossa História</h2>
        </div>
        <p className="whitespace-pre-line text-lg">{data?.historia || "História do instituto em breve."}</p>
      </div>

      {data?.linha_do_tempo && data.linha_do_tempo.length > 0 && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-[#005a8d]" />
            <h2 className="text-2xl font-serif font-bold text-[#005a8d]">Linha do Tempo</h2>
          </div>
          <div className="space-y-6 border-l-2 border-[#c5a059]/40 pl-6 ml-2">
            {data.linha_do_tempo.map((item, index) => (
              <div key={index} className="relative">
                <span className="absolute -left-[31px] top-1.5 w-4 h-4 bg-[#c5a059] rounded-full border-4 border-white"></span>
                <span className="text-sm font-bold text-[#c5a059]">{item.ano}</span>
                <h3 className="text-lg font-bold text-[#005a8d]">{item.titulo}</h3>
                <p className="text-gray-600 text-sm mt-1">{item.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
