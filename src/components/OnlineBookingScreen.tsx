import { useState } from 'react';
import { Table, Booking, Staff } from '../App';
import HeaderBar from './HeaderBar';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Calendar as CalendarIcon, Clock, Users, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from './ui/dialog';

interface OnlineBookingScreenProps {
  tables: Table[];
  onBookingCreate: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  onNavigateToTableMap?: () => void;
  onNavigateToKitchen?: () => void;
  onNavigateToManagement?: () => void;
  onLogout?: () => void;
  user?: Staff | null;
}

export default function OnlineBookingScreen({ tables, onBookingCreate, onNavigateToTableMap, onNavigateToKitchen, onNavigateToManagement, onLogout, user }: OnlineBookingScreenProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    date: '',
    time: '',
    guests: 2,
    eventType: '',
    notes: ''
  });
  const [suggestedTables, setSuggestedTables] = useState<Table[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [pendingTableId, setPendingTableId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFindTables = () => {
    setError(null);
    // Filter empty tables and sort by capacity to match guest count
    const available = tables.filter(t => t.status === 'empty').sort((a, b) => (a.maxSeats || 4) - (b.maxSeats || 4));
    if (available.length === 0) {
      setError('Không còn bàn phù hợp vào thời điểm này. Vui lòng thử lại sau.');
    } else {
      // Auto-select first table with capacity >= guests
      const appropriateTable = available.find(t => (t.maxSeats || 4) >= formData.guests);
      if (appropriateTable) {
        setSelectedTableId(appropriateTable.id);
      }
      setSuggestedTables(available);
      setStep(2);
    }
  };

  const openTableDialog = (tableId: number) => {
    setPendingTableId(tableId);
    setIsTableDialogOpen(true);
  };

  const confirmTableSelection = (tableId: number) => {
    setSelectedTableId(tableId);
    setIsTableDialogOpen(false);
    setPendingTableId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTableId) {
      setError("Vui lòng chọn một bàn.");
      return;
    }
    
    onBookingCreate({
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      date: formData.date,
      time: formData.time,
      guests: formData.guests,
      tableId: selectedTableId,
      status: 'confirmed', // Online bookings are auto-confirmed
      notes: formData.notes,
      setup: formData.eventType,
    });
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: "url('/Background/service.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Card className="w-full max-w-md text-center p-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="mb-3">Đặt bàn thành công!</h1>
          <p className="text-neutral-600 mb-6">
            Cảm ơn bạn đã đặt bàn tại nhà hàng chúng tôi. Thông tin chi tiết:
          </p>
          <div className="bg-neutral-50 rounded-lg p-4 mb-6 text-left">
            <p><strong>Tên:</strong> {formData.customerName}</p>
            <p><strong>SĐT:</strong> {formData.customerPhone}</p>
            <p><strong>Thời gian:</strong> {formData.time}, {formData.date}</p>
            <p><strong>Số khách:</strong> {formData.guests} người</p>
            <p><strong>Bàn số:</strong> {selectedTableId}</p>
            {formData.eventType && <p><strong>Sự kiện:</strong> {formData.eventType}</p>}
            {formData.notes && <p><strong>Ghi chú:</strong> {formData.notes}</p>}
          </div>
          <p className="text-sm text-neutral-500">Sử dụng thanh header phía trên để quay về trang chính.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <HeaderBar
        user={user ?? null}
        onNavigateToTableMap={onNavigateToTableMap}
        onNavigateToKitchen={onNavigateToKitchen}
        onNavigateToOnlineBooking={() => {}}
        onNavigateToManagement={onNavigateToManagement}
        onLogout={onLogout}
      />
      <div
        className="flex-1 overflow-auto p-4"
        style={{
          backgroundImage: "url('/Background/service.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Đặt bàn trực tuyến</CardTitle>
            <CardDescription>Hoàn tất các bước dưới đây để giữ chỗ.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <h3 className="font-semibold">Bước 1: Nhập thông tin</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Ngày *</Label>
                      <Input id="date" type="date" value={formData.date} onChange={(e) => handleInputChange('date', e.target.value)} min={new Date().toISOString().split('T')[0]} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Giờ *</Label>
                      <Input id="time" type="time" value={formData.time} onChange={(e) => handleInputChange('time', e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guests">Số lượng khách *</Label>
                    <Input id="guests" type="number" min="1" max="20" value={formData.guests} onChange={(e) => handleInputChange('guests', parseInt(e.target.value))} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventType">Sự kiện (tuỳ chọn)</Label>
                    <select id="eventType" value={formData.eventType} onChange={(e) => handleInputChange('eventType', e.target.value)} className="w-full rounded-md border px-3 py-2">
                      <option value="">(Không chọn)</option>
                      <option value="Kỉ niệm">Kỉ niệm</option>
                      <option value="Sinh nhật">Sinh nhật</option>
                      <option value="Họp nhóm">Họp nhóm</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú / Yêu cầu</Label>
                    <Textarea id="notes" rows={4} maxLength={250} value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} placeholder="Ví dụ: Không ăn cay, bàn gần cửa sổ..." />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Button type="button" onClick={handleFindTables} className="w-full" disabled={!formData.date || !formData.time || formData.guests <= 0}>
                    Tìm bàn phù hợp
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <h3 className="font-semibold">Bước 2: Chọn bàn và nhập thông tin</h3>
                  <div className="space-y-2">
                    <Label>Bàn trống gợi ý:</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {suggestedTables.map(table => (
                        <Button
                          key={table.id}
                          variant={selectedTableId === table.id ? 'default' : 'outline'}
                          className={selectedTableId === table.id ? 'bg-yellow-300 text-black border-yellow-300 hover:bg-yellow-300' : ''}
                          onClick={() => openTableDialog(table.id)}
                        >
                          Bàn {table.id}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên *</Label>
                    <Input id="name" value={formData.customerName} onChange={(e) => handleInputChange('customerName', e.target.value)} placeholder="Nhập họ và tên" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input id="phone" type="tel" value={formData.customerPhone} onChange={(e) => handleInputChange('customerPhone', e.target.value)} placeholder="Nhập số điện thoại" required />
                  </div>

                  {/* Notes moved to Step 1 so it's visible earlier */}

                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Dialog open={isTableDialogOpen} onOpenChange={(open: boolean) => setIsTableDialogOpen(open)}>
                    <DialogContent>
                      <DialogTitle>Chọn số bàn</DialogTitle>
                      <DialogDescription>Chọn bàn bạn muốn đặt (bấm vào số để xác nhận).</DialogDescription>
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {suggestedTables.map(t => (
                          <Button key={t.id} className={selectedTableId === t.id ? 'bg-yellow-300 text-black border-yellow-300' : ''} onClick={() => confirmTableSelection(t.id)}>
                            Bàn {t.id}
                          </Button>
                        ))}
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Huỷ</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => { setStep(1); setError(null); }} className="flex-1">Quay lại</Button>
                    <Button type="button" onClick={() => { if(selectedTableId && formData.customerName && formData.customerPhone) setStep(3); else setError("Vui lòng chọn bàn và điền đủ thông tin.") }} className="flex-1" disabled={!selectedTableId || !formData.customerName || !formData.customerPhone}>Tiếp tục</Button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h3 className="font-semibold">Bước 3: Xác nhận thông tin</h3>
                  <div className="bg-neutral-50 rounded-lg p-4 space-y-2 text-sm">
                    <p><strong>Tên:</strong> {formData.customerName}</p>
                    <p><strong>SĐT:</strong> {formData.customerPhone}</p>
                    <p><strong>Thời gian:</strong> {formData.time}, {formData.date}</p>
                    <p><strong>Số khách:</strong> {formData.guests} người</p>
                    <p><strong>Bàn đã chọn:</strong> <span className="font-bold text-orange-600">Bàn {selectedTableId}</span></p>
                    {formData.eventType && <p><strong>Sự kiện:</strong> {formData.eventType}</p>}
                    {formData.notes && <p><strong>Ghi chú:</strong> {formData.notes}</p>}
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">Quay lại</Button>
                    <Button type="submit" className="flex-1">Xác nhận đặt bàn</Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}