import { useState } from 'react';
import { Table, TableStatus, Staff, Order } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Clock, Calendar, ChefHat, LogOut, UserCog, ShoppingBasket } from 'lucide-react';
import GuestCountPopup from './GuestCountPopup';
import TableActionsPopup from './TableActionsPopup';
import TransferTableDialog from './TransferTableDialog';

interface TableMapDashboardProps {
  tables: Table[];
  orders: Order[];
  onTableClick: (tableId: number, action: 'view' | 'payment') => void;
  onOpenTable: (tableId: number, guestCount: number) => void;
  onTransferTable: (sourceTableId: number, targetTableId: number) => void;
  onNavigateToKitchen: () => void;
  onLogout?: () => void;
  onNavigateToManagement?: () => void;
  user: Staff;
}

export default function TableMapDashboard({ tables, orders, onTableClick, onOpenTable, onTransferTable, onNavigateToKitchen, onLogout, onNavigateToManagement, user }: TableMapDashboardProps) {
  const [isGuestPopupOpen, setGuestPopupOpen] = useState(false);
  const [isActionsPopupOpen, setActionsPopupOpen] = useState(false);
  const [isTransferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const getTableStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'empty':
        return 'bg-green-100 border-green-300 hover:bg-green-200';
      case 'serving':
        return 'bg-red-100 border-red-300 hover:bg-red-200';
      case 'booked':
        return 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200';
    }
  };

  const getTableStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'empty':
        return 'bg-green-500';
      case 'serving':
        return 'bg-red-500';
      case 'booked':
        return 'bg-yellow-500';
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

  const handleTableAction = (table: Table) => {
    setSelectedTable(table);
    if (table.status === 'empty') {
      setGuestPopupOpen(true);
    } else if (table.status === 'serving') {
      setActionsPopupOpen(true);
    }
  };

  const handleConfirmOpenTable = (guestCount: number) => {
    if (selectedTable) {
      onOpenTable(selectedTable.id, guestCount);
    }
    setGuestPopupOpen(false);
    setSelectedTable(null);
  };

  const handlePopupAction = (action: () => void) => {
    action();
    setActionsPopupOpen(false);
    setSelectedTable(null);
  };

  const handleOpenTransferDialog = () => {
    setActionsPopupOpen(false); // Close the small popup
    setTransferDialogOpen(true); // Open the main dialog
  };

  const handleConfirmTransfer = (sourceId: number, targetId: number) => {
    onTransferTable(sourceId, targetId);
    setTransferDialogOpen(false);
    setSelectedTable(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1>Sơ đồ bàn</h1>
            <p className="text-neutral-500 mt-1">Xin chào, {user.name} ({user.role})</p>
          </div>
          <div className="flex gap-3">
            {user.role !== 'Bếp' && user.role !== 'Kho' && (
              <Button variant="outline" onClick={onNavigateToKitchen}>
                <ChefHat className="w-4 h-4 mr-2" />
                Bếp
              </Button>
            )}
            {(user.role === 'Admin' || user.role === 'Quản lý') && onNavigateToManagement && (
              <Button variant="outline" onClick={onNavigateToManagement}>
                <UserCog className="w-4 h-4 mr-2" />
                Quản lý
              </Button>
            )}
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-neutral-600">Trống</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-neutral-600">Đang phục vụ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span className="text-neutral-600">Đã đặt</span>
          </div>
        </div>

        {/* Table Grid */}
        {tables.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((table) => {
              const order = table.status === 'serving' ? orders.find(o => o.tableId === table.id) : null;
              const orderStatus = order ? getOrderStatusInfo(order.status) : null;

              return (
                <Card
                  key={table.id}
                  className={`${getTableStatusColor(table.status)} border-2 cursor-pointer transition-all hover:shadow-lg relative overflow-hidden`}
                  onClick={() => handleTableAction(table)}
                >
                  <div className="p-6">
                    <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${getTableStatusBadge(table.status)}`}></div>
                    
                    <div className="mb-4">
                      <h2>Bàn {table.id}</h2>
                      <p className="text-neutral-600 capitalize mt-1">{table.status === 'empty' ? 'Trống' : table.status === 'serving' ? 'Đang phục vụ' : 'Đã đặt'}</p>
                    </div>

                    {table.status === 'empty' && (
                      <p className="text-neutral-500">Nhấn để mở bàn</p>
                    )}

                    {table.status === 'serving' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-neutral-700">
                          <Users className="w-4 h-4" />
                          <span>{table.customerCount} khách</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-700">
                          <Clock className="w-4 h-4" />
                          <span>{table.timeElapsed}</span>
                        </div>
                        {orderStatus && (
                          <div className="flex items-center gap-2 text-neutral-700 pt-1">
                            <ShoppingBasket className="w-4 h-4" />
                            <Badge variant={orderStatus.variant}>{orderStatus.text}</Badge>
                          </div>
                        )}
                      </div>
                    )}

                    {table.status === 'booked' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-neutral-700">
                          <Calendar className="w-4 h-4" />
                          <span>{table.bookingTime}</span>
                        </div>
                        <p className="text-neutral-700">{table.bookingName}</p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="mt-6 p-12 text-center">
            <p className="text-neutral-500">Chưa có bàn trong hệ thống</p>
          </Card>
        )}
      </div>
      
      {selectedTable && (
        <>
          <GuestCountPopup
            isOpen={isGuestPopupOpen}
            onClose={() => setGuestPopupOpen(false)}
            onConfirm={handleConfirmOpenTable}
            tableName={`Bàn ${selectedTable.id}`}
          />
          <TableActionsPopup
            isOpen={isActionsPopupOpen}
            onClose={() => setActionsPopupOpen(false)}
            tableName={`Bàn ${selectedTable.id}`}
            onAddOrder={() => handlePopupAction(() => onTableClick(selectedTable.id, 'view'))}
            onProcessPayment={() => handlePopupAction(() => onTableClick(selectedTable.id, 'payment'))}
            onTransferTable={handleOpenTransferDialog}
          />
          <TransferTableDialog
            isOpen={isTransferDialogOpen}
            onClose={() => setTransferDialogOpen(false)}
            sourceTable={selectedTable}
            availableTables={tables.filter(t => t.status === 'empty')}
            onConfirm={handleConfirmTransfer}
          />
        </>
      )}
    </div>
  );
}