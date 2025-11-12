import { useState } from 'react';
import { Table, Booking } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ArrowLeft, Plus, Search, Phone, Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface OfflineBookingScreenProps {
  tables: Table[];
  bookings: Booking[];
  onBookingCreate: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  onBack: () => void;
}

export default function OfflineBookingScreen({ tables, bookings, onBookingCreate, onBack }: OfflineBookingScreenProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    date: '',
    time: '',
    guests: 2,
    tableId: undefined as number | undefined,
    notes: '',
  });

  const availableTables = tables.filter(t => t.status === 'empty');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onBookingCreate({
      ...formData,
      status: 'confirmed',
    });
    
    setShowCreateDialog(false);
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      date: '',
      time: '',
      guests: 2,
      tableId: undefined,
      notes: '',
    });
  };

  const filteredBookings = bookings.filter(b =>
    b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.customerPhone.includes(searchQuery)
  );

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1>Quản lý đặt bàn</h1>
              <p className="text-neutral-500 mt-1">Đặt bàn Offline - Lễ tân</p>
            </div>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo đặt bàn mới
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{booking.customerName}</CardTitle>
                    <p className="text-sm text-neutral-500 mt-1">ID: {booking.id}</p>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <span>{booking.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="w-4 h-4 text-neutral-400" />
                  <span>{booking.date} lúc {booking.time}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Số khách:</span>
                  <span>{booking.guests} người</span>
                </div>
                {booking.tableId && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Bàn số:</span>
                    <span className="font-medium">Bàn {booking.tableId}</span>
                  </div>
                )}
                {booking.notes && (
                  <div className="text-sm text-neutral-600 bg-neutral-50 p-2 rounded">
                    <p className="font-medium">Ghi chú:</p>
                    <p>{booking.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-neutral-500">Không tìm thấy đặt bàn nào</p>
          </Card>
        )}
      </div>

      {/* Create Booking Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo đặt bàn mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin khách hàng để tạo đặt bàn
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Tên khách hàng *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone">Số điện thoại *</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="date">Ngày *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Giờ *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="guests">Số khách *</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="table">Bàn số</Label>
                <select
                  id="table"
                  value={formData.tableId || ''}
                  onChange={(e) => setFormData({ ...formData, tableId: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full h-10 px-3 border rounded-lg"
                >
                  <option value="">Tự động</option>
                  {availableTables.map(t => (
                    <option key={t.id} value={t.id}>Bàn {t.id}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Yêu cầu đặc biệt..."
                className="w-full min-h-[80px] px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                Hủy
              </Button>
              <Button type="submit" className="flex-1">
                Tạo đặt bàn
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
