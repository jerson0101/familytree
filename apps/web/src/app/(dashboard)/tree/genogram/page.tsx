'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Badge,
  Skeleton,
} from '@kintree/ui';
import { useFamilyTree, type Person, type MedicalCondition } from '@/hooks/useFamilyTree';

interface GenogramPerson {
  id: string;
  name: string;
  gender: string;
  generation: number;
  isDeceased: boolean;
  conditions: string[];
  isProband?: boolean;
}

interface RiskAnalysis {
  condition: string;
  occurrences: number;
  risk: 'Alto' | 'Moderado' | 'Bajo';
  recommendation: string;
}

// Medical condition recommendations
const CONDITION_RECOMMENDATIONS: Record<string, string> = {
  'Diabetes': 'Revisiones anuales de glucosa, mantener peso saludable',
  'Hipertensión': 'Monitoreo regular de presión arterial, reducir sodio',
  'Enfermedades Cardíacas': 'Controles cardíacos periódicos, ejercicio moderado',
  'Cáncer': 'Exámenes preventivos según edad y tipo',
  'Asma': 'Evitar alérgenos, tener siempre inhalador disponible',
  'Alzheimer': 'Ejercicio mental, vida social activa',
  'Depresión': 'Apoyo psicológico, actividad física regular',
  'Artritis': 'Ejercicio de bajo impacto, control de peso',
  'Tiroides': 'Controles hormonales periódicos',
  'Obesidad': 'Dieta balanceada, ejercicio regular',
};

