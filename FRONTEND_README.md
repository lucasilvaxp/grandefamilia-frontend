# 🌐 Fashion Catalog Frontend - Next.js

Frontend do catálogo de moda "Loja A Grande Família" construído com Next.js 15, React 19 e Tailwind CSS 4.

## 📁 Estrutura do Projeto (Front-end apenas)

```
FRONTEND/ (raiz do repositório Next.js)
├── src/
│   ├── app/                    # App Router Next.js
│   │   ├── page.tsx           # Homepage (catálogo público)
│   │   ├── layout.tsx         # Layout raiz
│   │   ├── globals.css        # Estilos globais
│   │   ├── admin/             # Painel administrativo
│   │   │   ├── page.tsx       # Dashboard admin
│   │   │   └── login/
│   │   │       └── page.tsx   # Login admin
│   │   └── api/               # API Routes (proxy para FastAPI)
│   │       ├── products/
│   │       │   ├── route.ts   # GET /api/products
│   │       │   └── [id]/
│   │       │       └── route.ts  # GET/PUT/DELETE /api/products/:id
│   │       ├── categories/
│   │       │   └── route.ts   # GET /api/categories
│   │       └── admin/
│   │           └── login/
│   │               └── route.ts  # POST /api/admin/login
│   ├── components/            # Componentes React
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Filters.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductModal.tsx
│   │   ├── ShoppingCart.tsx
│   │   └── ui/                # Shadcn/UI components
│   ├── hooks/                 # React Hooks
│   │   └── use-cart.tsx       # Carrinho de cotação
│   ├── lib/                   # Utilidades
│   │   ├── api-config.ts      # Configuração API
│   │   ├── mock-data.ts       # Dados mockados (dev)
│   │   └── utils.ts
│   └── types/                 # TypeScript types
│       └── product.ts
├── public/                    # Assets estáticos
├── .env.local.example         # Exemplo de env vars
├── .gitignore
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## 🚀 Deploy no Vercel

### Pré-requisitos

- Backend FastAPI já deployado no Render
- URL do backend (ex: `https://fashion-catalog-api.onrender.com`)

### Passo 1: Preparar Repositório

1. **Criar repositório Git separado para o frontend**
   ```bash
   # Crie um novo repositório vazio no GitHub
   # Copie apenas os arquivos do frontend para ele
   
   git init
   git add .
   git commit -m "Initial Next.js frontend"
   git remote add origin <seu-repositorio-github-frontend>
   git push -u origin main
   ```

2. **Estrutura do repositório** (deve conter na raiz):
   ```
   ├── src/
   ├── public/
   ├── package.json
   ├── next.config.ts
   ├── tsconfig.json
   └── .gitignore
   ```

### Passo 2: Deploy no Vercel

1. **Acessar Vercel**
   - Vá para: https://vercel.com/
   - Faça login com GitHub

2. **Importar Repositório**
   - Clique em "Add New..." → "Project"
   - Selecione o repositório do frontend
   - Clique em "Import"

3. **Configurar Projeto**
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `.` (raiz do repositório)
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.next` (padrão)
   - **Install Command**: `npm install` (padrão)

4. **Adicionar Variável de Ambiente** (CRÍTICO)
   - Em "Environment Variables", adicione:
     ```
     NEXT_PUBLIC_FASTAPI_URL = https://fashion-catalog-api.onrender.com
     ```
   - ⚠️ **Importante**: Use a URL real do seu backend Render

5. **Deploy**
   - Clique em "Deploy"
   - Aguarde 2-3 minutos
   - URL do frontend: `https://seu-projeto.vercel.app`

### Passo 3: Atualizar CORS no Backend

Após o deploy, você precisa atualizar as configurações de CORS no backend:

1. **Acessar Render Dashboard**
2. **Selecionar o serviço FastAPI**
3. **Ir em Environment**
4. **Atualizar a variável `CORS_ORIGINS`**:
   ```
   CORS_ORIGINS = https://seu-projeto.vercel.app
   ```
5. **Salvar e aguardar redeploy**

## 🔧 Desenvolvimento Local

### Setup

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Editar `.env.local`:
   ```env
   NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000
   ```

