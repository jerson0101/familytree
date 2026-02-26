'use client';

import { forwardRef, type FormHTMLAttributes, useState } from 'react';
import { cn } from '../utils/cn';
import { Input } from '../primitives/Input';
import { Button } from '../primitives/Button';
import { Card } from '../primitives/Card';
import { Avatar } from '../primitives/Avatar';

export interface PersonFormData {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  photoUrl?: string;
  notes?: string;
}

export interface PersonFormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  initialData?: Partial<PersonFormData>;
  onSubmit: (data: PersonFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export const PersonForm = forwardRef<HTMLFormElement, PersonFormProps>(
  (
    {
      className,
      initialData,
      onSubmit,
      onCancel,
      isLoading = false,
      mode = 'create',
      ...props
    },
    ref
  ) => {
    const [formData, setFormData] = useState<PersonFormData>({
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      gender: initialData?.gender || 'other',
      birthDate: initialData?.birthDate || '',
      birthPlace: initialData?.birthPlace || '',
      deathDate: initialData?.deathDate || '',
      deathPlace: initialData?.deathPlace || '',
      photoUrl: initialData?.photoUrl || '',
      notes: initialData?.notes || '',
    });

    const handleChange = (field: keyof PersonFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    return (
      <form
        ref={ref}
        className={cn('space-y-6', className)}
        onSubmit={handleSubmit}
        {...props}
      >
        {/* Photo and name preview */}
        <Card variant="bordered" padding="md">
          <div className="flex items-center gap-4">
            <Avatar
              name={fullName || 'New Person'}
              src={formData.photoUrl || null}
              size="xl"
            />
            <div>
              <p className="text-lg font-semibold text-neutral-900">
                {fullName || 'New Person'}
              </p>
              <p className="text-sm text-neutral-500">
                {mode === 'create' ? 'Adding new family member' : 'Editing details'}
              </p>
            </div>
          </div>
        </Card>

        {/* Basic info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wider">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="Enter first name"
              required
              fullWidth
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Enter last name"
              required
              fullWidth
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
              Gender
            </label>
            <div className="flex gap-3">
              {(['male', 'female', 'other'] as const).map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => handleChange('gender', gender)}
                  className={cn(
                    'flex-1 py-2.5 px-4 rounded-xl border transition-all duration-300',
                    'text-sm font-medium capitalize',
                    formData.gender === gender
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  )}
                  aria-pressed={formData.gender === gender}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Birth info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wider">
            Birth Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Birth Date"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              fullWidth
            />
            <Input
              label="Birth Place"
              value={formData.birthPlace}
              onChange={(e) => handleChange('birthPlace', e.target.value)}
              placeholder="City, Country"
              fullWidth
            />
          </div>
        </div>

        {/* Death info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wider">
            Death Information (if applicable)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Death Date"
              type="date"
              value={formData.deathDate}
              onChange={(e) => handleChange('deathDate', e.target.value)}
              fullWidth
            />
            <Input
              label="Death Place"
              value={formData.deathPlace}
              onChange={(e) => handleChange('deathPlace', e.target.value)}
              placeholder="City, Country"
              fullWidth
            />
          </div>
        </div>

        {/* Photo URL */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wider">
            Photo
          </h3>
          <Input
            label="Photo URL"
            type="url"
            value={formData.photoUrl}
            onChange={(e) => handleChange('photoUrl', e.target.value)}
            placeholder="https://..."
            hint="Enter a URL to the person's photo"
            fullWidth
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" loading={isLoading}>
            {mode === 'create' ? 'Add Person' : 'Save Changes'}
          </Button>
        </div>
      </form>
    );
  }
);

PersonForm.displayName = 'PersonForm';
