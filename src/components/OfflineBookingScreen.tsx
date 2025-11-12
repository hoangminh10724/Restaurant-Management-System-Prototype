import { useState } from 'react';
import { Table, Booking } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface OfflineBookingScreenProps {
  tables: Table[];
  bookings: Booking[];
  onBookingCreate: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  onBack: () => void;
}

export default function OfflineBookingScreen({ tables, bookings, onBookingCreate, onBack }: OfflineBookingScreenProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    date: '',
    time: '',
    guests: 2,
  });
  const [suggestedTables, setSuggestedTables] = useState<Table[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFindTables = () => {
    setError(null);

    // Filter tables that don't have a confirmed booking at the requested date and time.
    const availableTables = tables.filter(table => {
      const hasConflict = bookings.some(booking => 
        booking.tableId === table.id &&
        booking.date === formData.date &&
        booking.time === formData.time &&
        booking.status === 'confirmed'
      );
      return !hasConflict && table.status !== 'serving';
    });

    if (availableTables.length === 0) {
      setError('Không còn bàn phù hợp vào thời điểm này hoặc đã được đặt trước.');
    } else {
      setSuggestedTables(availableTables);
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTableId) {
      setError("Vui lòng chọn một bàn.");
      return;
    }
    
    onBookingCreate({
      ...formData,
      tableId: selectedTableId,
      status: 'confirmed',
    });
    
    toast.success(`Đặt bàn thành công cho ${formData.customerName} tại Bàn ${selectedTableId}.`);
    onBack();
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/Background/service.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" />Quay lại</Button>
            <div><h1>Tạo đặt bàn Offline</h1><p className="text-neutral-500 mt-1">Nhập thông tin khách hàng và chọn bàn</p></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-8 px-6">
        <Card>
          <CardHeader>
            <CardTitle>Biểu mẫu đặt bàn</CardTitle>
            <CardDescription>Hoàn tất các bước để tạo booking mới.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <h3 className="font-semibold">Bước 1: Yêu cầu của khách</h3>
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
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Button type="button" onClick={handleFindTables} className="w-full" disabled={!formData.date || !formData.time || formData.guests <= 0}>
                    Tìm bàn phù hợp
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <h3 className="font-semibold">Bước 2: Chọn bàn và thông tin khách</h3>
                  <div className="space-y-2">
                    <Label>Bàn trống gợi ý:</Label>
                    <div className="grid grid-cols-4 gap-2 p-2 border rounded-md max-h-32 overflow-y-auto">
                      {suggestedTables.map(table => (
                        <Button key={table.id} variant={selectedTableId === table.id ? 'default' : 'outline'} onClick={() => setSelectedTableId(table.id)}>
                          Bàn {table.id}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên khách hàng *</Label>
                    <Input id="name" value={formData.customerName} onChange={(e) => handleInputChange('customerName', e.target.value)} placeholder="Nhập họ và tên" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input id="phone" type="tel" value={formData.customerPhone} onChange={(e) => handleInputChange('customerPhone', e.target.value)} placeholder="Nhập số điện thoại" required />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
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
  );
}