"use client"
import { useState } from 'react';
import { amDB } from '@/models/db';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AddInhabitantModalProps {
  aquariumId: number;
  onClose: () => void;
}

export default function AddInhabitantModal({ aquariumId, onClose }: AddInhabitantModalProps) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !species.trim()) return;
    setSubmitting(true);
    try {
      await amDB.inhabitants.add({
        aquariumId,
        name: name.trim(),
        species: species.trim(),
        imageUrl,
      });
      onClose();
    } catch (err) {
      console.error('Error adding inhabitant', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 rounded-lg">
      <div className="relative w-full max-w-md rounded-lg border bg-background p-6 shadow-lg mx-4 max-h-[90%] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="mb-4 text-lg font-semibold">Add Inhabitant</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="inh-name">Name</Label>
            <Input id="inh-name" placeholder="e.g. Nemo" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="inh-species">Species</Label>
            <Input id="inh-species" placeholder="e.g. Clownfish" value={species} onChange={(e) => setSpecies(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="inh-image">Photo</Label>
            <Input id="inh-image" type="file" accept="image/*" onChange={handleImageFile} />
            {imageUrl && (
              <img src={imageUrl} alt="preview" className="mt-2 h-24 w-full rounded-md border object-cover" />
            )}
          </div>
        </div>

        <div className="modal-footer flex justify-end gap-2 pt-6  mt-4">
          <Button variant="outline" className="am-3d-btn am-3d-btn--sm" onClick={onClose}>Cancel</Button>
          <Button className="am-3d-btn am-3d-btn--sm am-3d-btn--primary" onClick={handleSubmit} disabled={!name.trim() || !species.trim() || submitting}>
            {submitting ? 'Adding…' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
}
