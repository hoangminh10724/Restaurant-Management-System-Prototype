import { useState } from 'react';
import { Order, Table } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Percent, Split, Merge, ArrowRight } from 'lucide-react';
import PaymentMethodPopup from './PaymentMethodPopup';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface PaymentProcessingScreenProps {
  order: Order;
  tableId: number;
  tables: Table[];
  onPaymentComplete: () => void;
  onBack: () => void;
  onTableUpdate: (tables: Table[]) => void;
  onOrderUpdate: (orders: Order[]) => void;
  orders: Order[];
}

export default function PaymentProcessingScreen({ order, tableId, tables, onPaymentComplete, onBack, onTableUpdate, onOrderUpdate, orders }: PaymentProcessingScreenProps) {
  const [discount, setDiscount] = useState(0);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const afterDiscount = subtotal - discountAmount;
  const vatRate = 0.1; // 10% VAT
  const vatAmount = afterDiscount * vatRate;
  const grandTotal = afterDiscount + vatAmount;

  const handlePayment = () => {
    setShowPaymentPopup(true);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setShowPaymentPopup(false);
    // Simulate payment processing
    setTimeout(() => {
      onPaymentComplete();
    }, 500);
  };

  const handleSplitBill = () => {
    // Simplified split bill logic
    alert('Tách hóa đơn - Chức năng demo');
    setShowSplitDialog(false);
  };

  const handleMergeTables = (targetTableId: number) => {
    // Merge logic
    alert(`Gộp bàn ${tableId} với bàn ${targetTableId}`);
    setShowMergeDialog(false);
  };

  const handleTransferTable = (targetTableId: number) => {
    // Transfer logic
    alert(`Chuyển order từ bàn ${tableId} sang bàn ${targetTableId}`);
    setShowTransferDialog(false);
  };

  const availableTables = tables.filter(t => t.id !== tableId && t.status !== 'booked');

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1>Payment Processing</h1>
              <p className="text-neutral-500 mt-1">Table {order.tableId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoice Details */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <h2 className="mb-4">Invoice Details</h2>
              
              <div className="space-y-3 mb-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-start justify-between border-b pb-3">
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
            </Card>

            {/* Additional Options */}
            <Card className="p-6">
              <h2 className="mb-4">Additional Options</h2>
              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" onClick={() => setShowSplitDialog(true)}>
                  <Split className="w-4 h-4 mr-2" />
                  Split Bill
                </Button>
                <Button variant="outline" onClick={() => setShowMergeDialog(true)}>
                  <Merge className="w-4 h-4 mr-2" />
                  Merge Tables
                </Button>
                <Button variant="outline" onClick={() => setShowTransferDialog(true)}>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Transfer Table
                </Button>
              </div>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="space-y-4">
            <Card className="p-6 sticky top-6">
              <h2 className="mb-4">Payment Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="text-neutral-900">${subtotal.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <div className="relative">
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="pr-10"
                    />
                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  </div>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-red-600">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">After Discount</span>
                  <span className="text-neutral-900">${afterDiscount.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">VAT (10%)</span>
                  <span className="text-neutral-900">${vatAmount.toFixed(2)}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span>Grand Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={handlePayment}>
                Process Payment
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Method Popup */}
      {showPaymentPopup && (
        <PaymentMethodPopup
          total={grandTotal}
          onSelect={handlePaymentMethodSelect}
          onClose={() => setShowPaymentPopup(false)}
        />
      )}

      {/* Split Bill Dialog */}
      {showSplitDialog && (
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tách Hóa Đơn</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Chức năng tách hóa đơn đang được phát triển.</p>
              <Button variant="outline" onClick={handleSplitBill}>
                Tách Hóa Đơn
              </Button>
              <Button variant="ghost" onClick={() => setShowSplitDialog(false)}>
                Hủy
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Merge Tables Dialog */}
      {showMergeDialog && (
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gộp Bàn</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Chọn bàn bạn muốn gộp:</p>
              <div className="grid grid-cols-2 gap-4">
                {availableTables.map(table => (
                  <Button key={table.id} variant="outline" onClick={() => handleMergeTables(table.id)}>
                    Bàn {table.id}
                  </Button>
                ))}
              </div>
              <Button variant="ghost" onClick={() => setShowMergeDialog(false)}>
                Hủy
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Transfer Table Dialog */}
      {showTransferDialog && (
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chuyển Bàn</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Chọn bàn bạn muốn chuyển:</p>
              <div className="grid grid-cols-2 gap-4">
                {availableTables.map(table => (
                  <Button key={table.id} variant="outline" onClick={() => handleTransferTable(table.id)}>
                    Bàn {table.id}
                  </Button>
                ))}
              </div>
              <Button variant="ghost" onClick={() => setShowTransferDialog(false)}>
                Hủy
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}