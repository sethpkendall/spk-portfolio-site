import { amDB } from '@/models/db';
import type { ActivityLog } from '@/models/interfaces';

const EXAMPLE_AQUARIUM_IMAGE = '/images/aquarium-sample.jpg';

const EXAMPLE_INHABITANTS = [
  { name: 'Nemo', species: 'Clownfish' },
  { name: 'Connar', species: 'Betta' },
  { name: 'Jet', species: 'Goldfish' },
  { name: 'Diablo', species: 'Angelfish' },
  { name: 'Puffy', species: 'Pufferfish' },
  { name: 'Parry', species: 'Swordtail' },
  { name: 'Gus', species: 'Guppy' },
  { name: 'Tang', species: 'Blue Tang' },
  { name: 'Brook', species: 'Neon Tetra' },
  { name: 'Dartanion', species: 'Seahorse' },
];

const DEFAULT_ACTIVITY_TYPES = [
  { label: 'Feeding', icon: 'utensils', defaultReminderDays: 1 },
  { label: 'Water Change', icon: 'droplets', defaultReminderDays: 7 },
  { label: 'Cleaning', icon: 'sparkles', defaultReminderDays: 14 },
  { label: 'Filter Cleaning', icon: 'filter', defaultReminderDays: 28 },
];

const HISTORY_DAYS = 56;
const EXAMPLE_DATA_KEY = 'am-example-data';

/**
 * Seed the database with example aquarium data so the app feels populated
 * on first load. Stores the example aquarium id in localStorage so we can
 * identify and remove the data later.
 */
export async function seedExampleData(): Promise<number> {
  // Create aquarium
  const aquariumId = (await amDB.aquariums.add({
    name: "Seth's Aquarium",
    imageUrl: EXAMPLE_AQUARIUM_IMAGE,
  })) as number;

  // Add inhabitants (no photos – the deterministic fish‑icon SVGs will be used)
  await amDB.inhabitants.bulkAdd(
    EXAMPLE_INHABITANTS.map((i) => ({
      aquariumId,
      name: i.name,
      species: i.species,
      imageUrl: '',
    }))
  );

  // Add activity types and collect their auto‑incremented IDs
  const typeIds = await Promise.all(
    DEFAULT_ACTIVITY_TYPES.map((t) =>
      amDB.activityTypes.add({
        aquariumId,
        label: t.label,
        icon: t.icon,
        defaultReminderDays: t.defaultReminderDays,
      })
    )
  );

  // Generate activity logs going back HISTORY_DAYS days.
  // Each activity type gets an entry every `defaultReminderDays` days.
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const logs: Omit<ActivityLog, 'id'>[] = [];

  DEFAULT_ACTIVITY_TYPES.forEach((type, idx) => {
    const typeId = typeIds[idx] as number;
    const interval = type.defaultReminderDays;

    for (let daysBack = 0; daysBack < HISTORY_DAYS; daysBack += interval) {
      // Skip the most recent Water Change so its status card shows as overdue
      if (type.label === 'Water Change' && daysBack === 0) continue;

      const date = new Date(today);
      date.setDate(date.getDate() - daysBack);
      logs.push({
        aquariumId,
        activityTypeId: typeId,
        date,
        notes: '',
        reminderDays: type.defaultReminderDays,
      });
    }
  });

  await amDB.activityLogs.bulkAdd(logs);

  // Persist flag so we know the current data is example data
  if (typeof window !== 'undefined') {
    localStorage.setItem(EXAMPLE_DATA_KEY, String(aquariumId));
  }

  return aquariumId;
}

/**
 * Remove all records that belong to the example aquarium and clear the flag.
 */
export async function clearExampleData(): Promise<void> {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem(EXAMPLE_DATA_KEY);
  if (!raw) return;

  const aquariumId = Number(raw);

  await Promise.all([
    amDB.inhabitants.where('aquariumId').equals(aquariumId).delete(),
    amDB.activityLogs.where('aquariumId').equals(aquariumId).delete(),
    amDB.activityTypes.where('aquariumId').equals(aquariumId).delete(),
    amDB.equipment.where('aquariumId').equals(aquariumId).delete(),
    amDB.aquariums.delete(aquariumId),
  ]);

  localStorage.removeItem(EXAMPLE_DATA_KEY);
}

/** Check whether the current dataset is the example seed. */
export function isExampleDataLoaded(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(EXAMPLE_DATA_KEY) !== null;
}
