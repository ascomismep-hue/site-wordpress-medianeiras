import { Link, useLocation } from "react-router-dom";

export default function InstitucionalSubNav() {
  const location = useLocation();

  const links = [
    { name: "Sobre nós", path: "/institucional/sobre-nos" },
    { name: "Madres Gerais", path: "/institucional/madres-gerais" },
    { name: "Irmãs", path: "/institucional/irmas" },
    { name: "Memorial", path: "/institucional/memorial" },
    { name: "Causa Dom Campelo", path: "/institucional/causa-dom-campelo" },
  ];

  return (
    <div className="bg-[#002845] py-4 shadow-inner border-b border-[#c5a059]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center items-center gap-3 sm:gap-6">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm sm:text-base font-medium px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#c5a059] text-white shadow-md"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
