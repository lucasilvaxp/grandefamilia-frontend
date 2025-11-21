"use client";

import { useCart } from '@/hooks/use-cart';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaWhatsapp } from 'react-icons/fa';

interface ShoppingCartProps {
  open: boolean;
  onClose: () => void;
}

export function ShoppingCart({ open, onClose }: ShoppingCartProps) {
  const { cart, removeFromCart, updateQuantity, total, itemCount, clearCart } = useCart();

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    const whatsappNumber = "5593991084582"; // (93) 99108-4582
    
    // Format message with cart items
    let message = "Olá! Gostaria de solicitar uma cotação para os seguintes produtos:\n\n";
    
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      if (item.product.brand) {
        message += `   - Marca: ${item.product.brand}\n`;
      }
      if (item.selectedSize) {
        message += `   - Tamanho: ${item.selectedSize}\n`;
      }
      if (item.selectedColor) {
        message += `   - Cor: ${item.selectedColor.name}\n`;
      }
      message += `   - Quantidade: ${item.quantity}\n`;
      message += `   - Preço unitário: R$ ${item.product.price.toFixed(2)}\n`;
      message += `   - Subtotal: R$ ${(item.product.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    message += `*Total: R$ ${total.toFixed(2)}*\n\n`;
    message += "Aguardo retorno para finalizar a compra. Obrigado!";
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab/window
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: whatsappUrl } }, "*");
    } else {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrinho de Cotação
            {itemCount > 0 && (
              <span className="text-sm text-muted-foreground">
                ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Carrinho vazio</h3>
                <p className="text-muted-foreground text-sm">
                  Adicione produtos ao seu carrinho para solicitar cotação
                </p>
              </div>
              <Button onClick={onClose}>Continuar Navegando</Button>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {cart.map((item, index) => {
                  const firstImage = item.product.images?.[0] || '/placeholder-product.jpg';
                  
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={firstImage}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-sm line-clamp-1">
                              {item.product.name}
                            </h4>
                            {item.product.brand && (
                              <p className="text-xs text-muted-foreground">
                                {item.product.brand}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={() => removeFromCart(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {(item.selectedColor || item.selectedSize) && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                            {item.selectedColor && (
                              <>
                                <div
                                  className="h-4 w-4 rounded-full border"
                                  style={{ backgroundColor: item.selectedColor.hex }}
                                />
                                <span>{item.selectedColor.name}</span>
                              </>
                            )}
                            {item.selectedColor && item.selectedSize && <span>•</span>}
                            {item.selectedSize && <span>Tamanho: {item.selectedSize}</span>}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="font-semibold">
                            R$ {(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4">
              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <SheetFooter className="flex-col gap-2">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                  onClick={handleWhatsAppCheckout}
                >
                  <FaWhatsapp className="h-5 w-5 mr-2" />
                  Solicitar Cotação via WhatsApp
                </Button>
                <Button variant="outline" onClick={onClose} className="w-full">
                  Continuar Navegando
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
