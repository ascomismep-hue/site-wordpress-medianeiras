import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Heart, Gift, Banknote } from "lucide-react";

export default function Doacao() {
  const [config, setConfig] = useState({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      const { data } = await supabase.from('donation_config').select('key, value');
      if (data) {
        const map = {};
        data.forEach(item => { map[item.key] = item.value; });
        setConfig(map);
      }
    }
    fetchConfig();
  }, []);

  const copyPix = () => {
    navigator.clipboard.writeText(config.pix_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <section className="bg-[#e31e24] text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <Heart className="w-10 h-10 mx-auto text-[#c5a059] mb-4" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Faça sua Doação</h1>
          <p className="mt-3 text-white/85">Sua generosidade sustenta nossas obras, missões e a vida consagrada.</p>
        </div>
      </section>

      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-2xl border border-[#c5a059]/20 p-6">
              <div className="flex items-center gap-2 mb-4"><Gift className="w-6 h-6 text-[#e31e24]" /><h2 className="font-serif text-lg font-bold text-[#005a8d]">Pix</h2></div>
              <p className="text-sm text-gray-500 mb-2">Chave Pix (e-mail):</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-[#f8f9fa] rounded-lg px-3 py-2 text-sm text-[#005a8d] font-mono">{config.pix_key || "Carregando..."}</code>
                <button onClick={copyPix} className="px-4 py-2 rounded-lg bg-[#e31e24] text-white text-sm font-semibold hover:bg-[#d63d30] transition">{copied ? "Copiado!" : "Copiar"}</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#c5a059]/20 p-6">
              <div className="flex items-center gap-2 mb-4"><Banknote className="w-6 h-6 text-[#005a8d]" /><h2 className="font-serif text-lg font-bold text-[#005a8d]">Transferência Bancária</h2></div>
              <dl className="text-sm space-y-1.5">
                <div className="flex justify-between"><dt className="text-gray-500">Banco</dt><dd className="font-semibold text-gray-700">{config.bank_name}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Agência</dt><dd className="font-semibold text-gray-700">{config.bank_agency}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Conta</dt><dd className="font-semibold text-gray-700">{config.bank_account}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Titular</dt><dd className="font-semibold text-gray-700">{config.bank_holder}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
