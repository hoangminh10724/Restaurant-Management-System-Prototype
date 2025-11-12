import { Order, Role } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, LogOut, ChefHat } from 'lucide-react';

interface KitchenDisplayScreenProps {
  orders: Order[];
  onStatusUpdate: (tableId: number, status: Order['status']) => void;
  onLogout: () => void;
  userRole: Role;
}

export default function KitchenDisplayScreen({ orders, onStatusUpdate, onLogout, userRole }: KitchenDisplayScreenProps) {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 border-orange-300';
      case 'cooking':
        return 'bg-blue-100 border-blue-300';
      case 'ready':
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-neutral-100 border-neutral-300';
    }
  };

  const getStatusBadgeVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'pending':
        return 'destructive';
      case 'cooking':
        return 'default';
      case 'ready':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getOrderStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { text: 'Mới', variant: 'destructive' as const };
      case 'cooking':
        return { text: 'Đang làm', variant: 'default' as const };
      case 'ready':
        return { text: 'Sẵn sàng', variant: 'secondary' as const };
      default:
        return { text: 'Đã xong', variant: 'outline' as const };
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1>Hệ thống hiển thị bếp</h1>
              <p className="text-neutral-500 mt-1">Các order đang hoạt động cho {userRole}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {orders.filter(o => o.status !== 'completed').length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-neutral-500">Không có order nào đang hoạt động</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.filter(o => o.status !== 'completed').map((order) => {
              const orderStatus = getOrderStatusInfo(order.status);
              return (
              <Card
                key={order.tableId}
                className={`${getStatusColor(order.status)} border-2 p-4`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2>Bàn {order.tableId}</h2>
                    <div className="flex items-center gap-2 text-neutral-600 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{order.timestamp}</span>
                    </div>
                  </div>
                  <Badge variant={orderStatus.variant}>
                    {orderStatus.text}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="bg-white rounded p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-900 text-white text-xs">
                              {item.quantity}
                            </span>
                            <span className="font-semibold">{item.name}</span>
                          </div>
                          {item.selectedModifier && (
                            <span className="text-neutral-600 ml-8 mt-1 block">
                              {item.selectedModifier}
                            </span>
                          )}
                           {item.notes && (
                            <p className="text-sm text-orange-600 ml-8 mt-1 fst-italic">
                              Ghi chú: {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {order.status === 'pending' && (
                    <Button
                      className="col-span-2"
                      onClick={() => onStatusUpdate(order.tableId, 'cooking')}
                    >
                      Bắt đầu làm
                    </Button>
                  )}
                  {order.status === 'cooking' && (
                    <Button
                      className="col-span-2"
                      variant="secondary"
                      onClick={() => onStatusUpdate(order.tableId, 'ready')}
                    >
                      Báo đã xong
                    </Button>
                  )}
                  {order.status === 'ready' && (
                    <div className="col-span-2 text-center py-2 bg-green-500 text-white rounded">
                      Sẵn sàng
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
}