3. **Iniciar servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acessar**
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin/login

## 🔗 Integração com Backend

### Como funciona

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Browser    │─────▶│  Next.js API │─────▶│   FastAPI    │
│  (Cliente)   │◀─────│   Routes     │◀─────│   Backend    │
└──────────────┘      └──────────────┘      └──────────────┘
```

### Configuração API

O arquivo `src/lib/api-config.ts` contém a URL base do backend:

```typescript
export const FASTAPI_BASE_URL = 
  process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
```

### Rotas de API (Proxy)

Todas as rotas em `src/app/api/*` fazem proxy para o FastAPI:

- `/api/products` → `https://backend.onrender.com/api/products`
- `/api/categories` → `https://backend.onrender.com/api/categories`

Isso evita problemas de CORS e mantém a URL da API consistente.

## 🎨 Customização

### Design System

O projeto usa um design system premium com tema escuro baseado na paleta da logo "A Grande Família":

- **Primary**: Golden/Bronze (`oklch(0.72 0.15 75)`)
- **Background**: Dark (`oklch(0.15 0.01 280)`)
- **WhatsApp**: Green (`oklch(0.55 0.18 145)`)

### Componentes UI

Utiliza **Shadcn/UI** para componentes reutilizáveis:

```bash
# Adicionar novos componentes
npx shadcn@latest add <component-name>
```

## 📱 Funcionalidades

### Catálogo Público (/)

- ✅ Grid de produtos responsivo
- ✅ Filtros laterais (Desktop) / Drawer (Mobile)
- ✅ Busca e paginação
- ✅ Modal de detalhes do produto
- ✅ Carrinho de cotação
- ✅ Botão WhatsApp com mensagem formatada

### Painel Administrativo (/admin)

- ✅ Login com autenticação
- ✅ Dashboard com métricas
- ✅ Gestão de produtos (CRUD)
- ✅ Upload de imagens
- ✅ Edição inline

## 🐛 Troubleshooting

### Erro: "Failed to fetch products"

**Causa**: Backend não está acessível ou CORS mal configurado

**Solução**:
1. Verifique se a URL do backend está correta em `.env.local`
2. Confirme que o backend está rodando
3. Verifique a variável `CORS_ORIGINS` no backend

### Erro: Build falha no Vercel

**Causa**: Dependências faltando ou erro de TypeScript

**Solução**:
1. Teste o build local: `npm run build`
2. Verifique logs do Vercel
3. Confirme que `package.json` tem todas as dependências

### Erro: "ENOENT: no such file or directory, lstat '.next/routes-manifest.json'"

**Causa**: Configuração de monorepo ou `outputFileTracingRoot`

**Solução**: ✅ Já corrigido! O `next.config.ts` foi limpo e não tem mais essa configuração.

### Erro: Images não carregam

**Causa**: Domínios de imagem não configurados

**Solução**: Verificar `next.config.ts` → `images.remotePatterns`

## 🔐 Segurança

- ✅ Credenciais de admin **não** expostas no código
- ✅ Variáveis de ambiente para URLs sensíveis
- ✅ CORS configurado apenas para domínios autorizados
- ✅ Validação de entrada em todos os formulários

## 📊 Performance

- ✅ Server Components para conteúdo estático
- ✅ Client Components apenas onde necessário
- ✅ Image optimization do Next.js
- ✅ Code splitting automático
- ✅ Lazy loading de componentes pesados

## 🌍 Responsividade

- ✅ Mobile-first design
- ✅ Breakpoints: 640px, 768px, 1024px, 1280px
- ✅ Grid adaptativo (1-4 colunas)
- ✅ Drawer de filtros em mobile
- ✅ Menu hamburguer em mobile

## 📝 Scripts

```bash
npm run dev      # Desenvolvimento local (port 3000)
npm run build    # Build para produção
npm run start    # Servidor de produção
npm run lint     # ESLint
```

## 🔗 Links Úteis

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev/)
- [Tailwind CSS 4 Docs](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Vercel Docs](https://vercel.com/docs)

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação
2. Verifique os logs do Vercel
3. Teste localmente primeiro

---

**Frontend pronto para produção no Vercel!** 🚀
