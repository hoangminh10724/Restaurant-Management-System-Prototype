import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle, Printer, Mail } from 'lucide-react';

interface ConfirmationScreenProps {
  onBackToDashboard: () => void;
}

export default function ConfirmationScreen({ onBackToDashboard }: ConfirmationScreenProps) {
  const handlePrintReceipt = () => {
    // Simulate printing
    alert('Receipt sent to printer');
  };

  const handleSendEmail = () => {
    // Simulate email sending
    alert('E-receipt sent successfully');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="mb-3">Payment Successful!</h1>
        <p className="text-neutral-500 mb-8">
          The payment has been processed successfully.
        </p>

        <div className="space-y-3 mb-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={handlePrintReceipt}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSendEmail}
          >
            <Mail className="w-4 h-4 mr-2" />
            Send E-Receipt
          </Button>
        </div>

        <Button className="w-full" onClick={onBackToDashboard}>
          Back to Dashboard
        </Button>
      </Card>
    </div>
  );
}
