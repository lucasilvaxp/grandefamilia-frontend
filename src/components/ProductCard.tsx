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
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
        />
        
        {/* Badges - Compact Mobile */}
        {discount > 0 && (
          <Badge className="absolute left-2 top-2 bg-red-500 text-white hover:bg-red-500 text-[10px] sm:text-xs px-1.5 py-0.5">
            -{discount}%
          </Badge>
        )}
        {product.featured && (
          <Badge className="absolute right-2 top-2 bg-primary text-primary-foreground hover:bg-primary text-[10px] sm:text-xs px-1.5 py-0.5">
            Destaque
          </Badge>
        )}
        
        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="secondary" className="text-sm md:text-base">
              Esgotado
            </Badge>
          </div>
        )}
      </div>
      
      {/* Content Section - Compact Mobile Padding */}
      <CardContent className="p-2.5 sm:p-3 md:p-4 bg-white flex-1 flex flex-col">
        {/* Product Name - Better Line Clamping */}
        <div className="mb-1.5 sm:mb-2">
          <h3 className="font-semibold text-xs sm:text-sm md:text-base line-clamp-2 text-gray-800">
            {product.name}
          </h3>
        </div>
        
        {/* Brand - Compact */}
        <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2">{product.brand}</p>
        
        {/* Rating - Compact */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] sm:text-xs font-medium text-gray-800">{product.rating}</span>
            <span className="text-[10px] sm:text-xs text-gray-500">
              ({product.reviewCount})
            </span>
          </div>
        )}
        
        {/* Price Section - Compact Mobile */}
        <div className="flex flex-col gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
          {product.originalPrice && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
              R$ {product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-base sm:text-lg md:text-xl font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
        </div>
        
        {/* Colors - Compact Mobile */}
        <div className="flex items-center gap-1 flex-wrap mb-1.5 sm:mb-2">
          {product.colors.slice(0, 4).map((color, idx) => (
            <div
              key={idx}
              className="h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] sm:text-xs text-gray-500">
              +{product.colors.length - 4}
            </span>
          )}
        </div>
        
        {/* Stock Info - Compact Mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600 mt-auto">
          <ShoppingCart className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
          <span className="truncate">{product.stock} em estoque</span>
        </div>
      </CardContent>
    </Card>
  );
}