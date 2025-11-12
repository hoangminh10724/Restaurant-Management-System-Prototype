import { useState } from 'react';
import { Table, Booking } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar as CalendarIcon, Clock, Users, ArrowLeft, CheckCircle } from 'lucide-react';

interface OnlineBookingScreenProps {
  tables: Table[];
  onBookingCreate: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  onBack: () => void;
}

export default function OnlineBookingScreen({ tables, onBookingCreate, onBack }: OnlineBookingScreenProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    date: '',
    time: '',
    guests: 2,
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const availableTables = tables.filter(t => t.status === 'empty').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onBookingCreate({
      ...formData,
      status: 'pending',
    });
    
    setSubmitted(true);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="mb-3">Đặt bàn thành công!</h1>
          <p className="text-neutral-600 mb-6">
            Chúng tôi đã nhận được yêu cầu đặt bàn của bạn. Một email xác nhận sẽ được gửi đến {formData.customerEmail}.
          </p>
          <div className="bg-neutral-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <p className="text-neutral-500">Tên khách hàng</p>
                <p className="font-medium">{formData.customerName}</p>
              </div>
              <div className="text-left">
                <p className="text-neutral-500">Số điện thoại</p>
                <p className="font-medium">{formData.customerPhone}</p>
              </div>
              <div className="text-left">
                <p className="text-neutral-500">Ngày</p>
                <p className="font-medium">{formData.date}</p>
              </div>
              <div className="text-left">
                <p className="text-neutral-500">Giờ</p>
                <p className="font-medium">{formData.time}</p>
              </div>
              <div className="text-left">
                <p className="text-neutral-500">Số khách</p>
                <p className="font-medium">{formData.guests} người</p>
              </div>
            </div>
          </div>
          <Button onClick={onBack} className="w-full">
            Quay lại trang chủ
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Đặt bàn trực tuyến</CardTitle>
            <CardDescription>
              Vui lòng điền thông tin để đặt bàn tại nhà hàng
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-neutral-200'}`}>
                  1
                </div>
                <span className="text-sm">Thông tin</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-orange-500' : 'bg-neutral-200'}`}></div>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-neutral-200'}`}>
                  2
                </div>
                <span className="text-sm">Xác nhận</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên *</Label>
                    <Input
                      id="name"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      placeholder="Nhập email (không bắt buộc)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Ngày *</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          className="pl-10"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Giờ *</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => handleInputChange('time', e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests">Số lượng khách *</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.guests}
                        onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full"
                    disabled={!formData.customerName || !formData.customerPhone || !formData.date || !formData.time}
                  >
                    Tiếp tục
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
                    <h3>Thông tin đặt bàn</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Tên khách hàng:</span>
                        <span>{formData.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Số điện thoại:</span>
                        <span>{formData.customerPhone}</span>
                      </div>
                      {formData.customerEmail && (
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Email:</span>
                          <span>{formData.customerEmail}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Ngày:</span>
                        <span>{formData.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Giờ:</span>
                        <span>{formData.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Số khách:</span>
                        <span>{formData.guests} người</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú</Label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Yêu cầu đặc biệt (không bắt buộc)"
                      className="w-full min-h-[100px] px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Lưu ý:</strong> Chúng tôi sẽ gửi tin nhắn xác nhận đến số điện thoại của bạn trong vòng 30 phút.
                      Hiện có {availableTables} bàn trống.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Quay lại
                    </Button>
                    <Button type="submit" className="flex-1">
                      Xác nhận đặt bàn
                    </Button>
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
