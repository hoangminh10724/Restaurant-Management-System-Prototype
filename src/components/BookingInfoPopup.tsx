import { Table } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Calendar, Clock, User, Phone, StickyNote, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BookingInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmArrival: () => void;
  table: Table | null;
  onSave?: (details: { name: string, phone: string, time: string, notes: string }) => void;
}

export default function BookingInfoPopup({ isOpen, onClose, onConfirmArrival, table, onSave }: BookingInfoPopupProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (table) {
      setName(table.bookingName || '');
      setPhone(table.bookingPhone || '');
      setTime(table.bookingTime || '');
      setNotes(table.bookingNotes || '');
      setIsEditing(false);
    }
  }, [table, isOpen]);

  if (!table) return null;

  const handleSave = () => {
    if (onSave) {
      onSave({ name, phone, time, notes });
    }
    setIsEditing(false);
  };

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
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <span className="font-medium block text-sm mb-1">Tên khách hàng:</span>
              {isEditing ? (
                <Input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8"
                />
              ) : (
                <div className="border border-gray-300 rounded px-2 py-1 bg-gray-50 text-sm">
                  {name || 'Không có'}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <span className="font-medium block text-sm mb-1">Số điện thoại:</span>
              {isEditing ? (
                <Input 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-8"
                />
              ) : (
                <div className="border border-gray-300 rounded px-2 py-1 bg-gray-50 text-sm">
                  {phone || 'Không có'}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <span className="font-medium block text-sm mb-1">Giờ đặt:</span>
              {isEditing ? (
                <Input 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-8"
                />
              ) : (
                <div className="border border-gray-300 rounded px-2 py-1 bg-gray-50 text-sm">
                  {time || 'Không có'}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <StickyNote className="w-5 h-5 text-gray-500 mt-3" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Ghi chú:</span>
              </div>
              {isEditing ? (
                <Textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập ghi chú cho đặt bàn này..."
                  className="min-h-24"
                />
              ) : (
                <div className="border border-gray-300 rounded p-2 bg-gray-50 min-h-24 whitespace-pre-wrap text-sm">
                  {notes || 'Không có ghi chú'}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between pt-4">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            {isEditing ? (
              <>
                <Button type="button" variant="secondary" onClick={handleSave}>Lưu</Button>
                <Button type="button" variant="outline" onClick={() => {
                  setName(table.bookingName || '');
                  setPhone(table.bookingPhone || '');
                  setTime(table.bookingTime || '');
                  setNotes(table.bookingNotes || '');
                  setIsEditing(false);
                }}>Hủy chỉnh sửa</Button>
              </>
            ) : (
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
            )}
          </div>
          <Button type="button" onClick={onConfirmArrival}>Xác nhận khách đến</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
