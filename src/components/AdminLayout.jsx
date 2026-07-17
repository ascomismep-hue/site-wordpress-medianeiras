import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, CalendarDays, Newspaper, MessagesSquare, Settings, Users, LogOut, Menu, X, Image, Images, FileDown, Crown, Heart } from "lucide-react";
import { base44 } from "@/api/base44Client";

const NAV = [
  { to: "/admin", label: "Painel", icon: LayoutDashboard, end: true, roles: ["admin", "publisher"] },
  { to: "/admin/conteudo", label: "Conteúdo das Páginas", icon: FileText, roles: ["admin"] },
  { to: "/admin/agenda", label: "Agendas", icon: CalendarDays, roles: ["admin", "publisher"] },
  { to: "/admin/noticias", label: "Notícias e Eventos", icon: Newspaper, roles: ["admin", "publisher"] },
  { to: "/admin/banners", label: "Banners da Home", icon: Image, roles: ["admin", "publisher"] },
  { to: "/admin/galeria", label: "Galeria de Mídias", icon: Images, roles: ["admin", "publisher"] },
  { to: "/admin/downloads", label: "Arquivos / Downloads", icon: FileDown, roles: ["admin"] },
  { to: "/admin/irmas", label: "Irmãs (Anuário)", icon: Users, roles: ["admin"] },
  { to: "/admin/madres", label: "Galeria das Madres", icon: Crown, roles: ["admin"] },
  { to: "/admin/doacoes", label: "Doações & Lembretes", icon: Heart, roles: ["admin"] },
  { to: "/admin/mensagens", label: "Mensagens Recebidas", icon: MessagesSquare, roles: ["admin"] },
  { to: "/admin/obras", label: "Obras e Comunidades", icon: Settings, roles: ["admin"] },
  { to: "/admin/config", label: "Configurações Gerais", icon: Settings, roles: ["admin"] },
  { to: "/admin/usuarios", label: "Usuários", icon: Users, roles: ["admin"] },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me()
      .then(u => setUser(u))
      .catch(() => { window.location.href = "/admin/login"; })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const role = user?.role || "user";
  const items = NAV.filter(n => n.roles.includes(role));

  const logout = async () => {
    await base44.auth.logout("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="w-8 h-8 border-4 border-[#c5a059]/30 border-t-[#c5a059] rounded-full animate-spin" />
      </div>
    );
  }

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-[#c5a059]/15">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white ring-2 ring-[#c5a059] flex items-center justify-center">
            <span className="font-serif font-bold text-sm text-[#005a8d]">IM</span>
          </div>
          <div>
            <div className="font-serif font-bold text-[#005a8d]">IMPAZ</div>
            <div className="text-[10px] uppercase tracking-wider text-[#c5a059]">Painel Admin</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? "bg-[#005a8d] text-white shadow-sm" : "text-[#005a8d] hover:bg-[#005a8d]/10"
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-[#c5a059]/15">
        <div className="px-3 py-2 mb-2">
          <div className="text-xs text-gray-500">Conectado como</div>
          <div className="text-sm font-semibold text-[#005a8d] truncate">{user?.email}</div>
          <div className="text-[10px] uppercase tracking-wider text-[#c5a059] mt-0.5">{role}</div>
        </div>
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#005a8d] hover:bg-[#005a8d]/10">
          <LayoutDashboard className="w-4 h-4" /> Ver Site
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#e31e24] hover:bg-[#e31e24]/10">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 bg-white border-r border-[#c5a059]/15 flex-col fixed inset-y-0">
        {SidebarContent}
      </aside>
      {/* Mobile drawer */}
      {open && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 flex flex-col">
            {SidebarContent}
          </aside>
        </>
      )}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between px-4 h-16 bg-white border-b border-[#c5a059]/15 sticky top-0 z-30">
          <button onClick={() => setOpen(true)} className="p-2 text-[#005a8d]"><Menu className="w-6 h-6" /></button>
          <span className="font-serif font-bold text-[#005a8d]">Painel IMPAZ</span>
          <button onClick={() => setOpen(true)} className="invisible"><Menu className="w-6 h-6" /></button>
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
