"use client";

import { useState, useEffect } from 'react';
import { Product, Category, Color } from '@/types/product';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ImageUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  onSuccess: () => void;
}

export function ProductFormDialog({
  open,
  onClose,
  product,
  categories,
  onSuccess,
}: ProductFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    subcategory: '',
    brand: '',
    stock: '',
    featured: false,
    tags: [] as string[],
  });
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
  const [newImage, setNewImage] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        category: product.category,
        subcategory: product.subcategory || '',
        brand: product.brand,
        stock: product.stock.toString(),
        featured: product.featured,
        tags: product.tags || [],
      });
      setSizes(product.sizes);
      setColors(product.colors);
      setImages(product.images);
    } else {
      resetForm();
    }
  }, [product, open]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      subcategory: '',
      brand: '',
      stock: '',
      featured: false,
      tags: [],
    });
    setSizes([]);
    setColors([]);
    setImages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sizes.length === 0) {
      toast.error('Adicione pelo menos um tamanho');
      return;
    }
    if (colors.length === 0) {
      toast.error('Adicione pelo menos uma cor');
      return;
    }
    if (images.length === 0) {
      toast.error('Adicione pelo menos uma imagem');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        brand: formData.brand,
        sizes,
        colors,
        images,
        stock: parseInt(formData.stock),
        featured: formData.featured,
        tags: formData.tags,
      };

      const url = product ? `/api/products/${product._id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(product ? 'Produto atualizado!' : 'Produto criado!');
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao salvar produto');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
    }
  };

  const addColor = () => {
    if (newColor.name && !colors.some(c => c.hex === newColor.hex)) {
      setColors([...colors, newColor]);
      setNewColor({ name: '', hex: '#000000' });
    }
  };

  const addImage = () => {
    if (newImage && !images.includes(newImage)) {
      setImages([...images, newImage]);
      setNewImage('');
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag('');
    }
  };

  const selectedCategory = categories.find(c => c.name === formData.category);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <form onSubmit={handleSubmit} className="space-y-6 pr-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="details">Tamanhos & Cores</TabsTrigger>
                <TabsTrigger value="images">Imagens</TabsTrigger>
              </TabsList>

              {/* Tab 1: Basic Info */}
              <TabsContent value="basic" className="space-y-4 mt-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                {/* Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Preço Original (R$)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={value =>
                      setFormData({ ...formData, category: value, subcategory: '' })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat._id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategory */}
                {selectedCategory && (
                  <div className="space-y-2">
                    <Label>Subcategoria</Label>
                    <Select
                      value={formData.subcategory}
                      onValueChange={value => setFormData({ ...formData, subcategory: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma subcategoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategory.subcategories.map(sub => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Brand & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={e => setFormData({ ...formData, brand: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Estoque *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: casual, elegante"
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              tags: formData.tags.filter(t => t !== tag),
                            })
                          }
                          className="ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Featured */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={checked => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Produto em Destaque</Label>
                </div>
              </TabsContent>

              {/* Tab 2: Sizes & Colors */}
              <TabsContent value="details" className="space-y-4 mt-4">
                {/* Sizes */}
                <div className="space-y-2">
                  <Label>Tamanhos *</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: P, M, G"
                      value={newSize}
                      onChange={e => setNewSize(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSize())}
                    />
                    <Button type="button" onClick={addSize} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(size => (
                      <Badge key={size} variant="secondary">
                        {size}
                        <button
                          type="button"
                          onClick={() => setSizes(sizes.filter(s => s !== size))}
                          className="ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-2">
                  <Label>Cores *</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nome da cor"
                      value={newColor.name}
                      onChange={e => setNewColor({ ...newColor, name: e.target.value })}
                      className="flex-1"
                    />
                    <Input
                      type="color"
                      value={newColor.hex}
                      onChange={e => setNewColor({ ...newColor, hex: e.target.value })}
                      className="w-20"
                    />
                    <Button type="button" onClick={addColor} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-2">
                        <div
                          className="h-3 w-3 rounded-full border"
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name}
                        <button
                          type="button"
                          onClick={() => setColors(colors.filter((_, i) => i !== idx))}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Tab 3: Images */}
              <TabsContent value="images" className="mt-4">
                <ImageUpload
                  images={images}
                  onImagesChange={setImages}
                  maxImages={10}
                />
              </TabsContent>
            </Tabs>
          </form>
        </ScrollArea>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvando...' : product ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
