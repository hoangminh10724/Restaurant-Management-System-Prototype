import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { CreditCard, Banknote, QrCode } from 'lucide-react';

interface PaymentMethodPopupProps {
  total: number;
  onSelect: (method: string) => void;
  onClose: () => void;
}

export default function PaymentMethodPopup({ total, onSelect, onClose }: PaymentMethodPopupProps) {
  const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: Banknote },
    { id: 'card', name: 'Card', icon: CreditCard },
    { id: 'qr', name: 'QR Code', icon: QrCode },
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Payment Method</DialogTitle>
          <DialogDescription>
            Total Amount: ${total.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <Button
                key={method.id}
                variant="outline"
                className="h-16 justify-start gap-4"
                onClick={() => onSelect(method.id)}
              >
                <Icon className="w-6 h-6" />
                <span>{method.name}</span>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
