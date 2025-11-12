import { Promotion } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Plus, Gift, Percent } from 'lucide-react';

interface PromotionManagementScreenProps {
  promotions: Promotion[];
  onPromotionUpdate: (promotions: Promotion[]) => void;
  onBack: () => void;
}

export default function PromotionManagementScreen({ promotions, onPromotionUpdate, onBack }: PromotionManagementScreenProps) {
  const getTypeIcon = (type: Promotion['type']) => {
    switch (type) {
      case 'discount': return <Percent className="w-5 h-5" />;
      case 'combo': return <Gift className="w-5 h-5" />;
      case 'buy1get1': return <Gift className="w-5 h-5" />;
    }
  };

  const getTypeName = (type: Promotion['type']) => {
    switch (type) {
      case 'discount': return 'Giảm giá';
      case 'combo': return 'Combo';
      case 'buy1get1': return 'Mua 1 Tặng 1';
    }
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
              <h1>Quản lý Combo & Khuyến mãi</h1>
              <p className="text-neutral-500 mt-1">Tạo gói combo và chương trình khuyến mãi</p>
            </div>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tạo khuyến mãi
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map((promo) => (
            <Card key={promo.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{promo.name}</CardTitle>
                  <Badge variant={promo.isActive ? 'default' : 'secondary'}>
                    {promo.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  {getTypeIcon(promo.type)}
                  <div>
                    <p className="text-sm text-neutral-600">{getTypeName(promo.type)}</p>
                    <p className="font-medium">
                      {promo.type === 'discount' && `${promo.value}% OFF`}
                      {promo.type === 'combo' && `$${promo.value}`}
                      {promo.type === 'buy1get1' && 'Mua 1 Tặng 1'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Bắt đầu:</span>
                    <span>{promo.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Kết thúc:</span>
                    <span>{promo.endDate}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  Chỉnh sửa
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
