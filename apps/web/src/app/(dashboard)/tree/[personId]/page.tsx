'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Button,
  Avatar,
  Badge,
  Tabs,
  TabList,
  TabTrigger,
  TabContent,
  Timeline,
  TimelineItem,
  Skeleton,
  Dialog,
  DialogContent,
  DialogHeader,
  Input,
} from '@kintree/ui';
import { createClient } from '@/lib/supabase';
import { useFamily } from '@/hooks/useFamily';
import { useAuthStore } from '@/stores/authStore';
import { useFamilyTree } from '@/hooks/useFamilyTree';
import type { Gender } from '@kintree/shared';

interface Person {
  id: string;
  firstName: string;
  lastName?: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  isLiving: boolean;
  biography?: string;
  photoUrl?: string;
  linkedUserId?: string;
}

interface SocialAccount {
  id: string;
  platform: 'instagram' | 'facebook';
  username: string;
  displayName?: string;
  profilePictureUrl?: string;
  isActive: boolean;
}

interface SocialPost {
  id: string;
  platform: string;
  postType: string;
  content?: string;
  mediaUrls: string[];
  thumbnailUrl?: string;
  permalink?: string;
  likesCount: number;
  commentsCount: number;
  postedAt: string;
}

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const personId = params.personId as string;
  const supabase = useMemo(() => createClient(), []);
  const { currentFamily } = useFamily();
  const currentUser = useAuthStore((state) => state.user);

  const [person, setPerson] = useState<Person | null>(null);
  const [relatives, setRelatives] = useState<{
    parents: Person[];
    spouse?: Person;
    children: Person[];
    siblings: Person[];
  }>({ parents: [], children: [], siblings: [] });
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [isSyncing, setIsSyncing] = useState(false);

  // Edit/Delete state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    gender: 'male' as Gender,
    birthDate: '',
    birthPlace: '',
    isLiving: true,
  });

  // Get update/delete functions from hook
  const { updatePerson, deletePerson } = useFamilyTree();

  // Check if current user is the linked user for this person
  const isOwner = person?.linkedUserId && currentUser?.id === person.linkedUserId;

  // Fetch person data with retry logic
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;

    async function fetchData() {
      if (!personId) return;
      setIsLoading(true);

      try {
        // Fetch person
        const { data: personData, error: personError } = await supabase
          .from('persons')
          .select('*')
          .eq('id', personId)
          .single();

        if (personError) {
          // If access denied, might be due to family context not being set yet
          // Retry a few times with delay
          if (retryCount < maxRetries && (personError.code === 'PGRST116' || personError.code === '42501')) {
            retryCount++;
            console.log(`Retrying fetch person (${retryCount}/${maxRetries})...`);
            setTimeout(fetchData, 500 * retryCount);
            return;
          }
          console.error('Error fetching person:', personError);
          setIsLoading(false);
          return;
        }

        const mappedPerson: Person = {
          id: personData.id,
          firstName: personData.first_name,
          lastName: personData.last_name,
          gender: personData.gender,
          birthDate: personData.birth_date,
          birthPlace: personData.birth_place,
          deathDate: personData.death_date,
          isLiving: personData.is_living,
          biography: personData.biography,
          photoUrl: personData.photo_url,
          linkedUserId: personData.linked_user_id,
        };
        setPerson(mappedPerson);

        // Fetch relatives (simplified - would need more complex queries for full relationship mapping)
        const { data: unions } = await supabase
          .from('unions')
          .select('*, partner1:partner1_id(*), partner2:partner2_id(*)')
          .or(`partner1_id.eq.${personId},partner2_id.eq.${personId}`);

        if (unions && unions.length > 0) {
          const union = unions[0];
          const spouse = union.partner1_id === personId ? union.partner2 : union.partner1;
          if (spouse) {
            setRelatives(prev => ({
              ...prev,
              spouse: {
                id: spouse.id,
                firstName: spouse.first_name,
                lastName: spouse.last_name,
                gender: spouse.gender,
                isLiving: spouse.is_living,
              },
            }));
          }
        }

        // Fetch social accounts
        const { data: accounts } = await supabase
          .from('social_media_accounts')
          .select('*')
          .eq('person_id', personId)
          .eq('is_active', true);

        if (accounts) {
          setSocialAccounts(accounts.map((a: any) => ({
            id: a.id,
            platform: a.platform,
            username: a.username,
            displayName: a.display_name,
            profilePictureUrl: a.profile_picture_url,
            isActive: a.is_active,
          })));
        }

        // Fetch social posts
        const { data: posts } = await supabase
          .from('social_posts')
          .select('*')
          .eq('person_id', personId)
          .order('posted_at', { ascending: false })
          .limit(20);

        if (posts) {
          setSocialPosts(posts.map((p: any) => ({
            id: p.id,
            platform: p.account_id, // We'd need to join to get platform
            postType: p.post_type,
            content: p.content,
            mediaUrls: p.media_urls || [],
            thumbnailUrl: p.thumbnail_url,
            permalink: p.permalink,
            likesCount: p.likes_count,
            commentsCount: p.comments_count,
            postedAt: p.posted_at,
          })));
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [personId, supabase]);

  // Initialize edit form when person data loads
  useEffect(() => {
    if (person) {
      setEditForm({
        firstName: person.firstName,
        lastName: person.lastName || '',
        gender: person.gender,
        birthDate: person.birthDate || '',
        birthPlace: person.birthPlace || '',
        isLiving: person.isLiving,
      });
    }
  }, [person]);

  const handleOpenEdit = () => {
    if (person) {
      setEditForm({
        firstName: person.firstName,
        lastName: person.lastName || '',
        gender: person.gender,
        birthDate: person.birthDate || '',
        birthPlace: person.birthPlace || '',
        isLiving: person.isLiving,
      });
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!person) return;
    setIsSubmitting(true);
    try {
      const success = await updatePerson(person.id, {
        firstName: editForm.firstName,
        lastName: editForm.lastName || undefined,
        gender: editForm.gender,
        birthDate: editForm.birthDate || undefined,
        isLiving: editForm.isLiving,
      });
      if (success) {
        // Update local state
        setPerson({
          ...person,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          gender: editForm.gender,
          birthDate: editForm.birthDate,
          isLiving: editForm.isLiving,
        });
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error('Error updating person:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!person) return;
    setIsSubmitting(true);
    try {
      const success = await deletePerson(person.id);
      if (success) {
        router.push('/tree');
      }
    } catch (err) {
      console.error('Error deleting person:', err);
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleConnectSocial = (platform: 'instagram' | 'facebook') => {
    // Store personId in sessionStorage to link account after OAuth
    sessionStorage.setItem('linkToPersonId', personId);
    router.push(`/api/social/${platform}/connect`);
  };

  const handleSyncPosts = async (accountId: string) => {
    setIsSyncing(true);
    try {
      const response = await fetch(`/api/social/sync?accountId=${accountId}`, {
        method: 'POST',
      });
      const result = await response.json();

      if (result.success) {
        // Refresh posts
        const { data: posts } = await supabase
          .from('social_posts')
          .select('*')
          .eq('person_id', personId)
          .order('posted_at', { ascending: false })
          .limit(20);

        if (posts) {
          setSocialPosts(posts.map((p: any) => ({
            id: p.id,
            platform: p.account_id,
            postType: p.post_type,
            content: p.content,
            mediaUrls: p.media_urls || [],
            thumbnailUrl: p.thumbnail_url,
            permalink: p.permalink,
            likesCount: p.likes_count,
            commentsCount: p.comments_count,
            postedAt: p.posted_at,
          })));
        }
      }
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <Container size="md" padding={false}>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton width={40} height={40} />
          <Skeleton width={200} height={32} />
        </div>
        <Skeleton height={200} className="mb-6" />
        <Skeleton height={300} />
      </Container>
    );
  }

  if (!person) {
    return (
      <Container size="md" padding={false}>
        <Card padding="lg" className="text-center">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Persona no encontrada</h2>
          <p className="text-neutral-500 mb-4">No se pudo encontrar la persona solicitada.</p>
          <Button onClick={() => router.push('/tree')}>Volver al árbol</Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="md" padding={false}>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-neutral-900">Detalle de Persona</h1>
      </div>

      {/* Person Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <Avatar
                name={`${person.firstName} ${person.lastName || ''}`}
                size="xl"
                src={person.photoUrl}
              />
              <div className="mt-3 flex gap-2">
                {person.isLiving ? (
                  <Badge variant="success">Vivo</Badge>
                ) : (
                  <Badge variant="secondary">Fallecido</Badge>
                )}
                <Badge variant="secondary">
                  {person.gender === 'male' ? 'Hombre' : person.gender === 'female' ? 'Mujer' : 'Otro'}
                </Badge>
              </div>
              {isOwner && (
                <Badge variant="primary" className="mt-2">Tu perfil</Badge>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  {person.firstName} {person.lastName || ''}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {person.birthDate && (
                  <>
                    <InfoItem label="Fecha de Nacimiento" value={new Date(person.birthDate).toLocaleDateString('es')} />
                    <InfoItem label="Edad" value={`${calculateAge(person.birthDate)} años`} />
                  </>
                )}
                {person.birthPlace && (
                  <InfoItem label="Lugar de Nacimiento" value={person.birthPlace} />
                )}
              </div>

              {person.biography && (
                <p className="text-neutral-600 text-sm italic">{person.biography}</p>
              )}

              <div className="flex gap-2">
                <Button size="sm" onClick={handleOpenEdit}>Editar</Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/tree')}>
                  Ver en Árbol
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabList>
          <TabTrigger value="info">Información</TabTrigger>
          <TabTrigger value="family">Familia</TabTrigger>
          <TabTrigger value="social">
            Redes Sociales
            {socialAccounts.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">
                {socialAccounts.length}
              </span>
            )}
          </TabTrigger>
        </TabList>

        <TabContent value="info">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-neutral-900">Información Personal</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {person.birthDate && (
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-neutral-400" />
                    <span className="text-neutral-700">
                      Nacido el {new Date(person.birthDate).toLocaleDateString('es', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {person.birthPlace && (
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-5 h-5 text-neutral-400" />
                    <span className="text-neutral-700">{person.birthPlace}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabContent>

        <TabContent value="family">
          <div className="space-y-4">
            {relatives.spouse && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-neutral-900">Cónyuge</h3>
                </CardHeader>
                <CardContent>
                  <RelativeCard
                    person={relatives.spouse}
                    relationship="Esposo/a"
                    onClick={() => router.push(`/tree/${relatives.spouse!.id}`)}
                  />
                </CardContent>
              </Card>
            )}

            {relatives.parents.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-neutral-900">Padres</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {relatives.parents.map((parent) => (
                      <RelativeCard
                        key={parent.id}
                        person={parent}
                        relationship={parent.gender === 'male' ? 'Padre' : 'Madre'}
                        onClick={() => router.push(`/tree/${parent.id}`)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {relatives.children.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-neutral-900">Hijos</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {relatives.children.map((child) => (
                      <RelativeCard
                        key={child.id}
                        person={child}
                        relationship={child.gender === 'male' ? 'Hijo' : 'Hija'}
                        onClick={() => router.push(`/tree/${child.id}`)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabContent>

        <TabContent value="social">
          <div className="space-y-6">
            {/* Connected Accounts */}
            <Card>
              <CardHeader
                title="Cuentas Conectadas"
                subtitle={isOwner ? 'Conecta tus redes sociales para compartir publicaciones' : 'Redes sociales vinculadas'}
              />
              <CardContent>
                {socialAccounts.length === 0 ? (
                  <div className="text-center py-6">
                    <SocialIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500 mb-4">
                      {isOwner
                        ? 'Conecta tus redes sociales para mostrar tus publicaciones en el árbol familiar'
                        : 'Este familiar aún no ha conectado sus redes sociales'}
                    </p>
                    {isOwner && (
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConnectSocial('instagram')}
                        >
                          <InstagramIcon className="w-4 h-4 mr-2" />
                          Conectar Instagram
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConnectSocial('facebook')}
                        >
                          <FacebookIcon className="w-4 h-4 mr-2" />
                          Conectar Facebook
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {socialAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-neutral-200"
                      >
                        <div className="flex items-center gap-3">
                          {account.platform === 'instagram' ? (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                              <InstagramIcon className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                              <FacebookIcon className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-neutral-900">
                              {account.displayName || account.username}
                            </p>
                            <p className="text-sm text-neutral-500">@{account.username}</p>
                          </div>
                        </div>
                        {isOwner && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSyncPosts(account.id)}
                            loading={isSyncing}
                          >
                            <RefreshIcon className="w-4 h-4 mr-1" />
                            Sincronizar
                          </Button>
                        )}
                      </div>
                    ))}

                    {isOwner && (
                      <div className="flex gap-2 pt-2">
                        {!socialAccounts.find(a => a.platform === 'instagram') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConnectSocial('instagram')}
                          >
                            <InstagramIcon className="w-4 h-4 mr-2" />
                            Agregar Instagram
                          </Button>
                        )}
                        {!socialAccounts.find(a => a.platform === 'facebook') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConnectSocial('facebook')}
                          >
                            <FacebookIcon className="w-4 h-4 mr-2" />
                            Agregar Facebook
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Posts */}
            {socialPosts.length > 0 && (
              <Card>
                <CardHeader title="Publicaciones Recientes" />
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {socialPosts.map((post) => (
                      <a
                        key={post.id}
                        href={post.permalink || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-square rounded-xl overflow-hidden bg-neutral-100 hover:opacity-90 transition-opacity relative group"
                      >
                        {post.thumbnailUrl || (post.mediaUrls && post.mediaUrls[0]) ? (
                          <img
                            src={post.thumbnailUrl || post.mediaUrls[0]}
                            alt={post.content?.slice(0, 50) || 'Post'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-3">
                            <p className="text-xs text-neutral-500 line-clamp-4">{post.content}</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-sm">
                          <span className="flex items-center gap-1">
                            <HeartIcon className="w-4 h-4" />
                            {post.likesCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <CommentIcon className="w-4 h-4" />
                            {post.commentsCount}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabContent>
      </Tabs>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <DialogHeader title="Editar Persona" onClose={() => setIsEditModalOpen(false)} />
        <DialogContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nombre"
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                required
                fullWidth
              />
              <Input
                label="Apellido"
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                fullWidth
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Género
              </label>
              <select
                value={editForm.gender}
                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as Gender })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <Input
              label="Fecha de nacimiento"
              type="date"
              value={editForm.birthDate}
              onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
              fullWidth
            />

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editForm.isLiving}
                onChange={(e) => setEditForm({ ...editForm, isLiving: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">Persona viva</span>
            </label>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                fullWidth
                onClick={handleSaveEdit}
                loading={isSubmitting}
                disabled={!editForm.firstName.trim()}
              >
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogHeader title="Eliminar Persona" onClose={() => setIsDeleteDialogOpen(false)} />
        <DialogContent>
          <div className="space-y-4">
            <p className="text-neutral-600">
              ¿Estás seguro de que deseas eliminar a <strong>{person?.firstName} {person?.lastName}</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                fullWidth
                onClick={handleDelete}
                loading={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-neutral-500 text-xs uppercase tracking-wide">{label}</p>
      <p className="text-neutral-900 font-medium">{value}</p>
    </div>
  );
}

function RelativeCard({
  person,
  relationship,
  onClick,
}: {
  person: Person;
  relationship: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left"
    >
      <Avatar name={`${person.firstName} ${person.lastName || ''}`} size="md" />
      <div className="flex-1">
        <p className="font-medium text-neutral-900">
          {person.firstName} {person.lastName || ''}
        </p>
        <p className="text-sm text-neutral-500">{relationship}</p>
      </div>
    </button>
  );
}

// Icons
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SocialIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="18" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
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

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}
