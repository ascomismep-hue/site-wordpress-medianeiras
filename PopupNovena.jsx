import { useState, useEffect } from "react";
import { X, Sparkles, BookOpen } from "lucide-react";

export default function PopupNovena() {
  const [visivel, setVisivel] = useState(false);
  const [tipoAtivo, setTipoAtivo] = useState(null); // 'aviso' ou 'oracao'

  useEffect(() => {
    const hoje = new Date();
    const mes = hoje.getMonth() + 1; // Outubro = 10, Novembro = 11
    const dia = hoje.getDate();

    // Intervalo 1: De 30 de Outubro a 05 de Novembro (Aviso de que está chegando)
    const eAviso = (mes === 10 && dia >= 30) || (mes === 11 && dia <= 5);

    // Intervalo 2: De 06 a 14 de Novembro (Dias da Novena com a Oração)
    const eNovena = mes === 11 && dia >= 6 && dia <= 14;

    if (eAviso) {
      setTipoAtivo("aviso");
      setVisivel(true);
    } else if (eNovena) {
      setTipoAtivo("oracao");
      setVisivel(true);
    }
  }, []);

  if (!visivel) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      
      {/* 1. MODO AVISO (30/10 a 05/11) */}
      {tipoAtivo === "aviso" && (
        <div className="bg-white max-w-lg w-full rounded-[2.5rem] shadow-2xl overflow-hidden p-8 relative text-center space-y-6 border-2 border-[#c5a059]/30">
          <button 
            onClick={() => setVisivel(false)}
            className="absolute top-6 right-6 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-full transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 bg-[#005a8d]/10 rounded-full flex items-center justify-center mx-auto text-[#005a8d]">
            <Sparkles className="w-8 h-8 text-[#c5a059]" />
          </div>

          <div className="space-y-2">
            <span className="bg-[#c5a059]/10 text-[#c5a059] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Contagem Regressiva
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#005a8d]">
              A Novena de Nossa Sra. Medianeira da Paz está chegando!
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Prepare o seu coração para dias de muita fé, oração e comunhão em nossa congregação. De 06 a 14 de novembro.
            </p>
          </div>

          <button 
            onClick={() => setVisivel(false)}
            className="w-full py-3.5 bg-[#005a8d] hover:bg-[#004068] text-white rounded-2xl font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            Acessar o Site
          </button>
        </div>
      )}

      {/* 2. MODO ORAÇÃO / NOVENA (06/14 de Novembro) */}
      {tipoAtivo === "oracao" && (
        <div className="bg-white max-w-4xl w-full rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative text-gray-900 border-2 border-[#c5a059]/30">
          
          <button 
            onClick={() => setVisivel(false)}
            className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors cursor-pointer"
            title="Fechar e entrar no site"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Coluna Esquerda: Imagem da Nossa Senhora */}
          <div className="md:col-span-6 bg-[#005a8d] relative min-h-[300px] md:min-h-[450px] flex items-center justify-center overflow-hidden">
            <img 
              src="/images/image_24a63a.jpg" 
              alt="Novena de Nossa Sra. Medianeira da Paz" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                06 a 14 de Novembro
              </span>
            </div>
          </div>

          {/* Coluna Direita: Oração da Novena (Fundo Azul Claro conforme a imagem de referência) */}
          <div className="md:col-span-6 bg-[#b2f2ff]/30 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <span className="bg-[#005a8d] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  NOVENA
                </span>
              </div>
              
              <h3 className="text-xl font-serif font-bold text-[#005a8d]">
                Nossa Senhora Medianeira, cuida de nós, apresenta nossas intenções a Jesus e nos ajuda a viver em paz. Amém!
              </h3>

              <div className="w-12 h-0.5 bg-[#c5a059] mx-auto"></div>

              <p className="text-xs font-semibold text-gray-700 italic">
                Pai-nosso e Glória ao Pai ao Filho e ao Espírito Santo. Amém!
              </p>
            </div>

            <button 
              onClick={() => setVisivel(false)}
              className="w-full py-3.5 bg-[#005a8d] hover:bg-[#004068] text-white rounded-2xl font-bold text-xs transition-all shadow-md cursor-pointer uppercase tracking-wider"
            >
              Rezar e Entrar no Site
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
