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
import { Loader2, Save, Store, MessageCircle, Instagram, Facebook, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export function StoreSettingsManager() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    storeName: '',
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
