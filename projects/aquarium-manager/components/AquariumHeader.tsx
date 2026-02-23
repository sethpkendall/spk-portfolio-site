import { Fish } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Aquarium } from '@/models/interfaces';

interface AquariumHeaderProps {
  aquarium: Aquarium;
  isExample?: boolean;
  onCreateOwn?: () => void;
}

export default function AquariumHeader({ aquarium, isExample, onCreateOwn }: AquariumHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      {/* Example-data banner */}
      {isExample && (
        <div className="w-full max-w-2xl rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-center text-sm">
          <span className="mr-1">🐟</span>
          You&apos;re viewing example data.
          <Button
            size="sm"
            variant="link"
            className="ml-1 h-auto p-0 text-sm font-semibold text-primary underline underline-offset-2"
            onClick={onCreateOwn}
          >
            Create your own aquarium
          </Button>{' '}
          to get started!
        </div>
      )}

      <div className="flex items-center gap-2">
        <Fish className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">{aquarium.name}</h1>
      </div>

      {aquarium.imageUrl ? (
        <div
          className="w-full max-w-2xl overflow-hidden rounded-xl border border-border shadow-md"
        >
          <img
            src={aquarium.imageUrl}
            alt={aquarium.name}
            className="block w-full object-cover"
            style={{ aspectRatio: '16 / 9' }}
          />
        </div>
      ) : (
        <div className="flex h-48 w-full max-w-2xl items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-muted-foreground">
          No aquarium image yet
        </div>
      )}
    </div>
  );
}
