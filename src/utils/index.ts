/**
 * Converte um nome de página em uma URL amigável (slug)
 * Ex: "Quem Somos" -> "/quem-somos"
 */
export function createPageUrl(pageName: string): string {
  if (!pageName) return '/';
  
  return '/' + pageName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/[\s_-]+/g, '-'); // Substitui espaços ou múltiplos hífens por um único hífen
}

// Você pode adicionar outras funções utilitárias aqui no futuro
