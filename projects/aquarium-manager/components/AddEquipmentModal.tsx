"use client"
import { useState } from 'react';
import { amDB } from '@/models/db';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AddEquipmentModalProps {
  aquariumId: number;
  onClose: () => void;
}

export default function AddEquipmentModal({ aquariumId, onClose }: AddEquipmentModalProps) {
  const [label, setLabel] = useState('');
  const [count, setCount] = useState(1);
  const [description, setDescription] = useState('');
  const [firstUsedDate, setFirstUsedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [inUse, setInUse] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!label.trim()) return;
    setSubmitting(true);
    try {
      await amDB.equipment.add({
        aquariumId,
        label: label.trim(),
        count,
        description: description.trim(),
        firstUsedDate: new Date(firstUsedDate),
        inUse,
      });
      onClose();
    } catch (err) {
      console.error('Error adding equipment', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 rounded-lg">
      <div className="relative w-full max-w-md rounded-lg border bg-background p-6 shadow-lg mx-4 max-h-[90%] overflow-y-auto">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>

        <h2 className="mb-4 text-lg font-semibold">Add Equipment</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="eq-label">Label</Label>
            <Input id="eq-label" placeholder="e.g. HOB Filter" value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="eq-count">Quantity</Label>
              <Input id="eq-count" type="number" min={0} value={count} onChange={(e) => setCount(Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="eq-date">Date First Used</Label>
              <Input id="eq-date" type="date" value={firstUsedDate} onChange={(e) => setFirstUsedDate(e.target.value)} />
            </div>
          </div>

          <div>
            <Label htmlFor="eq-desc">Description</Label>
            <Input id="eq-desc" placeholder="Optional description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="eq-inuse"
              type="checkbox"
              checked={inUse}
              onChange={(e) => setInUse(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="eq-inuse" className="text-sm cursor-pointer">Currently in use</Label>
          </div>
        </div>

        <div className="modal-footer flex justify-end gap-2 pt-6 mt-4">
          <Button variant="outline" className="am-3d-btn am-3d-btn--sm" onClick={onClose}>Cancel</Button>
          <Button className="am-3d-btn am-3d-btn--sm am-3d-btn--primary" onClick={handleSubmit} disabled={!label.trim() || submitting}>
            {submitting ? 'Adding…' : 'Add Equipment'}
          </Button>
        </div>
      </div>
    </div>
  );
}
