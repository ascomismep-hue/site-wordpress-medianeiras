import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail, MapPin, Globe, ChevronDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import FloatingDonation from "./FloatingDonation";

const NAV = [
  { to: "/", label: "Início", end: true },
  { label: "Quem Somos", to: "/quem-somos", children: [
    { to: "/quem-somos", label: "Nossa História" },
    { to: "/madres", label: "Madres Superioras" },
    { to: "/irmas", label: "Irmãs (Anuário)" },
    { to: "/dom-campelo", label: "Devoção a Dom Campelo" },
  ]},
  { to: "/agenda", label: "Agenda" },
  { to: "/vocacional", label: "Vocacional" },
  { to: "/obras-e-missoes", label: "Obras e Missões" },
  { label: "Mídia", children: [
    { to: "/galeria", label: "Galeria de Fotos e Vídeos" },
    { to: "/downloads", label: "Downloads" },
  ]},
  { to: "/contato", label: "Contato" },
];

function isPathActive(pathname, to) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(to + "/");
}

function Emblem({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Yellow cross (background) */}
      <path d="M24 7 V40 M16 15 H32" stroke="#c5a059" strokeWidth="3.4" strokeLinecap="round" />
      {/* Blue globe arcs (foreground frame) */}
      <path d="M8 30c4 5 10 8 16 8s12-3 16-8" stroke="#005a8d" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M6.5 34c4.6 5.6 10.9 8.5 17.5 8.5s12.9-2.9 17.5-8.5" stroke="#005a8d" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M12 18c2.5-3 7-4.5 12-4.5s9.5 1.5 12 4.5" stroke="#005a8d" strokeWidth="2.4" strokeLinecap="round" />
      {/* Red stylized dove (foreground, facing right) */}
      <path d="M16 25c1.5-2.4 4-2.6 6-1.2c1.4 1 2.7 1 4 .2c2-1.2 3.2-3 3.6-5.2c.6 3.2-.4 6.2-2.6 8.2c-1.8 1.6-4.3 2.2-7 1.6c-2.4-.5-3.8-.6-5.6.2c-1 .5-1.6 1.2-2 2.2c-.3-2.4 .6-4.4 1.6-6z" fill="#e31e24" />
      <path d="M28 19c.5.3 .8 .9 .7 1.5c-.1 .6-.6 1-1.2 1c.2-.8 .2-1.6 .5-2.5z" fill="#fff" />
      <circle cx="26.2" cy="20.2" r="0.55" fill="#e31e24" />
    </svg>
  );
}

function Logo({ white }) {
  return (
    <Link to="/" className="flex items-center group shrink-0">
      <img
        src="https://media.base44.com/images/public/6a3ed5cd85189f9802126f41/4860547b3_Cpia_de_segurana_de_CAPA.png"
        alt="Instituto Religioso das Medianeiras da Paz - IMPAZ"
        className={`h-12 sm:h-14 w-auto rounded-lg ${white ? "brightness-0 invert" : ""}`}
      />
    </Link>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9c1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/>
    </svg>
  );
}
function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
    </svg>
  );
}

function MobileDropdown({ item }) {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  useEffect(() => { setExpanded(false); }, [location.pathname]);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${isPathActive(location.pathname, item.to) ? "text-[#e31e24] bg-[#e31e24]/10" : "text-[#005a8d]"}`}
      >
        {item.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div className="ml-3 pl-3 border-l border-[#c5a059]/15 mt-1 space-y-1">
          {item.children.map(child => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm ${isActive ? "text-[#e31e24] bg-[#e31e24]/5 font-semibold" : "text-[#005a8d]"}`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo />
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="relative group">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        isActive ? "text-[#e31e24] bg-[#e31e24]/10" : "text-[#005a8d] hover:text-[#e31e24] hover:bg-[#e31e24]/10"
                      }`
                    }
                  >
                    {item.label}
                    <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform" />
                  </NavLink>
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-white rounded-xl shadow-xl ring-1 ring-[#c5a059]/15 py-2 min-w-[220px]">
                      {item.children.map(child => (
                        <NavLink key={child.to} to={child.to} className={({ isActive }) => `block px-4 py-2.5 text-sm font-medium ${isActive ? "text-[#e31e24] bg-[#e31e24]/5" : "text-[#005a8d] hover:bg-[#e31e24]/5 hover:text-[#e31e24]"}`}>
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive ? "text-[#e31e24] bg-[#e31e24]/10" : "text-[#005a8d] hover:text-[#e31e24] hover:bg-[#e31e24]/10"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
            <Link to="/admin" className="ml-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-[#005a8d] hover:bg-[#003f66] transition-colors">
              Área Restrita
            </Link>
          </nav>
          <button className="lg:hidden p-2 text-[#005a8d]" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-[#c5a059]/15 bg-white">
          <nav className="px-4 py-4 flex flex-col gap-1">
            {NAV.map((item) =>
              item.children ? (
                <MobileDropdown key={item.label} item={item} />
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium ${isActive ? "text-[#e31e24] bg-[#e31e24]/10" : "text-[#005a8d]"}`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
            <Link to="/admin" className="mt-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#005a8d] text-center">
              Área Restrita
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer({ config }) {
  return (
    <footer className="bg-[#005a8d] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Logo white />
            <p className="mt-4 text-sm text-white/80 max-w-md leading-relaxed">
              Instituto Religioso das Medianeiras da Paz — consagradas à paz, à oração e ao serviço dos irmãos.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><FacebookIcon className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><InstagramIcon className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-serif text-base font-bold mb-4 text-[#c5a059]">Navegação</h4>
            <ul className="space-y-2 text-sm">
              {NAV.filter(n => !n.end).map(n => (
                <li key={n.to}>
                  <Link to={n.to} className="text-white/80 hover:text-white">{n.label}</Link>
                  {n.children && (
                    <ul className="ml-3 mt-1 space-y-1">
                      {n.children.map(c => <li key={c.to}><Link to={c.to} className="text-white/60 text-xs hover:text-white">{c.label}</Link></li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-base font-bold mb-4 text-[#c5a059]">Casa Mãe</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#c5a059]" />{config?.endereco || "Endereço da Casa Mãe"}</li>
              <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 shrink-0 text-[#c5a059]" />{config?.telefone || "(00) 0000-0000"}</li>
              <li className="flex gap-2"><Mail className="w-4 h-4 mt-0.5 shrink-0 text-[#c5a059]" />{config?.email || "contato@impaz.org"}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/15 mt-10 pt-6 text-center text-xs text-white/60">
          © {new Date().getFullYear()} Instituto Religioso das Medianeiras da Paz (IMPAZ). Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

export { Logo, Emblem };

export default function PublicLayout() {
  const [config, setConfig] = useState({});
  useEffect(() => {
    base44.entities.SiteConfig.list().then(items => {
      const map = {};
      items.forEach(i => { map[i.key] = i.value; });
      setConfig(map);
    }).catch(() => {});
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <FloatingDonation />
      <Footer config={config} />
    </div>
  );
}
