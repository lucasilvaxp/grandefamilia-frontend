# 🚀 Guia Completo de Deploy - Arquitetura Desacoplada

## 📋 Visão Geral

Este guia explica como fazer o deploy completo do catálogo de moda "Loja A Grande Família" em uma arquitetura **totalmente desacoplada** com:

- 🌐 **Front-end**: Next.js 15 no **Vercel**
- 🐍 **Back-end**: FastAPI no **Render**
- 🗄️ **Database**: MongoDB Atlas (gratuito)

---

## 📦 Estrutura de Repositórios Separados

### Repositório 1: FRONTEND (Next.js)

```
grandefamilia-frontend/  ← Repositório Git separado
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── types/
├── public/
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

### Repositório 2: BACKEND (FastAPI)

```
grandefamilia-backend/  ← Repositório Git separado
├── main.py
├── database.py
├── models.py
├── routes/
│   ├── __init__.py
│   ├── products.py
│   └── categories.py
├── requirements.txt
├── render.yaml
├── .env.example
└── README.md
```

---

## 🎯 Passo a Passo Completo

### FASE 1: Preparar Banco de Dados (MongoDB Atlas)

#### 1.1 Criar Conta e Cluster

1. **Acessar**: https://www.mongodb.com/cloud/atlas/register
2. **Criar conta gratuita**
3. **Criar novo cluster** (M0 Sandbox - Free)
   - Provider: AWS, GCP ou Azure
   - Region: Escolha a mais próxima (ex: São Paulo)
4. **Aguardar criação** (~3 minutos)

#### 1.2 Configurar Acesso

1. **Database Access**
   - Criar usuário admin
   - Username: `admin`
   - Password: Gerar senha forte (copiar e salvar)
   - Database User Privileges: Read and write to any database

2. **Network Access**
   - Add IP Address
   - **Opção 1 (Desenvolvimento)**: Allow access from anywhere (`0.0.0.0/0`)
   - **Opção 2 (Produção)**: Adicionar IPs do Render

3. **Obter Connection String**
   - Clicar em "Connect" no cluster
   - Escolher "Connect your application"
   - Copiar connection string:
     ```
     mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - **Substituir** `<password>` pela senha real do usuário

---

### FASE 2: Deploy do Back-end (FastAPI no Render)

#### 2.1 Preparar Repositório Backend

```bash
# Navegue até a pasta BACKEND do projeto atual
cd BACKEND

# Inicializar repositório Git
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "Initial FastAPI backend for Fashion Catalog"

# Criar repositório no GitHub
# Vá para https://github.com/new
# Nome sugerido: grandefamilia-backend
# Não inicialize com README

# Conectar ao GitHub
git remote add origin https://github.com/seu-usuario/grandefamilia-backend.git
git branch -M main
git push -u origin main
```

#### 2.2 Deploy no Render

1. **Criar conta**: https://render.com/
2. **New Web Service**
   - Conectar repositório `grandefamilia-backend`
   - Name: `fashion-catalog-api`
   - Region: Oregon (US West) ou Ohio (US East)
   - Branch: `main`
   - Root Directory: `.` (raiz)
   - Runtime: **Python 3**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Configurar Environment Variables** (CRÍTICO)
   ```
   MONGO_URL = mongodb+srv://admin:SENHA@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   MONGO_DB_NAME = fashion_catalog
   CORS_ORIGINS = http://localhost:3000
   ```
   ⚠️ **Substitua** `SENHA` e o cluster correto da sua connection string

4. **Create Web Service**
   - Aguardar deploy (~5 minutos)
   - URL gerada: `https://fashion-catalog-api.onrender.com` (copiar)

5. **Testar Backend**
   ```bash
   # Health check
   curl https://fashion-catalog-api.onrender.com/health
   
   # Deve retornar: {"status":"healthy","service":"fastapi-backend"}
   
   # Documentação interativa
   # Abrir no navegador: https://fashion-catalog-api.onrender.com/docs
   ```

#### 2.3 Seed inicial de dados (Opcional)

Acesse a documentação interativa (`/docs`) e crie:

1. **Categorias**:
   - POST `/api/categories`
   ```json
   {
     "name": "Feminino",
     "slug": "feminino",
     "subcategories": ["Blusas", "Calças", "Vestidos"]
   }
   ```

2. **Produtos de teste**:
   - POST `/api/products`
   ```json
   {
     "name": "Camiseta Feminina",
     "description": "Camiseta básica de algodão",
     "price": 39.90,
     "category": "Feminino",
     "brand": "Marca X",
     "sizes": ["P", "M", "G"],
     "colors": [{"name": "Branco", "hex": "#FFFFFF"}],
     "images": ["https://via.placeholder.com/400"],
     "stock": 50,
     "featured": true
   }
   ```

---

### FASE 3: Deploy do Front-end (Next.js no Vercel)

#### 3.1 Preparar Repositório Frontend

