import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Heart, BookOpen, Church, Quote, Sparkles, Mail } from "lucide-react";

export default function DomCampelo() {
  const [content, setContent] = useState({});

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase
        .from('page_content')
        .select('section, key, value')
        .eq('page', 'dom_campelo');

      if (data) {
        const map = {};
        data.forEach(item => {
          if (!map[item.section]) map[item.section] = {};
          map[item.section][item.key] = item.value;
        });
        setContent(map);
      }
    }
    fetchContent();
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-white text-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1531259684756-2e3e5d8a9b6e?auto=format&fit=crop&w=1600&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#005a8d]/85 via-[#005a8d]/80 to-[#003355]/90" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
          <Sparkles className="w-10 h-10 mx-auto mb-4 text-[#c5a059]" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">{content?.hero?.titulo || "Causa de Canonização"}</h1>
          <p className="mt-4 text-lg text-white/90 font-light">{content?.hero?.subtitulo || "Servo de Deus Dom Antônio Campelo"}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* BIOGRAFIA */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="aspect-square rounded-3xl bg-[#005a8d]/10 ring-4 ring-[#c5a059]/20 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80" alt="Dom Campelo" className="w-full h-full object-cover" />
            </div>
            <div className="mt-4 bg-white rounded-2xl border border-[#c5a059]/15 p-4 text-sm space-y-2">
              <div className="flex items-center gap-2 text-[#005a8d]"><BookOpen className="w-4 h-4" /> Salesiano (SDB)</div>
              <div className="flex items-center gap-2 text-[#005a8d]"><Church className="w-4 h-4" /> 4º Bispo de Petrolina (PE)</div>
              <div className="flex items-center gap-2 text-[#c5a059]"><Heart className="w-4 h-4" /> Fundador das Medianeiras da Paz</div>
            </div>
          </div>
          <div className="md:col-span-2">
            <SectionTitle>Vida e Biografia</SectionTitle>
            <p className="text-gray-700 leading-relaxed">{content?.biografia?.p1 || "Carregando biografia..."}</p>
          </div>
        </section>

        {/* CITAÇÃO */}
        <section className="bg-[#005a8d] text-white rounded-3xl p-8 sm:p-12 text-center">
          <blockquote className="max-w-3xl mx-auto italic">
            <p className="font-serif text-xl sm:text-2xl leading-relaxed">{content?.citacao?.texto}</p>
            <footer className="mt-4 text-[#c5a059] font-semibold">— Dom Antônio Campelo de Aragão</footer>
          </blockquote>
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className="font-serif text-2xl font-bold text-[#005a8d] mb-4">{children}</h2>;
}
