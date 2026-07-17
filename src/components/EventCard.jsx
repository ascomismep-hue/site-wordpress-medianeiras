import { CalendarDays, Clock, MapPin } from "lucide-react";

export default function EventCard({ event, compact = false }) {
  if (!event) return null;
  const d = event.event_date ? new Date(event.event_date + "T00:00:00") : null;
  const day = d ? String(d.getDate()).padStart(2, "0") : "--";
  const month = d ? d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "") : "";
  const isMadre = event.agenda_type === "madre";
  const accent = isMadre ? "#c5a059" : "#e31e24";
  const label = isMadre ? "Agenda da Madre" : "Agenda Geral";

  return (
    <article className="group flex gap-4 bg-white rounded-2xl border border-[#c5a059]/15 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <div className="shrink-0 w-14 h-16 rounded-xl flex flex-col items-center justify-center text-white" style={{ backgroundColor: accent }}>
        <span className="text-xl font-bold leading-none">{day}</span>
        <span className="text-[10px] uppercase tracking-wider mt-1">{month}</span>
      </div>
      <div className="min-w-0 flex-1">
        <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1" style={{ color: accent, backgroundColor: `${accent}14` }}>{label}</span>
        <h3 className="font-serif font-bold text-[#005a8d] leading-snug">{event.title}</h3>
        {!compact && event.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
          {event.event_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.event_time}</span>}
          {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>}
        </div>
      </div>
    </article>
  );
}
