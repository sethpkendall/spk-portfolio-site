"use client"
import { useState } from 'react';
import { amDB } from '@/models/db';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AddActivityTypeModalProps {
  aquariumId: number;
  onClose: () => void;
}

export default function AddActivityTypeModal({ aquariumId, onClose }: AddActivityTypeModalProps) {
  const [label, setLabel] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!label.trim()) return;
    setSubmitting(true);
    try {
      await amDB.activityTypes.add({
        aquariumId,
        label: label.trim(),
        icon: 'circle',
      });
      onClose();
    } catch (err) {
      console.error('Error adding activity type', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 rounded-lg">
      <div className="relative w-full max-w-sm rounded-lg border bg-background p-6 shadow-lg mx-4 max-h-[90%] overflow-y-auto">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>

        <h2 className="mb-4 text-lg font-semibold">New Activity Type</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="at-label">Activity Name</Label>
            <Input
              id="at-label"
              placeholder="e.g. Gravel Vacuum"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer flex justify-end gap-2 pt-6 mt-4">
          <Button variant="outline" className="am-3d-btn am-3d-btn--sm" onClick={onClose}>Cancel</Button>
          <Button className="am-3d-btn am-3d-btn--sm am-3d-btn--primary" onClick={handleSubmit} disabled={!label.trim() || submitting}>
            {submitting ? 'Adding…' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
}
