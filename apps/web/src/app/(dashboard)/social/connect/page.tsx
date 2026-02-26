'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  Button,
  Badge,
  Skeleton,
} from '@kintree/ui';
import { useFamily } from '@/hooks/useFamily';
import { createClient } from '@/lib/supabase';

interface ConnectedAccount {
  id: string;
  platform: 'instagram' | 'facebook';
  username: string;
  displayName: string;
  profilePicture: string | null;
  isActive: boolean;
  lastSync: string | null;
}

const socialPlatforms = [
  {
    id: 'instagram' as const,
    name: 'Instagram',
    icon: InstagramIcon,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    description: 'Comparte fotos y momentos de tu vida diaria',
  },
  {
    id: 'facebook' as const,
    name: 'Facebook',
    icon: FacebookIcon,
    color: 'bg-blue-600',
    description: 'Conecta con tu familia y amigos',
  },
];

export default function SocialConnectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentFamily, isLoading: familyLoading } = useFamily();
  const supabase = useMemo(() => createClient(), []);

  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check for success/error from OAuth callback
  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const provider = searchParams.get('provider');

    if (success === 'true' && provider) {
      setMessage({ type: 'success', text: `¡${provider} conectado exitosamente!` });
      // Clear URL params
      router.replace('/social/connect');
      // Refresh accounts
      fetchConnectedAccounts();
    } else if (error) {
      const errorMessages: Record<string, string> = {
        missing_params: 'Faltan parámetros de autenticación',
        token_exchange_failed: 'Error al obtener el token de acceso',
        no_pages_found: 'No se encontraron páginas de Facebook. Instagram requiere una cuenta de negocio vinculada a una página de Facebook.',
        save_failed: 'Error al guardar la cuenta',
        connection_failed: 'Error de conexión',
        state_expired: 'La sesión expiró. Intenta nuevamente.',
        invalid_state: 'Estado de sesión inválido',
      };
      setMessage({ type: 'error', text: errorMessages[error] || `Error: ${error}` });
      router.replace('/social/connect');
    }
  }, [searchParams, router]);

  // Fetch connected accounts
  const fetchConnectedAccounts = async () => {
    if (!currentFamily?.id) {
      setConnectedAccounts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('social_media_accounts')
        .select('id, platform, username, display_name, profile_picture_url, is_active, last_synced_at')
        .eq('family_id', currentFamily.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching accounts:', error);
      }

      const accounts: ConnectedAccount[] = (data || []).map((acc: any) => ({
        id: acc.id,
        platform: acc.platform,
        username: acc.username,
        displayName: acc.display_name || acc.username,
        profilePicture: acc.profile_picture_url,
        isActive: acc.is_active,
        lastSync: acc.last_synced_at,
      }));

      setConnectedAccounts(accounts);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentFamily?.id) {
      fetchConnectedAccounts();
    }
  }, [currentFamily?.id]);

  const handleConnect = (platformId: string) => {
    if (!currentFamily?.id) {
      setMessage({ type: 'error', text: 'Primero debes crear una familia' });
      return;
    }

    setIsConnecting(platformId);
    // Redirect to OAuth flow
    const connectUrl = `/api/social/${platformId}/connect?familyId=${currentFamily.id}`;
    window.location.href = connectUrl;
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from('social_media_accounts')
        .update({ is_active: false })
        .eq('id', accountId);

      if (error) throw error;

      setConnectedAccounts((prev) => prev.filter((a) => a.id !== accountId));
      setMessage({ type: 'success', text: 'Cuenta desconectada' });
    } catch (err) {
      console.error('Error disconnecting:', err);
      setMessage({ type: 'error', text: 'Error al desconectar la cuenta' });
    }
  };

  const handleSync = async (accountId: string) => {
    try {
      // Call sync API
      const response = await fetch(`/api/social/sync?accountId=${accountId}`, {
        method: 'POST',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Sincronización iniciada' });
        // Update last sync time
        setConnectedAccounts((prev) =>
          prev.map((a) =>
            a.id === accountId ? { ...a, lastSync: new Date().toISOString() } : a
          )
        );
      } else {
        throw new Error('Sync failed');
      }
    } catch (err) {
      console.error('Error syncing:', err);
      setMessage({ type: 'error', text: 'Error al sincronizar' });
    }
  };

  const formatLastSync = (dateStr: string | null) => {
    if (!dateStr) return 'Nunca';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (familyLoading || isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton width={250} height={32} />
        <Skeleton height={100} />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton height={200} />
          <Skeleton height={200} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-neutral-900">Conectar Redes Sociales</h1>
      </div>

      <p className="text-neutral-600">
        Conecta tus redes sociales para compartir automáticamente tus publicaciones
        con tu familia en el feed familiar.
      </p>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-xl ${
          message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
          <button
            onClick={() => setMessage(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Connected Accounts */}
      {connectedAccounts.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-neutral-900">Cuentas Conectadas</h2>
          {connectedAccounts.map((account) => {
            const platform = socialPlatforms.find((p) => p.id === account.platform);
            if (!platform) return null;
            const IconComponent = platform.icon;

            return (
              <Card key={account.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={'w-12 h-12 rounded-xl flex items-center justify-center text-white ' + platform.color}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-neutral-900">{platform.name}</p>
                          {account.isActive && <Badge variant="success">Activa</Badge>}
                        </div>
                        <p className="text-sm text-neutral-600">@{account.username}</p>
                        <p className="text-xs text-neutral-400">
                          Última sincronización: {formatLastSync(account.lastSync)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(account.id)}
                      >
                        <RefreshIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(account.id)}
                      >
                        Desconectar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Available Platforms */}
      <div className="space-y-4">
        <h2 className="font-semibold text-neutral-900">Plataformas Disponibles</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {socialPlatforms.map((platform) => {
            const isConnected = connectedAccounts.some((a) => a.platform === platform.id);
            const IconComponent = platform.icon;

            return (
              <Card key={platform.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={'w-14 h-14 rounded-xl flex items-center justify-center text-white ' + platform.color}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">{platform.name}</p>
                      <p className="text-sm text-neutral-600">{platform.description}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      className="w-full"
                      variant={isConnected ? 'outline' : 'primary'}
                      disabled={isConnected || isConnecting === platform.id}
                      onClick={() => handleConnect(platform.id)}
                    >
                      {isConnecting === platform.id ? (
                        'Conectando...'
                      ) : isConnected ? (
                        'Conectada'
                      ) : (
                        'Conectar'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Privacy Notice */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ShieldIcon className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-neutral-900">Tu privacidad es importante</p>
              <p className="text-sm text-neutral-600 mt-1">
                Solo se compartirán las publicaciones que hagas después de conectar tu cuenta.
                Tus publicaciones anteriores no se importarán. Puedes desconectar en cualquier momento.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <InfoIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-neutral-900">Requisitos para Instagram</p>
              <ul className="text-sm text-neutral-600 mt-1 list-disc list-inside space-y-1">
                <li>Tu cuenta de Instagram debe ser una cuenta de negocio o creador</li>
                <li>Debe estar vinculada a una página de Facebook</li>
                <li>Debes ser administrador de esa página de Facebook</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 4v6h-6M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}
