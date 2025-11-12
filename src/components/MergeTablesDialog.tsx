import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Table } from '../App';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

interface MergeTablesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sourceTable: Table;
  mergeableTables: Table[];
  onConfirm: (sourceTableId: number, targetTableIds: number[]) => void;
}

export default function MergeTablesDialog({
  isOpen,
  onClose,
  sourceTable,
  mergeableTables,
  onConfirm,
}: MergeTablesDialogProps) {
  const [selectedTableIds, setSelectedTableIds] = useState<number[]>([]);

  const handleToggleTable = (tableId: number) => {
    setSelectedTableIds(prev =>
      prev.includes(tableId)
        ? prev.filter(id => id !== tableId)
        : [...prev, tableId]
    );
  };

  const handleConfirm = () => {
    if (selectedTableIds.length > 0) {
      onConfirm(sourceTable.id, selectedTableIds);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gộp bàn</DialogTitle>
          <DialogDescription>
            Gộp order từ các bàn khác vào <strong>Bàn {sourceTable.id}</strong>. Các bàn được gộp sẽ được chuyển về trạng thái "Trống".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h4 className="font-semibold mb-3">Chọn các bàn cần gộp:</h4>
          {mergeableTables.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {mergeableTables.map(table => (
                <div
                  key={table.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-100"
                >
                  <Checkbox
                    id={`merge-${table.id}`}
                    checked={selectedTableIds.includes(table.id)}
                    onCheckedChange={() => handleToggleTable(table.id)}
                  />
                  <Label htmlFor={`merge-${table.id}`} className="flex-1 cursor-pointer">
                    Bàn {table.id}
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-4">Không có bàn nào khác đang phục vụ để gộp.</p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
          <Button type="submit" onClick={handleConfirm} disabled={selectedTableIds.length === 0}>
            Xác nhận gộp ({selectedTableIds.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
