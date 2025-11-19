"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Você pode adicionar no máximo ${maxImages} imagens`);
      return;
    }

    setUploading(true);

    try {
      // Create FormData with correct field name
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file); // Changed from 'file' to 'images'
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao fazer upload');
      }

      const data = await response.json();
      // Backend returns { urls: [...] }
      const uploadedUrls = data.urls || [];
      onImagesChange([...images, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} imagem(ns) enviada(s) com sucesso!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer upload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
    toast.success('Imagem removida');
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Selecionar Imagens do Dispositivo
            </>
          )}
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>• Selecione imagens do seu computador ou celular</p>
        <p>• Formatos aceitos: JPEG, PNG, WebP</p>
        <p>• Tamanho máximo por imagem: 5MB</p>
        <p>• Máximo de {maxImages} imagens por produto</p>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={imageUrl}
                  alt={`Imagem ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                {/* Remove Button Overlay */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                  title="Remover imagem"
                >
                  <X className="h-4 w-4" />
                </button>
                {/* Image Number Badge */}
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <Card className="border-dashed">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Nenhuma imagem adicionada
            </p>
            <p className="text-xs text-muted-foreground">
              Clique no botão acima para selecionar imagens
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
