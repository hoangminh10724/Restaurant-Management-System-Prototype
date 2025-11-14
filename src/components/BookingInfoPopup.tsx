import { Table } from '../App';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Calendar, Clock, User, Phone, StickyNote } from 'lucide-react';

interface BookingInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmArrival: () => void;
  table: Table | null;
}

export default function BookingInfoPopup({ isOpen, onClose, onConfirmArrival, table }: BookingInfoPopupProps) {
  if (!table) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thông tin đặt bàn: Bàn {table.id}</DialogTitle>
          <DialogDescription>
            Chi tiết lịch đặt cho bàn này.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-3 text-gray-500" />
            <span className="font-medium">Tên khách hàng:</span>
            <span className="ml-2">{table.bookingName || 'Không có'}</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-5 h-5 mr-3 text-gray-500" />
            <span className="font-medium">Số điện thoại:</span>
            <span className="ml-2">{table.bookingPhone || 'Không có'}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-3 text-gray-500" />
            <span className="font-medium">Giờ đặt:</span>
            <span className="ml-2">{table.bookingTime || 'Không có'}</span>
          </div>
          {/* Assuming booking might have notes in the future, though not in current Table type */}
          {/* <div className="flex items-start">
            <StickyNote className="w-5 h-5 mr-3 text-gray-500 mt-1" />
            <span className="font-medium">Ghi chú:</span>
            <span className="ml-2">{'Không có'}</span>
          </div> */}
        </div>
        <div className="flex justify-end space-x-2 pt-4">
           <Button type="button" variant="outline" onClick={onClose}>Đóng</Button>
           <Button type="button" onClick={onConfirmArrival}>Xác nhận khách đến</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
