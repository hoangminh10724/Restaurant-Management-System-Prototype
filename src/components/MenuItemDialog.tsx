import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  cost: number;
  isAvailable: boolean;
  image: string;
}

interface MenuItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
  itemToEdit?: MenuItem | null;
}

export default function MenuItemDialog({ isOpen, onClose, onSave, itemToEdit }: MenuItemDialogProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Món chính');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setCategory(itemToEdit.category);
      setPrice(itemToEdit.price.toString());
      setImage(itemToEdit.image);
    } else {
      // Reset form for new item
      setName('');
      setCategory('Món chính');
      setPrice('');
      setImage('');
    }
  }, [itemToEdit, isOpen]);

  const handleSave = () => {
    const newItem: MenuItem = {
      id: itemToEdit ? itemToEdit.id : Date.now(),
      name,
      category,
      price: Number(price) || 0,
      cost: (Number(price) || 0) * 0.4, // Assuming cost is 40% of price for simplicity
      isAvailable: itemToEdit ? itemToEdit.isAvailable : true,
      image,
    };
    onSave(newItem);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{itemToEdit ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tên món
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Danh mục
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Món chính">Món chính</SelectItem>
                <SelectItem value="Món ăn vặt">Món ăn vặt</SelectItem>
                <SelectItem value="Nước uống">Nước uống</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Giá bán
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              URL hình ảnh
            </Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="col-span-3"
              placeholder="Vd: /Food/ten-mon.jpg"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
