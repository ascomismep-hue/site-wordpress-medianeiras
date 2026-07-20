import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Link } from "react-router-dom";
import { CalendarDays, Newspaper, Heart, Mail, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, news: 0, prayers: 0, vocations: 0, newMessages: 0 });
  const [recentPrayers, setRecentPrayers] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      // Carregando todas as contagens em paralelo para melhor performance
      const [
        { count: eventsCount },
        { count: newsCount },
        { data: prayers, count: prayersCount },
        { data: vocations, count: vocationsCount }
      ] = await Promise.all([
        supabase.from("agenda_events").select("*", { count: "exact", head: true }),
        supabase.from("news").select("*", { count: "exact", head: true }), // Certifique-se de que a tabela se chama 'news'
        supabase.from("prayer_requests").select("*", { count: "exact" }),
        supabase.from("vocation_forms").select("*", { count: "exact" })
      ]);

      const prayersList = prayers || [];
      const vocationsList = vocations || [];

      setStats({
        events: eventsCount || 0,
        news: newsCount || 0,
        prayers: prayersCount || 0,
        vocations: vocationsCount || 0,
        newMessages: 
          prayersList.filter(p => p.status === "new").length + 
          vocationsList.filter(v => v.status === "new").length,
      });

      setRecentPrayers(prayersList.slice(0, 5));
    }
    loadDashboard();
  }, []);

  const cards = [
    { label: "Compromissos", value: stats.events, icon: CalendarDays, color: "#F1B434", link: "/admin/agenda" },
    { label: "Notícias", value: stats.news, icon: Newspaper, color: "#5594C5", link: "/admin/noticias" },
    { label: "Pedidos de Oração", value: stats.prayers, icon: Heart, color: "#F25244", link: "/admin/mensagens" },
    { label: "Contatos Vocacionais", value: stats.vocations, icon: Mail, color: "#8e44ad", link: "/admin/mensagens" },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#5594C5] mb-2">Painel</h1>
      <p className="text-gray-500 mb-8">Resumo geral do site do IMPAZ.</p>

      {/* Alerta de novas mensagens */}
      {stats.newMessages > 0 && (
        <div className="mb-8 p-4 rounded-xl bg-[#F25244]/10 border border-[#F25244]/20 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-[#F25244]" />
          <p className="text-sm text-[#F25244] font-medium">{stats.newMessages} nova(s) mensagem(ns) aguardando resposta.</p>
          <Link to="/admin/mensagens" className="ml-auto text-sm font-semibold text-[#F25244] hover:underline">Ver mensagens</Link>
        </div>
      )}

      {/* Cards de estatísticas */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(c => (
          <Link key={c.label} to={c.link} className="bg-white rounded-2xl border border-[#F1B434]/15 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${c.color}18` }}>
              <c.icon className="w-6 h-6" style={{ color: c.color }} />
            </div>
            <div className="text-3xl font-bold text-[#5594C5] font-serif">{c.value}</div>
            <div className="text-sm text-gray-500 mt-1">{c.label}</div>
          </Link>
        ))}
      </div>

      {/* Atalhos Rápidos e Lista de Orações (Mantém a estrutura original) */}
      {/* ... */}
    </div>
  );
}
