import { useState, useEffect } from 'react';
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
  maxSeats?: number;
}

export default function GuestCountPopup({ isOpen, onClose, onConfirm, tableName, maxSeats = 8 }: GuestCountPopupProps) {
  const [count, setCount] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCount(1); // Reset count when dialog opens
      setError('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (count > 0 && count <= maxSeats) {
      onConfirm(count);
    } else {
      setError(`Số khách phải từ 1 đến ${maxSeats}.`);
    }
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = parseInt(e.target.value);
    if (newCount > maxSeats) {
      setError(`Bàn này có tối đa ${maxSeats} ghế.`);
      setCount(maxSeats);
    } else if (newCount < 1) {
      setError('Số khách phải lớn hơn 0.');
      setCount(1);
    }
    else {
      setCount(newCount || 1);
      setError('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Mở bàn {tableName}</DialogTitle>
          <DialogDescription>
            Nhập số lượng khách để mở bàn mới. Bàn này có tối đa {maxSeats} ghế.
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
              onChange={handleCountChange}
              className={`col-span-3 ${error ? 'border-red-500' : ''}`}
              min="1"
              max={maxSeats}
              autoFocus
            />
          </div>
          {error && <p className="col-span-4 text-red-500 text-sm text-center">{error}</p>}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
          <Button type="submit" onClick={handleConfirm}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}