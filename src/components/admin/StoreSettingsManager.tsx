"use client";

import { useState, useEffect } from 'react';
import { StoreSettings } from '@/types/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, Store, MessageCircle, Instagram, Facebook, Mail, Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export function StoreSettingsManager() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
  const [formData, setFormData] = useState({
    storeName: '',
    logo: '',
    whatsappNumber: '',
    whatsappMessage: '',
    instagram: '',
    facebook: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setFormData({
          storeName: data.storeName || '',
          logo: data.logo || '',
          whatsappNumber: data.whatsappNumber || '',
          whatsappMessage: data.whatsappMessage || '',
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          email: data.email || '',
          address: data.address || '',
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    // Validate file size (2MB max for logo)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('A logo deve ter no máximo 2MB');
      return;
    }

    setUploadingLogo(true);

    try {
      const formData = new FormData();
      formData.append('images', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const logoUrl = data.urls[0];
        setFormData(prev => ({ ...prev, logo: logoUrl }));
        toast.success('Logo enviada com sucesso!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao fazer upload da logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Erro ao fazer upload da logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: '' }));
    toast.success('Logo removida');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Configurações salvas com sucesso!');
        fetchSettings();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações da Loja</CardTitle>
        <CardDescription>
          Gerencie as informações e contatos da sua loja
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Informações da Loja</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeName">Nome da Loja</Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                placeholder="Loja A Grande Família"
              />
            </div>
            
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="logo">Logo da Loja</Label>
              <div className="space-y-3">
                {formData.logo ? (
                  <div className="relative inline-block">
                    <div className="relative w-48 h-48 border-2 border-border rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={formData.logo}
                        alt="Logo da loja"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2"
                      onClick={removeLogo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-48 h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center bg-muted/50">
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhuma logo</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                  <Label htmlFor="logo">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploadingLogo}
                      asChild
                    >
                      <span className="cursor-pointer">
                        {uploadingLogo ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            {formData.logo ? 'Alterar Logo' : 'Fazer Upload da Logo'}
                          </>
                        )}
                      </span>
                    </Button>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Imagem PNG, JPG ou WEBP (máx. 2MB). Recomendado: fundo transparente, 512x512px
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rua, número, bairro, cidade - UF"
                rows={2}
              />
            </div>
          </div>

          <Separator />

          {/* WhatsApp */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[var(--whatsapp)]" />
              <h3 className="text-lg font-semibold">WhatsApp</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">Número do WhatsApp</Label>
              <Input
                id="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="5593991084582"
              />
              <p className="text-xs text-muted-foreground">
                Formato: código do país + DDD + número (sem espaços ou símbolos)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappMessage">Mensagem Padrão do WhatsApp</Label>
              <Textarea
                id="whatsappMessage"
                value={formData.whatsappMessage}
                onChange={e => setFormData({ ...formData, whatsappMessage: e.target.value })}
                placeholder="Olá! Gostaria de saber mais sobre os produtos."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Esta mensagem será pré-preenchida quando o cliente clicar no botão WhatsApp
              </p>
            </div>
          </div>

          <Separator />

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Redes Sociais</h3>
            <div className="space-y-2">
              <Label htmlFor="instagram">
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </div>
              </Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://instagram.com/lojagrandefamilia"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">
                <div className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" />
                  Facebook
                </div>
              </Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="https://facebook.com/lojagrandefamilia"
              />
            </div>
          </div>

          <Separator />

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contato</h3>
            <div className="space-y-2">
              <Label htmlFor="email">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-mail
                </div>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="contato@lojagrandefamilia.com"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={saving} size="lg">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}