import { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import TableMapDashboard from './components/TableMapDashboard';
import OrderTakingScreen from './components/OrderTakingScreen';
import KitchenDisplayScreen from './components/KitchenDisplayScreen';
import PaymentProcessingScreen from './components/PaymentProcessingScreen';
import ConfirmationScreen from './components/ConfirmationScreen';
import ManagementDashboard from './components/ManagementDashboard';
import OnlineBookingScreen from './components/OnlineBookingScreen';
import OfflineBookingScreen from './components/OfflineBookingScreen';
import CustomerSelfPaymentScreen from './components/CustomerSelfPaymentScreen';
import LoyaltyManagementScreen from './components/LoyaltyManagementScreen';
import InventoryManagementScreen from './components/InventoryManagementScreen';
import MenuManagementScreen from './components/MenuManagementScreen';
import StaffManagementScreen from './components/StaffManagementScreen';
import PromotionManagementScreen from './components/PromotionManagementScreen';
import ReportsScreen from './components/ReportsScreen';
import SettingsScreen from './components/SettingsScreen';

export type TableStatus = 'empty' | 'serving' | 'booked';

export interface Table {
  id: number;
  status: TableStatus;
  customerCount?: number;
  timeElapsed?: string;
  bookingTime?: string;
  bookingName?: string;
  bookingPhone?: string;
  bookingId?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  modifiers?: string[];
  description?: string;
  image?: string;
  isAvailable?: boolean;
  ingredients?: { ingredientId: number; quantity: number }[];
}

export interface OrderItem extends MenuItem {
  quantity: number;
  selectedModifier?: string;
}

export interface Order {
  tableId: number;
  items: OrderItem[];
  timestamp: string;
  status: 'pending' | 'cooking' | 'ready' | 'completed';
  serverId?: string;
  customerId?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  points: number;
  tier: 'Silver' | 'Gold' | 'Platinum';
  totalSpent: number;
  visits: number;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  time: string;
  guests: number;
  tableId?: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}

export interface Ingredient {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  minThreshold: number;
  unitCost: number;
  category: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'waitstaff' | 'kitchen' | 'cashier' | 'receptionist';
  phone: string;
  email: string;
  username: string;
  status: 'active' | 'inactive';
  shifts: string[];
}

export interface Promotion {
  id: string;
  name: string;
  type: 'discount' | 'combo' | 'buy1get1';
  value: number;
  items?: number[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export type Screen = 
  | 'login' 
  | 'dashboard' 
  | 'order' 
  | 'kitchen' 
  | 'payment' 
  | 'confirmation' 
  | 'management'
  | 'online-booking'
  | 'offline-booking'
  | 'customer-payment'
  | 'loyalty'
  | 'inventory'
  | 'menu-mgmt'
  | 'staff-mgmt'
  | 'promotions'
  | 'reports'
  | 'settings';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'waitstaff' | 'kitchen' | 'manager' | 'admin'>('waitstaff');
  
  const [tables, setTables] = useState<Table[]>([
    { id: 1, status: 'empty' },
    { id: 2, status: 'serving', customerCount: 4, timeElapsed: '25 min' },
    { id: 3, status: 'empty' },
    { id: 4, status: 'booked', bookingTime: '7:00 PM', bookingName: 'Smith', bookingPhone: '0901234567' },
    { id: 5, status: 'serving', customerCount: 2, timeElapsed: '10 min' },
    { id: 6, status: 'empty' },
    { id: 7, status: 'empty' },
    { id: 8, status: 'booked', bookingTime: '8:30 PM', bookingName: 'Johnson', bookingPhone: '0912345678' },
    { id: 9, status: 'empty' },
    { id: 10, status: 'serving', customerCount: 6, timeElapsed: '45 min' },
    { id: 11, status: 'empty' },
    { id: 12, status: 'empty' },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      tableId: 2,
      items: [
        { id: 1, name: 'Caesar Salad', price: 12.99, category: 'Appetizers', quantity: 2, isAvailable: true },
        { id: 4, name: 'Beef Steak', price: 32.99, category: 'Main Courses', quantity: 2, selectedModifier: 'Medium', isAvailable: true },
        { id: 7, name: 'Red Wine', price: 45.00, category: 'Drinks', quantity: 1, isAvailable: true },
      ],
      timestamp: '6:35 PM',
      status: 'cooking',
    },
    {
      tableId: 5,
      items: [
        { id: 2, name: 'Bruschetta', price: 9.99, category: 'Appetizers', quantity: 1, isAvailable: true },
        { id: 5, name: 'Grilled Salmon', price: 28.99, category: 'Main Courses', quantity: 2, selectedModifier: 'Well-done', isAvailable: true },
      ],
      timestamp: '6:50 PM',
      status: 'pending',
    },
    {
      tableId: 10,
      items: [
        { id: 3, name: 'Soup of the Day', price: 8.99, category: 'Appetizers', quantity: 3, isAvailable: true },
        { id: 4, name: 'Beef Steak', price: 32.99, category: 'Main Courses', quantity: 3, selectedModifier: 'Rare', isAvailable: true },
        { id: 6, name: 'Pasta Carbonara', price: 18.99, category: 'Main Courses', quantity: 2, isAvailable: true },
        { id: 8, name: 'Beer', price: 6.50, category: 'Drinks', quantity: 4, isAvailable: true },
      ],
      timestamp: '6:15 PM',
      status: 'cooking',
    },
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    { id: 'C001', name: 'Nguyen Van A', phone: '0901234567', email: 'nguyenvana@email.com', points: 1250, tier: 'Gold', totalSpent: 5000000, visits: 45 },
    { id: 'C002', name: 'Tran Thi B', phone: '0912345678', email: 'tranthib@email.com', points: 850, tier: 'Silver', totalSpent: 3200000, visits: 28 },
    { id: 'C003', name: 'Le Van C', phone: '0923456789', email: 'levanc@email.com', points: 2100, tier: 'Platinum', totalSpent: 8500000, visits: 67 },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'B001',
      customerName: 'Smith',
      customerPhone: '0901234567',
      customerEmail: 'smith@email.com',
      date: '2025-11-11',
      time: '19:00',
      guests: 4,
      tableId: 4,
      status: 'confirmed',
      notes: 'Window seat preferred',
      createdAt: '2025-11-10T10:30:00',
    },
    {
      id: 'B002',
      customerName: 'Johnson',
      customerPhone: '0912345678',
      date: '2025-11-11',
      time: '20:30',
      guests: 2,
      tableId: 8,
      status: 'confirmed',
      createdAt: '2025-11-10T14:20:00',
    },
  ]);

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: 'Beef', unit: 'kg', quantity: 25, minThreshold: 10, unitCost: 250000, category: 'Meat' },
    { id: 2, name: 'Salmon', unit: 'kg', quantity: 15, minThreshold: 8, unitCost: 350000, category: 'Seafood' },
    { id: 3, name: 'Lettuce', unit: 'kg', quantity: 8, minThreshold: 5, unitCost: 20000, category: 'Vegetables' },
    { id: 4, name: 'Tomato', unit: 'kg', quantity: 12, minThreshold: 6, unitCost: 15000, category: 'Vegetables' },
    { id: 5, name: 'Pasta', unit: 'kg', quantity: 20, minThreshold: 10, unitCost: 45000, category: 'Dry Goods' },
    { id: 6, name: 'Red Wine', unit: 'bottle', quantity: 30, minThreshold: 15, unitCost: 200000, category: 'Beverages' },
  ]);

  const [staff, setStaff] = useState<Staff[]>([
    { id: 'S001', name: 'Admin User', role: 'admin', phone: '0900000000', email: 'admin@restaurant.com', username: 'admin', status: 'active', shifts: ['Morning', 'Evening'] },
    { id: 'S002', name: 'Manager User', role: 'manager', phone: '0900000001', email: 'manager@restaurant.com', username: 'manager', status: 'active', shifts: ['Evening'] },
    { id: 'S003', name: 'Waiter 1', role: 'waitstaff', phone: '0900000002', email: 'waiter1@restaurant.com', username: 'waiter1', status: 'active', shifts: ['Morning'] },
    { id: 'S004', name: 'Chef 1', role: 'kitchen', phone: '0900000003', email: 'chef1@restaurant.com', username: 'chef1', status: 'active', shifts: ['Morning', 'Evening'] },
  ]);

  const [promotions, setPromotions] = useState<Promotion[]>([
    { id: 'P001', name: 'Happy Hour 20% Off', type: 'discount', value: 20, startDate: '2025-11-01', endDate: '2025-11-30', isActive: true },
    { id: 'P002', name: 'Steak Combo', type: 'combo', value: 45000, items: [4, 7], startDate: '2025-11-01', endDate: '2025-12-31', isActive: true },
  ]);

  const handleLogin = (role: 'waitstaff' | 'kitchen' | 'manager' | 'admin') => {
    setIsLoggedIn(true);
    setUserRole(role);
    if (role === 'kitchen') {
      setCurrentScreen('kitchen');
    } else if (role === 'manager' || role === 'admin') {
      setCurrentScreen('management');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  const handleTableClick = (tableId: number, action: 'open' | 'view' | 'payment') => {
    setSelectedTable(tableId);
    if (action === 'open') {
      setTables(tables.map(t => t.id === tableId ? { ...t, status: 'serving' as TableStatus, customerCount: 0, timeElapsed: '0 min' } : t));
      setCurrentScreen('order');
    } else if (action === 'view') {
      setCurrentScreen('order');
    } else if (action === 'payment') {
      setCurrentScreen('payment');
    }
  };

  const handleOrderSubmit = (tableId: number, orderItems: OrderItem[]) => {
    const newOrder: Order = {
      tableId,
      items: orderItems,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      status: 'pending',
    };
    setOrders([...orders, newOrder]);
    setCurrentScreen('dashboard');
  };

  const handlePaymentComplete = () => {
    if (selectedTable) {
      setTables(tables.map(t => t.id === selectedTable ? { ...t, status: 'empty' as TableStatus, customerCount: undefined, timeElapsed: undefined } : t));
      setOrders(orders.filter(o => o.tableId !== selectedTable));
    }
    setCurrentScreen('confirmation');
  };

  const handleBackToDashboard = () => {
    if (userRole === 'manager' || userRole === 'admin') {
      setCurrentScreen('management');
    } else {
      setCurrentScreen('dashboard');
    }
    setSelectedTable(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('login');
    setUserRole('waitstaff');
  };

  const handleOrderUpdate = (tableId: number, updatedItems: OrderItem[]) => {
    setOrders(orders.map(o => o.tableId === tableId ? { ...o, items: updatedItems } : o));
  };

  const handleOrderStatusUpdate = (tableId: number, status: Order['status']) => {
    setOrders(orders.map(o => o.tableId === tableId ? { ...o, status } : o));
  };

  const handleBookingCreate = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...booking,
      id: `B${String(bookings.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };
    setBookings([...bookings, newBooking]);
    
    // Update table status if table is assigned
    if (booking.tableId) {
      setTables(tables.map(t => 
        t.id === booking.tableId 
          ? { ...t, status: 'booked' as TableStatus, bookingTime: booking.time, bookingName: booking.customerName, bookingPhone: booking.customerPhone }
          : t
      ));
    }
  };

  const currentOrder = selectedTable ? orders.find(o => o.tableId === selectedTable) : null;

  return (
    <div className="min-h-screen bg-neutral-50">
      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} />
      )}
      {currentScreen === 'dashboard' && (
        <TableMapDashboard
          tables={tables}
          onTableClick={handleTableClick}
          onNavigateToKitchen={() => setCurrentScreen('kitchen')}
          onLogout={handleLogout}
          onNavigateToManagement={() => setCurrentScreen('management')}
        />
      )}
      {currentScreen === 'order' && selectedTable && (
        <OrderTakingScreen
          tableId={selectedTable}
          existingOrder={currentOrder}
          onSubmit={handleOrderSubmit}
          onUpdate={handleOrderUpdate}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'kitchen' && (
        <KitchenDisplayScreen
          orders={orders}
          onStatusUpdate={handleOrderStatusUpdate}
          onNavigateToDashboard={() => setCurrentScreen('dashboard')}
          userRole={userRole}
        />
      )}
      {currentScreen === 'payment' && selectedTable && currentOrder && (
        <PaymentProcessingScreen
          order={currentOrder}
          tableId={selectedTable}
          tables={tables}
          onPaymentComplete={handlePaymentComplete}
          onBack={handleBackToDashboard}
          onTableUpdate={setTables}
          onOrderUpdate={setOrders}
          orders={orders}
        />
      )}
      {currentScreen === 'confirmation' && (
        <ConfirmationScreen onBackToDashboard={handleBackToDashboard} />
      )}
      {currentScreen === 'management' && (
        <ManagementDashboard
          tables={tables}
          orders={orders}
          onLogout={handleLogout}
          onNavigate={setCurrentScreen}
          userRole={userRole}
        />
      )}
      {currentScreen === 'online-booking' && (
        <OnlineBookingScreen
          tables={tables}
          onBookingCreate={handleBookingCreate}
          onBack={() => setCurrentScreen('login')}
        />
      )}
      {currentScreen === 'offline-booking' && (
        <OfflineBookingScreen
          tables={tables}
          bookings={bookings}
          onBookingCreate={handleBookingCreate}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'customer-payment' && selectedTable && currentOrder && (
        <CustomerSelfPaymentScreen
          order={currentOrder}
          tableId={selectedTable}
          onPaymentComplete={() => {
            handlePaymentComplete();
            setCurrentScreen('login');
          }}
        />
      )}
      {currentScreen === 'loyalty' && (
        <LoyaltyManagementScreen
          customers={customers}
          onCustomerUpdate={setCustomers}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'inventory' && (
        <InventoryManagementScreen
          ingredients={ingredients}
          onInventoryUpdate={setIngredients}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'menu-mgmt' && (
        <MenuManagementScreen
          ingredients={ingredients}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'staff-mgmt' && (
        <StaffManagementScreen
          staff={staff}
          onStaffUpdate={setStaff}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'promotions' && (
        <PromotionManagementScreen
          promotions={promotions}
          onPromotionUpdate={setPromotions}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'reports' && (
        <ReportsScreen
          orders={orders}
          tables={tables}
          ingredients={ingredients}
          staff={staff}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'settings' && (
        <SettingsScreen
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
