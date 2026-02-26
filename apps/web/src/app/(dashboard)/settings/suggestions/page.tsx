'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Avatar,
  Badge,
} from '@kintree/ui';

interface Suggestion {
  id: string;
  entityType: string;
  changeType: string;
  suggestedBy: { id: string; name: string };
  suggestedAt: string;
  status: string;
  currentData: Record<string, unknown> | null;
  suggestedData: Record<string, unknown> | null;
  reason: string;
  entityName: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    entityType: 'person',
    changeType: 'update',
    suggestedBy: { id: '4', name: 'María López' },
    suggestedAt: '2024-01-15T10:30:00Z',
    status: 'pending',
    currentData: { occupation: 'Ingeniero' },
    suggestedData: { occupation: 'Ingeniero de Software Senior' },
    reason: 'Actualizar el puesto actual de trabajo',
    entityName: 'Juan García',
  },
  {
    id: '2',
    entityType: 'person',
    changeType: 'create',
    suggestedBy: { id: '4', name: 'María López' },
    suggestedAt: '2024-01-14T15:00:00Z',
    status: 'pending',
    currentData: null,
    suggestedData: { firstName: 'Pedro', lastName: 'García', relationship: 'Tío' },
    reason: 'Agregar al tío Pedro que falta en el árbol',
    entityName: 'Nueva Persona',
  },
  {
    id: '3',
    entityType: 'person',
    changeType: 'update',
    suggestedBy: { id: '3', name: 'Carlos García' },
    suggestedAt: '2024-01-13T09:00:00Z',
    status: 'approved',
    currentData: { birthPlace: 'México' },
    suggestedData: { birthPlace: 'Ciudad de México, México' },
    reason: 'Especificar la ciudad de nacimiento',
    entityName: 'Ana Martínez',
    reviewedBy: 'Juan García',
    reviewedAt: '2024-01-13T12:00:00Z',
  },
  {
    id: '4',
    entityType: 'relationship',
    changeType: 'delete',
    suggestedBy: { id: '4', name: 'María López' },
    suggestedAt: '2024-01-12T11:00:00Z',
    status: 'rejected',
    currentData: { type: 'sibling' },
    suggestedData: null,
    reason: 'Esta relación parece incorrecta',
    entityName: 'Relación: Juan - Laura',
    reviewedBy: 'Juan García',
    reviewedAt: '2024-01-12T14:00:00Z',
    reviewNotes: 'La relación es correcta, son medios hermanos',
  },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const statusLabels = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada',
};

const changeTypeLabels = {
  create: 'Crear',
  update: 'Actualizar',
  delete: 'Eliminar',
};

export default function SuggestionsPage() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState(mockSuggestions);
  const [filter, setFilter] = useState('pending');

  const filteredSuggestions = suggestions.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const handleApprove = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
            ...s,
            status: 'approved',
            reviewedBy: 'Usuario Actual',
            reviewedAt: new Date().toISOString(),
          }
          : s
      )
    );
  };

  const handleReject = (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
            ...s,
            status: 'rejected',
            reviewedBy: 'Usuario Actual',
            reviewedAt: new Date().toISOString(),
          }
          : s
      )
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pendingCount = suggestions.filter((s) => s.status === 'pending').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-neutral-900">
          Cola de Sugerencias
          {pendingCount > 0 && (
            <Badge variant="warning" className="ml-2">{pendingCount}</Badge>
          )}
        </h1>
      </div>

      <p className="text-neutral-600">
        Revisa y aprueba los cambios sugeridos por miembros con permisos limitados.
      </p>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['pending', 'approved', 'rejected', 'all'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'pending' && 'Pendientes'}
            {f === 'approved' && 'Aprobadas'}
            {f === 'rejected' && 'Rechazadas'}
            {f === 'all' && 'Todas'}
          </Button>
        ))}
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {filteredSuggestions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-neutral-500">
              No hay sugerencias {filter !== 'all' ? statusLabels[filter as keyof typeof statusLabels].toLowerCase() + 's' : ''}
            </CardContent>
          </Card>
        ) : (
          filteredSuggestions.map((suggestion) => {
            const statusColor = statusColors[suggestion.status as keyof typeof statusColors];
            const statusLabel = statusLabels[suggestion.status as keyof typeof statusLabels];
            const changeLabel = changeTypeLabels[suggestion.changeType as keyof typeof changeTypeLabels];

            return (
              <Card key={suggestion.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={suggestion.suggestedBy.name} size="sm" />
                      <div>
                        <p className="font-medium text-neutral-900">
                          {suggestion.suggestedBy.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatDate(suggestion.suggestedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{changeLabel}</Badge>
                      <span className={'px-2 py-1 rounded-full text-xs font-medium ' + statusColor}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-3 mb-3">
                    <p className="text-sm font-medium text-neutral-900 mb-1">
                      {suggestion.entityName}
                    </p>
                    {suggestion.reason && (
                      <p className="text-sm text-neutral-600">{suggestion.reason}</p>
                    )}
                    {suggestion.suggestedData && (
                      <div className="mt-2 text-xs text-neutral-500">
                        <span className="font-medium">Datos sugeridos: </span>
                        {JSON.stringify(suggestion.suggestedData)}
                      </div>
                    )}
                  </div>

                  {suggestion.status === 'pending' ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(suggestion.id)}
                      >
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Aprobar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(suggestion.id)}
                      >
                        <XIcon className="w-4 h-4 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-500">
                      Revisado por {suggestion.reviewedBy} el{' '}
                      {suggestion.reviewedAt && formatDate(suggestion.reviewedAt)}
                      {suggestion.reviewNotes && (
                        <p className="mt-1 italic">Nota: {suggestion.reviewNotes}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