```bash
# Volte para a raiz do projeto
cd ..

# Copiar apenas arquivos do frontend para novo diretório
mkdir ../grandefamilia-frontend
cp -r src public package.json next.config.ts tsconfig.json .gitignore ../grandefamilia-frontend/

# Navegar para o novo diretório
cd ../grandefamilia-frontend

# Inicializar repositório Git
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "Initial Next.js frontend for Fashion Catalog"

# Criar repositório no GitHub
# Vá para https://github.com/new
# Nome sugerido: grandefamilia-frontend
# Não inicialize com README

# Conectar ao GitHub
git remote add origin https://github.com/seu-usuario/grandefamilia-frontend.git
git branch -M main
git push -u origin main
```

#### 3.2 Deploy no Vercel

1. **Acessar**: https://vercel.com/
2. **Login com GitHub**
3. **Add New Project**
   - Import repository: `grandefamilia-frontend`
   - Framework Preset: Next.js (detectado automaticamente)
   - Root Directory: `.` (deixar vazio)
   - Build Command: `npm run build` (padrão)
   - Output Directory: `.next` (padrão)

4. **Configure Environment Variables** (CRÍTICO)
   ```
   NEXT_PUBLIC_FASTAPI_URL = https://fashion-catalog-api.onrender.com
   ```
   ⚠️ **Substituir** pela URL real do backend Render

5. **Deploy**
   - Clicar em "Deploy"
   - Aguardar build (~2-3 minutos)
   - URL gerada: `https://grandefamilia.vercel.app` (copiar)

6. **Testar Frontend**
   - Abrir: `https://grandefamilia.vercel.app`
   - Verificar se produtos aparecem
   - Testar filtros e busca

---

### FASE 4: Conectar Front-end e Back-end (CORS)

#### 4.1 Atualizar CORS no Backend

1. **Acessar Render Dashboard**
2. **Selecionar serviço**: `fashion-catalog-api`
3. **Environment → Edit**
4. **Atualizar variável**:
   ```
   CORS_ORIGINS = https://grandefamilia.vercel.app
   ```
5. **Save Changes**
6. **Aguardar redeploy** (~2 minutos)

#### 4.2 Testar Integração

```bash
# Abrir frontend no navegador
https://grandefamilia.vercel.app

# Abrir DevTools (F12) → Network
# Navegar pelo catálogo
# Verificar requisições:
# - /api/products → Status 200
# - /api/categories → Status 200
```

---

## ✅ Checklist Final

### Backend (Render)

- [ ] Repositório Git criado e pushado
- [ ] Deploy no Render realizado
- [ ] Variável `MONGO_URL` configurada corretamente
- [ ] Variável `CORS_ORIGINS` com URL do Vercel
- [ ] Health check funcionando: `/health`
- [ ] Documentação acessível: `/docs`
- [ ] Categorias e produtos de teste criados

### Frontend (Vercel)

- [ ] Repositório Git separado criado
- [ ] Deploy no Vercel realizado
- [ ] Variável `NEXT_PUBLIC_FASTAPI_URL` configurada
- [ ] Homepage carrega produtos do backend
- [ ] Filtros funcionam corretamente
- [ ] Carrinho de cotação funcional
- [ ] Painel admin acessível em `/admin`

### Integração

- [ ] CORS configurado com URL Vercel
- [ ] Requisições API retornam Status 200
- [ ] Sem erros no console do navegador
- [ ] Upload de imagens funciona (admin)

---

## 🐛 Resolução de Problemas

### Erro: "Failed to fetch products"

**Sintoma**: Frontend não carrega produtos

**Causas possíveis**:
1. Backend não está rodando
2. CORS mal configurado
3. URL do backend incorreta

**Soluções**:
```bash
# 1. Testar backend diretamente
curl https://fashion-catalog-api.onrender.com/health

# 2. Verificar CORS no Render
# Environment → CORS_ORIGINS deve conter URL Vercel

# 3. Verificar variável no Vercel
# Settings → Environment Variables → NEXT_PUBLIC_FASTAPI_URL
```

### Erro: "ENOENT: no such file or directory, lstat '.next/routes-manifest.json'"

**Sintoma**: Build falha no Vercel

**Causa**: ✅ **JÁ CORRIGIDO** - `next.config.ts` limpo sem `outputFileTracingRoot`

**Verificação**:
```typescript
// next.config.ts deve estar assim:
const nextConfig: NextConfig = {
  images: { remotePatterns: [...] },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true }
};
// SEM outputFileTracingRoot ou configuração de monorepo
```

### Erro: KeyError: 'MONGO_URL' no Render

**Sintoma**: Backend falha ao iniciar

**Causa**: Variável de ambiente não configurada

**Solução**:
1. Render Dashboard → fashion-catalog-api
2. Environment → Add Environment Variable
3. Key: `MONGO_URL`
4. Value: Connection string do MongoDB
5. Save

