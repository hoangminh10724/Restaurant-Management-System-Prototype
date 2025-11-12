import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { FilePlus, CreditCard, Move } from 'lucide-react';

interface TableActionsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  onAddOrder: () => void;
  onProcessPayment: () => void;
  onTransferTable: () => void;
}

export default function TableActionsPopup({
  isOpen,
  onClose,
  tableName,
  onAddOrder,
  onProcessPayment,
  onTransferTable,
}: TableActionsPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hành động cho {tableName}</DialogTitle>
          <DialogDescription>
            Chọn một hành động để tiếp tục.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-3 py-4">
          <Button
            onClick={() => {
              onAddOrder();
              onClose();
            }}
            className="h-16 text-lg"
          >
            <FilePlus className="w-5 h-5 mr-3" />
            Ghi thêm món
          </Button>
          <Button
            onClick={() => {
              onProcessPayment();
              onClose();
            }}
            variant="secondary"
            className="h-16 text-lg"
          >
            <CreditCard className="w-5 h-5 mr-3" />
            Tính tiền
          </Button>
          <Button
            onClick={() => {
              onTransferTable();
              onClose();
            }}
            variant="outline"
            className="h-16 text-lg"
          >
            <Move className="w-5 h-5 mr-3" />
            Chuyển bàn
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
