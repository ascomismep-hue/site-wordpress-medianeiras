import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail, MapPin, ChevronDown } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
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

export function isPathActive(pathname, to) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(to + "/");
}

export function Logo({ white }) {
  return (
    <Link to="/" className="flex items-center group shrink-0">
      {/* ALTERE O SRC ABAIXO PARA O CAMINHO DA SUA IMAGEM LOCAL OU OUTRO HOST SEGURO */}
      <img
        src="/logo.png" 
        alt="Instituto Religioso das Medianeiras da Paz - IMPAZ"
        className={`h-12 sm:h-14 w-auto rounded-lg ${white ? "brightness-0 invert" : ""}`}
      />
    </Link>
  );
}

export function FacebookIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9c1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/>
    </svg>
  );
}

export function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Logo />
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
             /* ... (Mantenha o resto da lógica do seu Header original aqui) ... */
             <NavLink key={item.to || item.label} to={item.to} className="px-4 py-2 text-sm text-[#005a8d]">{item.label}</NavLink>
          ))}
          <Link to="/admin" className="ml-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-[#005a8d]">Área Restrita</Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer({ config }) {
  return (
    <footer className="bg-[#005a8d] text-white mt-20 p-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        <div><Logo white /><p className="mt-4 text-sm">Instituto Religioso das Medianeiras da Paz.</p></div>
        <div><h4 className="font-bold text-[#c5a059]">Casa Mãe</h4>
          <ul className="text-sm space-y-2">
            <li><MapPin className="inline w-4 h-4 mr-2" />{config?.endereco || "Carregando..."}</li>
            <li><Phone className="inline w-4 h-4 mr-2" />{config?.telefone || "..."}</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout() {
  const [config, setConfig] = useState({});

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from('site_config').select('key, value');
      if (data) {
        const map = {};
        data.forEach(i => { map[i.key] = i.value; });
        setConfig(map);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <Header />
      <main className="flex-1"><Outlet /></main>
      <FloatingDonation />
      <Footer config={config} />
    </div>
  );
}
