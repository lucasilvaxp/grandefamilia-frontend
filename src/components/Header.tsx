"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart as ShoppingCartIcon, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart } from './ShoppingCart';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card backdrop-blur-xl supports-[backdrop-filter]:bg-card/95">
        <div className="container px-4 md:px-6">
          <div className="flex h-16 md:h-20 items-center justify-between gap-4">
            {/* Logo - Larger and Better Spaced */}
            <Link href="/" className="flex items-center group flex-shrink-0">
              <div className="relative h-12 w-12 md:h-16 md:w-16 transition-transform group-hover:scale-110">
                <Image
                  src="/logo-grande-familia.png"
                  alt="Loja A Grande Família"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                Catálogo
              </Link>
              <Link
                href="/admin"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                Admin
              </Link>
            </nav>

            {/* Right Side Actions - Better Spacing */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-primary/10 hover:text-primary h-10 w-10"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center font-bold shadow-lg">
                    {itemCount}
                  </span>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden hover:bg-primary/10 hover:text-primary h-10 w-10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border/40 py-4 space-y-2">
              <Link
                href="/"
                className="block px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-primary/10 hover:text-primary rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Catálogo
              </Link>
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-primary/10 hover:text-primary rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          )}
        </div>
      </header>

      <ShoppingCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
