"use client";

import { useState } from 'react';
import { Product, Color } from '@/types/product';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Check } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function ProductModal({ product, open, onClose }: ProductModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  // Safe fallbacks for optional fields
  const images = product.images || [];
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const stock = product.stock ?? 0;
  const tags = product.tags || [];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    // Only validate if options exist
    if (sizes.length > 0 && !selectedSize) {
      toast.error('Por favor, selecione um tamanho');
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      toast.error('Por favor, selecione uma cor');
      return;
    }

    addToCart(product, quantity, selectedSize || undefined, selectedColor || undefined);
    toast.success('Produto adicionado ao carrinho!');
    onClose();
  };

  // Reset selections when product changes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedImage(0);
      setSelectedSize('');
      setSelectedColor(null);
      setQuantity(1);
      onClose();
    }
  };

  const currentImage = images[selectedImage] || images[0] || '/placeholder-product.jpg';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {discount > 0 && (
                <Badge className="absolute left-2 top-2 bg-red-500 text-white">
                  -{discount}%
                </Badge>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                      selectedImage === idx
                        ? 'border-primary'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              {product.brand && (
                <p className="text-muted-foreground">{product.brand}</p>
              )}
            </div>

            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                {product.reviewCount && (
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount} avaliações)
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-3">
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-3xl font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </span>
            </div>

            {product.description && (
              <p className="text-sm text-muted-foreground">{product.description}</p>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Tamanho: {selectedSize && <span className="text-primary">{selectedSize}</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {colors.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Cor: {selectedColor && <span className="text-primary">{selectedColor.name}</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`relative h-10 w-10 rounded-full border-2 transition-all ${
                        selectedColor?.hex === color.hex
                          ? 'border-primary scale-110'
                          : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor?.hex === color.hex && (
                        <Check className="h-5 w-5 absolute inset-0 m-auto text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium mb-2 block">Quantidade</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  disabled={quantity >= stock}
                >
                  +
                </Button>
                <span className="text-sm text-muted-foreground ml-2">
                  ({stock} disponíveis)
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
            </Button>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
