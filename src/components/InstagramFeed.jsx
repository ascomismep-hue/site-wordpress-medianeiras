import { useState, useEffect } from "react";
import { Instagram, ExternalLink, Play, Image as ImageIcon, Loader2 } from "lucide-react";

export default function InstagramFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================================
  // CONFIGURAÇÃO: Cole aqui o Token de Acesso gerado no Meta for Developers
  // =========================================================================
  const INSTAGRAM_ACCESS_TOKEN = import.meta.env.VITE_INSTAGRAM_TOKEN || "";
  const PERFIL_URL = "https://www.instagram.com/irimep/"; // Link oficial do perfil

  // Dados de demonstração (exibidos automaticamente enquanto o token não for inserido)
  const postsDemonstracao = [
    {
      id: "demo-1",
      caption: "Acompanhe as novidades, eventos e ações sociais do Instituto Religioso das Irmãs Medianeiras da Paz (IRIMEP).",
      media_type: "IMAGE",
      media_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      permalink: PERFIL_URL,
      timestamp: new Date().toISOString(),
    },
    {
      id: "demo-2",
      caption: "Compromisso com o acolhimento, a saúde e a educação em todas as nossas obras e missões.",
      media_type: "IMAGE",
      media_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      permalink: PERFIL_URL,
      timestamp: new Date().toISOString(),
    },
    {
      id: "demo-3",
      caption: "Fique por dentro da nossa agenda institucional e das atividades da Família Medianeira.",
      media_type: "IMAGE",
      media_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
      permalink: PERFIL_URL,
      timestamp: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    async function buscarUltimasPublicacoes() {
      // Se não houver token configurado ainda, exibe os cards de demonstração
      if (!INSTAGRAM_ACCESS_TOKEN) {
        setPosts(postsDemonstracao);
        setLoading(false);
        return;
      }

      try {
        // Busca exatamente as 3 últimas publicações (limit=3) via Graph API do Instagram
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=3&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.data && data.data.length > 0) {
          setPosts(data.data.slice(0, 3));
        } else {
          console.warn("Retorno vazio da API do Instagram, usando fallback:", data);
          setPosts(postsDemonstracao);
        }
      } catch (error) {
        console.error("Erro ao carregar feed do Instagram:", error);
        setPosts(postsDemonstracao);
      } finally {
        setLoading(false);
      }
    }

    buscarUltimasPublicacoes();
  }, [INSTAGRAM_ACCESS_TOKEN]);

  // Formata a data da publicação para DD/MM/AAAA
  const formatarData = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("pt-BR");
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-wrap justify-between items-end mb-10 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#c5a059] flex items-center gap-1.5">
            <Instagram className="w-4 h-4" /> Redes Sociais
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#005a8d] mt-1">
            Últimas do Instagram
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Acompanhe em tempo real as publicações oficiais do <strong>@irimep</strong>.
          </p>
        </div>

        <a
          href={PERFIL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#005a8d] hover:bg-[#004068] text-white font-bold text-xs px-5 py-3 rounded-2xl transition-all shadow-sm flex items-center gap-2"
        >
          <Instagram className="w-4 h-4" />
          Seguir no Instagram
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Estado de Carregamento */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" />
        </div>
      ) : (
        /* Grade com as 3 Últimas Publicações */
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => {
            // Se for vídeo/Reels, usa a thumbnail_url como capa
            const imagemCapa =
              post.media_type === "VIDEO"
                ? post.thumbnail_url || post.media_url
                : post.media_url;

            return (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Container da Imagem (Proporção Quadrada 1:1) */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={imagemCapa}
                    alt={post.caption ? post.caption.slice(0, 60) : "Publicação IRIMEP"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Ícone indicador caso seja Vídeo/Reels ou Carrossel */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-xs text-white p-2 rounded-full">
                    {post.media_type === "VIDEO" ? (
                      <Play className="w-4 h-4 fill-white" />
                    ) : (
                      <ImageIcon className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {/* Legenda e Rodapé do Card */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {post.caption || "Confira esta publicação completa no nosso perfil oficial do Instagram."}
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
