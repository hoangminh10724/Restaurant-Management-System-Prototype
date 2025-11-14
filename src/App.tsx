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
import InvoiceView from './components/InvoiceView';
import CostManagementScreen, { OperatingCosts, CostData } from './components/CostManagementScreen';
import { Toaster } from './components/ui/sonner';

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
  maxSeats?: number;
  bookingNotes?: string;
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
  notes?: string;
}

export interface Order {
  tableId: number;
  items: OrderItem[];
  timestamp: string;
  status: 'pending' | 'cooking' | 'ready' | 'completed';
  serverId: string;
  customerId?: string;
  date: string; // YYYY-MM-DD format
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
  eventType?: string;
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
  role: 'Admin' | 'Quản lý' | 'Phục vụ' | 'Bếp' | 'Thu ngân' | 'Kho';
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

export type Role = 'Admin' | 'Quản lý' | 'Phục vụ' | 'Bếp' | 'Thu ngân' | 'Kho';

export type Screen = 
  | 'login' 
  | 'dashboard' 
  | 'order' 
  | 'kitchen' 
  | 'payment' 
  | 'confirmation'
  | 'invoice'
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
  | 'cost-management'
  | 'settings';

// Define a type for the bill details to be passed around
export interface BillDetails {
  subtotal: number;
  totalDiscount: number;
  appliedPromotionsDetails: { name: string; amount: number }[];
  vatAmount: number;
  grandTotal: number;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<Staff | null>(null);
  const [lastCompletedTransaction, setLastCompletedTransaction] = useState<{ order: Order; billDetails: BillDetails; customer?: Customer | null } | null>(null);
  const [operatingCosts, setOperatingCosts] = useState<OperatingCosts>({
    "2025-11": { rent: 2000, salary: 5000, utilities: 850, marketing: 300, other: 150 }
  });
  