### Erro: CORS policy no Frontend

**Sintoma**: Console mostra erro de CORS

**Solução**:
```bash
# No Render, atualizar CORS_ORIGINS
CORS_ORIGINS = https://grandefamilia.vercel.app,https://grandefamilia.vercel.app
```

### Free Tier do Render hiberna após 15 minutos

**Sintoma**: Primeira requisição demora ~30 segundos

**Causa**: Free tier do Render desliga após inatividade

**Soluções**:
1. **Aceitar demora**: Normal para free tier
2. **Usar cron job**: Ping a cada 10 minutos (ex: cron-job.org)
3. **Upgrade para pago**: $7/mês para manter sempre ativo

---

## 📊 Arquitetura Final

```
┌─────────────────────────────────────────────────────────┐
│                    INTERNET/BROWSER                      │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │    Next.js Frontend (Vercel)      │
        │  https://grandefamilia.vercel.app │
        │                                    │
        │  - Homepage (catálogo público)     │
        │  - Admin Panel                     │
        │  - API Routes (proxy)              │
        └───────────────────────────────────┘
                            │
                            │ HTTP Requests
                            ▼
        ┌───────────────────────────────────┐
        │   FastAPI Backend (Render)        │
        │  https://fashion-catalog-api...   │
        │                                    │
        │  - REST API (CRUD produtos)        │
        │  - Filtros e busca                 │
        │  - Paginação                       │
        └───────────────────────────────────┘
                            │
                            │ MongoDB Driver
                            ▼
        ┌───────────────────────────────────┐
        │  MongoDB Atlas (Cloud)            │
        │                                    │
        │  - Produtos Collection             │
        │  - Categories Collection           │
        │  - Indexes otimizados              │
        └───────────────────────────────────┘
```

---

## 🔐 Segurança

### Variáveis de Ambiente

**NUNCA commitar**:
- `.env`
- `.env.local`
- Connection strings
- Senhas

**Sempre usar**:
- `.env.example` (template)
- Environment variables no Render/Vercel
- Secrets management

### CORS

**Desenvolvimento**:
```
CORS_ORIGINS = http://localhost:3000
```

**Produção**:
```
CORS_ORIGINS = https://grandefamilia.vercel.app
```

### MongoDB

- Usar Database Users dedicados
- Limitar IPs quando possível
- Habilitar auditing (planos pagos)

---

## 📈 Performance

### Frontend (Vercel)

- ✅ CDN global automático
- ✅ Cache de assets
- ✅ Image optimization
- ✅ Code splitting

### Backend (Render)

- ✅ Container isolado
- ✅ Auto-scaling (planos pagos)
- ✅ Health checks
- ✅ Zero downtime deploys

### Database (MongoDB Atlas)

- ✅ Indexes criados automaticamente
- ✅ Connection pooling
- ✅ Query optimization
- ✅ Backups automáticos

---

## 💰 Custos

| Serviço | Free Tier | Limitações | Upgrade |
|---------|-----------|------------|---------|
| **Vercel** | 100GB bandwidth | Comercial use OK | $20/mês |
| **Render** | 750h/mês | Hiberna após 15min | $7/mês |
| **MongoDB Atlas** | 512MB storage | Sem backups | $9/mês |

**Total Free**: $0/mês (com limitações)
**Total Pago**: ~$36/mês (sem limitações)

---

## 🎉 Próximos Passos

Após deploy completo:

1. **Domínio Customizado**
   - Vercel: Settings → Domains → Add domain
   - Render: Settings → Custom Domain

2. **SSL Automático**
   - ✅ Vercel: Automático
   - ✅ Render: Automático

3. **Monitoramento**
   - Vercel Analytics
   - Render Metrics
   - MongoDB Atlas Monitoring

4. **Backup e Disaster Recovery**
   - MongoDB Atlas: Automated backups (plano pago)
   - Código: Sempre em Git

5. **CI/CD**
   - ✅ Vercel: Deploy automático no push
   - ✅ Render: Deploy automático no push

---

## 📞 Suporte

**Documentação Oficial**:
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

**Comunidades**:
- [Next.js Discord](https://discord.gg/nextjs)
- [FastAPI Discord](https://discord.gg/fastapi)

---

## ✅ Deploy Completo!

Seu catálogo de moda está agora em **produção** com arquitetura **100% desacoplada**:

- ✅ Frontend Next.js no Vercel
- ✅ Backend FastAPI no Render
- ✅ Database MongoDB Atlas
- ✅ Sem conflitos de monorepo
- ✅ Sem erros de dependências
- ✅ CORS configurado corretamente
- ✅ Pronto para escalar

**URLs Finais**:
- Frontend: `https://grandefamilia.vercel.app`
- Backend: `https://fashion-catalog-api.onrender.com`
- API Docs: `https://fashion-catalog-api.onrender.com/docs`

🚀 **Projeto lançado e pronto para usar!**
