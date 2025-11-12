import { MenuItem } from '../App';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface ModifierPopupProps {
  item: MenuItem;
  onSelect: (modifier: string) => void;
  onClose: () => void;
}

export default function ModifierPopup({ item, onSelect, onClose }: ModifierPopupProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>
            Select cooking preference for this item
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-4">
          {item.modifiers?.map((modifier) => (
            <Button
              key={modifier}
              variant="outline"
              className="h-16"
              onClick={() => onSelect(modifier)}
            >
              {modifier}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
