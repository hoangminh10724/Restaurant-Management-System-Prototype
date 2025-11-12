import { useState } from 'react';
import { Order } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { QrCode, CreditCard, CheckCircle } from 'lucide-react';

interface CustomerSelfPaymentScreenProps {
  order: Order;
  tableId: number;
  onPaymentComplete: () => void;
}

export default function CustomerSelfPaymentScreen({ order, tableId, onPaymentComplete }: CustomerSelfPaymentScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'card' | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vatRate = 0.1;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  const handlePayment = () => {
    setIsPaying(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="mb-3">Thanh toán thành công!</h1>
          <p className="text-neutral-600">
            Cảm ơn quý khách đã sử dụng dịch vụ. Hẹn gặp lại!
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <Card className="p-6">
          <h1 className="mb-2">Thanh toán tự động</h1>
          <p className="text-neutral-600 mb-6">Bàn số {tableId}</p>

          {/* Order Summary */}
          <div className="mb-6">
            <h2 className="mb-4">Chi tiết đơn hàng</h2>
            <div className="space-y-3 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-start justify-between pb-3 border-b">
                  <div className="flex-1">
                    <h3>{item.name}</h3>
                    {item.selectedModifier && (
                      <p className="text-neutral-500 mt-1">{item.selectedModifier}</p>
                    )}
                    <p className="text-neutral-500 mt-1">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-neutral-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Tạm tính</span>
                <span className="text-neutral-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">VAT (10%)</span>
                <span className="text-neutral-900">${vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span>Tổng cộng</span>
                <span className="text-2xl">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {!paymentMethod ? (
            <>
              <h2 className="mb-4">Chọn phương thức thanh toán</h2>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-32 flex flex-col gap-3"
                  onClick={() => setPaymentMethod('qr')}
                >
                  <QrCode className="w-12 h-12" />
                  <span>Quét mã QR</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-32 flex flex-col gap-3"
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className="w-12 h-12" />
                  <span>Thẻ ngân hàng</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {paymentMethod === 'qr' && (
                <div className="text-center">
                  <h2 className="mb-4">Quét mã QR để thanh toán</h2>
                  <div className="mx-auto w-64 h-64 bg-white border-4 border-neutral-900 rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="w-48 h-48" />
                  </div>
                  <p className="text-neutral-600">
                    Sử dụng ứng dụng ngân hàng để quét mã QR
                  </p>
                  <p className="text-neutral-600 mb-6">
                    Số tiền: ${total.toFixed(2)}
                  </p>
                  <Button onClick={handlePayment} disabled={isPaying} className="w-full">
                    {isPaying ? 'Đang xử lý...' : 'Xác nhận đã thanh toán'}
                  </Button>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div>
                  <h2 className="mb-4">Thanh toán bằng thẻ</h2>
                  <p className="text-neutral-600 mb-6 text-center">
                    Vui lòng chạm thẻ của bạn vào thiết bị đọc thẻ
                  </p>
                  <div className="mx-auto w-64 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <CreditCard className="w-24 h-24 text-white" />
                  </div>
                  <Button onClick={handlePayment} disabled={isPaying} className="w-full">
                    {isPaying ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                  </Button>
                </div>
              )}

              <Button variant="outline" onClick={() => setPaymentMethod(null)} className="w-full">
                Chọn phương thức khác
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
