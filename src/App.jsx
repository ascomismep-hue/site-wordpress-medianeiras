import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound.jsx';
import { AuthProvider, useAuth } from '@/lib/AuthContext.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// Layouts
import PublicLayout from '@/components/PublicLayout.jsx';
import AdminLayout from '@/components/AdminLayout.jsx';

// Páginas Públicas - Certifique-se que os arquivos na pasta 'pages' têm exatamente estes nomes
import Home from '@/pages/Home.jsx';
import QuemSomos from '@/pages/QuemSomos.jsx';
import Agenda from '@/pages/Agenda.jsx';
import Vocacional from '@/pages/Vocacional.jsx';
import ObrasMissoes from '@/pages/ObrasMissoes.jsx';
import Contato from '@/pages/Contato.jsx';
import Galeria from '@/pages/Galeria.jsx';
import Downloads from '@/pages/Downloads.jsx';
import Madres from '@/pages/Madres.jsx';
import Irmas from '@/pages/Irmas.jsx';
import Doacao from '@/pages/Doacao.jsx';
import DomCampelo from '@/pages/DomCampelo.jsx';

// Páginas Admin - Certifique-se que estão dentro de 'pages/admin/'
import AdminLogin from '@/pages/admin/AdminLogin.jsx';
import AdminDashboard from '@/pages/admin/AdminDashboard.jsx';
import AdminAgenda from '@/pages/admin/AdminAgenda.jsx';
import AdminNoticias from '@/pages/admin/AdminNoticias.jsx';
import AdminMensagens from '@/pages/admin/AdminMensagens.jsx';
import AdminConteudo from '@/pages/admin/AdminConteudo.jsx';
import AdminObras from '@/pages/admin/AdminObras.jsx';
import AdminConfig from '@/pages/admin/AdminConfig.jsx';
import AdminUsuarios from '@/pages/admin/AdminUsuarios.jsx';
import AdminBanners from '@/pages/admin/AdminBanners.jsx';
import AdminGaleria from '@/pages/admin/AdminGaleria.jsx';
import AdminDownloads from '@/pages/admin/AdminDownloads.jsx';
import AdminIrmas from '@/pages/admin/AdminIrmas.jsx';
import AdminMadres from '@/pages/admin/AdminMadres.jsx';
import AdminDoacoes from '@/pages/admin/AdminDoacoes.jsx';

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-8 h-8 border-4 border-[#c5a059]/30 border-t-[#c5a059] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
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
