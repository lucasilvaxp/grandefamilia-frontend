"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category } from '@/types/product';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Loader2, LogOut, Home, Settings, Package, Tag, TrendingUp } from 'lucide-react';
import { ProductFormDialog } from '@/components/ProductFormDialog';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/lib/auth';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [logo, setLogo] = useState('/logo-grande-familia.png');
  const router = useRouter();
  const { isAuthenticated, logout, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, settingsRes] = await Promise.all([
        fetch('/api/products?pageSize=100&_t=' + Date.now()),
        fetch('/api/categories'),
        fetch('/api/settings'),
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.data);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData.logo) {
          setLogo(settingsData.logo);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso');
    router.push('/admin/login');
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Optimistic update: remove from local state immediately
        setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
        toast.success('Produto excluído com sucesso');
        
        // Refresh data after a delay to sync with backend
        setTimeout(() => {
          fetchData();
        }, 500);
      } else {
        toast.error('Erro ao excluir produto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erro ao excluir produto');
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleFormSuccess = (updatedProduct?: Product) => {
    setFormOpen(false);
    setEditingProduct(null);
    
    if (updatedProduct) {
      // Optimistic update: update local state immediately
      if (editingProduct) {
        // Update existing product
        setProducts(prev => prev.map(p => 
          p.id === updatedProduct.id ? updatedProduct : p
        ));
      } else {
        // Add new product
        setProducts(prev => [updatedProduct, ...prev]);
      }
    }
    
    // Refresh data after a delay to sync with backend
    setTimeout(() => {
      fetchData();
    }, 500);
  };

  // Calculate statistics
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  const uniqueBrands = new Set(products.map(p => p.brand)).size;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="container max-w-7xl mx-auto py-4 md:py-8 px-4 md:px-6 flex-1">
        {/* Admin Header - Responsive */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4 md:mb-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative h-12 w-12 md:h-16 md:w-16 flex-shrink-0">
                <Image
                  src={logo}
                  alt="Loja A Grande Família"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Painel Administrativo</h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Gerencie produtos, categorias e configurações do catálogo
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Responsive Grid */}
          <div className="grid grid-cols-2 md:flex gap-2 md:gap-3">
            <Link href="/" className="w-full md:w-auto">
              <Button variant="outline" className="w-full md:w-auto" size="default">
                <Home className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Página Principal</span>
                <span className="md:hidden">Home</span>
              </Button>
            </Link>
            <Link href="/admin/configuracoes" className="w-full md:w-auto">
              <Button variant="outline" className="w-full md:w-auto" size="default">
                <Settings className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Configurações</span>
                <span className="md:hidden">Config</span>
              </Button>
            </Link>
            <Button onClick={handleCreate} className="w-full md:w-auto" size="default">
              <Plus className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Novo Produto</span>
              <span className="md:hidden">Novo</span>
            </Button>
            <Button onClick={handleLogout} variant="outline" className="w-full md:w-auto" size="default">
              <LogOut className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Sair</span>
              <span className="md:hidden">Sair</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                Total de Produtos
              </CardTitle>
              <Package className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-3xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {products.filter(p => p.featured).length} em destaque
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                Categorias
              </CardTitle>
              <Tag className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-3xl font-bold">{categories.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {uniqueBrands} marcas diferentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                Valor em Estoque
              </CardTitle>
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-3xl font-bold">R$ {totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total do inventário
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                Estoque Baixo
              </CardTitle>
              <Package className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-3xl font-bold">{lowStockProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Produtos com menos de 10 unidades
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum produto cadastrado
              </div>
            ) : (
              <>
                {/* Desktop Table - Hidden on Mobile */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Imagem</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Estoque</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map(product => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="relative h-12 w-12 overflow-hidden rounded bg-gray-100">
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.brand}</TableCell>
                          <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={product.stock < 10 ? 'text-destructive font-semibold' : ''}>
                              {product.stock}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {product.featured && (
                                <Badge variant="secondary">Destaque</Badge>
                              )}
                              {product.stock === 0 && (
                                <Badge variant="destructive">Esgotado</Badge>
                              )}
                              {product.stock > 0 && product.stock < 10 && (
                                <Badge variant="outline" className="text-yellow-600">Baixo</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(product)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards - Hidden on Desktop */}
                <div className="md:hidden space-y-4">
                  {products.map(product => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="flex gap-4 p-4">
                        {/* Image */}
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1 truncate">{product.name}</h3>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <p>{product.category} • {product.brand}</p>
                            <p className="font-bold text-foreground text-base">R$ {product.price.toFixed(2)}</p>
                            <p>Estoque: <span className={product.stock < 10 ? 'text-destructive font-semibold' : ''}>{product.stock}</span></p>
                          </div>
                          
                          {/* Badges */}
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {product.featured && (
                              <Badge variant="secondary" className="text-xs">Destaque</Badge>
                            )}
                            {product.stock === 0 && (
                              <Badge variant="destructive" className="text-xs">Esgotado</Badge>
                            )}
                            {product.stock > 0 && product.stock < 10 && (
                              <Badge variant="outline" className="text-yellow-600 text-xs">Baixo</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 border-t p-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleDeleteClick(product)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Product Form Dialog */}
      <ProductFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        categories={categories}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{productToDelete?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}