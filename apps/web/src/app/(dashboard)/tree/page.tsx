'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Container,
  Card,
  Button,
  SearchInput,
  Tabs,
  TabList,
  TabTrigger,
  TabContent,
  Avatar,
  Skeleton,
  Dialog,
  DialogContent,
  DialogHeader,
  Input,
  Badge,
} from '@kintree/ui';
import { useTreeLayout } from '@/hooks/useTreeLayout';
import { useFamilyTree, type RelationshipTypeOption, type MedicalCondition } from '@/hooks/useFamilyTree';
import { useFamilyInvitations } from '@/hooks/useFamilyInvitations';
import type { GraphNode, Viewport, PersonNodeData } from '@kintree/graph-engine';
import type { Gender } from '@kintree/shared';

// Common medical conditions for family history
const COMMON_MEDICAL_CONDITIONS = [
  { id: 'diabetes', name: 'Diabetes', icon: <BloodIcon /> },
  { id: 'hypertension', name: 'Hypertension', icon: <HeartIcon /> },
  { id: 'heart_disease', name: 'Heart Disease', icon: <HeartAnatomyIcon /> },
  { id: 'cancer', name: 'Cancer', icon: <RibbonIcon /> },
  { id: 'asthma', name: 'Asthma', icon: <LungsIcon /> },
  { id: 'alzheimers', name: 'Alzheimer\'s', icon: <BrainIcon /> },
  { id: 'depression', name: 'Depression', icon: <BrainIcon /> },
  { id: 'arthritis', name: 'Arthritis', icon: <BoneIcon /> },
  { id: 'thyroid', name: 'Thyroid', icon: <ButterflyIcon /> },
  { id: 'obesity', name: 'Obesity', icon: <ScaleIcon /> },
];

// Relationship options for the dropdown
const RELATIONSHIP_OPTIONS: { value: RelationshipTypeOption; label: string; requiresRelatedPerson: boolean }[] = [
  { value: 'self', label: 'Myself (Main Person)', requiresRelatedPerson: false },
  { value: 'father', label: 'Father', requiresRelatedPerson: true },
  { value: 'mother', label: 'Mother', requiresRelatedPerson: true },
  { value: 'spouse', label: 'Spouse', requiresRelatedPerson: true },
  { value: 'son', label: 'Son', requiresRelatedPerson: true },
  { value: 'daughter', label: 'Daughter', requiresRelatedPerson: true },
  { value: 'brother', label: 'Brother', requiresRelatedPerson: true },
  { value: 'sister', label: 'Sister', requiresRelatedPerson: true },
  { value: 'grandfather_paternal', label: 'Paternal Grandfather', requiresRelatedPerson: true },
  { value: 'grandmother_paternal', label: 'Paternal Grandmother', requiresRelatedPerson: true },
  { value: 'grandfather_maternal', label: 'Maternal Grandfather', requiresRelatedPerson: true },
  { value: 'grandmother_maternal', label: 'Maternal Grandmother', requiresRelatedPerson: true },
  { value: 'uncle', label: 'Uncle', requiresRelatedPerson: true },
  { value: 'aunt', label: 'Aunt', requiresRelatedPerson: true },
  { value: 'cousin', label: 'Cousin', requiresRelatedPerson: true },
];

// Initial viewport state
const INITIAL_VIEWPORT: Viewport = {
  x: 0,
  y: 0,
  scale: 0.8,
  width: 800,
  height: 600,
};

