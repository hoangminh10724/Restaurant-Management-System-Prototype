import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Ingredient } from '../App';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface StockInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
  onConfirm: (updates: { ingredientId: number; quantity: number; unitCost: number }) => void;
}

export default function StockInDialog({ isOpen, onClose, ingredients, onConfirm }: StockInDialogProps) {
  const [ingredientId, setIngredientId] = useState<string>('');
  const [quantity, setQuantity] = useState(0);
  const [unitCost, setUnitCost] = useState(0);

  const selectedIngredient = ingredients.find(i => i.id === Number(ingredientId));

  const handleConfirm = () => {
    if (ingredientId && quantity > 0 && unitCost >= 0) {
      onConfirm({
        ingredientId: Number(ingredientId),
        quantity,
        unitCost,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Lập phiếu nhập kho</DialogTitle>
          <DialogDescription>
            Cập nhật số lượng và đơn giá cho nguyên liệu nhập vào.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ingredient" className="text-right">
              Nguyên liệu
            </Label>
            <Select onValueChange={(value) => setIngredientId(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn một nguyên liệu..." />
              </SelectTrigger>
              <SelectContent>
                {ingredients.map(ing => (
                  <SelectItem key={ing.id} value={String(ing.id)}>
                    {ing.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Số lượng nhập
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 0)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit-cost" className="text-right">
              Đơn giá mới
            </Label>
            <Input
              id="unit-cost"
              type="number"
              min="0"
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value) || 0)}
              className="col-span-3"
              placeholder={selectedIngredient ? `Giá cũ: $${selectedIngredient.unitCost}` : ''}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
          <Button type="submit" onClick={handleConfirm} disabled={!ingredientId || quantity <= 0}>
            Lưu phiếu nhập
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
