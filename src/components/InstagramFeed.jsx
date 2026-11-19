import { useState, useEffect } from "react";
import { Instagram, ExternalLink, Play, Image as ImageIcon, Loader2 } from "lucide-react";

export default function InstagramFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================================
  // CONFIGURAÇÃO DO PERFIL E FEED OFICIAL (BEHOLD.SO)
  // =========================================================================
  const PERFIL_USUARIO = "@medianeiras.dapaz";
  const PERFIL_URL = "https://www.instagram.com/medianeiras.dapaz/";
  const BEHOLD_FEED_URL = "https://feeds.behold.so/CHaT009nsO6u69D9n6EX";

  // Dados de reserva apenas caso haja falha de conexão com o Behold
  const postsFallback = [
    {
      id: "fallback-1",
      caption: "Acompanhe as novidades, eventos e ações missionárias das Irmãs Medianeiras da Paz (@medianeiras.dapaz).",
      mediaType: "IMAGE",
      mediaUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      permalink: PERFIL_URL,
      timestamp: new Date().toISOString(),
    },
    {
      id: "fallback-2",
      caption: "Compromisso com o acolhimento, a saúde, a educação e a evangelização em todas as nossas obras.",
      mediaType: "IMAGE",
      mediaUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      permalink: PERFIL_URL,
      timestamp: new Date().toISOString(),
    },
    {
      id: "fallback-3",
      caption: "Fique por dentro da nossa agenda institucional e da caminhada da Família Medianeira.",
      mediaType: "IMAGE",
      mediaUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
      permalink: PERFIL_URL,
      timestamp: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    async function carregarFeedInstagram() {
      try {
        const response = await fetch(BEHOLD_FEED_URL);
        if (!response.ok) {
          throw new Error(`Erro HTTP ao buscar feed: ${response.status}`);
        }

        const data = await response.json();

        // O Behold retorna um objeto { posts: [...] } nas versões mais recentes ou um array direto
        const listaPosts = Array.isArray(data) ? data : data.posts || [];

        if (listaPosts.length > 0) {
          setPosts(listaPosts.slice(0, 3));
        } else {
          setPosts(postsFallback);
        }
      } catch (error) {
        console.error("Erro ao carregar publicações reais do Instagram:", error);
        setPosts(postsFallback);
      } finally {
        setLoading(false);
      }
    }

    carregarFeedInstagram();
  }, []);

  // Formata a data ISO vinda do Instagram para o padrão brasileiro (DD/MM/AAAA)
  const formatarData = (isoString) => {
    if (!isoString) return "";
    const data = new Date(isoString);
    return isNaN(data.getTime()) ? "" : data.toLocaleDateString("pt-BR");
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#c5a059] flex items-center gap-1.5">
            <Instagram className="w-4 h-4" /> Redes Sociais
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#005a8d] mt-1">
            Últimas do Instagram
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Acompanhe as publicações oficiais de <strong>{PERFIL_USUARIO}</strong>.
          </p>
        </div>

        <a
          href={PERFIL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#005a8d] hover:bg-[#004068] text-white font-bold text-xs px-5 py-3 rounded-2xl transition-all shadow-sm flex items-center gap-2"
        >
          <Instagram className="w-4 h-4" />
          Seguir {PERFIL_USUARIO}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Estado de Carregamento */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" />
        </div>
      ) : (
        /* Grade com as 3 Últimas Publicações Reais */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => {
            const tipoMidia = post.mediaType || "IMAGE";
            // Se for vídeo/Reels, prioriza a thumbnailUrl (capa estática) para não quebrar a tag <img>
            const urlImagem =
              tipoMidia === "VIDEO"
                ? post.thumbnailUrl || post.sizes?.medium?.mediaUrl || post.mediaUrl
                : post.sizes?.medium?.mediaUrl || post.mediaUrl;

            return (
              <a
                key={post.id}
                href={post.permalink || PERFIL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Imagem de Capa Quadrada (1:1) */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={urlImagem}
                    alt={post.caption ? post.caption.slice(0, 60) : "Publicação Irmãs Medianeiras da Paz"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Ícone indicador de Vídeo/Reels ou Foto/Carrossel */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-xs text-white p-2 rounded-full">
                    {tipoMidia === "VIDEO" ? (
                      <Play className="w-4 h-4 fill-white" />
                    ) : (
                      <ImageIcon className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {/* Legenda e Rodapé */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                    {post.caption || "Confira esta publicação completa no perfil @medianeiras.dapaz."}
                  </p>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-medium">
                      {formatarData(post.timestamp)}
                    </span>
                    <span className="text-[#005a8d] font-bold group-hover:text-[#c5a059] transition-colors flex items-center gap-1">
                      Ver no Instagram <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
