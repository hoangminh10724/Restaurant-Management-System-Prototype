import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle, FileText } from 'lucide-react';
import { BillDetails, Order, Customer } from '../App';

interface ConfirmationScreenProps {
  onBackToDashboard: () => void;
  onNavigateToInvoice: () => void;
  lastCompletedTransaction: { order: Order; billDetails: BillDetails; customer?: Customer | null } | null;
}

export default function ConfirmationScreen({ onBackToDashboard, onNavigateToInvoice, lastCompletedTransaction }: ConfirmationScreenProps) {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="mb-3">Thanh toán thành công!</h1>
        <p className="text-neutral-500 mb-8">
          Giao dịch đã được xử lý thành công.
        </p>

        <div className="space-y-3 mb-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={onNavigateToInvoice}
            disabled={!lastCompletedTransaction}
          >
            <FileText className="w-4 h-4 mr-2" />
            Xuất hóa đơn
          </Button>
        </div>

        <Button className="w-full" onClick={onBackToDashboard}>
          Quay lại Sơ đồ bàn
        </Button>
      </Card>
    </div>
  );
}
