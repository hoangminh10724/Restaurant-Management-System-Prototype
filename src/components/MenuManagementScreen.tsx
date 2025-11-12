import { useState } from 'react';
import { Ingredient } from '../App';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Plus, Edit, Eye, EyeOff } from 'lucide-react';
import MenuItemDialog, { MenuItem } from './MenuItemDialog';

interface MenuManagementScreenProps {
  ingredients: Ingredient[];
  onBack: () => void;
}

const initialMenuItems: MenuItem[] = [
    { id: 1, name: 'Bánh cuốn', category: 'Món chính', price: 50000, cost: 20000, isAvailable: true, image: '/Food/bánh cuốn.jpg' },
    { id: 2, name: 'Bánh xèo', category: 'Món chính', price: 60000, cost: 25000, isAvailable: true, image: '/Food/bánh xèo.jpg' },
    { id: 3, name: 'Canh ngao', category: 'Món chính', price: 55000, cost: 22000, isAvailable: true, image: '/Food/canh ngao.jpg' },
    { id: 4, name: 'Cơm tấm', category: 'Món chính', price: 45000, cost: 18000, isAvailable: true, image: '/Food/cơm tấm.jpg' },
    { id: 5, name: 'Tokbokki', category: 'Món ăn vặt', price: 70000, cost: 30000, isAvailable: true, image: '/Food/tokbokki.jpg' },
    { id: 6, name: 'Coca-Cola', category: 'Nước uống', price: 15000, cost: 5000, isAvailable: true, image: '/Drink/coca.jpg' },
    { id: 7, name: 'Fanta', category: 'Nước uống', price: 15000, cost: 5000, isAvailable: true, image: '/Drink/fanta.jpg' },
    { id: 8, name: 'Nước ép', category: 'Nước uống', price: 20000, cost: 8000, isAvailable: true, image: '/Drink/nước ép.jpg' },
    { id: 9, name: 'Pepsi', category: 'Nước uống', price: 15000, cost: 5000, isAvailable: true, image: '/Drink/pepsi.jpg' },
];

export default function MenuManagementScreen({ onBack }: MenuManagementScreenProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = (item: MenuItem) => {
    if (editingItem) {
      // Update existing item
      setMenuItems(menuItems.map((i) => (i.id === item.id ? item : i)));
    } else {
      // Add new item
      setMenuItems([...menuItems, item]);
    }
    handleCloseDialog();
  };

  const handleToggleAvailability = (id: number) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/Background/chung.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1>Quản lý thực đơn</h1>
              <p className="text-neutral-500 mt-1">Thêm, sửa, ẩn món ăn & đặt định mức nguyên liệu</p>
            </div>
          </div>
          <Button onClick={handleAddItem}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm món mới
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 gap-4">
          {menuItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-6" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2>{item.name}</h2>
                      <span className="px-2 py-1 bg-neutral-100 rounded text-sm">{item.category}</span>
                      {item.isAvailable ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <Eye className="w-4 h-4" /> Hiển thị
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-neutral-400 text-sm">
                          <EyeOff className="w-4 h-4" /> Đã ẩn
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm mt-3">
                      <div>
                        <p className="text-neutral-500">Giá bán</p>
                        <p>{item.price.toLocaleString('vi-VN')}₫</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Giá vốn</p>
                        <p>{item.cost.toLocaleString('vi-VN')}₫</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Lợi nhuận</p>
                        <p className="text-green-600">{(item.price - item.cost).toLocaleString('vi-VN')}₫</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Tỷ suất lợi nhuận</p>
                        <p>{item.price > 0 ? (((item.price - item.cost) / item.price) * 100).toFixed(1) : 0}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleAvailability(item.id)}>
                      {item.isAvailable ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                      {item.isAvailable ? 'Ẩn' : 'Hiện'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <MenuItemDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveItem}
        itemToEdit={editingItem}
      />
    </div>
  );
}
