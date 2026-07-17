# AGENTS.md

## Project Context
Este projeto foi migrado do Base44 para o **Supabase**. O código agora utiliza o SDK oficial do Supabase para autenticação e persistência de dados.

## Stack Técnica
- **Frontend**: React + Vite + Tailwind CSS.
- **Backend**: Supabase (Database, Auth, Storage).
- **Gerenciamento de Estado**: TanStack Query (React Query).

## Configuração Local
1. Crie um arquivo `.env` na raiz do projeto seguindo o modelo `.env.example`.
2. Adicione as variáveis:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Instale as dependências: `npm install`
4. Inicie o desenvolvimento: `npm run dev`

## Convenções
- **Autenticação**: Use o hook `useAuth()` para acessar o estado do usuário.
- **Banco de Dados**: As operações SQL devem ser feitas via `supabaseClient.js`.
- **Rotas**: Rotas administrativas são protegidas pelo componente `ProtectedRoute` e `AdminLayout`.
- **Segurança**: Nunca comite o arquivo `.env`. Use `.gitignore` para ignorá-lo.
