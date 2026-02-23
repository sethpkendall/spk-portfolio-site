"use client"
import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { amDB } from '@/models/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ActivityType } from '@/models/interfaces';

interface LogActivityModalProps {
  aquariumId: number;
  onClose: () => void;
  preselectedType?: ActivityType;
}

export default function LogActivityModal({ aquariumId, onClose, preselectedType }: LogActivityModalProps) {
  const [activityTypeId, setActivityTypeId] = useState<number | ''>(preselectedType?.id ?? '');
  const [date, setDate] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  const [notes, setNotes] = useState('');
  const [reminderDays, setReminderDays] = useState<number>(preselectedType?.defaultReminderDays ?? 0);
  const [submitting, setSubmitting] = useState(false);

  const activityTypes = useLiveQuery(
    () => amDB.activityTypes.where('aquariumId').equals(aquariumId).toArray(),
    [aquariumId]
  );

  // When the selected activity type changes, update reminderDays to that type's default
  useEffect(() => {
    if (!activityTypeId || !activityTypes) return;
    const type = activityTypes.find((t) => t.id === activityTypeId);
    if (type) {
      setReminderDays(type.defaultReminderDays ?? 0);
    }
  }, [activityTypeId, activityTypes]);

  const handleSubmit = async () => {
    if (!activityTypeId) return;
    setSubmitting(true);
    try {
      // Parse YYYY-MM-DD as local midnight (not UTC)
      const [y, m, d] = date.split('-').map(Number);
      const localDate = new Date(y, m - 1, d);

      await amDB.activityLogs.add({
        aquariumId,
        activityTypeId: activityTypeId as number,
        date: localDate,
        notes,
        reminderDays,
      });
      onClose();
    } catch (err) {
      console.error('Failed to log activity', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 rounded-lg">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg mx-4 max-h-[90%] overflow-y-auto">
        <h2 className="mb-4 text-lg font-semibold">Log Activity</h2>

        <div className="space-y-4">
          <div>
            <Label>Activity Type</Label>
            <Select
              value={activityTypeId ? String(activityTypeId) : undefined}
              onValueChange={(v) => setActivityTypeId(Number(v))}
            >
              <SelectTrigger><SelectValue placeholder="Select type…" /></SelectTrigger>
              <SelectContent>
                {activityTypes?.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="log-date">Date</Label>
            <Input id="log-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="log-notes">Notes</Label>
            <Input id="log-notes" placeholder="Optional notes…" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="log-reminder">Reminder (days)</Label>
            <Input
              id="log-reminder"
              type="number"
              min={0}
              value={reminderDays}
              onChange={(e) => setReminderDays(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              How many days until this activity is due again. 0 = no reminder.
            </p>
          </div>
        </div>

        <div className="modal-footer flex justify-end gap-2 pt-6 mt-4">
          <Button variant="outline" className="am-3d-btn am-3d-btn--sm" onClick={onClose}>Cancel</Button>
          <Button className="am-3d-btn am-3d-btn--sm am-3d-btn--primary" onClick={handleSubmit} disabled={!activityTypeId || submitting}>
            {submitting ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
