import { useState } from 'react';
import { Table, TableStatus, Staff, Order } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Clock, Calendar, ChefHat, LogOut, UserCog, ShoppingBasket, MapPin, Bell, Search, Settings } from 'lucide-react';
import HeaderBar from './HeaderBar';
import GuestCountPopup from './GuestCountPopup';
import TableActionsPopup from './TableActionsPopup';
import TransferTableDialog from './TransferTableDialog';
import BookingInfoPopup from './BookingInfoPopup';

interface TableMapDashboardProps {
  tables: Table[];
  orders: Order[];
  onTableClick: (tableId: number, action: 'view' | 'payment') => void;
  onOpenTable: (tableId: number, guestCount: number) => void;
  onTransferTable: (sourceTableId: number, targetTableId: number) => void;
  onNavigateToKitchen: () => void;
  onNavigateToOnlineBooking?: () => void;
  onLogout?: () => void;
  onNavigateToManagement?: () => void;
  user: Staff;
}

export default function TableMapDashboard({ tables, orders, onTableClick, onOpenTable, onTransferTable, onNavigateToKitchen, onNavigateToOnlineBooking, onLogout, onNavigateToManagement, user }: TableMapDashboardProps) {
  const [isGuestPopupOpen, setGuestPopupOpen] = useState(false);
  const [isActionsPopupOpen, setActionsPopupOpen] = useState(false);
  const [isTransferDialogOpen, setTransferDialogOpen] = useState(false);
  const [isBookingInfoOpen, setBookingInfoOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isSettingModalOpen, setSettingModalOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedStatuses, setSelectedStatuses] = useState<TableStatus[]>(['empty', 'serving', 'booked']);
  const [functionModalOpen, setFunctionModalOpen] = useState(false);

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
    } else if (table.status === 'booked') {
      setBookingInfoOpen(true);
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

  const handleConfirmBookingArrival = () => {
    setBookingInfoOpen(false);
    setGuestPopupOpen(true);
    // The selectedTable is already set, so GuestCountPopup will use it
  };

  const handleConfirmTransfer = (sourceId: number, targetId: number) => {
    onTransferTable(sourceId, targetId);
    setTransferDialogOpen(false);
    setSelectedTable(null);
  };

  // Prepare tables for the selected floor (8 per floor)
  const _tablesPerFloor = 8;
  const _floorStart = (selectedFloor - 1) * _tablesPerFloor + 1;
  const _floorEnd = selectedFloor * _tablesPerFloor;
  const floorTables = tables.filter(table => table.id >= _floorStart && table.id <= _floorEnd && selectedStatuses.includes(table.status));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#eef2f6', display: 'flex', flexDirection: 'column' }}>
      <HeaderBar
        user={user}
        onNavigateToTableMap={() => {}}
        onNavigateToKitchen={onNavigateToKitchen}
        onNavigateToOnlineBooking={onNavigateToOnlineBooking}
        onNavigateToManagement={onNavigateToManagement}
        onLogout={onLogout}
      />

      {/* Filter Section */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
        {/* Floor Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: '600', color: '#374151', fontSize: '14px' }}>Tầng:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3].map((floor) => (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: selectedFloor === floor ? '#2563eb' : '#e5e7eb',
                  color: selectedFloor === floor ? 'white' : '#374151'
                }}
                onMouseEnter={(e) => {
                  if (selectedFloor !== floor) {
                    e.currentTarget.style.backgroundColor = '#d1d5db';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedFloor !== floor) {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }
                }}
              >
                Tầng {floor}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: '600', color: '#374151', fontSize: '14px' }}>Trạng thái:</span>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { status: 'empty' as TableStatus, label: 'Trống', color: '#22c55e' },
              { status: 'serving' as TableStatus, label: 'Đang phục vụ', color: '#ef4444' },
              { status: 'booked' as TableStatus, label: 'Đã đặt', color: '#eab308' },
            ].map((item) => (
              <button
                key={item.status}
                onClick={() => {
                  if (selectedStatuses.includes(item.status)) {
                    setSelectedStatuses(selectedStatuses.filter(s => s !== item.status));
                  } else {
                    setSelectedStatuses([...selectedStatuses, item.status]);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: selectedStatuses.includes(item.status) ? '#e5e7eb' : '#f3f4f6',
                  color: selectedStatuses.includes(item.status) ? '#1f2937' : '#9ca3af'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                  e.currentTarget.style.color = '#1f2937';
                }}
                onMouseLeave={(e) => {
                  if (!selectedStatuses.includes(item.status)) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.color = '#9ca3af';
                  }
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }}></div>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

  {/* Main Content Area */}
  <div style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#eef2f6' }}>
        {/* Floor Section Wrapper */}
        <div style={{ maxWidth: '100%' }}>
          {/* Floor Header */}
          <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #52525b' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#e4e4e7', marginBottom: '16px' }}>
              🏢 Tầng {selectedFloor}
            </h2>
            
            {/* Legend */}
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', paddingLeft: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
                <span style={{ fontSize: '13px', color: '#a1a1aa' }}>Trống</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                <span style={{ fontSize: '13px', color: '#a1a1aa' }}>Đang phục vụ</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#eab308' }}></div>
                <span style={{ fontSize: '13px', color: '#a1a1aa' }}>Đã đặt</span>
              </div>
            </div>
          </div>

          {/* Table Grid - 4 columns fixed for 8 tables */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', padding: '16px' }}>
            {floorTables.map((table, indexInFloor) => {
                const rowNumber = Math.floor(indexInFloor / 4) + 1; // 1 or 2
                const order = table.status === 'serving' ? orders.find(o => o.tableId === table.id) : null;
                
                let borderColor = '#22c55e'; // green
                if (table.status === 'serving') {
                  borderColor = '#ef4444'; // red
                }
                if (table.status === 'booked') {
                  borderColor = '#eab308'; // yellow
                }

                const seats = table.maxSeats ?? 4;

                return (
                  <div
                    key={table.id}
                    onClick={() => handleTableAction(table)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      cursor: 'pointer', 
                      position: 'relative', 
                      height: '180px',
                      perspective: '1000px',
                      marginTop: rowNumber === 2 ? '80px' : '0' // push second row down to avoid overlap
                    }}
                    onMouseEnter={(e) => {
                      const inner = e.currentTarget.querySelector('[data-inner]') as HTMLElement;
                      if (inner) {
                        inner.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
                        inner.style.transform = 'scale(1.08) translateY(-4px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const inner = e.currentTarget.querySelector('[data-inner]') as HTMLElement;
                      if (inner) {
                        inner.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
                        inner.style.transform = 'scale(1) translateY(0)';
                      }
                    }}
                  >
                    {/* Decorative outer glow */}
                    <div style={{
                      position: 'absolute',
                      width: '170px',
                      height: '170px',
                      borderRadius: '50%',
                      border: `2px solid ${borderColor}`,
                      opacity: 0.3,
                      animation: 'pulse 2s infinite'
                    }}></div>

                    {/* Outer Circle - Status Border */}
                    <div style={{
                      position: 'absolute',
                      width: '160px',
                      height: '160px',
                      borderRadius: '50%',
                      border: `5px solid ${borderColor}`,
                      opacity: 0.9,
                      boxShadow: `inset 0 0 20px ${borderColor}33`
                    }}></div>

                    {/* Inner Circle - White content area */}
                    <div
                      data-inner
                      style={{
                        position: 'absolute',
                        width: '145px',
                        height: '145px',
                        borderRadius: '50%',
                        backgroundColor: '#fafafa',
                        border: '2px solid #e5e7eb',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.3s ease',
                        zIndex: 10,
                        backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 50%)'
                      }}
                    >
                      {/* Table ID - Large */}
                      <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb', marginBottom: '4px', lineHeight: '1' }}>
                        {table.id}
                      </div>

                      {/* Seat squares positioned around the table (based on maxSeats: 2,4,6) */}
                      {Array.from({ length: seats }).map((_, i) => {
                        const angle = (360 / seats) * i - 90; // start from top
                        const rad = (angle * Math.PI) / 180;
                        const baseRadius = 96; // px distance from center to place seat squares (moved out slightly)
                        // Shift lower seats down a bit for clarity
                        const lowerShift = Math.sin(rad) > 0 ? 12 : 0;
                        const x = Math.cos(rad) * baseRadius;
                        const y = Math.sin(rad) * baseRadius + lowerShift;
                        return (
                          <div
                            key={i}
                            style={{
                              position: 'absolute',
                              left: `calc(50% + ${x}px)`,
                              top: `calc(50% + ${y}px)`,
                              transform: 'translate(-50%, -50%)',
                              width: '18px',
                              height: '18px',
                              backgroundColor: '#08213a', // dark blue-black
                              borderRadius: '4px',
                              zIndex: 20,
                              border: '1px solid rgba(255,255,255,0.06)'
                            }}
                          />
                        );
                      })}

                      {/* Status/Info Text */}
                      {table.status === 'serving' && (
                        <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600', textAlign: 'center' }}>
                          {table.customerCount}👥
                        </div>
                      )}
                      {table.status === 'booked' && (
                        <div style={{ fontSize: '10px', color: '#eab308', fontWeight: '600', textAlign: 'center', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {table.bookingName}
                        </div>
                      )}
                      {table.status === 'empty' && (
                        <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: '600' }}>
                          ✓ Trống
                        </div>
                      )}
                    </div>

                    {/* (Removed the outside numeric square - seats are shown as small squares around the circle) */}
                  </div>
                );
              })}
          </div>

          {/* Empty state */}
          {tables.filter(table => {
            const tablesPerFloor = 8;
            const floorStart = (selectedFloor - 1) * tablesPerFloor + 1;
            const floorEnd = selectedFloor * tablesPerFloor;
            return table.id >= floorStart && table.id <= floorEnd && selectedStatuses.includes(table.status);
          }).length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#71717a' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
              <div style={{ fontSize: '14px' }}>Không có bàn nào phù hợp với bộ lọc</div>
            </div>
          )}
        </div>

        {/* CSS Animation */}
        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.6;
            }
          }
        `}</style>
      </div>

      {/* Settings Modal */}
      {isSettingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-96 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-blue-600">Thiết kế sơ đồ</h2>
              <button
                onClick={() => setSettingModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:border-blue-300 h-10">
                Thêm phòng
              </Button>
              <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:border-blue-300 h-10">
                Thiết lập nhanh sơ đồ
              </Button>
              <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:border-blue-300 h-10">
                Thêm bàn
              </Button>
              <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:border-blue-300 h-10">
                Chọn ảnh nền
              </Button>
              <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:border-blue-300 h-10">
                Bố ảnh bàn
              </Button>
              <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:border-blue-300 h-10">
                Đổi màu bàn
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {selectedTable && (
        <>
          <GuestCountPopup
            isOpen={isGuestPopupOpen}
            onClose={() => setGuestPopupOpen(false)}
            onConfirm={handleConfirmOpenTable}
            tableName={`Bàn ${selectedTable.id}`}
            maxSeats={selectedTable.maxSeats}
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
          <BookingInfoPopup
            isOpen={isBookingInfoOpen}
            onClose={() => setBookingInfoOpen(false)}
            table={selectedTable}
            onConfirmArrival={handleConfirmBookingArrival}
          />
        </>
      )}
    </div>
  );
}