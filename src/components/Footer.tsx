"use client";

import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const whatsappNumber = "5593991084582";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="border-t bg-muted/50">
      <div className="container max-w-7xl mx-auto py-8 md:py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="relative h-8 w-8 md:h-10 md:w-10">
                <Image
                  src="/logo-grande-familia.png"
                  alt="Loja A Grande Família"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-bold text-base md:text-lg">Loja A Grande Família</h3>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Descubra as últimas tendências em moda e estilo com qualidade e preços acessíveis.
            </p>
          </div>

          {/* Contato */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base md:text-lg">Contato</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-3 w-3 md:h-4 md:w-4 mt-0.5 flex-shrink-0 text-primary" />
                <div>
                  <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    (93) 99108-4582
                  </a>
                  <p className="text-muted-foreground text-xs">WhatsApp</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-3 w-3 md:h-4 md:w-4 mt-0.5 flex-shrink-0 text-primary" />
                <a 
                  href="mailto:lojaagrandefamilia@gmail.com"
                  className="hover:text-primary transition-colors break-all"
                >
                  lojaagrandefamilia@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3 w-3 md:h-4 md:w-4 mt-0.5 flex-shrink-0 text-primary" />
                <span className="text-xs md:text-sm">Av. Tancredo Neves, 2035<br />Santarém, PA</span>
              </li>
            </ul>
          </div>

          {/* Horário */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base md:text-lg">Horário</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li className="flex items-start gap-2">
                <Clock className="h-3 w-3 md:h-4 md:w-4 mt-0.5 flex-shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Seg - Sex</p>
                  <p className="text-muted-foreground">08:00 - 12:00</p>
                  <p className="text-muted-foreground">14:00 - 18:00</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-3 w-3 md:h-4 md:w-4 mt-0.5 flex-shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Sábado</p>
                  <p className="text-muted-foreground">08:00 - 12:00</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-3 w-3 md:h-4 md:w-4 mt-0.5 flex-shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Dom/Feriados</p>
                  <p className="text-muted-foreground">Fechado</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base md:text-lg">Redes Sociais</h3>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/Loja_grandefamilia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61582513584665"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 md:h-5 md:w-5" />
              </a>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Siga-nos nas redes sociais para novidades e promoções!
            </p>
          </div>
        </div>

        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t text-center text-xs md:text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Loja A Grande Família. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}