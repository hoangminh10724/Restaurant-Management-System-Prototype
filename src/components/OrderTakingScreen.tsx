import { useState } from 'react';
import { MenuItem, OrderItem, Order } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ArrowLeft, Plus, Minus, Trash2, Send, Ban } from 'lucide-react';
import ModifierPopup from './ModifierPopup';

interface OrderTakingScreenProps {
  tableId: number;
  menuItems: MenuItem[];
  existingOrder?: Order | null;
  onSubmit: (tableId: number, items: OrderItem[]) => void;
  onUpdate: (tableId: number, items: OrderItem[]) => void;
  onBack: () => void;
}

const categories = ['Món chính', 'Món ăn vặt', 'Nước uống'];

export default function OrderTakingScreen({ tableId, menuItems, existingOrder, onSubmit, onUpdate, onBack }: OrderTakingScreenProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>(existingOrder?.items || []);
  const [selectedCategory, setSelectedCategory] = useState('Món chính');
  const [showModifierPopup, setShowModifierPopup] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  const handleAddItem = (menuItem: MenuItem) => {
    // 3a. Món đã hết:
    if (!menuItem.isAvailable) {
      // Although the button is disabled, this is a safeguard.
      return; 
    }

    if (menuItem.modifiers && menuItem.modifiers.length > 0) {
      setSelectedMenuItem(menuItem);
      setShowModifierPopup(true);
    } else {
      addItemToOrder(menuItem);
    }
  };

  const addItemToOrder = (menuItem: MenuItem, modifier?: string) => {
    const existingItem = orderItems.find(
      item => item.id === menuItem.id && item.selectedModifier === modifier
    );

    if (existingItem) {
      setOrderItems(
        orderItems.map(item =>
          item.id === menuItem.id && item.selectedModifier === modifier
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        { ...menuItem, quantity: 1, selectedModifier: modifier, notes: '' },
      ]);
    }
  };

  const handleModifierSelect = (modifier: string) => {
    if (selectedMenuItem) {
      addItemToOrder(selectedMenuItem, modifier);
    }
    setShowModifierPopup(false);
    setSelectedMenuItem(null);
  };

  const handleIncreaseQuantity = (index: number) => {
    setOrderItems(
      orderItems.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (index: number) => {
    const item = orderItems[index];
    if (item.quantity > 1) {
      setOrderItems(
        orderItems.map((item, i) =>
          i === index ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    } else {
      handleRemoveItem(index);
    }
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleNoteChange = (index: number, note: string) => {
    setOrderItems(
      orderItems.map((item, i) =>
        i === index ? { ...item, notes: note } : item
      )
    );
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSendToKitchen = () => {
    if (orderItems.length === 0) return; // Safeguard

    if (existingOrder) {
      onUpdate(tableId, orderItems);
    } else {
      onSubmit(tableId, orderItems);
    }
    onBack(); // Go back to dashboard after sending
  };

  const filteredMenuItems = menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1>Bàn {tableId}</h1>
              <p className="text-neutral-500 mt-1">Ghi order</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column - Menu */}
          <div className="space-y-4">
            <Card className="p-4">
              <h2 className="mb-4 text-xl font-semibold">Thực đơn</h2>
              
              <div className="flex gap-2 mb-6 border-b pb-4">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {filteredMenuItems.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                      !item.isAvailable
                        ? 'bg-neutral-100 cursor-not-allowed'
                        : 'hover:bg-neutral-50 cursor-pointer'
                    }`}
                    onClick={() => handleAddItem(item)}
                  >
                    {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />}
                    <div className="flex-1">
                      <h3 className={`${!item.isAvailable ? 'text-neutral-400' : ''}`}>{item.name}</h3>
                      {item.isAvailable && item.modifiers && (
                        <p className="text-sm text-neutral-500 mt-1">Tùy chỉnh</p>
                      )}
                      {!item.isAvailable && (
                        <Badge variant="destructive" className="mt-1">Tạm hết</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-semibold ${!item.isAvailable ? 'text-neutral-400' : 'text-neutral-900'}`}>
                        {item.price.toLocaleString('vi-VN')}₫
                      </span>
                      <Button size="sm" disabled={!item.isAvailable}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-4 sticky top-24">
            <Card className="p-4">
              <h2 className="mb-4 text-xl font-semibold">Chi tiết Order</h2>

              {orderItems.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  <p>Chưa có món nào</p>
                  <p className="mt-2 text-sm">Chọn món từ thực đơn để bắt đầu</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
                    {orderItems.map((item, index) => (
                      <div key={index} className="border rounded-lg p-3 bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            {item.selectedModifier && (
                              <Badge variant="secondary" className="mt-1">
                                {item.selectedModifier}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleDecreaseQuantity(index)}>
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <Button size="sm" variant="outline" onClick={() => handleIncreaseQuantity(index)}>
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <span className="text-neutral-900 font-semibold">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        <Input
                          type="text"
                          placeholder="Thêm ghi chú..."
                          value={item.notes}
                          onChange={(e) => handleNoteChange(index, e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Tổng cộng</span>
                      <span>{calculateSubtotal().toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 h-12 text-lg"
                    onClick={handleSendToKitchen}
                    disabled={orderItems.length === 0}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {existingOrder ? 'Cập nhật Order' : 'Gửi Order'}
                  </Button>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>

      {showModifierPopup && selectedMenuItem && (
        <ModifierPopup
          item={selectedMenuItem}
          onSelect={handleModifierSelect}
          onClose={() => {
            setShowModifierPopup(false);
            setSelectedMenuItem(null);
          }}
        />
      )}
    </div>
  );
}