export default function TreePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState('tree');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewport, setViewport] = useState<Viewport>(INITIAL_VIEWPORT);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<{ x: number; y: number } | null>(null);

  // Modal state for adding person
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invitationSent, setInvitationSent] = useState(false);
  const [invitationError, setInvitationError] = useState<string | null>(null);
  const [newPerson, setNewPerson] = useState({
    firstName: '',
    lastName: '',
    gender: 'male' as Gender,
    birthDate: '',
    birthPlace: '',
    isLiving: true,
    email: '',
    sendInvitation: false,
    relationshipType: 'self' as RelationshipTypeOption,
    relatedToPersonId: '',
    medicalConditions: [] as MedicalCondition[],
  });

  // Get real data from Supabase
  const { graphData, persons, isLoading: dataLoading, createPersonWithRelationship, getRootPerson, getPersonRole } = useFamilyTree();
  const { sendInvitation } = useFamilyInvitations();

  // Get the root person for default "related to" selection
  const rootPerson = getRootPerson();

  // Handle adding a new person
  const handleAddPerson = async () => {
    if (!newPerson.firstName.trim() || !newPerson.birthPlace.trim()) {
      setInvitationError('Name and birth place are required');
      return;
    }

    // Validate: if not "self", must select a related person
    const requiresRelated = RELATIONSHIP_OPTIONS.find(o => o.value === newPerson.relationshipType)?.requiresRelatedPerson;
    if (requiresRelated && !newPerson.relatedToPersonId) {
      setInvitationError('You must select who they are related to');
      return;
    }

    setIsSubmitting(true);
    setInvitationError(null);
    setInvitationSent(false);

    try {
      const result = await createPersonWithRelationship({
        firstName: newPerson.firstName.trim(),
        lastName: newPerson.lastName.trim() || undefined,
        gender: newPerson.gender,
        birthDate: newPerson.birthDate || undefined,
        birthPlace: newPerson.birthPlace,
        isLiving: newPerson.isLiving,
        relationshipType: newPerson.relationshipType,
        relatedToPersonId: newPerson.relatedToPersonId || undefined,
        medicalConditions: newPerson.medicalConditions.length > 0 ? newPerson.medicalConditions : undefined,
      });

      if (result) {
        // Send invitation if email provided
        if (newPerson.sendInvitation && newPerson.email.trim()) {
          const invResult = await sendInvitation(
            result.id,
            newPerson.email.trim(),
            `I invite you to join our family tree as ${newPerson.firstName}`
          );

          if (invResult.success) {
            setInvitationSent(true);
          } else {
            setInvitationError(invResult.error || 'Error sending invitation');
          }
        }

        // Reset form and close modal
        setNewPerson({
          firstName: '',
          lastName: '',
          gender: 'male',
          birthDate: '',
          birthPlace: '',
          isLiving: true,
          email: '',
          sendInvitation: false,
          relationshipType: persons.length === 0 ? 'self' : 'son',
          relatedToPersonId: rootPerson?.id || '',
          medicalConditions: [],
        });
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating person:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute layout from real data with root person
  const { nodes, edges, bounds, generations } = useTreeLayout(
    graphData?.persons?.length > 0 ? graphData : null,
    { rootPersonId: rootPerson?.id }
  );

  // Update viewport size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setViewport((v) => ({ ...v, width: rect.width, height: rect.height }));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Center the tree on initial load
  useEffect(() => {
    if (bounds.width > 0 && bounds.height > 0) {
      const centerX = (bounds.minX + bounds.maxX) / 2;
      const centerY = (bounds.minY + bounds.maxY) / 2;
      setViewport((v) => ({
        ...v,
        x: centerX,
        y: centerY,
        scale: Math.min(
          v.width / (bounds.width + 100),
          v.height / (bounds.height + 100),
          1
        ),
      }));
    }
  }, [bounds]);

  // Handle node click
  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      if (node.type === 'person') {
        const data = node.data as PersonNodeData;
        setSelectedNodeId(node.id);
        router.push(`/tree/${data.personId}`);
      }
    },
    [router]
  );

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning || !lastPanPoint) return;
      const dx = e.clientX - lastPanPoint.x;
      const dy = e.clientY - lastPanPoint.y;
      setViewport((v) => ({
        ...v,
        x: v.x - dx / v.scale,
        y: v.y - dy / v.scale,
      }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    },
    [isPanning, lastPanPoint]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setLastPanPoint(null);
  }, []);

  // Zoom handlers
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;

    setViewport((v) => {
      const newScale = Math.min(Math.max(v.scale * delta, 0.1), 3);
      const scaleRatio = newScale / v.scale;
      return {
        ...v,
        x: v.x + (mouseX / v.scale - v.width / 2 / v.scale) * (1 - 1 / scaleRatio),
        y: v.y + (mouseY / v.scale - v.height / 2 / v.scale) * (1 - 1 / scaleRatio),
        scale: newScale,
      };
    });
  }, []);

  const handleZoomIn = useCallback(() => {
    setViewport((v) => ({ ...v, scale: Math.min(v.scale * 1.2, 3) }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setViewport((v) => ({ ...v, scale: Math.max(v.scale / 1.2, 0.1) }));
  }, []);

  const handleFitToScreen = useCallback(() => {
    if (bounds.width > 0) {
      const centerX = (bounds.minX + bounds.maxX) / 2;
      const centerY = (bounds.minY + bounds.maxY) / 2;
      setViewport((v) => ({
        ...v,
        x: centerX,
        y: centerY,
        scale: Math.min(v.width / (bounds.width + 100), v.height / (bounds.height + 100), 1),
      }));
    }
  }, [bounds]);

  // Transform for SVG
  const transform = `translate(${viewport.width / 2 - viewport.x * viewport.scale}, ${viewport.height / 2 - viewport.y * viewport.scale
    }) scale(${viewport.scale})`;

  // Show loading state
  if (dataLoading) {
    return (
      <Container size="full" padding={false}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Skeleton width={250} height={32} />
            <Skeleton width={150} height={20} className="mt-2" />
          </div>
        </div>
        <Skeleton height={500} className="rounded-2xl" />
      </Container>
    );
  }

  const personCount = persons.length;

  return (
    <Container size="full" padding={false}>
      {/* Header with gradient text */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary">Family Tree</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="primary" glow>
              <UsersSmallIcon className="w-3 h-3 mr-1" />
              {personCount} people
            </Badge>
            <Badge variant="secondary">
              <LayersIcon className="w-3 h-3 mr-1" />
              {generations || 0} generations
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Search family..."
            onChange={setSearchQuery}
            onSearch={(q) => console.log('Search:', q)}
            className="w-64"
          />
          <Button leftIcon={<PlusIcon />} onClick={() => setIsAddModalOpen(true)}>
            Add Person
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs value={viewMode} onChange={setViewMode}>
        <TabList variant="default" className="mb-6">
          <TabTrigger value="tree" icon={<TreeIcon />}>
            Tree View
          </TabTrigger>
          <TabTrigger value="genogram" icon={<GenogramIcon />}>
            Genogram
          </TabTrigger>
          <TabTrigger value="list" icon={<ListIcon />}>
            List View
          </TabTrigger>
        </TabList>

        <TabContent value="tree">
          {/* Tree container - Clean and Premium */}
          <div className="relative h-[calc(100vh-280px)] min-h-[500px] rounded-3xl border border-neutral-200 bg-neutral-50/30 overflow-hidden shadow-sm">
            {/* SVG Canvas */}
            <div
              ref={containerRef}
              className="w-full h-full bg-neutral-50/50 relative z-10"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
            >
              <svg width={viewport.width} height={viewport.height} className="absolute inset-0">
                <defs>
                  {/* Enhanced shadow filter */}
                  <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.08" />
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.06" />
                  </filter>
                  {/* Gradient for male nodes */}
                  <linearGradient id="maleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  {/* Gradient for female nodes */}
                  <linearGradient id="femaleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  {/* Gradient for selected state */}
                  <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff6b47" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  {/* Edge gradient */}
                  <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#d4d4d4" />
                    <stop offset="100%" stopColor="#a3a3a3" />
                  </linearGradient>
                </defs>

                <g transform={transform}>
                  {/* Render edges with gradient */}
                  {edges.map((edge) => (
                    <path
                      key={edge.id}
                      d={edge.pathData || ''}
                      fill="none"
                      stroke="url(#edgeGradient)"
                      strokeWidth={2.5}
                      className="transition-colors"
                      strokeLinecap="round"
                    />
                  ))}

                  {/* Render nodes */}
                  {nodes.map((node) => {
                    if (node.type === 'person') {
                      const data = node.data as PersonNodeData;
                      const isSelected = selectedNodeId === node.id;
                      const gradientId = isSelected ? 'selectedGradient' : data.gender === 'male' ? 'maleGradient' : 'femaleGradient';
                      const personRole = getPersonRole(data.personId);

                      return (
                        <g
                          key={node.id}
                          transform={`translate(${node.x - node.width / 2}, ${node.y - node.height / 2})`}
                          onClick={() => handleNodeClick(node)}
                          className="cursor-pointer transition-transform hover:scale-105"
                          style={{ transformOrigin: 'center' }}
                        >
                          {/* Card background with gradient border */}
                          <rect
                            width={node.width}
                            height={node.height}
                            rx={16}
                            fill="white"
                            filter="url(#shadow)"
                          />
                          {/* Gradient border overlay */}
                          <rect
                            width={node.width}
                            height={node.height}
                            rx={16}
                            fill="none"
                            stroke={`url(#${gradientId})`}
                            strokeWidth={isSelected ? 3 : 2}
                            className="transition-all"
                          />
                          {/* Deceased indicator */}
                          {!data.isLiving && (
                            <line
                              x1={0}
                              y1={0}
                              x2={node.width}
                              y2={node.height}
                              stroke="#9ca3af"
                              strokeWidth={1}
                              opacity={0.4}
                            />
                          )}
                          {/* Role badge at top */}
                          {personRole && (
                            <>
                              <rect
                                x={node.width / 2 - 30}
                                y={-10}
                                width={60}
                                height={18}
                                rx={9}
                                fill={personRole === 'Me' ? '#ff6b47' : data.gender === 'male' ? '#3b82f6' : '#ec4899'}
                              />
                              <text
                                x={node.width / 2}
                                y={3}
                                textAnchor="middle"
                                fontSize={10}
                                fontWeight={600}
                                fill="white"
                              >
                                {personRole}
                              </text>
                            </>
                          )}
                          {/* Avatar circle with gradient */}
                          <circle
                            cx={node.width / 2}
                            cy={35}
                            r={22}
                            fill={`url(#${data.gender === 'male' ? 'maleGradient' : 'femaleGradient'})`}
                            opacity={0.15}
                          />
                          <circle
                            cx={node.width / 2}
                            cy={35}
                            r={20}
                            fill={`url(#${data.gender === 'male' ? 'maleGradient' : 'femaleGradient'})`}
                            opacity={0.2}
                          />
                          {/* Initials */}
                          <text
                            x={node.width / 2}
                            y={40}
                            textAnchor="middle"
                            fontSize={14}
                            fontWeight={700}
                            fill={data.gender === 'male' ? '#1e40af' : '#9d174d'}
                          >
                            {data.firstName?.[0] || ''}{data.lastName?.[0] || ''}
                          </text>
                          {/* Name */}
                          <text
                            x={node.width / 2}
                            y={68}
                            textAnchor="middle"
                            fontSize={12}
                            fontWeight={600}
                            fill="#1f2937"
                          >
                            {data.firstName}
                          </text>
                          <text
                            x={node.width / 2}
                            y={83}
                            textAnchor="middle"
                            fontSize={10}
                            fill="#6b7280"
                          >
                            {data.lastName}
                          </text>
                          {/* Birth year */}
                          {data.birthDate && (
                            <text
                              x={node.width / 2}
                              y={96}
                              textAnchor="middle"
                              fontSize={9}
                              fill="#9ca3af"
                            >
                              {data.birthDate.split('-')[0]}
                              {!data.isLiving && ' †'}
                            </text>
                          )}
                        </g>
                      );
                    }

                    if (node.type === 'union') {
                      return (
                        <g key={node.id}>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.width / 2 + 2}
                            fill="url(#selectedGradient)"
                            opacity={0.3}
                          />
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.width / 2}
                            fill="#f5f5f5"
                            stroke="#d4d4d4"
                            strokeWidth={1.5}
                          />
                        </g>
                      );
                    }

                    return null;
                  })}
                </g>
              </svg>
            </div>

            {/* Floating glass controls */}
            <div className="absolute bottom-4 right-4 flex gap-2 glass rounded-xl p-1">
              <Button variant="ghost" size="sm" onClick={handleZoomOut} className="hover:bg-white/50">
                <MinusIcon />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleZoomIn} className="hover:bg-white/50">
                <PlusSmallIcon />
              </Button>
              <div className="w-px bg-neutral-200 my-1" />
              <Button variant="ghost" size="sm" onClick={handleFitToScreen} className="hover:bg-white/50">
                <FitIcon />
              </Button>
            </div>

            {/* Zoom level indicator with glass effect */}
            <div className="absolute bottom-4 left-4 glass px-3 py-1.5 rounded-lg">
              <span className="text-xs font-medium text-neutral-600">
                {Math.round(viewport.scale * 100)}%
              </span>
            </div>
          </div>
        </TabContent>

        <TabContent value="genogram">
          <Card variant="bordered" padding="none" className="h-[calc(100vh-280px)] min-h-[500px]">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50/30">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <GenogramIcon className="w-10 h-10 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  Medical Genogram
                </h3>
                <p className="text-neutral-500 max-w-sm mx-auto mb-6">
                  Visualize family tree with hereditary medical conditions.
                </p>
                <Link href="/tree/genogram">
                  <Button>View Full Genogram</Button>
                </Link>
              </div>
            </div>
          </Card>
        </TabContent>

        <TabContent value="list">
          <Card variant="bordered" padding="lg">
            <div className="space-y-2">
              {nodes
                .filter((n) => n.type === 'person')
                .map((node, index) => {
                  const data = node.data as PersonNodeData;
                  const personRole = getPersonRole(data.personId);
                  return (
                    <button
                      key={node.id}
                      onClick={() => handleNodeClick(node)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent border border-transparent hover:border-primary-100 transition-all text-left group animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Avatar name={`${data.firstName} ${data.lastName}`} size="md" ringColor="primary" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-neutral-900 group-hover:text-primary-700 transition-colors">
                            {data.firstName} {data.lastName}
                          </p>
                          {personRole && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full text-white ${personRole === 'Me' ? 'bg-primary-500' : data.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
                              }`}>
                              {personRole}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500">
                          {data.birthDate?.split('-')[0]}
                          {!data.isLiving && ' - Deceased'}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRightIcon />
                      </div>
                    </button>
                  );
                })}
            </div>
          </Card>
        </TabContent>
      </Tabs>

      {/* Footer controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-neutral-400 flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <MouseIcon className="w-4 h-4" />
            Drag to pan
          </span>
          <span className="text-neutral-300">·</span>
          <span className="inline-flex items-center gap-1">
            <ScrollIcon className="w-4 h-4" />
            Scroll to zoom
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<DownloadIcon />}>
            Export
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<ShareIcon />}>
            Share
          </Button>
        </div>
      </div>

      {/* Add Person Modal */}
      <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} className="max-h-[85vh] flex flex-col">
        <DialogHeader title="Add Family Member" onClose={() => setIsAddModalOpen(false)} />
        <DialogContent className="overflow-y-auto flex-1">
          <div className="space-y-4">
            {/* Relationship Type - FIRST and most important */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-4">
              <label className="block text-sm font-semibold text-neutral-800 mb-2">
                Relationship Type *
              </label>
              <select
                className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                value={newPerson.relationshipType}
                onChange={(e) => {
                  const relType = e.target.value as RelationshipTypeOption;
                  // Auto-set gender based on relationship type
                  let autoGender = newPerson.gender;
                  if (['father', 'grandfather_paternal', 'grandfather_maternal', 'son', 'brother', 'uncle'].includes(relType)) {
                    autoGender = 'male';
                  } else if (['mother', 'grandmother_paternal', 'grandmother_maternal', 'daughter', 'sister', 'aunt'].includes(relType)) {
                    autoGender = 'female';
                  }
                  setNewPerson({
                    ...newPerson,
                    relationshipType: relType,
                    gender: autoGender,
                    relatedToPersonId: relType === 'self' ? '' : (rootPerson?.id || ''),
                  });
                }}
              >
                {persons.length === 0 ? (
                  <option value="self">Myself (create root person)</option>
                ) : (
                  <>
                    <option value="" disabled>Select relationship</option>
                    <optgroup label="Immediate Family">
                      <option value="father">Father</option>
                      <option value="mother">Mother</option>
                      <option value="spouse">Spouse</option>
                      <option value="son">Son</option>
                      <option value="daughter">Daughter</option>
                      <option value="brother">Brother</option>
                      <option value="sister">Sister</option>
                    </optgroup>
                    <optgroup label="Grandparents">
                      <option value="grandfather_paternal">Paternal Grandfather</option>
                      <option value="grandmother_paternal">Paternal Grandmother</option>
                      <option value="grandfather_maternal">Maternal Grandfather</option>
                      <option value="grandmother_maternal">Maternal Grandmother</option>
                    </optgroup>
                    <optgroup label="Other Relatives">
                      <option value="uncle">Uncle</option>
                      <option value="aunt">Aunt</option>
                      <option value="cousin">Cousin</option>
                    </optgroup>
                  </>
                )}
              </select>
            </div>

            {/* Related to Person - only show if needed */}
            {newPerson.relationshipType !== 'self' && persons.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Related to *
                </label>
                <select
                  value={newPerson.relatedToPersonId}
                  onChange={(e) => setNewPerson({ ...newPerson, relatedToPersonId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  <option value="">Select person...</option>
                  {persons.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.firstName} {person.lastName || ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-neutral-500 mt-1">
                  Select the person you want to add this relative to
                </p>
              </div>
            )}

            <div className="border-t border-neutral-100 pt-4">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">Personal Details</p>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  value={newPerson.firstName}
                  onChange={(e) => setNewPerson({ ...newPerson, firstName: e.target.value })}
                  placeholder="John"
                  required
                  fullWidth
                />
                <Input
                  label="Last Name"
                  value={newPerson.lastName}
                  onChange={(e) => setNewPerson({ ...newPerson, lastName: e.target.value })}
                  placeholder="Doe"
                  fullWidth
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Género
                </label>
                <select
                  value={newPerson.gender}
                  onChange={(e) => setNewPerson({ ...newPerson, gender: e.target.value as Gender })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <Input
                label="Birth Date"
                type="date"
                value={newPerson.birthDate}
                onChange={(e) => setNewPerson({ ...newPerson, birthDate: e.target.value })}
                fullWidth
              />
              <Input
                label="Birth Place"
                value={newPerson.birthPlace}
                onChange={(e) => setNewPerson({ ...newPerson, birthPlace: e.target.value })}
                placeholder="City, Country"
                required
                fullWidth
                className="col-span-2"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newPerson.isLiving}
                onChange={(e) => setNewPerson({ ...newPerson, isLiving: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">Living Person</span>
            </label>

            {/* Medical conditions section */}
            <div className="border-t border-neutral-100 pt-4 mt-2">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">
                Medical Conditions (Family History)
              </p>
              <p className="text-xs text-neutral-400 mb-3">
                Select known medical conditions for the genogram
              </p>
              <div className="grid grid-cols-2 gap-2">
                {COMMON_MEDICAL_CONDITIONS.map((condition) => {
                  const isSelected = newPerson.medicalConditions.some(c => c.id === condition.id);
                  return (
                    <label
                      key={condition.id}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${isSelected
                        ? 'bg-primary-50 border-primary-300 text-primary-800'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewPerson({
                              ...newPerson,
                              medicalConditions: [
                                ...newPerson.medicalConditions,
                                { id: condition.id, name: condition.name }
                              ]
                            });
                          } else {
                            setNewPerson({
                              ...newPerson,
                              medicalConditions: newPerson.medicalConditions.filter(c => c.id !== condition.id)
                            });
                          }
                        }}
                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm">
                        {condition.icon} {condition.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Invitation section */}
            <div className="border-t border-neutral-100 pt-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={newPerson.sendInvitation}
                  onChange={(e) => setNewPerson({ ...newPerson, sendInvitation: e.target.checked })}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">Send invitation to confirm kinship</span>
              </label>

              {newPerson.sendInvitation && (
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-4 mb-3">
                  <p className="text-xs text-primary-700 mb-3">
                    A notification will be sent to confirm they are your relative and to connect their social networks.
                  </p>
                  <Input
                    label="Relative's Email"
                    type="email"
                    value={newPerson.email}
                    onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                    placeholder="relative@email.com"
                    fullWidth
                  />
                </div>
              )}

              {invitationError && (
                <p className="text-sm text-red-600 mb-2">{invitationError}</p>
              )}
            </div>
          </div>
        </DialogContent>
        {/* Footer buttons - fixed at bottom */}
        <div className="flex gap-3 p-6 pt-4 border-t border-neutral-100 flex-shrink-0">
          <Button
            variant="outline"
            fullWidth
            onClick={() => setIsAddModalOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={handleAddPerson}
            loading={isSubmitting}
            disabled={!newPerson.firstName.trim()}
          >
            Add
          </Button>
        </div>
      </Dialog>
    </Container >
  );
}

// Icons
function PlusIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function PlusSmallIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
    </svg>
  );
}

function TreeIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22V8M12 8C9 8 6 5 6 2h12c0 3-3 6-6 6z" />
      <path d="M9 22h6" />
    </svg>
  );
}

function GenogramIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="8" height="8" />
      <circle cx="18" cy="6" r="4" />
      <rect x="2" y="14" width="8" height="8" />
      <circle cx="18" cy="18" r="4" />
      <path d="M10 6h4M6 10v4M18 10v4" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

function FitIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="w-5 h-5 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function UsersSmallIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function MouseIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="3" width="12" height="18" rx="6" />
      <path d="M12 7v4" />
    </svg>
  );
}

function ScrollIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v18M5 10l7-7 7 7M5 14l7 7 7-7" />
    </svg>
  );
}

function BloodIcon() {
  return (
    <svg className="w-4 h-4 inline-block text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-4 h-4 inline-block text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function HeartAnatomyIcon() {
  return (
    <svg className="w-4 h-4 inline-block text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12.5 3.5v5M18.5 7v4M8.5 4v6M12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0-7.78-7.78L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23z" />
    </svg>
  );
}

function RibbonIcon() {
  return (
    <svg className="w-4 h-4 inline-block text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 18s-7-5.5-7-10a5 5 0 0 1 10 0c0 4.5-7 10-7 10z" />
      <path d="m19 21-5-6M5 21l5-6" />
    </svg>
  );
}

function LungsIcon() {
  return (
    <svg className="w-4 h-4 inline-block text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v9M7 6v6a5 5 0 1 0 10 0V6" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg className="w-4 h-4 inline-block text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.5 2h5M5 6.5a4.5 4.5 0 0 1 14 0c0 1.25-.5 2.5-1.5 3.5a4.5 4.5 0 0 1-5.5 1 4.5 4.5 0 0 1-5.5-1C5.5 9 5 7.75 5 6.5z" />
      <path d="M9.5 11v6a4.5 4.5 0 0 0 9 0M5.5 11v6a4.5 4.5 0 0 0 9 0" />
    </svg>
  );
}

function BoneIcon() {
  return (
    <svg className="w-4 h-4 inline-block text-orange-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 10c.8-.8 2-.6 2.8.2.8.8.8 2 0 2.8l-1.4 1.4-2.8-2.8L17 10Z" />
      <path d="M15.6 11.4 8.6 18.4M4.2 17c-.8.8-1 2-.2 2.8.8.8 2 1 2.8.2l1.4-1.4-2.8-2.8L4.2 17Z" />
      <path d="M7 14c-.8-.8-2-.6-2.8.2-.8.8-.8 2 0 2.8l1.4-1.4 2.8 2.8L7 14Z" />
      <path d="M19.8 7c.8-.8 1-2 .2-2.8C19.2 3.4 18 3.2 17.2 4l-1.4 1.4 2.8 2.8L19.8 7Z" />
    </svg>
  );
}

function ButterflyIcon() {
  return (
    <svg className="w-4 h-4 inline-block text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M8 6a4 4 0 0 1 8 0c0 2.5-4 6-4 6s-4-3.5-4-6M6 14a4 4 0 0 1 12 0c0 2.5-6 6-6 6s-6-3.5-6-6" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg className="w-4 h-4 inline-block text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v18M5 10l7-7 7 7M5 14l7 7 7-7" />
    </svg>
  );
}
