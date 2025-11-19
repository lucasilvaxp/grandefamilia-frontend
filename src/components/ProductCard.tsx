"use client";

import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-xl border-gray-200 bg-white h-full flex flex-col"
      onClick={onClick}
    >
      {/* Image Section - Consistent Aspect Ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        
        {/* Badges - Better Mobile Positioning */}
        {discount > 0 && (
          <Badge className="absolute left-2 top-2 bg-red-500 text-white hover:bg-red-500 text-xs">
            -{discount}%
          </Badge>
        )}
        {product.featured && (
          <Badge className="absolute right-2 top-2 bg-primary text-primary-foreground hover:bg-primary text-xs">
            Destaque
          </Badge>
        )}
        
        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="secondary" className="text-base md:text-lg">
              Esgotado
            </Badge>
          </div>
        )}
      </div>
      
      {/* Content Section - Flexible Layout */}
      <CardContent className="p-3 md:p-4 bg-white flex-1 flex flex-col">
        {/* Product Name */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm md:text-base line-clamp-2 flex-1 text-gray-800">
            {product.name}
          </h3>
        </div>
        
        {/* Brand */}
        <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-gray-800">{product.rating}</span>
            <span className="text-xs text-gray-500">
              ({product.reviewCount})
            </span>
          </div>
        )}
        
        {/* Price Section - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              R$ {product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-lg md:text-xl font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
        </div>
        
        {/* Colors - Better Mobile Display */}
        <div className="flex items-center gap-1 flex-wrap mb-2">
          {product.colors.slice(0, 4).map((color, idx) => (
            <div
              key={idx}
              className="h-4 w-4 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-xs text-gray-500">
              +{product.colors.length - 4}
            </span>
          )}
        </div>
        
        {/* Stock Info - Mobile Friendly */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mt-auto">
          <ShoppingCart className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{product.stock} em estoque</span>
        </div>
      </CardContent>
    </Card>
  );
}
