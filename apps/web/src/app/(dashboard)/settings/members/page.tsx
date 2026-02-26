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
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  Input,
} from '@kintree/ui';

const mockMembers = [
  {
    id: '1',
    name: 'Juan García',
    email: 'juan@example.com',
    role: 'owner',
    status: 'active',
    joinedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Ana Martínez',
    email: 'ana@example.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-05',
  },
  {
    id: '3',
    name: 'Carlos García',
    email: 'carlos@example.com',
    role: 'editor',
    status: 'active',
    joinedAt: '2024-01-10',
  },
  {
    id: '4',
    name: 'María López',
    email: 'maria@example.com',
    role: 'suggest_only',
    status: 'active',
    joinedAt: '2024-01-15',
  },
  {
    id: '5',
    name: 'Pedro Hernández',
    email: 'pedro@example.com',
    role: 'viewer',
    status: 'pending',
    joinedAt: null,
  },
];

const roleLabels = {
  owner: 'Owner',
  admin: 'Admin',
  editor: 'Editor',
  suggest_only: 'Suggestions Only',
  viewer: 'Read Only',
};

const roleColors = {
  owner: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-blue-700',
  editor: 'bg-green-100 text-green-700',
  suggest_only: 'bg-yellow-100 text-yellow-700',
  viewer: 'bg-neutral-100 text-neutral-700',
};

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState(mockMembers);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');

  const handleInvite = () => {
    if (!inviteEmail) return;
    const newMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'pending',
      joinedAt: null,
    };
    setMembers((prev) => [...prev, newMember]);
    setShowInviteDialog(false);
    setInviteEmail('');
    setInviteRole('viewer');
  };

  const handleRoleChange = (memberId: string, newRole: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
  };

  const handleRemove = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-neutral-900">Family Members</h1>
        </div>
        <Button onClick={() => setShowInviteDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Invite
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-neutral-900">{members.length} members</h3>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-neutral-100">
            {members.map((member) => {
              const roleLabel = roleLabels[member.role as keyof typeof roleLabels];
              const roleColor = roleColors[member.role as keyof typeof roleColors];

              return (
                <div key={member.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar name={member.name} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-neutral-900">{member.name}</p>
                        {member.status === 'pending' && (
                          <Badge variant="warning">Pending</Badge>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={'px-3 py-1 rounded-full text-xs font-medium ' + roleColor}>
                      {roleLabel}
                    </span>
                    {member.role !== 'owner' && (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className="text-sm border border-neutral-200 rounded-lg px-2 py-1"
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="suggest_only">Suggestions Only</option>
                        <option value="viewer">Read Only</option>
                      </select>
                    )}
                    {member.role !== 'owner' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(member.id)}
                      >
                        <TrashIcon className="w-4 h-4 text-neutral-400" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Role Descriptions */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-neutral-900">Role Descriptions</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-neutral-900">Owner:</span>
              <span className="text-neutral-600 ml-2">Full control of the family</span>
            </div>
            <div>
              <span className="font-medium text-neutral-900">Admin:</span>
              <span className="text-neutral-600 ml-2">Can manage members and settings</span>
            </div>
            <div>
              <span className="font-medium text-neutral-900">Editor:</span>
              <span className="text-neutral-600 ml-2">Can edit people and relationships</span>
            </div>
            <div>
              <span className="font-medium text-neutral-900">Suggestions Only:</span>
              <span className="text-neutral-600 ml-2">Can only suggest changes for review</span>
            </div>
            <div>
              <span className="font-medium text-neutral-900">Read Only:</span>
              <span className="text-neutral-600 ml-2">Can only view the tree</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onClose={() => setShowInviteDialog(false)}>
        <DialogHeader>
          <h2 className="text-lg font-semibold">Invite Member</h2>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Role
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-xl"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="suggest_only">Suggestions Only</option>
                <option value="viewer">Read Only</option>
              </select>
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleInvite}>
            Send Invitation
          </Button>
        </DialogFooter>
      </Dialog>
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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}
