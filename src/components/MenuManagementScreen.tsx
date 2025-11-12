import { useState } from 'react';
import { Ingredient } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Plus, Edit, Eye, EyeOff } from 'lucide-react';

interface MenuManagementScreenProps {
  ingredients: Ingredient[];
  onBack: () => void;
}

export default function MenuManagementScreen({ ingredients, onBack }: MenuManagementScreenProps) {
  const menuItems = [
    { id: 1, name: 'Caesar Salad', category: 'Appetizers', price: 12.99, cost: 5.50, isAvailable: true },
    { id: 2, name: 'Bruschetta', category: 'Appetizers', price: 9.99, cost: 3.20, isAvailable: true },
    { id: 4, name: 'Beef Steak', category: 'Main Courses', price: 32.99, cost: 15.00, isAvailable: true, ingredients: [{ name: 'Beef', amount: '200g' }] },
    { id: 5, name: 'Grilled Salmon', category: 'Main Courses', price: 28.99, cost: 12.50, isAvailable: true },
    { id: 7, name: 'Red Wine', category: 'Drinks', price: 45.00, cost: 20.00, isAvailable: true },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
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
          <Button>
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
                        <p>${item.price}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Giá vốn</p>
                        <p>${item.cost}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Lợi nhuận</p>
                        <p className="text-green-600">${(item.price - item.cost).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Tỷ suất lợi nhuận</p>
                        <p>{(((item.price - item.cost) / item.price) * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                    {item.ingredients && (
                      <div className="mt-3 p-3 bg-neutral-50 rounded">
                        <p className="text-sm font-medium mb-2">Công thức (Định mức nguyên liệu):</p>
                        {item.ingredients.map((ing, idx) => (
                          <p key={idx} className="text-sm text-neutral-600">• {ing.name}: {ing.amount}</p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Button>
                    <Button variant="outline" size="sm">
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
    </div>
  );
}
