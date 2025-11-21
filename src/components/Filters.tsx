"use client";

import { useState, useEffect } from 'react';
import { FilterOptions, Category } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Search } from 'lucide-react';

interface FiltersProps {
  categories: Category[];
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function Filters({ categories, filters, onFiltersChange }: FiltersProps) {
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [priceRange, setPriceRange] = useState([
    filters.minPrice || 0,
    filters.maxPrice || 1000,
  ]);

  const brands = [
    'Eleganza',
    'Executive',
    'Luxe',
    'Urban Style',
    'SportMax',
    'BasicWear',
    'SunStyle',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchQuery });
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const handlePriceCommit = () => {
    onFiltersChange({
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 1000]);
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.category ||
    filters.subcategory ||
    filters.brand ||
    filters.search ||
    filters.minPrice ||
    filters.maxPrice;

  return (
    <div className="space-y-4 md:space-y-6 bg-gray-100 p-4 md:p-6 rounded-lg border border-gray-200">
      {/* Search */}
      <form onSubmit={handleSearchSubmit}>
        <Label htmlFor="search" className="mb-2 block text-gray-800 font-semibold text-sm md:text-base">
          Buscar
        </Label>
        <div className="flex gap-2">
          <Input
            id="search"
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 text-sm md:text-base"
          />
          <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 flex-shrink-0">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-gray-800 font-semibold text-sm md:text-base">Filtros Ativos</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-primary hover:text-primary/80 hover:bg-primary/10 text-xs md:text-sm"
            >
              Limpar Tudo
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs">
                {filters.category}
                <button
                  onClick={() =>
                    onFiltersChange({ ...filters, category: undefined, subcategory: undefined })
                  }
                  className="ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.subcategory && (
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs">
                {filters.subcategory}
                <button
                  onClick={() => onFiltersChange({ ...filters, subcategory: undefined })}
                  className="ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.brand && (
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs">
                {filters.brand}
                <button
                  onClick={() => onFiltersChange({ ...filters, brand: undefined })}
                  className="ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.search && (
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs">
                Busca: {filters.search}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    onFiltersChange({ ...filters, search: undefined });
                  }}
                  className="ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Category */}
      <div className="space-y-2">
        <Label className="text-gray-800 font-semibold text-sm md:text-base">Categoria</Label>
        <Select
          value={filters.category || 'all'}
          onValueChange={value =>
            onFiltersChange({
              ...filters,
              category: value === 'all' ? undefined : value,
              subcategory: undefined,
            })
          }
        >
          <SelectTrigger className="bg-white border-gray-300 text-gray-800 text-sm md:text-base">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subcategory */}
      {filters.category && (
        <div className="space-y-2">
          <Label className="text-gray-800 font-semibold text-sm md:text-base">Subcategoria</Label>
          <Select
            value={filters.subcategory || 'all'}
            onValueChange={value =>
              onFiltersChange({
                ...filters,
                subcategory: value === 'all' ? undefined : value,
              })
            }
          >
            <SelectTrigger className="bg-white border-gray-300 text-gray-800 text-sm md:text-base">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories
                .find(cat => cat.name === filters.category)
                ?.subcategories.map(sub => (
                  <SelectItem key={sub} value={sub}>
                    {sub}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Brand */}
      <div className="space-y-2">
        <Label className="text-gray-800 font-semibold text-sm md:text-base">Marca</Label>
        <Select
          value={filters.brand || 'all'}
          onValueChange={value =>
            onFiltersChange({
              ...filters,
              brand: value === 'all' ? undefined : value,
            })
          }
        >
          <SelectTrigger className="bg-white border-gray-300 text-gray-800 text-sm md:text-base">
            <SelectValue placeholder="Todas as marcas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as marcas</SelectItem>
            {brands.map(brand => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-gray-800 font-semibold text-sm md:text-base">Faixa de Preço</Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceCommit}
            min={0}
            max={1000}
            step={10}
            className="w-full"
          />
        </div>
        <div className="flex items-center justify-between text-xs md:text-sm text-gray-600">
          <span>R$ {priceRange[0]}</span>
          <span>R$ {priceRange[1]}</span>
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <Label className="text-gray-800 font-semibold text-sm md:text-base">Ordenar por</Label>
        <Select
          value={filters.sort || 'newest'}
          onValueChange={value =>
            onFiltersChange({
              ...filters,
              sort: value as FilterOptions['sort'],
            })
          }
        >
          <SelectTrigger className="bg-white border-gray-300 text-gray-800 text-sm md:text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mais Recentes</SelectItem>
            <SelectItem value="popular">Mais Popular</SelectItem>
            <SelectItem value="price_asc">Menor Preço</SelectItem>
            <SelectItem value="price_desc">Maior Preço</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}