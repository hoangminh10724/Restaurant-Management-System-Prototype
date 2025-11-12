import React from 'react';
import { Order, Customer } from '../App';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface BillDetails {
  subtotal: number;
  totalDiscount: number;
  appliedPromotionsDetails: { name: string; amount: number }[];
  vatAmount: number;
  grandTotal: number;
}

interface InvoiceViewProps {
  order: Order;
  billDetails: BillDetails;
  customer?: Customer | null;
  onBack: () => void;
}

export default function InvoiceView({ order, billDetails, customer, onBack }: InvoiceViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-neutral-200 p-8 flex flex-col items-center">
      <div className="w-full max-w-md bg-white shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">RESTAURANT POS</h1>
          <p className="text-neutral-500">123 Example Street, City</p>
          <p className="text-neutral-500">Phone: (123) 456-7890</p>
        </div>

        <Separator className="my-4" />

        <div className="mb-4">
          <p><strong>Hóa đơn cho Bàn:</strong> {order.tableId}</p>
          <p><strong>Ngày:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Giờ:</strong> {new Date().toLocaleTimeString()}</p>
          {customer && <p><strong>Khách hàng:</strong> {customer.name} - {customer.phone}</p>}
        </div>

        <Separator className="my-4" />

        <table className="w-full mb-4">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Món</th>
              <th className="text-center py-2">SL</th>
              <th className="text-right py-2">Đơn giá</th>
              <th className="text-right py-2">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">
                  {item.name}
                  {item.selectedModifier && <span className="text-xs text-neutral-500 block">({item.selectedModifier})</span>}
                </td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">${item.price.toFixed(2)}</td>
                <td className="text-right py-2">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex justify-between"><span>Tiền hàng:</span><span>${billDetails.subtotal.toFixed(2)}</span></div>
          {billDetails.appliedPromotionsDetails.map((promo, index) => (
            <div key={index} className="flex justify-between text-red-600">
              <span>{promo.name}:</span>
              <span>-${promo.amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between"><span>VAT (8%):</span><span>${billDetails.vatAmount.toFixed(2)}</span></div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-lg"><span>TỔNG CỘNG:</span><span>${billDetails.grandTotal.toFixed(2)}</span></div>
        </div>

        <Separator className="my-4" />

        <p className="text-center text-sm text-neutral-600">Cảm ơn quý khách và hẹn gặp lại!</p>
      </div>
      
      <div className="w-full max-w-md mt-6 flex gap-4 print:hidden">
        <Button variant="outline" onClick={onBack} className="flex-1">Quay lại</Button>
        <Button onClick={handlePrint} className="flex-1">In hóa đơn</Button>
      </div>
    </div>
  );
}
