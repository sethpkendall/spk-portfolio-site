"use client"
import { useState } from 'react';
import { amDB } from '@/models/db';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface SetupWizardProps {
  onComplete: () => void;
}

const DEFAULT_ACTIVITY_TYPES = [
  { label: 'Feeding', icon: 'utensils', defaultReminderDays: 1 },
  { label: 'Water Change', icon: 'droplets', defaultReminderDays: 7 },
  { label: 'Cleaning', icon: 'sparkles', defaultReminderDays: 14 },
  { label: 'Filter Cleaning', icon: 'filter', defaultReminderDays: 28 },
];

/** Resize an image file to fit within maxDim and return a compressed data-URI */
function resizeImage(file: File, maxDim = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export default function SetupWizard({ onComplete }: SetupWizardProps) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resized = await resizeImage(file);
      setImageUrl(resized);
    } catch (err) {
      console.error('Image resize failed', err);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const aquariumId = await amDB.aquariums.add({
        name: name.trim(),
        imageUrl,
      });

      // Seed default activity types
      await amDB.activityTypes.bulkAdd(
        DEFAULT_ACTIVITY_TYPES.map((t) => ({
          aquariumId: aquariumId as number,
          label: t.label,
          icon: t.icon,
          defaultReminderDays: t.defaultReminderDays,
        }))
      );

      onComplete();
    } catch (err) {
      console.error('Setup error', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 rounded-lg">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg mx-4 max-h-[90%] overflow-y-auto">
        <h2 className="mb-1 text-xl font-semibold">Set Up Your Aquarium</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Give your aquarium a name and optionally add a photo.
        </p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="aq-name">Aquarium Name</Label>
            <Input
              id="aq-name"
              placeholder="e.g. Living Room Tank"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="aq-image">Aquarium Photo</Label>
            <Input
              id="aq-image"
              type="file"
              accept="image/*"
              onChange={handleImageFile}
            />
            {imageUrl && (
              <div className="mt-2 overflow-hidden rounded-md border" style={{ maxHeight: 128 }}>
                <img
                  src={imageUrl}
                  alt="preview"
                  style={{ display: 'block', width: '100%', height: 128, objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button className="am-3d-btn am-3d-btn--sm am-3d-btn--primary" onClick={handleSubmit} disabled={!name.trim() || submitting}>
            {submitting ? 'Creating…' : 'Create Aquarium'}
          </Button>
        </div>
      </div>
    </div>
  );
}
