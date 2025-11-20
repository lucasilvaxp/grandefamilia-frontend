"use client";

import { useState, useEffect } from 'react';
import { Product, Category, FilterOptions } from '@/types/product';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Filters } from '@/components/Filters';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductModal } from '@/components/ProductModal';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal, MessageCircle } from 'lucide-react';
import { buildQueryString } from '@/lib/api-config';
import Image from 'next/image';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const whatsappNumber = "5593991084582";
  const whatsappMessage = encodeURIComponent("Olá! Gostaria de saber mais sobre os produtos da Loja A Grande Família.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = buildQueryString({
          ...filters,
          page,
          pageSize: 20,
        });

        const response = await fetch(`/api/products${queryParams}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.data);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, page]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(1);
    setMobileFiltersOpen(false);
  };

  const handleWhatsAppClick = () => {
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage(
        { type: "OPEN_EXTERNAL_URL", data: { url: whatsappLink } },
        "*"
      );
    } else {
      window.open(whatsappLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Banner Section - Optimized Heights */}
      <section className="relative w-full bg-[var(--light-bg)]">
        <div className="container max-w-7xl mx-auto px-4 py-4 md:py-8 lg:py-12">
          <div className="max-w-5xl mx-auto">
            {/* Banner Card with Cover Image */}
            <div className="relative rounded-lg md:rounded-xl overflow-hidden shadow-lg md:shadow-2xl">
              {/* Cover Image - Reduced Mobile Height */}
              <div className="relative w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[500px]">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/WhatsApp-Image-2025-11-17-at-18.13.20-1763468229731.jpeg"
                  alt="Loja A Grande Família - Catálogo de Roupas"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              </div>

              {/* Content Overlay - Compact Mobile */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-3 sm:p-5 md:p-8">
                {/* Text Content - Reduced Mobile Spacing */}
                <div className="text-center space-y-1 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6 w-full max-w-3xl">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-2xl leading-tight">
                    Loja A Grande Família
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-primary font-semibold drop-shadow-lg">
                    ATACADO DE ROUPAS
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-gray-200 drop-shadow-lg px-2">
                    Moda Feminina, Masculina e Infantil - Grandes Quantidades
                  </p>
                  
                  {/* Badge - Compact Mobile */}
                  <div className="flex justify-center pt-1 sm:pt-2">
                    <div className="inline-block bg-primary/95 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-lg">
                      <p className="text-xs sm:text-sm md:text-base font-bold text-primary-foreground whitespace-nowrap">
                        Atacado a partir de 1 Peça!
                      </p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Button - Compact Mobile */}
                <Button
                  size="default"
                  className="bg-[var(--whatsapp)] hover:bg-[var(--whatsapp)]/90 text-white font-semibold text-xs sm:text-sm md:text-base px-4 sm:px-6 py-4 sm:py-5 shadow-2xl hover:scale-105 transition-transform w-full sm:w-auto max-w-sm"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Fale Conosco no WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Light Background */}
      <main className="flex-1 bg-[var(--light-bg)] text-[var(--light-foreground)]">
        <div className="container max-w-7xl mx-auto px-4 py-4 md:py-6">
          {/* Desktop: Sidebar + Content | Mobile: Stacked */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
            {/* Desktop Filters - Sticky Sidebar */}
            <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
              <div className="sticky top-20">
                <Filters
                  categories={categories}
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
            </aside>

            {/* Mobile Filters - Drawer */}
            <div className="lg:hidden w-full">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full border-gray-300 bg-white text-[var(--light-foreground)] hover:bg-gray-100">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] sm:w-[350px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <Filters
                      categories={categories}
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Product Grid - Flexible Width */}
            <div className="w-full lg:flex-1 lg:min-w-0 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {loading ? 'Carregando...' : `${products.length} produtos encontrados`}
                </p>
              </div>

              <ProductGrid
                products={products}
                loading={loading}
                onProductClick={setSelectedProduct}
              />

              {/* Pagination - Compact Mobile */}
              {totalPages > 1 && !loading && (
                <div className="flex items-center justify-center gap-2 pt-6 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="border-gray-300 bg-white text-[var(--light-foreground)] hover:bg-gray-100"
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-gray-600 px-2">
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="border-gray-300 bg-white text-[var(--light-foreground)] hover:bg-gray-100"
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <Footer />
    </div>
  );
}
