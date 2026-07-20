import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Download, FileText, FolderOpen } from "lucide-react";

export default function Downloads() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cats, setCats] = useState([]);
  const [cat, setCat] = useState("todas");

  useEffect(() => {
    async function fetchDownloads() {
      setLoading(true);
      const { data, error } = await supabase
        .from('download_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setItems(data);
        const uniqueCats = [...new Set(data.map(i => i.category).filter(Boolean))];
        setCats(uniqueCats);
      }
      setLoading(false);
    }
    fetchDownloads();
  }, []);

  const filtered = cat === "todas" ? items : items.filter(i => i.category === cat);

  return (
    <div>
      <section className="bg-[#005a8d] text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <FolderOpen className="w-10 h-10 mx-auto text-[#c5a059] mb-4" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Downloads</h1>
          <p className="mt-3 text-white/85">Documentos, materiais e arquivos para baixar.</p>
        </div>
      </section>

      <section className="py-12 bg-[#f8f9fa]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {cats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button onClick={() => setCat("todas")} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${cat === "todas" ? "bg-[#e31e24] text-white" : "bg-white text-[#005a8d] border border-[#c5a059]/20"}`}>Todas</button>
              {cats.map(c => (
                <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${cat === c ? "bg-[#e31e24] text-white" : "bg-white text-[#005a8d] border border-[#c5a059]/20"}`}>{c}</button>
              ))}
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-500 py-12">Carregando...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16"><FileText className="w-12 h-12 text-[#c5a059]/30 mx-auto mb-4" /><p className="text-gray-500">Nenhum arquivo disponível.</p></div>
          ) : (
            <div className="space-y-3">
              {filtered.map(f => (
                <a key={f.id} href={f.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-white rounded-xl border border-[#c5a059]/15 p-4 hover:border-[#e31e24]/40 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-[#e31e24]/10 flex items-center justify-center shrink-0">
                    {f.file_type?.toUpperCase() === "PDF" ? <FileText className="w-6 h-6 text-[#e31e24]" /> : <Download className="w-6 h-6 text-[#005a8d]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-[#005a8d] truncate">{f.title}</h3>
                    {f.description && <p className="text-sm text-gray-500 truncate">{f.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {f.file_type && <span className="text-xs font-bold uppercase text-[#c5a059]">{f.file_type}</span>}
                    <Download className="w-5 h-5 text-[#005a8d] group-hover:text-[#e31e24] transition" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
