import { useState, useMemo, useEffect } from 'react';
import { Order, OrderItem, Table, Promotion, Customer, BillDetails } from '../App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { ArrowLeft, Tag, AlertCircle, Search, UserPlus, UserCheck, X } from 'lucide-react';
import PaymentMethodPopup from './PaymentMethodPopup';
import NewCustomerDialog from './NewCustomerDialog';

interface PaymentProcessingScreenProps {
  order: Order;
  tableId: number;
  promotions: Promotion[];
  customers: Customer[];
  onRegisterCustomer: (name: string, phone: string) => Customer;
  onPaymentComplete: (details: { customerId?: string; amountPaid: number; paidItems: OrderItem[]; billDetails: BillDetails }) => void;
  onBack: () => void;
}

const VAT_RATE = 0.08; // 8% VAT

export default function PaymentProcessingScreen({ order, promotions, customers, onRegisterCustomer, onPaymentComplete, onBack }: PaymentProcessingScreenProps) {
  const [appliedPromoIds, setAppliedPromoIds] = useState<string[]>([]);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  
  const [customerSearch, setCustomerSearch] = useState('');
  const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    setSelectedItems(order.items);
  }, [order]);

  const handleToggleItemSelection = (itemToToggle: OrderItem) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selectedItem => 
        selectedItem.id === itemToToggle.id &&
        selectedItem.selectedModifier === itemToToggle.selectedModifier &&
        selectedItem.notes === itemToToggle.notes
      );
      if (isSelected) {
        return prev.filter(selectedItem => 
          !(selectedItem.id === itemToToggle.id && 
            selectedItem.selectedModifier === itemToToggle.selectedModifier &&
            selectedItem.notes === itemToToggle.notes)
        );
      } else {
        return [...prev, itemToToggle];
      }
    });
  };

  const priceError = useMemo(() => {
    return order.items.find(item => typeof item.price !== 'number' || item.price <= 0);
  }, [order.items]);

  const billDetails: BillDetails = useMemo(() => {
    const itemsToCalculate = selectedItems;
    const subtotal = itemsToCalculate.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let totalDiscount = 0;
    const appliedPromotionsDetails: { name: string; amount: number }[] = [];

    appliedPromoIds.forEach(promoId => {
      const promo = promotions.find(p => p.id === promoId);
      if (promo && promo.type === 'discount') {
        const discountAmount = subtotal * (promo.value / 100);
        totalDiscount += discountAmount;
        appliedPromotionsDetails.push({ name: promo.name, amount: discountAmount });
      }
    });

    const totalAfterDiscount = subtotal - totalDiscount;
    const vatAmount = totalAfterDiscount * VAT_RATE;
    const grandTotal = totalAfterDiscount + vatAmount;

    return { subtotal, totalDiscount, appliedPromotionsDetails, vatAmount, grandTotal };
  }, [selectedItems, appliedPromoIds, promotions]);

  const handlePayment = () => {
    if (priceError || selectedItems.length === 0) return;
    setShowPaymentPopup(true);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setShowPaymentPopup(false);
    setTimeout(() => {
      onPaymentComplete({
        customerId: foundCustomer?.id,
        amountPaid: billDetails.grandTotal,
        paidItems: selectedItems,
        billDetails: billDetails,
      });
    }, 500);
  };

  const isSplitting = selectedItems.length < order.items.length;
  const activePromotions = promotions.filter(p => p.isActive);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" />Quay lại</Button>
            <div><h1>Thanh toán</h1><p className="text-neutral-500 mt-1">Bàn {order.tableId}</p></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Chi tiết hóa đơn</h2>
                <div className="flex items-center gap-2">
                  <Label htmlFor="select-all">Chọn tất cả</Label>
                  <Checkbox id="select-all" checked={!isSplitting && order.items.length > 0} onCheckedChange={(checked) => setSelectedItems(checked ? order.items : [])} />
                </div>
              </div>
              <div className="space-y-3">
                {order.items.map((item, index) => {
                  const isChecked = selectedItems.some(selectedItem => 
                    selectedItem.id === item.id &&
                    selectedItem.selectedModifier === item.selectedModifier &&
                    selectedItem.notes === item.notes
                  );
                  return (
                    <div key={index} className={`flex items-start justify-between border-b pb-3 transition-all ${isChecked ? '' : 'opacity-40'}`}>
                      <div className="flex-1 flex items-center">
                        <Checkbox className="mr-4" checked={isChecked} onCheckedChange={() => handleToggleItemSelection(item)} />
                        <div>
                          <p className="font-medium">{item.name} {item.selectedModifier ? `(${item.selectedModifier})` : ''}</p>
                          <p className="text-neutral-500 mt-1">${item.price.toFixed(2)} × {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-neutral-900 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="space-y-4 sticky top-24">
            <Card className="p-6">
              <h2 className="mb-4 font-semibold text-lg">Khách hàng thành viên</h2>
              {!foundCustomer ? (
                <div className="space-y-2">
                  <Label htmlFor="customer-search">Tra cứu SĐT / Mã</Label>
                  <div className="flex gap-2">
                    <Input id="customer-search" placeholder="Nhập SĐT hoặc mã..." value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} />
                    <Button onClick={() => {}}><Search className="w-4 h-4" /></Button>
                  </div>
                  {searchError && (
                    <div className="text-red-600 text-sm mt-2 flex items-center justify-between">
                      <span>{searchError}</span>
                      <Button variant="link" className="p-0 h-auto" onClick={() => setIsRegistering(true)}>
                        <UserPlus className="w-4 h-4 mr-1"/> Đăng ký mới
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-green-900 flex items-center"><UserCheck className="w-4 h-4 mr-2"/>{foundCustomer.name}</p>
                      <p className="text-sm text-green-800">Hạng: {foundCustomer.tier} - {foundCustomer.points} điểm</p>
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => { setFoundCustomer(null); setCustomerSearch(''); }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 font-semibold text-lg">Tổng cộng {isSplitting ? `(${selectedItems.length} món)` : ''}</h2>
              {priceError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" /><AlertTitle>Lỗi</AlertTitle>
                  <AlertDescription>Món "{priceError.name}" bị thiếu giá.</AlertDescription>
                </Alert>
              )}
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-neutral-600">Tiền hàng</span><span>${billDetails.subtotal.toFixed(2)}</span></div>
                <div className="space-y-2">
                  <p className="text-neutral-600">Khuyến mãi</p>
                  {activePromotions.length > 0 ? activePromotions.map(promo => (
                    <div key={promo.id} className="flex items-center space-x-3 text-sm">
                      <Checkbox id={`promo-bill-${promo.id}`} checked={appliedPromoIds.includes(promo.id)} onCheckedChange={() => handleTogglePromotion(promo.id)} />
                      <Label htmlFor={`promo-bill-${promo.id}`} className="flex-1 cursor-pointer">{promo.name}</Label>
                    </div>
                  )) : <p className="text-xs text-neutral-400 pl-4">Không có khuyến mãi.</p>}
                  {billDetails.appliedPromotionsDetails.map((promo, index) => (
                    <div key={index} className="flex justify-between text-red-600 pl-8">
                      <span className="flex items-center gap-2"><Tag className="w-4 h-4"/>{promo.name}</span>
                      <span>-${promo.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between"><span className="text-neutral-600">VAT ({VAT_RATE * 100}%)</span><span>${billDetails.vatAmount.toFixed(2)}</span></div>
                <div className="border-t my-2"></div>
                <div className="flex justify-between font-bold text-xl"><span>Phải trả</span><span>${billDetails.grandTotal.toFixed(2)}</span></div>
              </div>
              <Button className="w-full mt-6 h-12 text-lg" onClick={handlePayment} disabled={!!priceError || selectedItems.length === 0}>
                {isSplitting ? 'Thanh toán mục đã chọn' : 'Thanh toán toàn bộ'}
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {showPaymentPopup && <PaymentMethodPopup total={billDetails.grandTotal} onSelect={handlePaymentMethodSelect} onClose={() => setShowPaymentPopup(false)} />}
      {isRegistering && <NewCustomerDialog isOpen={isRegistering} onClose={() => setIsRegistering(false)} onConfirm={handleConfirmRegistration} initialPhone={customerSearch} />}
    </div>
  );
}
