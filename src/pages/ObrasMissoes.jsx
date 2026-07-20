import { usePageContent } from "@/hooks/usePageContent";
import { useEntities } from "@/hooks/useEntities";

export default function ObrasMissoes() {
  const { get } = usePageContent();
  const { items: works } = useEntities("SocialWork");

  return (
    <div>
      <section className="bg-[#005a8d] text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">Caridade & Missão</span>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold">Obras Sociais e Missões</h1>
          <p className="mt-4 text-white/85 leading-relaxed">{get("obras", "intro", "texto", "Conheça as obras de caridade e as missões que levam a paz de Cristo aos mais necessitados.")}</p>
        </div>
      </section>

      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {works.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.sort((a, b) => (a.order || 0) - (b.order || 0)).map(w => (
                <article key={w.id} className="bg-white rounded-2xl border border-[#c5a059]/15 overflow-hidden hover:shadow-lg transition-shadow">
                  {w.image_url && (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={w.image_url} alt={w.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-serif text-lg font-bold text-[#005a8d]">{w.title}</h3>
                    {w.description && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{w.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">Nenhuma obra cadastrada ainda.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
