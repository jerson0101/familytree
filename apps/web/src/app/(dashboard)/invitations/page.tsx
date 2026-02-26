'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Skeleton,
  Avatar,
  Badge,
} from '@kintree/ui';
import { useFamilyInvitations } from '@/hooks/useFamilyInvitations';
import { useFamily } from '@/hooks/useFamily';
import { useFamilyStore } from '@/stores/familyStore';

export default function InvitationsPage() {
  const router = useRouter();
  const {
    sentInvitations,
    receivedInvitations,
    isLoading,
    acceptInvitation,
    rejectInvitation,
    cancelInvitation,
    resendInvitation,
  } = useFamilyInvitations();
  const { fetchFamilies } = useFamily();
  const setCurrentFamily = useFamilyStore((state) => state.setCurrentFamily);

  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAccept = async (invitationId: string) => {
    const invitation = receivedInvitations.find(inv => inv.id === invitationId);
    if (!invitation) return;

    setProcessingId(invitationId);
    try {
      const result = await acceptInvitation(invitationId);

      if (result.success && result.familyId) {
        setCurrentFamily({
          id: result.familyId,
          name: invitation.familyName || 'My Family',
          primaryColor: '#ff6b47',
          createdAt: new Date().toISOString(),
          memberCount: 1,
        });
        await fetchFamilies();
        setProcessingId(null);
        await new Promise(resolve => setTimeout(resolve, 300));
        router.push('/tree');
      } else {
        setProcessingId(null);
        alert(result.error || 'Error accepting invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setProcessingId(null);
      alert('Unexpected error accepting invitation');
    }
  };

  const handleReject = async (invitationId: string) => {
    setProcessingId(invitationId);
    await rejectInvitation(invitationId);
    setProcessingId(null);
  };

  const handleCancel = async (invitationId: string) => {
    setProcessingId(invitationId);
    await cancelInvitation(invitationId);
    setProcessingId(null);
  };

  const handleResend = async (invitationId: string) => {
    setProcessingId(invitationId);
    await resendInvitation(invitationId);
    setProcessingId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (isLoading) {
    return <InvitationsSkeleton />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-8 pb-24">
      <div className="mb-10 animate-fade-in">
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Invitations</h1>
        <p className="text-neutral-500 mt-2 text-lg">
          Manage your family connections
        </p>
      </div>

      <div className="space-y-8 animate-slide-up">
        {/* Received Invitations */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <InboxIcon className="w-5 h-5 text-neutral-400" />
            Received
            {receivedInvitations.length > 0 &&
              <span className="ml-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{receivedInvitations.length}</span>
            }
          </h2>

          {receivedInvitations.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
              <MailIcon className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 font-medium">No pending invitations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {receivedInvitations.map((invitation) => (
                <div key={invitation.id} className="p-5 rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-colors bg-neutral-50/50">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-white shrink-0">
                        <UsersIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900 text-lg">
                          {invitation.inviterName || 'Someone'} invited you
                        </p>
                        <p className="text-neutral-600">
                          Join <strong>{invitation.familyName}</strong> as <strong>{invitation.personName}</strong>
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          Sent on {formatDate(invitation.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto">
                      {isExpired(invitation.expiresAt) ? (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">Expired</span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleReject(invitation.id)}
                            disabled={processingId === invitation.id}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-neutral-600 font-medium hover:bg-neutral-200 transition-colors text-sm"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleAccept(invitation.id)}
                            disabled={processingId === invitation.id}
                            className="flex-1 sm:flex-none px-6 py-2 rounded-xl bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition-colors text-sm flex items-center justify-center gap-2"
                          >
                            {processingId === invitation.id && <Spinner className="w-4 h-4" />}
                            Accept
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sent Invitations */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <SendIcon className="w-5 h-5 text-neutral-400" />
            Sent
            {sentInvitations.length > 0 &&
              <span className="ml-2 bg-neutral-100 text-neutral-600 text-xs font-bold px-2 py-0.5 rounded-full">{sentInvitations.length}</span>
            }
          </h2>

          {sentInvitations.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
              <SendIcon className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 font-medium">No invitations sent yet</p>
              <button onClick={() => router.push('/tree')} className="mt-4 text-neutral-900 font-bold underline hover:text-neutral-700">
                Go to Tree to invite family
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sentInvitations.map((invitation) => {
                const expired = isExpired(invitation.expiresAt);
                return (
                  <div key={invitation.id} className="p-4 rounded-2xl border border-neutral-100 hover:border-neutral-200 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={invitation.personName || invitation.inviteeEmail} size="md" />
                      <div>
                        <p className="font-bold text-neutral-900 text-sm">
                          {invitation.personName || 'Relative'}
                        </p>
                        <p className="text-xs text-neutral-500">{invitation.inviteeEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <InvitationStatusBadge status={invitation.status} expired={expired} />

                      {invitation.status === 'pending' && (
                        expired ? (
                          <button
                            onClick={() => handleResend(invitation.id)}
                            disabled={processingId === invitation.id}
                            className="text-xs font-bold text-neutral-900 hover:text-neutral-600"
                          >
                            Resend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleCancel(invitation.id)}
                            disabled={processingId === invitation.id}
                            className="text-xs font-bold text-red-600 hover:text-red-400"
                          >
                            Cancel
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InvitationStatusBadge({ status, expired }: { status: string; expired: boolean }) {
  if (status === 'accepted') return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">Accepted</span>;
  if (status === 'rejected') return <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold">Rejected</span>;
  if (expired) return <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold">Expired</span>;
  return <span className="bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full text-xs font-bold">Pending</span>;
}

function InvitationsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-8">
      <Skeleton width={200} height={40} className="mb-10" />
      <Skeleton height={200} className="rounded-3xl mb-8" />
      <Skeleton height={200} className="rounded-3xl" />
    </div>
  );
}

// Icons
function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
