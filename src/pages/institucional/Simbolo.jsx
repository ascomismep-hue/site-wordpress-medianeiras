import React from "react";
import { Sparkles, Church, Globe, Heart, ShieldCheck } from "lucide-react";

export default function Simbolo() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-gray-700">
      
      {/* Título Principal */}
      <div className="text-center mb-12 space-y-3">
        <span className="text-xs font-bold text-[#c5a059] uppercase tracking-widest bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
          Carisma e Espiritualidade
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#005a8d]">
          Fundamentação Teológica do Símbolo
        </h1>
        <div className="w-24 h-1 bg-[#c5a059] mx-auto rounded-full"></div>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          O símbolo das Irmãs Medianeiras da Paz expressa, por meio de seus elementos, uma profunda síntese da fé cristã, da redenção de Cristo e da missão de Maria.
        </p>
      </div>

      {/* Imagem Oficial do Símbolo em Destaque */}
      <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 mb-16 flex flex-col md:flex-row items-center gap-10">
        <div className="w-full md:w-1/2 flex justify-center bg-[#002845] p-8 rounded-3xl shadow-inner">
          <img 
            src="/icone.png" 
            alt="Símbolo das Medianeiras da Paz" 
            className="w-64 h-64 sm:w-80 sm:h-80 object-contain drop-shadow-2xl"
          />
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#005a8d]">Síntese Visual e Carisma</h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
            É uma representação visual do carisma e da espiritualidade que inspiram a vida consagrada e a missão evangelizadora. Cada traço e cor revelam o compromisso de levar vida, esperança e paz a toda a humanidade.
          </p>
          <p className="text-xs text-gray-400 italic">
            Estudos por Oliveira, jp
          </p>
        </div>
      </div>

      {/* Os 5 Elementos Principais */}
      <div className="space-y-10">

        {/* 1. A cruz dourada */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-50 text-[#c5a059] rounded-2xl flex items-center justify-center shrink-0">
              <Church className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#005a8d]">
              1. A cruz dourada — A redenção de Cristo
            </h2>
          </div>
          <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
            <p>
              A cruz, situada ao fundo, representa o mistério central da fé cristã: a paixão, a morte e a ressurreição de Jesus Cristo, que entregou sua vida para a salvação da humanidade.
            </p>
            <p>
              Ela recorda que toda missão cristã nasce do amor redentor de Cristo e encontra na cruz a fonte de sua espiritualidade. É diante da cruz que a pessoa é chamada à conversão, à reconciliação e à entrega generosa ao serviço dos irmãos.
            </p>
            <blockquote className="border-l-4 border-[#c5a059] pl-4 italic text-gray-700 bg-gray-50 py-2 rounded-r-lg my-2">
              “Eu vim para que todos tenham vida e a tenham em abundância.” (Jo 10,10)
            </blockquote>
          </div>
        </div>

        {/* 2. A pomba vermelha */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-50 text-[#e31e24] rounded-2xl flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-red-950">
              2. A pomba vermelha — A ação do Espírito Santo libertador
            </h2>
          </div>
          <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
            <p>
              A pomba, símbolo bíblico do Espírito Santo, representa sua presença viva e transformadora na Igreja e no mundo. Sua cor vermelha pode evocar o fogo do Pentecostes, o amor ardente de Deus e a força que impulsiona os discípulos à missão.
            </p>
            <p>
              O Espírito Santo ilumina, fortalece e liberta o ser humano de tudo aquilo que impede a plenitude da vida: o egoísmo, a injustiça, a opressão, a violência e a falta de esperança.
            </p>
          </div>
        </div>

        {/* 3. O globo vazado */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-50 text-[#005a8d] rounded-2xl flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#005a8d]">
              3. O globo vazado — A humanidade e o mundo a evangelizar
            </h2>
          </div>
          <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
            <p>
              O globo azul, desenhado por linhas abertas, representa o mundo, a humanidade e a universalidade da missão evangelizadora. Seu traçado vazado pode ser interpretado como sinal de abertura, acolhida e disponibilidade: a missão não conhece fronteiras e não exclui ninguém.
            </p>
            <p>
              A cor azul evoca a paz, a serenidade, a confiança e a esperança. As linhas que formam o globo recordam que todos os povos estão interligados e que a verdadeira paz exige diálogo, solidariedade e corresponsabilidade.
            </p>
          </div>
        </div>

        {/* 4. A Medianeira da Paz */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-50 text-[#c5a059] rounded-2xl flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#005a8d]">
              4. A Medianeira da Paz — Maria, mulher da fé e da comunhão
            </h2>
          </div>
          <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
            <p>
              A figura da pomba, integrada à cruz e ao globo, permite contemplar também a dimensão mariana da espiritualidade das Medianeiras da Paz. Maria é reconhecida pela Igreja como Mãe de Jesus e mulher do sim generoso.
            </p>
            <blockquote className="border-l-4 border-[#c5a059] pl-4 italic text-gray-700 bg-gray-50 py-2 rounded-r-lg my-2">
              “Fazei tudo o que ele vos disser.” (Jo 2,5)
            </blockquote>
            <p>
              Na espiritualidade das Medianeiras da Paz, Maria inspira uma missão de proximidade, sensibilidade às necessidades humanas e promoção da comunhão (cf. 1Tm 2,5; <em>Lumen gentium</em>, n. 60–62).
            </p>
          </div>
        </div>

        {/* 5. A unidade dos elementos */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-700 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-purple-950">
              5. A unidade dos elementos — Uma espiritualidade, uma missão
            </h2>
          </div>
          <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            <p className="mb-4">Os elementos do símbolo revelam juntos uma mensagem profunda de fé e compromisso:</p>
            <ul className="grid sm:grid-cols-2 gap-3">
              <li className="bg-gray-50 p-4 rounded-2xl border border-gray-100"><strong>A cruz:</strong> Cristo redime e dá sentido à missão.</li>
              <li className="bg-gray-50 p-4 rounded-2xl border border-gray-100"><strong>A pomba:</strong> o Espírito Santo anima, liberta e envia.</li>
              <li className="bg-gray-50 p-4 rounded-2xl border border-gray-100"><strong>O globo:</strong> o mundo inteiro é destinatário do Evangelho.</li>
              <li className="bg-gray-50 p-4 rounded-2xl border border-gray-100"><strong>Maria:</strong> inspira a acolhida e a condução a Jesus.</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Síntese Espiritual Final */}
      <div className="mt-16 bg-gradient-to-br from-[#002845] to-[#004068] text-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl text-center space-y-6">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#c5a059]">Síntese Espiritual do Carisma</h3>
        <p className="text-white/90 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
          Cristo é a fonte da redenção; o Espírito Santo é a força que liberta e envia; Maria é a inspiração materna que conduz a Jesus; e o mundo é o campo da missão. As Medianeiras da Paz são chamadas a testemunhar esse amor por meio da oração, da vida fraterna, da evangelização, da educação, da saúde e do serviço aos mais necessitados.
        </p>
        <div className="pt-4 border-t border-white/10 text-xs text-white/60">
          Fundamentação teológica desenvolvida por Oliveira, jp.
        </div>
      </div>

    </div>
  );
}