  const [tables, setTables] = useState<Table[]>([
    // Create 24 tables, 8 per floor. maxSeats set up variably per table.
    { id: 1, status: 'empty', maxSeats: 4 },
    { id: 2, status: 'serving', customerCount: 4, timeElapsed: '25 min', maxSeats: 6 },
    { id: 3, status: 'empty', maxSeats: 4 },
    { id: 4, status: 'booked', bookingTime: '7:00 PM', bookingName: 'Smith', bookingPhone: '0901234567', maxSeats: 6 },
    { id: 5, status: 'serving', customerCount: 2, timeElapsed: '10 min', maxSeats: 2 },
    { id: 6, status: 'empty', maxSeats: 4 },
    { id: 7, status: 'empty', maxSeats: 4 },
    { id: 8, status: 'booked', bookingTime: '8:30 PM', bookingName: 'Johnson', bookingPhone: '0912345678', maxSeats: 6 },

    { id: 9, status: 'empty', maxSeats: 4 },
    { id: 10, status: 'serving', customerCount: 6, timeElapsed: '45 min', maxSeats: 6 },
    { id: 11, status: 'empty', maxSeats: 2 },
    { id: 12, status: 'empty', maxSeats: 4 },
    { id: 13, status: 'empty', maxSeats: 4 },
    { id: 14, status: 'serving', customerCount: 3, timeElapsed: '12 min', maxSeats: 4 },
    { id: 15, status: 'booked', bookingTime: '7:30 PM', bookingName: 'Le', bookingPhone: '0922222222', maxSeats: 6 },
    { id: 16, status: 'empty', maxSeats: 4 },

    { id: 17, status: 'empty', maxSeats: 4 },
    { id: 18, status: 'booked', bookingTime: '8:00 PM', bookingName: 'Tran', bookingPhone: '0933333333', maxSeats: 6 },
    { id: 19, status: 'empty', maxSeats: 4 },
    { id: 20, status: 'serving', customerCount: 5, timeElapsed: '30 min', maxSeats: 6 },
    { id: 21, status: 'empty', maxSeats: 2 },
    { id: 22, status: 'empty', maxSeats: 4 },
    { id: 23, status: 'empty', maxSeats: 4 },
    { id: 24, status: 'empty', maxSeats: 6 },
  ]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: 'Bánh cuốn', category: 'Món chính', price: 50000, isAvailable: true, image: '/Food/bánh cuốn.jpg' },
    { id: 2, name: 'Bánh xèo', category: 'Món chính', price: 60000, isAvailable: true, image: '/Food/bánh xèo.jpg' },
    { id: 3, name: 'Canh ngao', category: 'Món chính', price: 55000, isAvailable: true, image: '/Food/canh ngao.jpg' },
    { id: 4, name: 'Cơm tấm', category: 'Món chính', price: 45000, isAvailable: true, image: '/Food/cơm tấm.jpg' },
    { id: 5, name: 'Tokbokki', category: 'Món ăn vặt', price: 70000, isAvailable: true, image: '/Food/tokbokki.jpg' },
    { id: 6, name: 'Coca-Cola', category: 'Nước uống', price: 15000, isAvailable: true, image: '/Drink/coca.jpg' },
    { id: 7, name: 'Fanta', category: 'Nước uống', price: 15000, isAvailable: true, image: '/Drink/fanta.jpg' },
    { id: 8, name: 'Nước ép', category: 'Nước uống', price: 20000, isAvailable: true, image: '/Drink/nước ép.jpg' },
    { id: 9, name: 'Pepsi', category: 'Nước uống', price: 15000, isAvailable: true, image: '/Drink/pepsi.jpg' },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      tableId: 2,
      items: [
        { id: 1, name: 'Bánh cuốn', category: 'Món chính', price: 50000, quantity: 2, isAvailable: true, image: '/Food/bánh cuốn.jpg' },
        { id: 4, name: 'Cơm tấm', category: 'Món chính', price: 45000, quantity: 2, isAvailable: true, image: '/Food/cơm tấm.jpg' },
        { id: 6, name: 'Coca-Cola', category: 'Nước uống', price: 15000, quantity: 1, isAvailable: true, image: '/Drink/coca.jpg' },
      ],
      timestamp: '6:35 PM',
      status: 'cooking',
      serverId: 'S003',
      date: '2025-11-11'
    },
    {
      tableId: 5,
      items: [
        { id: 2, name: 'Bánh xèo', category: 'Món chính', price: 60000, quantity: 1, isAvailable: true, image: '/Food/bánh xèo.jpg' },
        { id: 8, name: 'Nước ép', category: 'Nước uống', price: 20000, quantity: 2, isAvailable: true, image: '/Drink/nước ép.jpg' },
      ],
      timestamp: '6:50 PM',
      status: 'pending',
      serverId: 'S003',
      date: '2025-11-11'
    },
    {
      tableId: 10,
      items: [
        { id: 5, name: 'Tokbokki', category: 'Món ăn vặt', price: 70000, quantity: 3, isAvailable: true, image: '/Food/tokbokki.jpg' },
        { id: 7, name: 'Fanta', category: 'Nước uống', price: 15000, quantity: 4, isAvailable: true, image: '/Drink/fanta.jpg' },
      ],
      timestamp: '6:15 PM',
      status: 'cooking',
      serverId: 'S006',
      date: '2025-11-10'
    }
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
    { id: 'S001', name: 'Admin User', role: 'Admin', phone: '0900000000', email: 'admin@restaurant.com', username: 'admin', status: 'active', shifts: ['Morning', 'Evening'] },
    { id: 'S002', name: 'Manager User', role: 'Quản lý', phone: '0900000001', email: 'manager@restaurant.com', username: 'manager', status: 'active', shifts: ['Evening'] },
    { id: 'S003', name: 'Waiter 1', role: 'Phục vụ', phone: '0900000002', email: 'waiter1@restaurant.com', username: 'waiter', status: 'active', shifts: ['Morning'] },
    { id: 'S004', name: 'Chef 1', role: 'Bếp', phone: '0900000003', email: 'chef1@restaurant.com', username: 'kitchen', status: 'active', shifts: ['Morning', 'Evening'] },
    { id: 'S005', name: 'Cashier 1', role: 'Thu ngân', phone: '0900000004', email: 'cashier1@restaurant.com', username: 'cashier', status: 'active', shifts: ['Evening'] },
    { id: 'S006', name: 'Locked User', role: 'Phục vụ', phone: '0900000005', email: 'locked@restaurant.com', username: 'locked', status: 'inactive', shifts: [] },
    { id: 'S007', name: 'Warehouse User', role: 'Kho', phone: '0900000006', email: 'warehouse@restaurant.com', username: 'kho', status: 'active', shifts: ['Morning'] },
  ]);

  const [promotions, setPromotions] = useState<Promotion[]>([
    { id: 'P001', name: 'Happy Hour 20% Off', type: 'discount', value: 20, startDate: '2025-11-01', endDate: '2025-11-30', isActive: true },
    { id: 'P002', name: 'Steak Combo', type: 'combo', value: 45000, items: [4, 7], startDate: '2025-11-01', endDate: '2025-12-31', isActive: true },
  ]);

  const handleLogin = (user: Staff) => {
    setLoggedInUser(user);
    const role = user.role;
    if (role === 'Admin' || role === 'Quản lý') {
      setCurrentScreen('management');
    } else if (role === 'Bếp' || role === 'Kho') {
      setCurrentScreen('kitchen');
    } else { 
      setCurrentScreen('dashboard');
    }
  };

  const handleOpenTable = (tableId: number, guestCount: number) => {
    setTables(tables.map(t => 
      t.id === tableId 
        ? { ...t, status: 'serving' as TableStatus, customerCount: guestCount, timeElapsed: '0 min' } 
        : t
    ));
    setSelectedTable(tableId);
    setCurrentScreen('order');
  };

  const handleUpdateBookingDetails = (tableId: number, details: { name: string, phone: string, time: string, notes: string }) => {
    setTables(tables.map(t => 
      t.id === tableId 
        ? { ...t, 
            bookingName: details.name, 
            bookingPhone: details.phone, 
            bookingTime: details.time,
            bookingNotes: details.notes
          }
        : t
    ));
  };

  const handleTableClick = (tableId: number, action: 'view' | 'payment') => {
    setSelectedTable(tableId);
    if (action === 'view') {
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
      serverId: loggedInUser!.id,
      date: new Date().toISOString().split('T')[0]
    };
    setOrders([...orders, newOrder]);
    setCurrentScreen('dashboard');
  };

  const handleRegisterCustomer = (name: string, phone: string): Customer => {
    const newCustomer: Customer = {
      id: `C${String(customers.length + 1).padStart(3, '0')}`,
      name,
      phone,
      points: 0,
      tier: 'Silver',
      totalSpent: 0,
      visits: 0,
    };
    setCustomers([...customers, newCustomer]);
    return newCustomer;
  };

  const handlePaymentComplete = (details: { customerId?: string; amountPaid: number; paidItems: OrderItem[]; billDetails: BillDetails }) => {
    if (!selectedTable) return;

    const order = orders.find(o => o.tableId === selectedTable);
    if (!order) return;

    // For the invoice, create a temporary order object with only the paid items
    const invoiceOrder: Order = { ...order, items: details.paidItems };
    const customer = customers.find(c => c.id === details.customerId);
    setLastCompletedTransaction({ order: invoiceOrder, billDetails: details.billDetails, customer });

    // Update the actual order with remaining items
    const remainingItems = order.items.filter(originalItem => 
      !details.paidItems.some(paidItem => 
        paidItem.id === originalItem.id && 
        paidItem.selectedModifier === originalItem.selectedModifier &&
        paidItem.notes === originalItem.notes
      )
    );

    if (remainingItems.length === 0) {
      setTables(tables.map(t => t.id === selectedTable ? { ...t, status: 'empty' as TableStatus, customerCount: undefined, timeElapsed: undefined, bookingName: undefined, bookingPhone: undefined, bookingTime: undefined } : t));
      setOrders(orders.map(o => o.tableId === selectedTable ? { ...o, items: [], status: 'completed' } : o));
    } else {
      setOrders(orders.map(o => o.tableId === selectedTable ? { ...o, items: remainingItems } : o));
    }

    if (details.customerId) {
      setCustomers(customers.map(c => {
        if (c.id === details.customerId) {
          const pointsEarned = Math.floor(details.amountPaid / 1000);
          return {
            ...c,
            points: c.points + pointsEarned,
            totalSpent: c.totalSpent + details.amountPaid,
            visits: c.visits + 1,
          };
        }
        return c;
      }));
    }

    setCurrentScreen('confirmation');
  };

  const handleTransferTable = (sourceTableId: number, targetTableId: number) => {
    const orderToTransfer = orders.find(o => o.tableId === sourceTableId);
    const sourceTable = tables.find(t => t.id === sourceTableId);

    if (!orderToTransfer || !sourceTable) return;

    const updatedOrders = orders.map(o => 
      o.tableId === sourceTableId ? { ...o, tableId: targetTableId } : o
    );
    setOrders(updatedOrders);

    const updatedTables = tables.map(t => {
      if (t.id === sourceTableId) {
        return { ...t, status: 'empty' as TableStatus, customerCount: undefined, timeElapsed: undefined, bookingName: undefined, bookingPhone: undefined, bookingTime: undefined };
      }
      if (t.id === targetTableId) {
        return { ...t, status: 'serving' as TableStatus, customerCount: sourceTable.customerCount, timeElapsed: sourceTable.timeElapsed };
      }
      return t;
    });
    setTables(updatedTables);
  };

  const handleMergeTables = (sourceTableId: number, targetTableIds: number[]) => {
    const sourceOrder = orders.find(o => o.tableId === sourceTableId);
    if (!sourceOrder) return;

    const itemsToMerge = orders
      .filter(o => targetTableIds.includes(o.tableId))
      .flatMap(o => o.items);

    const updatedSourceOrder = {
      ...sourceOrder,
      items: [...sourceOrder.items, ...itemsToMerge],
    };

    const updatedOrders = orders
      .filter(o => !targetTableIds.includes(o.tableId))
      .map(o => o.tableId === sourceTableId ? updatedSourceOrder : o);
    
    setOrders(updatedOrders);

    const updatedTables = tables.map(t => 
      targetTableIds.includes(t.id)
        ? { ...t, status: 'empty' as TableStatus, customerCount: undefined, timeElapsed: undefined }
        : t
    );
    setTables(updatedTables);
  };

  const handleStockIn = (update: { ingredientId: number; quantity: number; unitCost: number }) => {
    setIngredients(prevIngredients => 
      prevIngredients.map(ing => {
        if (ing.id === update.ingredientId) {
          return {
            ...ing,
            quantity: ing.quantity + update.quantity,
            unitCost: update.unitCost, // Update the unit cost
          };
        }
        return ing;
      })
    );
    // In a real app, you would also save a stock-in record here.
    console.log('Stock-in processed:', update);
  };

  const handleSaveCosts = (period: string, data: CostData) => {
    setOperatingCosts(prev => ({
      ...prev,
      [period]: data,
    }));
  };

  const handleBackToDashboard = () => {
    if (loggedInUser?.role === 'Admin' || loggedInUser?.role === 'Quản lý') {
      setCurrentScreen('management');
    } else {
      setCurrentScreen('dashboard');
    }
    setSelectedTable(null);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentScreen('login');
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
    
    if (booking.tableId) {
      setTables(tables.map(t => 
        t.id === booking.tableId 
          ? { ...t, status: 'booked' as TableStatus, bookingTime: booking.time, bookingName: booking.customerName, bookingPhone: booking.customerPhone } 
          : t
      ));
    }
  };

  const currentOrder = selectedTable ? orders.find(o => o.tableId === selectedTable && o.status !== 'completed') : null;
  const userRole = loggedInUser?.role;

  return (
    <div className="min-h-screen">
      <Toaster richColors />
      {currentScreen === 'login' && (
        <LoginScreen 
          onLogin={handleLogin} 
          staff={staff}
        />
      )}

      {currentScreen === 'dashboard' && loggedInUser && (
        <TableMapDashboard
          tables={tables}
          orders={orders.filter(o => o.status !== 'completed')}
          onTableClick={handleTableClick}
          onOpenTable={handleOpenTable}
          onTransferTable={handleTransferTable}
          onNavigateToKitchen={() => setCurrentScreen('kitchen')}
          onNavigateToOnlineBooking={() => setCurrentScreen('online-booking')}
          onLogout={handleLogout}
          onNavigateToManagement={() => setCurrentScreen('management')}
          onUpdateBookingDetails={handleUpdateBookingDetails}
          user={loggedInUser}
        />
      )}
      {currentScreen === 'order' && selectedTable && loggedInUser && (
        <OrderTakingScreen
          tableId={selectedTable}
          menuItems={menuItems}
          existingOrder={currentOrder}
          onSubmit={handleOrderSubmit}
          onUpdate={handleOrderUpdate}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'kitchen' && loggedInUser && (
        <KitchenDisplayScreen
          orders={orders}
          onStatusUpdate={handleOrderStatusUpdate}
          onLogout={handleLogout}
          onNavigateToTableMap={() => setCurrentScreen('dashboard')}
          onNavigateToOnlineBooking={() => setCurrentScreen('online-booking')}
          onNavigateToManagement={() => setCurrentScreen('management')}
          user={loggedInUser}
        />
      )}
      {currentScreen === 'payment' && selectedTable && currentOrder && loggedInUser && (
        <PaymentProcessingScreen
          order={currentOrder}
          tableId={selectedTable}
          promotions={promotions}
          customers={customers}
          onRegisterCustomer={handleRegisterCustomer}
          onPaymentComplete={handlePaymentComplete}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'confirmation' && (
        <ConfirmationScreen 
          onBackToDashboard={handleBackToDashboard} 
          onNavigateToInvoice={() => setCurrentScreen('invoice')}
          lastCompletedTransaction={lastCompletedTransaction}
        />
      )}
      {currentScreen === 'invoice' && lastCompletedTransaction && (
        <InvoiceView
          order={lastCompletedTransaction.order}
          billDetails={lastCompletedTransaction.billDetails}
          customer={lastCompletedTransaction.customer}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}
      {currentScreen === 'management' && loggedInUser && (
        <ManagementDashboard
          tables={tables}
          orders={orders}
          onLogout={handleLogout}
          onNavigate={setCurrentScreen}
          userRole={userRole as Role}
        />
      )}
      {currentScreen === 'online-booking' && (
        <OnlineBookingScreen
          tables={tables}
          onBookingCreate={handleBookingCreate}
          onNavigateToTableMap={() => loggedInUser ? setCurrentScreen('dashboard') : setCurrentScreen('login')}
          onNavigateToKitchen={() => loggedInUser ? setCurrentScreen('kitchen') : setCurrentScreen('login')}
          onNavigateToManagement={() => loggedInUser ? setCurrentScreen('management') : setCurrentScreen('login')}
          onLogout={handleLogout}
          user={loggedInUser}
        />
      )}
      {currentScreen === 'offline-booking' && loggedInUser && (
        <OfflineBookingScreen
          tables={tables}
          bookings={bookings}
          onBookingCreate={handleBookingCreate}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'customer-payment' && currentOrder && selectedTable && (
        <CustomerSelfPaymentScreen
          order={currentOrder}
          tableId={selectedTable}
          onPaymentComplete={() => {
            if(currentOrder) {
              const billDetails: BillDetails = { subtotal: 0, totalDiscount: 0, appliedPromotionsDetails: [], vatAmount: 0, grandTotal: 0 }; // Placeholder
              handlePaymentComplete({ paidItems: currentOrder.items, amountPaid: 0, billDetails, customerId: undefined });
            }
            setCurrentScreen('login');
          }}
        />
      )}
      {currentScreen === 'loyalty' && loggedInUser && (
        <LoyaltyManagementScreen
          customers={customers}
          onCustomerUpdate={setCustomers}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'inventory' && loggedInUser && (
        <InventoryManagementScreen
          ingredients={ingredients}
          onInventoryUpdate={setIngredients}
          onStockIn={handleStockIn}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'menu-mgmt' && loggedInUser && (
        <MenuManagementScreen
          ingredients={ingredients}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'staff-mgmt' && loggedInUser && (
        <StaffManagementScreen
          staff={staff}
          onStaffUpdate={setStaff}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'promotions' && loggedInUser && (
        <PromotionManagementScreen
          promotions={promotions}
          onPromotionUpdate={setPromotions}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'reports' && loggedInUser && (
        <ReportsScreen
          orders={orders}
          tables={tables}
          ingredients={ingredients}
          staff={staff}
          menuItems={menuItems}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'settings' && loggedInUser && (
        <SettingsScreen
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'cost-management' && loggedInUser && (
        <CostManagementScreen
          costs={operatingCosts}
          onSave={handleSaveCosts}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
