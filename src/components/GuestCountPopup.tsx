import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface GuestCountPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (guestCount: number) => void;
  tableName: string;
}

export default function GuestCountPopup({ isOpen, onClose, onConfirm, tableName }: GuestCountPopupProps) {
  const [count, setCount] = useState(1);

  const handleConfirm = () => {
    if (count > 0) {
      onConfirm(count);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mở bàn {tableName}</DialogTitle>
          <DialogDescription>
            Nhập số lượng khách để mở bàn mới.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="guest-count" className="text-right">
              Số khách
            </Label>
            <Input
              id="guest-count"
              type="number"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="col-span-3"
              min="1"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
          <Button type="submit" onClick={handleConfirm}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
