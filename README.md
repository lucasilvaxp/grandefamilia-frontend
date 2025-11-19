# 🛍️ Fashion Catalog - Catálogo de Moda

Sistema completo de catálogo de moda e-commerce construído com **Next.js 15**, **React**, **TypeScript**, **Tailwind CSS** e **Shadcn/UI**, com backend preparado para integração com **FastAPI** e **MongoDB**.

## ✨ Características

### Frontend (Next.js)
- 🎨 **UI Moderna**: Interface responsiva e elegante com Shadcn/UI e Tailwind CSS
- 🛒 **Carrinho de Compras**: Sistema de carrinho com localStorage
- 🔍 **Busca e Filtros**: Filtragem avançada por categoria, marca, preço, cores e tamanhos
- 📱 **Responsivo**: Design adaptável para desktop, tablet e mobile
- ⚡ **Performance**: Server-Side Rendering (SSR) e otimizações do Next.js 15
- 🎯 **Admin Panel**: Painel administrativo completo para gerenciar produtos

### Backend (FastAPI - Preparado)
- 🚀 **API RESTful**: Endpoints completos para CRUD de produtos
- 🗄️ **MongoDB**: Integração assíncrona com Motor
- 🔄 **Paginação**: Sistema de paginação eficiente
- 🔎 **Busca Avançada**: Filtros e ordenação de produtos
- 📊 **Validação**: Schemas Pydantic para validação de dados

## 🚀 Como Executar

### Opção 1: Modo Development (Com Mock Data)

```bash
# 1. Instalar dependências
bun install

# 2. Iniciar servidor de desenvolvimento
bun dev

# Acesse: http://localhost:3000
```

O projeto já vem configurado com dados mock e funcionará imediatamente!

### Opção 2: Com FastAPI Backend

Veja `FASTAPI_INTEGRATION.md` para instruções completas de setup do backend.

```bash
# 1. Atualizar .env.local
USE_MOCK_DATA=false
NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000

# 2. Iniciar Next.js
bun dev
```

## 📖 Funcionalidades Principais

### 1. Catálogo de Produtos
- Grid responsivo de produtos
- Imagens com hover effect
- Badges de desconto e destaque
- Avaliações e reviews
- Indicador de estoque

### 2. Filtros Avançados
- Busca por texto
- Filtro por categoria e subcategoria
- Filtro por marca
- Range de preço com slider
- Ordenação (mais recente, popular, preço)
- Tags ativas removíveis

### 3. Detalhes do Produto
- Galeria de imagens
- Seleção de tamanho e cor
- Controle de quantidade
- Adicionar ao carrinho
- Informações completas do produto

### 4. Carrinho de Compras
- Persistência com localStorage
- Adicionar/remover produtos
- Atualizar quantidades
- Cálculo de total
- Sidebar responsiva

### 5. Painel Admin
- Listagem de todos os produtos
- Criar novo produto
- Editar produto existente
- Excluir produto
- Upload de múltiplas imagens
- Gerenciamento de variações (cores/tamanhos)
- Estatísticas do catálogo

## 🎨 Tecnologias Utilizadas

### Frontend
- **Next.js 15**: Framework React com App Router
- **React 19**: Biblioteca UI
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização utility-first
- **Shadcn/UI**: Componentes UI de alta qualidade
- **Lucide React**: Ícones
- **Sonner**: Notificações toast

### Backend (Preparado)
- **FastAPI**: Framework web Python assíncrono
- **MongoDB**: Banco de dados NoSQL
- **Motor**: Driver assíncrono MongoDB
- **Pydantic**: Validação de dados

## 🔌 API Endpoints

### Produtos

```
GET    /api/products              # Listar produtos (com filtros)
GET    /api/products/:id          # Obter produto específico
POST   /api/products              # Criar produto
PUT    /api/products/:id          # Atualizar produto
DELETE /api/products/:id          # Excluir produto
```

### Categorias

```
GET    /api/categories            # Listar categorias
```

## 📱 Páginas

- `/` - Homepage com catálogo de produtos
- `/admin` - Painel administrativo

## 📚 Documentação Adicional

- **FastAPI Integration**: Veja `FASTAPI_INTEGRATION.md` para documentação completa do backend
- **Implementation Summary**: Veja `IMPLEMENTATION_SUMMARY.md` para detalhes da implementação

## 🛠️ Configuração

### Variáveis de Ambiente

```env
# Development com mock data
USE_MOCK_DATA=true

# Production com FastAPI
USE_MOCK_DATA=false
NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000
```

---

**Desenvolvido com ❤️ usando Next.js, React, TypeScript e Tailwind CSS**