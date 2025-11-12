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
import { ArrowRight } from 'lucide-react';

interface TransferTableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sourceTable: Table;
  availableTables: Table[];
  onConfirm: (sourceTableId: number, targetTableId: number) => void;
}

export default function TransferTableDialog({
  isOpen,
  onClose,
  sourceTable,
  availableTables,
  onConfirm,
}: TransferTableDialogProps) {
  const [targetTableId, setTargetTableId] = useState<number | null>(null);

  const handleConfirm = () => {
    if (targetTableId) {
      onConfirm(sourceTable.id, targetTableId);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chuyển bàn</DialogTitle>
          <DialogDescription>
            Chuyển toàn bộ order từ <strong>Bàn {sourceTable.id}</strong> sang một bàn trống khác.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 border rounded-lg text-center bg-red-100">
              <p className="font-bold">TỪ BÀN</p>
              <p className="text-2xl">{sourceTable.id}</p>
            </div>
            <ArrowRight className="w-6 h-6 text-neutral-500" />
            <div className={`p-4 border rounded-lg text-center ${targetTableId ? 'bg-green-100' : 'bg-neutral-100'}`}>
              <p className="font-bold">SANG BÀN</p>
              <p className="text-2xl">{targetTableId ?? '?'}</p>
            </div>
          </div>

          <h4 className="font-semibold mb-3">Chọn bàn đích (bàn trống):</h4>
          {availableTables.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {availableTables.map(table => (
                <Button
                  key={table.id}
                  variant={targetTableId === table.id ? 'default' : 'outline'}
                  onClick={() => setTargetTableId(table.id)}
                >
                  Bàn {table.id}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-4">Không có bàn trống nào.</p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
          <Button type="submit" onClick={handleConfirm} disabled={!targetTableId}>Xác nhận chuyển</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
