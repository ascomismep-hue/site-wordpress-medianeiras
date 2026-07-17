import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';

// Layouts
import PublicLayout from '@/components/PublicLayout';
import AdminLayout from '@/components/AdminLayout';

// Páginas Públicas
import Home from '@/pages/Home';
import QuemSomos from '@/pages/QuemSomos';
import Agenda from '@/pages/Agenda';
import Vocacional from '@/pages/Vocacional';
import ObrasMissoes from '@/pages/ObrasMissoes';
import Contato from '@/pages/Contato';
import Galeria from '@/pages/Galeria';
import Downloads from '@/pages/Downloads';
import Madres from '@/pages/Madres';
import Irmas from '@/pages/Irmas';
import Doacao from '@/pages/Doacao';
import DomCampelo from '@/pages/DomCampelo';

// Páginas Admin
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminAgenda from '@/pages/admin/AdminAgenda';
import AdminNoticias from '@/pages/admin/AdminNoticias';
import AdminMensagens from '@/pages/admin/AdminMensagens';
import AdminConteudo from '@/pages/admin/AdminConteudo';
import AdminObras from '@/pages/admin/AdminObras';
import AdminConfig from '@/pages/admin/AdminConfig';
import AdminUsuarios from '@/pages/admin/AdminUsuarios';
import AdminBanners from '@/pages/admin/AdminBanners';
import AdminGaleria from '@/pages/admin/AdminGaleria';
import AdminDownloads from '@/pages/admin/AdminDownloads';
import AdminIrmas from '@/pages/admin/AdminIrmas';
import AdminMadres from '@/pages/admin/AdminMadres';
import AdminDoacoes from '@/pages/admin/AdminDoacoes';

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useAuth();

  // Exibe loading enquanto o Supabase verifica a sessão inicial
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-8 h-8 border-4 border-[#c5a059]/30 border-t-[#c5a059] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/vocacional" element={<Vocacional />} />
        <Route path="/obras-e-missoes" element={<ObrasMissoes />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/madres" element={<Madres />} />
        <Route path="/irmas" element={<Irmas />} />
        <Route path="/doacao" element={<Doacao />} />
        <Route path="/dom-campelo" element={<DomCampelo />} />
      </Route>

      {/* Rotas Administrativas */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="conteudo" element={<AdminConteudo />} />
        <Route path="agenda" element={<AdminAgenda />} />
        <Route path="noticias" element={<AdminNoticias />} />
        <Route path="mensagens" element={<AdminMensagens />} />
        <Route path="obras" element={<AdminObras />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="galeria" element={<AdminGaleria />} />
        <Route path="downloads" element={<AdminDownloads />} />
        <Route path="irmas" element={<AdminIrmas />} />
        <Route path="madres" element={<AdminMadres />} />
        <Route path="doacoes" element={<AdminDoacoes />} />
        <Route path="config" element={<AdminConfig />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
      </Route>
      
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}
