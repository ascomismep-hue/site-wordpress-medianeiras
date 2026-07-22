import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { Loader2, Plus, Trash2, Heart, Calendar, Phone, Mail, User, LogOut, Gift, Bell, CheckCircle, Filter, AlertCircle } from "lucide-react";

export default function AdminDoacoes({ onLogout }) {
  const [causas, setCausas] = useState([]);
  const [doadores, setDoadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaAdmin, setAbaAdmin] = useState("tarefas"); // "tarefas", "causas" ou "doadores"

  // Filtro por causa na listagem de doadores
  const [filtroCausa, setFiltroCausa] = useState("todas");

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

  // Filtragem de doadores por causa
  const doadoresFiltrados = doadores.filter(d => {
    if (filtroCausa === "todas") return true;
    return d.causa_id?.toString() === filtroCausa || d.causa_nome === filtroCausa;
  });

  // GERAÇÃO DA CENTRAL DE TAREFAS AUTOMÁTICA
  // Verifica aniversários próximos ou no dia e lembretes de doação mensal
  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const diaAtual = hoje.getDate();

  const tarefas = doadores.map(d => {
    let alertas = [];
    
    // Verifica aniversário
    if (d.data_nascimento) {
      const [anoNasc, mesNasc, diaNasc] = d.data_nascimento.split("-").map(Number);
      if (mesNasc === mesAtual) {
        if (diaNasc === diaAtual) {
          alertas.push({ tipo: "aniversario_hoje", texto: `🎉 Hoje é aniversário de ${d.nome}! Enviar mensagem de felicitações.` });
        } else if (diaNasc === diaAtual + 1) {
          alertas.push({ tipo: "aniversario_amanha", texto: `🎁 Amanhã é aniversário de ${d.nome}. Prepare o cartão!` });
        }
      }
    }

    // Se for doador mensal, gera lembrete de renovação (simulando ciclo de 30 dias baseado na data de registro)
    if (d.tipo === "mensal" && d.data_registro) {
      const dataReg = new Date(d.data_registro);
      const diffDias = Math.floor((hoje - dataReg) / (1000 * 60 * 60 * 24)) % 30;
      if (diffDias >= 28) {
        alertas.push({ tipo: "renovacao_mensal", texto: `📞 Ligar ou enviar mensagem para ${d.nome}: ciclo mensal de doação (${d.causa_nome || 'Geral'}) vence em breve.` });
      }
    }

    return { ...d, alertas };
  }).filter(d => d.alertas.length > 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#005a8d]">Gestão de Doações e Causas</h1>
          <p className="text-gray-600 text-sm">Central inteligente de campanhas, apoiadores e tarefas de relacionamento.</p>
        </div>
        {onLogout && (
          <button onClick={onLogout} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-2xl font-bold text-sm border border-red-100">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        )}
      </div>

      {/* Abas internas com destaque para a Central de Tarefas */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setAbaAdmin("tarefas")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            abaAdmin === "tarefas" ? "bg-[#e31e24] text-white shadow-sm" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Bell className="w-4 h-4" /> Central de Tarefas ({tarefas.reduce((acc, t) => acc + t.alertas.length, 0)})
        </button>
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
          Base de Doadores ({doadores.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#005a8d]" /></div>
      ) : abaAdmin === "tarefas" ? (
        /* CENTRAL DE TAREFAS E LEMBRETES */
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="border-b pb-4 flex justify-between items-center">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#005a8d]">Lembretes e Contatos Pendentes</h3>
              <p className="text-xs text-gray-500 mt-0.5">Gerado automaticamente com base em aniversários do mês e renovações de doações mensais.</p>
            </div>
            <span className="bg-red-50 text-[#e31e24] font-bold text-xs px-3 py-1 rounded-full border border-red-100">
              {tarefas.reduce((acc, t) => acc + t.alertas.length, 0)} pendência(s)
            </span>
          </div>

          {tarefas.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-gray-700 text-sm">Tudo em dia por aqui!</h4>
              <p className="text-xs text-gray-500">Nenhum aniversário ou renovação de doação pendente para hoje.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tarefas.map(d => (
                <div key={d.id} className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{d.nome}</span>
                      <span className="text-[10px] font-bold uppercase bg-white px-2 py-0.5 rounded border text-[#005a8d]">
                        {d.tipo === 'mensal' ? 'Doador Mensal' : 'Apoiador'}
                      </span>
                    </div>
                    {d.alertas.map((alt, idx) => (
                      <p key={idx} className="text-xs font-semibold text-amber-900 flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" /> {alt.texto}
                      </p>
                    ))}
                    <p className="text-[11px] text-gray-500 pt-1">
                      Telefone: <strong className="text-gray-700">{d.telefone}</strong> | E-mail: <strong className="text-gray-700">{d.email}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`https://wa.me/55${d.telefone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(d.nome)},%20passando%20para%20agradecer%20seu%20carinho...`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" /> Enviar WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
        /* LISTA DE DOADORES COM FILTRO POR CAUSA */
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#005a8d]">Base de Apoiadores e Doadores</h3>
              <p className="text-xs text-gray-500 mt-0.5">Filtre os apoiadores por causa para campanhas direcionadas.</p>
            </div>

            {/* Filtro por Causa */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#005a8d]" />
              <select
                value={filtroCausa}
                onChange={e => setFiltroCausa(e.target.value)}
                className="p-2.5 rounded-xl border border-gray-300 bg-gray-50 text-xs font-bold text-gray-700 focus:bg-white focus:outline-none"
              >
                <option value="todas">Todas as Causas ({doadores.length})</option>
                {causas.map(c => (
                  <option key={c.id} value={c.id.toString()}>{c.titulo}</option>
                ))}
              </select>
            </div>
          </div>

          {doadoresFiltrados.length === 0 ? (
            <p className="text-center py-16 text-gray-400 text-sm">Nenhum doador encontrado para este filtro.</p>
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
                  {doadoresFiltrados.map(d => (
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
