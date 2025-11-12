import { useState } from 'react';
import { Ingredient } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ArrowLeft, Plus, Minus, AlertTriangle, FilePlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import StockInDialog from './StockInDialog';

interface InventoryManagementScreenProps {
  ingredients: Ingredient[];
  onInventoryUpdate: (ingredients: Ingredient[]) => void;
  onStockIn: (update: { ingredientId: number; quantity: number; unitCost: number }) => void;
  onBack: () => void;
}

export default function InventoryManagementScreen({ ingredients, onInventoryUpdate, onStockIn, onBack }: InventoryManagementScreenProps) {
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [isStockInDialogOpen, setStockInDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'remove'>('add');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [notes, setNotes] = useState('');

  const lowStockItems = ingredients.filter(i => i.quantity < i.minThreshold);
  const totalValue = ingredients.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0);

  const isStockOutInvalid = dialogType === 'remove' && selectedIngredient && quantity > selectedIngredient.quantity;

  const handleStockAdjustment = () => {
    if (selectedIngredient && quantity > 0 && !isStockOutInvalid) {
      const updatedIngredients = ingredients.map(i =>
        i.id === selectedIngredient.id
          ? {
              ...i,
              quantity: dialogType === 'add' ? i.quantity + quantity : i.quantity - quantity
            }
          : i
      );
      onInventoryUpdate(updatedIngredients);
      setShowAdjustDialog(false);
      setSelectedIngredient(null);
      setQuantity(0);
      setNotes('');
    }
  };

  const openAdjustDialog = (ingredient: Ingredient, type: 'add' | 'remove') => {
    setSelectedIngredient(ingredient);
    setDialogType(type);
    setQuantity(0);
    setNotes('');
    setShowAdjustDialog(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1>Quản lý kho</h1>
              <p className="text-neutral-500 mt-1">Nhập/Xuất kho & Cảnh báo tồn</p>
            </div>
          </div>
          <Button onClick={() => setStockInDialogOpen(true)}>
            <FilePlus className="w-4 h-4 mr-2" />
            Lập phiếu nhập kho
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
            <TabsTrigger value="alerts">Cảnh báo ({lowStockItems.length})</TabsTrigger>
            <TabsTrigger value="history">Lịch sử</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card><CardHeader><CardTitle>Tổng mặt hàng</CardTitle></CardHeader><CardContent><div className="text-3xl">{ingredients.length}</div></CardContent></Card>
              <Card><CardHeader><CardTitle>Giá trị tồn kho</CardTitle></CardHeader><CardContent><div className="text-3xl">${totalValue.toLocaleString()}</div></CardContent></Card>
              <Card><CardHeader><CardTitle>Sắp hết hàng</CardTitle></CardHeader><CardContent><div className="text-3xl text-orange-600">{lowStockItems.length}</div></CardContent></Card>
              <Card><CardHeader><CardTitle>Hết hàng</CardTitle></CardHeader><CardContent><div className="text-3xl text-red-600">{ingredients.filter(i => i.quantity === 0).length}</div></CardContent></Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Danh sách nguyên liệu</CardTitle></CardHeader>
              <CardContent><div className="space-y-3">
                {ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3>{ingredient.name}</h3>
                        <Badge variant="outline">{ingredient.category}</Badge>
                        {ingredient.quantity < ingredient.minThreshold && (<Badge className="bg-orange-100 text-orange-700"><AlertTriangle className="w-3 h-3 mr-1" />Sắp hết</Badge>)}
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div><p className="text-neutral-500">Tồn kho</p><p className={ingredient.quantity < ingredient.minThreshold ? 'text-orange-600' : ''}>{ingredient.quantity} {ingredient.unit}</p></div>
                        <div><p className="text-neutral-500">Ngưỡng tối thiểu</p><p>{ingredient.minThreshold} {ingredient.unit}</p></div>
                        <div><p className="text-neutral-500">Đơn giá</p><p>${ingredient.unitCost.toLocaleString()}/{ingredient.unit}</p></div>
                        <div><p className="text-neutral-500">Giá trị</p><p>${(ingredient.quantity * ingredient.unitCost).toLocaleString()}</p></div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => openAdjustDialog(ingredient, 'add')}><Plus className="w-4 h-4 mr-1" />Nhập lẻ</Button>
                      <Button size="sm" variant="outline" onClick={() => openAdjustDialog(ingredient, 'remove')}><Minus className="w-4 h-4 mr-1" />Xuất lẻ</Button>
                    </div>
                  </div>
                ))}
              </div></CardContent>
            </Card>
          </TabsContent>
          {/* Other tabs content */}
        </Tabs>
      </div>

      <StockInDialog isOpen={isStockInDialogOpen} onClose={() => setStockInDialogOpen(false)} ingredients={ingredients} onConfirm={onStockIn} />

      <Dialog open={showAdjustDialog} onOpenChange={setShowAdjustDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Điều chỉnh kho</DialogTitle>
            <DialogDescription>Thay đổi nhanh số lượng tồn kho cho một mặt hàng.</DialogDescription>
          </DialogHeader>
          {selectedIngredient && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h3>{selectedIngredient.name}</h3>
                <p className="text-neutral-600 mt-1">Tồn kho hiện tại: {selectedIngredient.quantity} {selectedIngredient.unit}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Số lượng {dialogType === 'add' ? 'nhập' : 'xuất'} ({selectedIngredient.unit})</Label>
                <Input id="quantity" type="number" min="0" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} />
                {isStockOutInvalid && (
                  <p className="text-red-600 text-sm">Số lượng xuất không được vượt quá tồn kho.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Lý do điều chỉnh..." className="w-full min-h-[80px] px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowAdjustDialog(false)} className="flex-1">Hủy</Button>
                <Button onClick={handleStockAdjustment} className="flex-1" disabled={quantity <= 0 || isStockOutInvalid}>Xác nhận</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
