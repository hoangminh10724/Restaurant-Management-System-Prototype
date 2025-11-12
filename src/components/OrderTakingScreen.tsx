import { useState, useEffect } from 'react';
import { MenuItem, OrderItem, Order } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Plus, Minus, Trash2, Send } from 'lucide-react';
import ModifierPopup from './ModifierPopup';

interface OrderTakingScreenProps {
  tableId: number;
  existingOrder?: Order;
  onSubmit: (tableId: number, items: OrderItem[]) => void;
  onUpdate: (tableId: number, items: OrderItem[]) => void;
  onBack: () => void;
}

const menuItems: MenuItem[] = [
  { id: 1, name: 'Caesar Salad', price: 12.99, category: 'Appetizers' },
  { id: 2, name: 'Bruschetta', price: 9.99, category: 'Appetizers' },
  { id: 3, name: 'Soup of the Day', price: 8.99, category: 'Appetizers' },
  { id: 4, name: 'Beef Steak', price: 32.99, category: 'Main Courses', modifiers: ['Rare', 'Medium-Rare', 'Medium', 'Well-done'] },
  { id: 5, name: 'Grilled Salmon', price: 28.99, category: 'Main Courses', modifiers: ['Rare', 'Medium', 'Well-done'] },
  { id: 6, name: 'Pasta Carbonara', price: 18.99, category: 'Main Courses' },
  { id: 7, name: 'Red Wine', price: 45.00, category: 'Drinks' },
  { id: 8, name: 'Beer', price: 6.50, category: 'Drinks' },
  { id: 9, name: 'Soft Drink', price: 3.50, category: 'Drinks' },
  { id: 10, name: 'Coffee', price: 4.50, category: 'Drinks' },
];

const categories = ['Appetizers', 'Main Courses', 'Drinks'];

export default function OrderTakingScreen({ tableId, existingOrder, onSubmit, onUpdate, onBack }: OrderTakingScreenProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>(existingOrder?.items || []);
  const [selectedCategory, setSelectedCategory] = useState('Appetizers');
  const [showModifierPopup, setShowModifierPopup] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  const handleAddItem = (menuItem: MenuItem) => {
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
        { ...menuItem, quantity: 1, selectedModifier: modifier },
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

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSendToKitchen = () => {
    if (existingOrder) {
      onUpdate(tableId, orderItems);
    } else {
      onSubmit(tableId, orderItems);
    }
  };

  const filteredMenuItems = menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1>Table {tableId}</h1>
              <p className="text-neutral-500 mt-1">Take Order</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Menu */}
          <div className="space-y-4">
            <Card className="p-4">
              <h2 className="mb-4">Menu</h2>
              
              {/* Category Tabs */}
              <div className="flex gap-2 mb-6">
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

              {/* Menu Items */}
              <div className="space-y-3">
                {filteredMenuItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-neutral-50 cursor-pointer"
                    onClick={() => handleAddItem(item)}
                  >
                    <div className="flex-1">
                      <h3>{item.name}</h3>
                      {item.modifiers && (
                        <p className="text-neutral-500 mt-1">Customizable</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-900">${item.price.toFixed(2)}</span>
                      <Button size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-4">
            <Card className="p-4 sticky top-6">
              <h2 className="mb-4">Order Summary</h2>

              {orderItems.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  <p>No items added yet</p>
                  <p className="mt-2">Select items from the menu to start the order</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {orderItems.map((item, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3>{item.name}</h3>
                            {item.selectedModifier && (
                              <Badge variant="secondary" className="mt-1">
                                {item.selectedModifier}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDecreaseQuantity(index)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleIncreaseQuantity(index)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <span className="text-neutral-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Subtotal</span>
                      <span className="text-neutral-900">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6"
                    onClick={handleSendToKitchen}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send to Kitchen
                  </Button>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Modifier Popup */}
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
