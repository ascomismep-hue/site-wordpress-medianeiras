import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Plus, Trash2, Heart, QrCode, Calendar, Phone, Mail, User, LogOut, DollarSign, Gift } from "lucide-react";

export default function AdminDoacoes({ onLogout }) {
  const [causas, setCausas] = useState([]);
  const [doadores, setDoadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAdmin, setAbaAdmin] = useState("causas"); // "causas" ou "doadores"

  const [novaCausa, setNovaCausa] = useState({
    titulo: "",
    descricao: "",
    chave_pix: "",
    qr_code_url: "",
    foto_url: "",
    ordem: 0
  });

  useEffect(() => {
    fetchDadosAdmin();
  }, []);

  async function fetchDadosAdmin() {
    setLoading(true);
    const [{ data: cData }, { data: dData }] = await Promise.all([
      supabase.from("causas_doacao").select("*").order("ordem"),
      supabase.from("compromissos_doacao").select("*").order("data_registro", { ascending: false })
    ]);

    if (cData) setCausas(cData);
    if (dData) setDoadores(dData);
    setLoading(false);
  }

  async function handleAddCausa(e) {
    e.preventDefault();
    const { error } = await supabase.from("causas_doacao").insert([novaCausa]);
    if (!error) {
      setNovaCausa({ titulo: "", descricao: "", chave_pix: "", qr_code_url: "", foto_url: "", ordem: 0 });
      fetchDadosAdmin();
      alert("Causa de doação cadastrada com sucesso!");
    } else {
      alert("Erro ao cadastrar causa.");
    }
  }

  async function handleDeleteCausa(id) {
    if (window.confirm("Deseja realmente excluir esta causa de doação?")) {
      const { error } = await supabase.from("causas_doacao").delete().eq("id", id);
      if (!error) fetchDadosAdmin();
      else alert("Erro ao excluir.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#005a8d]">Gestão de Doações e Causas</h1>
          <p className="text-gray-600 text-sm">Gerencie as campanhas ativas e acompanhe a base de doadores e apoiadores mensais.</p>
        </div>
        {onLogout && (
          <button onClick={onLogout} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-2xl font-bold text-sm border border-red-100">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        )}
      </div>

      {/* Abas internas */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setAbaAdmin("causas")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            abaAdmin === "causas" ? "bg-[#005a8d] text-white shadow-sm" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Causas Cadastradas ({causas.length})
        </button>
        <button
          onClick={() => setAbaAdmin("doadores")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            abaAdmin === "doadores" ? "bg-[#005a8d] text-white shadow-sm" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Base de Doadores e Mensalistas ({doadores.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>
      ) : abaAdmin === "causas" ? (
        <div className="space-y-10">
          {/* Formulário de Nova Causa */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#005a8d]">Cadastrar Nova Causa de Doação</h3>
            <form onSubmit={handleAddCausa} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título da Causa</label>
                <input type="text" required placeholder="Ex: Reforma da Capela" value={novaCausa.titulo} onChange={e => setNovaCausa({...novaCausa, titulo: e.target.value})} className="w-full p-3 rounded-xl border text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Chave PIX</label>
                <input type="text" required placeholder="E-mail, CNPJ ou Celular" value={novaCausa.chave_pix} onChange={e => setNovaCausa({...novaCausa, chave_pix: e.target.value})} className="w-full p-3 rounded-xl border text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Link do QR Code (URL da Imagem)</label>
                <input type="text" placeholder="https://exemplo.com/qrcode.png" value={novaCausa.qr_code_url} onChange={e => setNovaCausa({...novaCausa, qr_code_url: e.target.value})} className="w-full p-3 rounded-xl border text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Link da Foto Principal</label>
                <input type="text" placeholder="https://exemplo.com/foto.jpg" value={novaCausa.foto_url} onChange={e => setNovaCausa({...novaCausa, foto_url: e.target.value})} className="w-full p-3 rounded-xl border text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Descrição Breve</label>
                <textarea rows="3" required placeholder="Explique para que serão destinados os recursos..." value={novaCausa.descricao} onChange={e => setNovaCausa({...novaCausa, descricao: e.target.value})} className="w-full p-3 rounded-xl border text-sm" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="bg-[#005a8d] hover:bg-[#004068] text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Cadastrar Causa
                </button>
              </div>
            </form>
          </div>

          {/* Listagem de Causas */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#005a8d]">Causas Ativas Cadastradas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {causas.map(c => (
                <div key={c.id} className="p-6 rounded-2xl border border-gray-200 flex flex-col justify-between space-y-4 bg-gray-50">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#e31e24] bg-red-50 px-2 py-0.5 rounded-full">PIX: {c.chave_pix}</span>
                    <h4 className="font-bold text-lg text-[#005a8d]">{c.titulo}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{c.descricao}</p>
                  </div>
                  <button onClick={() => handleDeleteCausa(c.id)} className="bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-xl text-xs font-bold border border-red-100 flex items-center justify-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" /> Excluir Causa
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* LISTA DE DOADORES E MENSALISTAS */
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="font-serif text-xl font-bold text-[#005a8d]">Base de Apoiadores e Doadores Mensais</h3>
            <span className="text-xs text-gray-500">Utilize esta base para envio de felicitações de aniversário e lembretes de doação.</span>
          </div>

          {doadores.length === 0 ? (
            <p className="text-center py-16 text-gray-400 text-sm">Nenhum registro de doação efetuado até o momento.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b">
                  <tr>
                    <th className="p-3">Doador(a)</th>
                    <th className="p-3">Contato</th>
                    <th className="p-3">Causa Escolhida</th>
                    <th className="p-3">Tipo</th>
                    <th className="p-3">Valor</th>
                    <th className="p-3">Aniversário</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {doadores.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-bold text-gray-900">{d.nome}</td>
                      <td className="p-3 text-gray-600">
                        <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#005a8d]" /> {d.telefone}</div>
                        <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#005a8d]" /> {d.email}</div>
                      </td>
                      <td className="p-3 font-semibold text-[#005a8d]">{d.causa_nome || "Geral"}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${d.tipo === 'mensal' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {d.tipo === 'mensal' ? 'Mensal (Recorrente)' : 'Única'}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-emerald-700">R$ {Number(d.valor).toFixed(2)}</td>
                      <td className="p-3 flex items-center gap-1 text-gray-600">
                        <Gift className="w-3.5 h-3.5 text-amber-600" />
                        {d.data_nascimento ? new Date(d.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR') : "Não informada"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
