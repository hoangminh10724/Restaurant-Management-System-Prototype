import { Order, Staff } from '../App';
import HeaderBar from './HeaderBar';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, LogOut, ChefHat } from 'lucide-react';

interface KitchenDisplayScreenProps {
  orders: Order[];
  onStatusUpdate: (tableId: number, status: Order['status']) => void;
  onLogout: () => void;
  onNavigateToTableMap?: () => void;
  onNavigateToOnlineBooking?: () => void;
  onNavigateToManagement?: () => void;
  user?: Staff | null;
}

export default function KitchenDisplayScreen({ orders, onStatusUpdate, onLogout, onNavigateToTableMap, onNavigateToOnlineBooking, onNavigateToManagement, user }: KitchenDisplayScreenProps) {
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

  // We'll render a left-aligned responsive grid and show only a specific set of tables
  const focusTables = [2, 5, 10, 14, 20];

  // Default menus for those tables when no active order exists
  const defaultMenus: Record<number, { name: string; quantity: number; selectedModifier?: string; notes?: string }[]> = {
    2: [
      { name: 'Phở Bò', quantity: 2 },
      { name: 'Trà đá', quantity: 2 }
    ],
    5: [
      { name: 'Cơm sườn', quantity: 3 },
      { name: 'Nước ngọt', quantity: 3 }
    ],
    10: [
      { name: 'Bún chả', quantity: 4 },
      { name: 'Bia', quantity: 4 }
    ],
    14: [
      { name: 'Gỏi cuốn', quantity: 2 },
      { name: 'Nước chanh', quantity: 2 }
    ],
    20: [
      { name: 'Lẩu hải sản', quantity: 1, notes: 'Không cay' },
      { name: 'Cơm trắng', quantity: 4 }
    ]
  };

  // Build items to render for each focus table (prefer live order if exists)
  const tableCards = focusTables.map((tableId) => {
    const order = orders.find(o => o.tableId === tableId && o.status !== 'completed');
    const items = order ? order.items : (defaultMenus[tableId] ?? []);
    const status = order ? order.status : ('pending' as Order['status']);
    const timestamp = order ? order.timestamp : '';
    return { tableId, items, status, timestamp };
  });

  return (
    <div className="min-h-screen">
      <HeaderBar
        user={user ?? null}
        onNavigateToTableMap={onNavigateToTableMap}
        onNavigateToKitchen={() => {}}
        onNavigateToOnlineBooking={onNavigateToOnlineBooking}
        onNavigateToManagement={onNavigateToManagement}
        onLogout={onLogout}
      />

      <div style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, justifyContent: 'start', alignItems: 'start' }}>
          {tableCards.map(({ tableId, items, status, timestamp }) => {
            const orderStatus = getOrderStatusInfo(status);
            return (
              <Card key={tableId} className={`${getStatusColor(status)} border-2 p-4`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <h2>Bàn {tableId}</h2>
                    {timestamp && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b7280', marginTop: 6 }}>
                        <Clock className="w-4 h-4" />
                        <span style={{ fontSize: 12 }}>{timestamp}</span>
                      </div>
                    )}
                  </div>
                  <Badge variant={orderStatus.variant}>{orderStatus.text}</Badge>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {items.map((item: any, index: number) => (
                    <div key={index} style={{ background: 'white', borderRadius: 6, padding: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 26, height: 26, borderRadius: 999, background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{item.quantity}</div>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                        </div>
                        {item.selectedModifier && <div style={{ color: '#6b7280', fontSize: 12 }}>{item.selectedModifier}</div>}
                      </div>
                      {item.notes && <div style={{ color: '#ea580c', fontSize: 12, marginTop: 6 }}>Ghi chú: {item.notes}</div>}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {status === 'pending' && (
                    <Button style={{ flex: 1 }} onClick={() => onStatusUpdate(tableId, 'cooking')}>Bắt đầu làm</Button>
                  )}
                  {status === 'cooking' && (
                    <Button style={{ flex: 1 }} variant="secondary" onClick={() => onStatusUpdate(tableId, 'ready')}>Báo đã xong</Button>
                  )}
                  {status === 'ready' && (
                    <div style={{ flex: 1, textAlign: 'center', paddingTop: 8, paddingBottom: 8, backgroundColor: '#16a34a', color: 'white', borderRadius: 6 }}>Sẵn sàng</div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
