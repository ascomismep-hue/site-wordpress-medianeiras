import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

export default function NewsCard({ news }) {
  if (!news) return null;
  const d = news.published_date ? new Date(news.published_date + "T00:00:00") : null;
  const dateStr = d ? d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" }) : "";

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-[#c5a059]/15 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
      {news.image_url ? (
        <div className="aspect-[16/10] overflow-hidden bg-[#f8f9fa]">
          <img src={news.image_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="aspect-[16/10] bg-gradient-to-br from-[#c5a059]/15 to-[#e31e24]/15 flex items-center justify-center">
          <CalendarDays className="w-10 h-10 text-[#c5a059]/40" />
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        {news.category && <span className="text-[10px] font-semibold uppercase tracking-wider text-[#e31e24] mb-2">{news.category}</span>}
        <h3 className="font-serif font-bold text-[#005a8d] leading-snug group-hover:text-[#e31e24] transition-colors">{news.title}</h3>
        {news.content && <p className="text-sm text-gray-600 mt-2 line-clamp-3 flex-1">{news.content}</p>}
        {dateStr && <div className="text-xs text-gray-400 mt-3">{dateStr}</div>}
      </div>
    </article>
  );
}
