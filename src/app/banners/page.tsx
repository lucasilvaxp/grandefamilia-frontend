"use client";

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Instagram, Smartphone, Share2, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface BannerData {
  id: string;
  title: string;
  description: string;
  format: string;
  aspectRatio: string;
  category: 'loja' | 'tech';
  imageUrl: string;
  cta: string;
  usage: string;
}

export default function BannersPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const banners: BannerData[] = [
    {
      id: 'loja-stories-lancamento',
      title: '🛍️ Lançamento (Stories)',
      description: 'Novidade: Site Oficial Lançado! Destaque a facilidade de navegação e a novidade do catálogo online.',
      format: 'Stories',
      aspectRatio: '9:16 (Vertical)',
      category: 'loja',
      imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/1d54d7a4-3d52-45ea-a97b-c59059e7cd1b/generated_images/modern-instagram-stories-banner-9-16-ver-97882964-20251120172853.jpg',
      cta: 'Visite Agora! (Swipe Up)',
      usage: '@Loja_grandefamilia - Divulgação do lançamento do site'
    },
    {
      id: 'loja-feed-destaque',
      title: '🛍️ Destaque (Feed)',
      description: 'Mix de 3 produtos em destaque: Catálogo Completo, Preços Transparentes, Peça Rápido!',
      format: 'Feed',
      aspectRatio: '1:1 (Quadrado)',
      category: 'loja',
      imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/1d54d7a4-3d52-45ea-a97b-c59059e7cd1b/generated_images/instagram-square-feed-post-1-1-for-luxur-1a06cfd2-20251120172853.jpg',
      cta: 'Compre Pelo Site! + WhatsApp',
      usage: '@Loja_grandefamilia - Incentivo à compra'
    },
    {
      id: 'tech-stories-tecnologia',
      title: '💻 Tecnologia (Stories)',
      description: 'FastAPI + Next.js: A Arquitetura da Loja Grandefamilia. Stack completo: FastAPI, Next.js, MongoDB Atlas, Render/Vercel.',
      format: 'Stories',
      aspectRatio: '9:16 (Vertical)',
      category: 'tech',
      imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/1d54d7a4-3d52-45ea-a97b-c59059e7cd1b/generated_images/tech-focused-instagram-stories-banner-fo-f4d9c1eb-20251120171635.jpg',
      cta: 'Saiba Mais no Meu Perfil',
      usage: '@infotechlp - Promoção da implementação'
    },
    {
      id: 'tech-feed-funcionalidades',
      title: '💻 Funcionalidades (Feed)',
      description: 'Destaque das funcionalidades: Catálogo Admin, Roteamento Otimizado, Integração API/DB. Foco em performance e robustez.',
      format: 'Feed',
      aspectRatio: '1:1 (Quadrado)',
      category: 'tech',
      imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/1d54d7a4-3d52-45ea-a97b-c59059e7cd1b/generated_images/instagram-square-feed-post-1-1-for-profe-2754d091-20251120172854.jpg',
      cta: 'Desenvolvimento Profissional + Logo LP Infotech',
      usage: '@infotechlp - Expertise profissional'
    }
  ];

  const handleDownload = async (banner: BannerData) => {
    try {
      const response = await fetch(banner.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${banner.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Banner "${banner.title}" baixado com sucesso!`);
    } catch (error) {
      console.error('Error downloading banner:', error);
      toast.error('Erro ao baixar banner');
    }
  };

  const handleCopyUrl = (banner: BannerData) => {
    navigator.clipboard.writeText(banner.imageUrl);
    setCopiedId(banner.id);
    toast.success('URL copiada para área de transferência!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (banner: BannerData) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: banner.title,
          text: banner.description,
          url: banner.imageUrl
        });
        toast.success('Banner compartilhado!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Erro ao compartilhar');
        }
      }
    } else {
      handleCopyUrl(banner);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="container max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-6 flex-1">
        {/* Header Section */}
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
            Banners de Divulgação
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Banners profissionais para Instagram seguindo o design visual da Loja A Grande Família
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 mb-8 justify-center flex-wrap">
          <Badge variant="secondary" className="text-sm md:text-base px-4 py-2">
            <Instagram className="h-4 w-4 mr-2" />
            4 Banners Criados
          </Badge>
          <Badge variant="outline" className="text-sm md:text-base px-4 py-2">
            <Smartphone className="h-4 w-4 mr-2" />
            Stories + Feed
          </Badge>
        </div>

        {/* Loja Banners Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">🛍️ Banners para a Loja</h2>
            <Badge>@Loja_grandefamilia</Badge>
          </div>
          <p className="text-muted-foreground mb-6">
            Objetivo: Divulgação do lançamento do site e incentivo à compra
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {banners.filter(b => b.category === 'loja').map(banner => (
              <Card key={banner.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{banner.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {banner.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{banner.format}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Banner Preview */}
                  <div className={`relative mx-auto bg-gray-100 rounded-lg overflow-hidden ${
                    banner.aspectRatio.startsWith('9:16') 
                      ? 'w-[280px] h-[497px]' 
                      : 'w-full aspect-square'
                  }`}>
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Formato</p>
                      <p className="font-medium">{banner.aspectRatio}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">CTA</p>
                      <p className="font-medium text-xs">{banner.cta}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Uso</p>
                    <p className="text-sm">{banner.usage}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleDownload(banner)}
                      className="flex-1"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyUrl(banner)}
                    >
                      {copiedId === banner.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(banner)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tech Banners Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">💻 Banners Profissionais</h2>
            <Badge>@infotechlp</Badge>
          </div>
          <p className="text-muted-foreground mb-6">
            Objetivo: Promover a implementação da tecnologia e expertise profissional
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {banners.filter(b => b.category === 'tech').map(banner => (
              <Card key={banner.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{banner.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {banner.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{banner.format}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Banner Preview */}
                  <div className={`relative mx-auto bg-gray-100 rounded-lg overflow-hidden ${
                    banner.aspectRatio.startsWith('9:16') 
                      ? 'w-[280px] h-[497px]' 
                      : 'w-full aspect-square'
                  }`}>
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Formato</p>
                      <p className="font-medium">{banner.aspectRatio}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">CTA</p>
                      <p className="font-medium text-xs">{banner.cta}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Uso</p>
                    <p className="text-sm">{banner.usage}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleDownload(banner)}
                      className="flex-1"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyUrl(banner)}
                    >
                      {copiedId === banner.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(banner)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Download All Section */}
        <div className="mt-12 text-center">
          <Card className="inline-block">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-3">Download em Lote</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md">
                Baixe todos os banners de uma vez clicando nos botões individuais acima
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                <Badge variant="outline" className="text-xs">
                  2 Stories (9:16)
                </Badge>
                <Badge variant="outline" className="text-xs">
                  2 Feed Posts (1:1)
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Alta Resolução
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}