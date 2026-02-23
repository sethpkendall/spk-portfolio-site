"use client"
import { useLiveQuery } from 'dexie-react-hooks';
import { amDB } from '@/models/db';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getFishIcon } from './fish-icons';

interface InhabitantListProps {
  aquariumId: number;
  onAdd: () => void;
}

export default function InhabitantList({ aquariumId, onAdd }: InhabitantListProps) {
  const inhabitants = useLiveQuery(
    () => amDB.inhabitants.where('aquariumId').equals(aquariumId).toArray(),
    [aquariumId]
  );

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Inhabitants</h2>
        <Button size="sm" variant="outline" className="am-3d-btn am-3d-btn--sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {(!inhabitants || inhabitants.length === 0) ? (
        <p className="text-sm text-muted-foreground">No inhabitants yet — add your first fish!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {inhabitants.map((i) => {
            const FishIcon = getFishIcon(i.id ?? 0);
            return (
              <Card key={i.id} className="overflow-hidden">
                {/* banner — photo or fish illustration */}
                {i.imageUrl ? (
                  <img
                    src={i.imageUrl}
                    alt={i.name}
                    className="h-20 w-full object-cover"
                  />
                ) : (
                  <FishIcon className="w-full h-20" />
                )}

                <CardContent className="px-3 pt-2 pb-3 text-center">
                  <p className="font-medium text-sm leading-tight">{i.name}</p>
                  <p className="text-xs text-muted-foreground">{i.species}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
