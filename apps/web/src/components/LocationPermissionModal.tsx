'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogContent,
  Button,
} from '@kintree/ui';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnable: () => Promise<boolean>;
  onSkip?: () => void;
}

export default function LocationPermissionModal({
  isOpen,
  onClose,
  onEnable,
  onSkip,
}: LocationPermissionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnable = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await onEnable();
      if (success) {
        onClose();
      } else {
        setError('No se pudo habilitar la ubicación. Por favor, permite el acceso en la configuración de tu navegador.');
      }
    } catch (err) {
      setError('Error al solicitar permisos de ubicación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onSkip?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="max-h-[85vh] flex flex-col">
      <DialogHeader title="Compartir Ubicación" onClose={onClose} />
      <DialogContent className="overflow-y-auto flex-1">
        <div className="text-center">
          {/* Icon */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-200">
            <LocationIcon className="w-12 h-12 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-neutral-800 mb-3">
            Mantén a tu familia conectada
          </h3>

          {/* Description */}
          <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
            Comparte tu ubicación con tu familia para que puedan saber dónde estás y mantenerse seguros juntos.
          </p>

          {/* Features */}
          <div className="space-y-3 mb-6 text-left max-w-sm mx-auto">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckIcon className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800 text-sm">Seguridad familiar</p>
                <p className="text-xs text-green-600">Tus familiares podrán ver tu ubicación en tiempo real</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <ShieldIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-800 text-sm">Privacidad controlada</p>
                <p className="text-xs text-blue-600">Puedes desactivar la ubicación cuando quieras</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <BellIcon className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-amber-800 text-sm">Alertas de zona</p>
                <p className="text-xs text-amber-600">Recibe notificaciones cuando alguien llegue a casa</p>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              fullWidth
              onClick={handleEnable}
              loading={isLoading}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
            >
              <LocationIcon className="w-4 h-4 mr-2" />
              Compartir mi ubicación
            </Button>

            <Button
              variant="ghost"
              fullWidth
              onClick={handleSkip}
              disabled={isLoading}
            >
              Ahora no
            </Button>
          </div>

          {/* Privacy note */}
          <p className="text-xs text-neutral-400 mt-4">
            Tu ubicación solo se compartirá con los miembros de tu familia.
            Puedes cambiar esto en cualquier momento en Configuración.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Icons
function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
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

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}
