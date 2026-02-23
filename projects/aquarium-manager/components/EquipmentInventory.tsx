"use client"
import { useLiveQuery } from 'dexie-react-hooks';
import { amDB } from '@/models/db';
import { Plus, Check, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface EquipmentInventoryProps {
  aquariumId: number;
  onAdd: () => void;
}

export default function EquipmentInventory({ aquariumId, onAdd }: EquipmentInventoryProps) {
  const equipment = useLiveQuery(
    () => amDB.equipment.where('aquariumId').equals(aquariumId).toArray(),
    [aquariumId]
  );

  const toggleInUse = async (id: number, current: boolean) => {
    await amDB.equipment.update(id, { inUse: !current });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Equipment Inventory</h3>
        <Button size="sm" variant="outline" className="am-3d-btn am-3d-btn--sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" /> Add Equipment
        </Button>
      </div>

      {(!equipment || equipment.length === 0) ? (
        <p className="text-sm text-muted-foreground">No equipment tracked yet.</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="hidden sm:table-cell">Description</TableHead>
                <TableHead className="hidden md:table-cell">First Used</TableHead>
                <TableHead className="text-center">In Use?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.label}</TableCell>
                  <TableCell className="text-center">{item.count}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-xs max-w-[200px] truncate">
                    {item.description || '—'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs">
                    {new Date(item.firstUsedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => toggleInUse(item.id!, item.inUse)}
                      className="inline-flex items-center justify-center"
                      title={item.inUse ? 'Mark not in use' : 'Mark in use'}
                    >
                      {item.inUse ? (
                        <Badge variant="default" className="gap-1 text-[10px]">
                          <Check className="h-3 w-3" /> Yes
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1 text-[10px]">
                          <XCircle className="h-3 w-3" /> No
                        </Badge>
                      )}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
