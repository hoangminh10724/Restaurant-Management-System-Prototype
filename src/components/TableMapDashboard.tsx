import { Table, TableStatus } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Users, Clock, Calendar, ChefHat, LogOut } from 'lucide-react';

interface TableMapDashboardProps {
  tables: Table[];
  onTableClick: (tableId: number, action: 'open' | 'view' | 'payment') => void;
  onNavigateToKitchen: () => void;
  onLogout?: () => void;
  onNavigateToManagement?: () => void;
}

export default function TableMapDashboard({ tables, onTableClick, onNavigateToKitchen, onLogout, onNavigateToManagement }: TableMapDashboardProps) {
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

  const handleTableAction = (table: Table) => {
    if (table.status === 'empty') {
      onTableClick(table.id, 'open');
    } else if (table.status === 'serving') {
      // Show quick action menu
      const action = window.confirm('View/Edit Order? (OK)\nProcess Payment? (Cancel)');
      if (action) {
        onTableClick(table.id, 'view');
      } else {
        onTableClick(table.id, 'payment');
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1>Restaurant Dashboard</h1>
            <p className="text-neutral-500 mt-1">Table Management & Status Overview</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onNavigateToKitchen}>
              <ChefHat className="w-4 h-4 mr-2" />
              Kitchen View
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            {onNavigateToManagement && (
              <Button variant="outline" onClick={onNavigateToManagement}>
                Management
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-neutral-600">Empty</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-neutral-600">Serving</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span className="text-neutral-600">Booked</span>
          </div>
        </div>

        {/* Table Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <Card
              key={table.id}
              className={`${getTableStatusColor(table.status)} border-2 cursor-pointer transition-all hover:shadow-lg relative overflow-hidden`}
              onClick={() => handleTableAction(table)}
            >
              <div className="p-6">
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${getTableStatusBadge(table.status)}`}></div>
                
                {/* Table Number */}
                <div className="mb-4">
                  <h2>Table {table.id}</h2>
                  <p className="text-neutral-600 capitalize mt-1">{table.status}</p>
                </div>

                {/* Empty State */}
                {table.status === 'empty' && (
                  <p className="text-neutral-500">Click to open table</p>
                )}

                {/* Serving State */}
                {table.status === 'serving' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-neutral-700">
                      <Users className="w-4 h-4" />
                      <span>{table.customerCount} guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-700">
                      <Clock className="w-4 h-4" />
                      <span>{table.timeElapsed}</span>
                    </div>
                  </div>
                )}

                {/* Booked State */}
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
          ))}
        </div>
      </div>
    </div>
  );
}