export default function GenogramPage() {
  const router = useRouter();
  const [selectedPerson, setSelectedPerson] = useState<GenogramPerson | null>(null);
  const { persons, unions, isLoading, getRootPerson, getParentsOfPerson, getPersonRole } = useFamilyTree();

  const rootPerson = getRootPerson();

  // Transform persons into genogram format with generations
  const genogramPersons = useMemo((): GenogramPerson[] => {
    if (!rootPerson || persons.length === 0) return [];

    const result: GenogramPerson[] = [];
    const visited = new Set<string>();

    // Helper to add person with generation
    const addPerson = (person: Person, generation: number) => {
      if (visited.has(person.id)) return;
      visited.add(person.id);

      const conditions = (person.medicalConditions || []).map((c: MedicalCondition) => c.name);

      result.push({
        id: person.id,
        name: `${person.firstName} ${person.lastName || ''}`.trim(),
        gender: person.gender,
        generation,
        isDeceased: !person.isLiving,
        conditions,
        isProband: person.id === rootPerson.id,
      });
    };

    // Add root person (generation 2 = current generation)
    addPerson(rootPerson, 2);

    // Add parents (generation 1)
    const rootParents = getParentsOfPerson(rootPerson.id);
    if (rootParents.fatherId) {
      const father = persons.find(p => p.id === rootParents.fatherId);
      if (father) addPerson(father, 1);
    }
    if (rootParents.motherId) {
      const mother = persons.find(p => p.id === rootParents.motherId);
      if (mother) addPerson(mother, 1);
    }

    // Add grandparents (generation 0)
    if (rootParents.fatherId) {
      const fatherParents = getParentsOfPerson(rootParents.fatherId);
      if (fatherParents.fatherId) {
        const gf = persons.find(p => p.id === fatherParents.fatherId);
        if (gf) addPerson(gf, 0);
      }
      if (fatherParents.motherId) {
        const gm = persons.find(p => p.id === fatherParents.motherId);
        if (gm) addPerson(gm, 0);
      }
    }
    if (rootParents.motherId) {
      const motherParents = getParentsOfPerson(rootParents.motherId);
      if (motherParents.fatherId) {
        const gf = persons.find(p => p.id === motherParents.fatherId);
        if (gf) addPerson(gf, 0);
      }
      if (motherParents.motherId) {
        const gm = persons.find(p => p.id === motherParents.motherId);
        if (gm) addPerson(gm, 0);
      }
    }

    // Add siblings (generation 2)
    if (rootParents.unionId) {
      const parentUnion = unions.find(u => u.id === rootParents.unionId);
      if (parentUnion) {
        for (const childId of parentUnion.children) {
          const sibling = persons.find(p => p.id === childId);
          if (sibling && sibling.id !== rootPerson.id) {
            addPerson(sibling, 2);
          }
        }
      }
    }

    // Add children (generation 3) - find unions where root is a partner
    for (const union of unions) {
      if (union.partner1Id === rootPerson.id || union.partner2Id === rootPerson.id) {
        for (const childId of union.children) {
          const child = persons.find(p => p.id === childId);
          if (child) addPerson(child, 3);
        }
      }
    }

    // Add any remaining persons not yet assigned
    for (const person of persons) {
      if (!visited.has(person.id)) {
        const role = getPersonRole(person.id);
        let gen = 2;
        if (role?.includes('Abuelo') || role?.includes('Abuela')) gen = 0;
        else if (role === 'Padre' || role === 'Madre' || role?.includes('Tío') || role?.includes('Tía')) gen = 1;
        else if (role?.includes('Hijo') || role?.includes('Hija') || role?.includes('Sobrino') || role?.includes('Sobrina')) gen = 3;
        addPerson(person, gen);
      }
    }

    return result;
  }, [persons, unions, rootPerson, getParentsOfPerson, getPersonRole]);

  // Calculate risk analysis based on actual medical conditions
  const conditionRisks = useMemo((): RiskAnalysis[] => {
    const conditionCount: Record<string, number> = {};

    for (const person of genogramPersons) {
      for (const condition of person.conditions) {
        conditionCount[condition] = (conditionCount[condition] || 0) + 1;
      }
    }

    return Object.entries(conditionCount)
      .sort(([, a], [, b]) => b - a)
      .map(([condition, count]) => ({
        condition,
        occurrences: count,
        risk: count >= 3 ? 'Alto' : count >= 2 ? 'Moderado' : 'Bajo',
        recommendation: CONDITION_RECOMMENDATIONS[condition] || 'Consultar con un especialista',
      }));
  }, [genogramPersons]);

  const generations = [
    genogramPersons.filter((p) => p.generation === 0),
    genogramPersons.filter((p) => p.generation === 1),
    genogramPersons.filter((p) => p.generation === 2),
    genogramPersons.filter((p) => p.generation === 3),
  ].filter(gen => gen.length > 0);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton height={48} width={300} />
        <Skeleton height={200} />
        <Skeleton height={400} />
      </div>
    );
  }

  // Empty state if no family data
  if (genogramPersons.length === 0) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Genograma Médico</h1>
            <p className="text-sm text-neutral-500">
              Visualización de condiciones médicas hereditarias
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
              <HeartIcon className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">
              No hay datos familiares
            </h3>
            <p className="text-neutral-500 max-w-sm mx-auto mb-4">
              Agrega miembros a tu árbol genealógico con sus condiciones médicas para ver el genograma.
            </p>
            <Button onClick={() => router.push('/tree')}>
              Ir al Árbol Genealógico
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Genograma Médico</h1>
            <p className="text-sm text-neutral-500">
              Visualización de condiciones médicas hereditarias
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Exportar PDF
        </Button>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-neutral-800"></div>
              <span>Hombre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-neutral-800"></div>
              <span>Mujer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-neutral-800 relative">
                <div className="absolute inset-0 bg-neutral-800" style={{clipPath: 'polygon(0 0, 100% 100%, 0 100%)'}}></div>
              </div>
              <span>Con condición</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-neutral-800 relative">
                <div className="absolute -top-1 -right-1 w-full h-0.5 bg-neutral-800 origin-center rotate-45"></div>
              </div>
              <span>Fallecido</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Genogram View */}
      <Card>
        <CardContent className="p-8">
          <div className="space-y-12">
            {generations.map((gen, genIndex) => {
              const genNumber = gen[0]?.generation ?? genIndex;
              const genLabels: Record<number, string> = {
                0: 'Abuelos',
                1: 'Padres y Tíos',
                2: 'Tu Generación',
                3: 'Hijos',
              };
              return (
              <div key={genIndex}>
                <p className="text-xs text-neutral-400 mb-4">
                  {genLabels[genNumber] || `Generación ${genNumber}`}
                </p>
                <div className="flex justify-center gap-8">
                  {gen.map((person) => (
                    <button
                      key={person.id}
                      onClick={() => setSelectedPerson(person)}
                      className="flex flex-col items-center group"
                    >
                      <div className="relative">
                        {/* Shape based on gender */}
                        <div
                          className={
                            'w-16 h-16 border-3 transition-colors ' +
                            (person.gender === 'male' ? '' : 'rounded-full ') +
                            (person.isProband ? 'border-primary-600 ' : 'border-neutral-800 ') +
                            (selectedPerson?.id === person.id ? 'ring-2 ring-primary-300 ' : '') +
                            'group-hover:border-primary-500'
                          }
                          style={{
                            borderWidth: '3px',
                            background: person.conditions.length > 0
                              ? 'linear-gradient(135deg, transparent 50%, #374151 50%)'
                              : 'transparent',
                          }}
                        />
                        {/* Deceased marker */}
                        {person.isDeceased && (
                          <div
                            className="absolute -top-1 left-1/2 w-20 h-0.5 bg-neutral-800"
                            style={{
                              transform: 'translateX(-50%) rotate(-45deg)',
                              transformOrigin: 'center',
                            }}
                          />
                        )}
                      </div>
                      <p className="mt-2 text-xs text-neutral-600 text-center max-w-20 truncate">
                        {person.name}
                      </p>
                      {person.conditions.length > 0 && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {person.conditions.length} condición{person.conditions.length > 1 ? 'es' : ''}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Person Details */}
      {selectedPerson && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-neutral-900">{selectedPerson.name}</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPerson(null)}>
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500">Estado</p>
                <p className="text-neutral-900">
                  {selectedPerson.isDeceased ? 'Fallecido' : 'Vivo'}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Condiciones Médicas</p>
                {selectedPerson.conditions.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedPerson.conditions.map((c) => (
                      <Badge key={c} variant="warning">{c}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-600">Sin condiciones registradas</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Analysis */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-neutral-900">Análisis de Riesgo Hereditario</h3>
        </CardHeader>
        <CardContent>
          {conditionRisks.length > 0 ? (
            <div className="space-y-4">
              {conditionRisks.map((risk) => (
                <div key={risk.condition} className="p-4 bg-neutral-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-neutral-900">{risk.condition}</p>
                    <Badge
                      variant={
                        risk.risk === 'Alto' ? 'error' : risk.risk === 'Moderado' ? 'warning' : 'secondary'
                      }
                    >
                      Riesgo {risk.risk}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-600">
                    {risk.occurrences} familiar{risk.occurrences > 1 ? 'es' : ''} con esta condición
                  </p>
                  <p className="text-sm text-primary-600 mt-2">
                    Recomendación: {risk.recommendation}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-neutral-500">
                No hay condiciones médicas registradas aún.
              </p>
              <p className="text-sm text-neutral-400 mt-1">
                Agrega condiciones médicas al crear o editar miembros de la familia.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-neutral-400 text-center">
        Esta información es solo para referencia y no constituye consejo médico. 
        Consulta con un profesional de salud para evaluación personalizada.
      </p>
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

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
