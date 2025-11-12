import { Table, Order } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  ArrowLeft,
  Calendar,
  Clock,
  Package,
  Settings,
  UserCog,
  Utensils,
  Gift,
  FileText,
  Warehouse,
  Heart
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ManagementDashboardProps {
  tables: Table[];
  orders: Order[];
  onLogout: () => void;
  onNavigate: (screen: any) => void;
  userRole: 'waitstaff' | 'kitchen' | 'manager' | 'admin';
}

export default function ManagementDashboard({ tables, orders, onLogout, onNavigate, userRole }: ManagementDashboardProps) {
  // Calculate statistics
  const totalTables = tables.length;
  const occupiedTables = tables.filter(t => t.status === 'serving').length;
  const bookedTables = tables.filter(t => t.status === 'booked').length;
  const emptyTables = tables.filter(t => t.status === 'empty').length;
  const occupancyRate = ((occupiedTables / totalTables) * 100).toFixed(1);

  // Calculate revenue
  const totalRevenue = orders.reduce((sum, order) => {
    return sum + order.items.reduce((orderSum, item) => orderSum + (item.price * item.quantity), 0);
  }, 0);

  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate items sold
  const totalItemsSold = orders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);

  // Revenue by hour (mock data for demo)
  const revenueByHour = [
    { hour: '12 PM', revenue: 450 },
    { hour: '1 PM', revenue: 680 },
    { hour: '2 PM', revenue: 520 },
    { hour: '3 PM', revenue: 390 },
    { hour: '4 PM', revenue: 310 },
    { hour: '5 PM', revenue: 580 },
    { hour: '6 PM', revenue: 920 },
    { hour: '7 PM', revenue: 1150 },
  ];

  // Popular items (from current orders)
  const itemSales: { [key: string]: { count: number; revenue: number } } = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!itemSales[item.name]) {
        itemSales[item.name] = { count: 0, revenue: 0 };
      }
      itemSales[item.name].count += item.quantity;
      itemSales[item.name].revenue += item.price * item.quantity;
    });
  });

  const popularItems = Object.entries(itemSales)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Category sales data
  const categorySales = [
    { name: 'Appetizers', value: 28 },
    { name: 'Main Courses', value: 45 },
    { name: 'Drinks', value: 27 },
  ];

  const COLORS = ['#f97316', '#3b82f6', '#10b981'];

  // Order status breakdown
  const orderStatusData = [
    { status: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { status: 'Cooking', count: orders.filter(o => o.status === 'cooking').length },
    { status: 'Ready', count: orders.filter(o => o.status === 'ready').length },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onLogout}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1>Management Dashboard</h1>
              <p className="text-neutral-500 mt-1">Analytics & Reports</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-neutral-600">
            <Calendar className="w-4 h-4" />
            <span>November 11, 2025</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="menu">Menu Performance</TabsTrigger>
            <TabsTrigger value="tables">Table Management</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Access Menu */}
            <Card>
              <CardHeader>
                <CardTitle>Quản lý nhanh</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => onNavigate('offline-booking')}>
                    <Calendar className="w-5 h-5" />
                    <span>Đặt bàn Offline</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => onNavigate('loyalty')}>
                    <Heart className="w-5 h-5" />
                    <span>Khách hàng VIP</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => onNavigate('inventory')}>
                    <Warehouse className="w-5 h-5" />
                    <span>Quản lý kho</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => onNavigate('menu-mgmt')}>
                    <Utensils className="w-5 h-5" />
                    <span>Quản lý thực đơn</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => onNavigate('staff-mgmt')}>
                    <UserCog className="w-5 h-5" />
                    <span>Nhân viên</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => onNavigate('promotions')}>
                    <Gift className="w-5 h-5" />
                    <span>Khuyến mãi</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => onNavigate('reports')}>
                    <FileText className="w-5 h-5" />
                    <span>Báo cáo</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => onNavigate('settings')}>
                    <Settings className="w-5 h-5" />
                    <span>Cài đặt</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">Total Revenue</CardTitle>
                  <DollarSign className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">${totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-neutral-500 mt-1">Today's earnings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">Active Orders</CardTitle>
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{totalOrders}</div>
                  <p className="text-xs text-neutral-500 mt-1">Currently processing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">Table Occupancy</CardTitle>
                  <Users className="w-4 h-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{occupancyRate}%</div>
                  <p className="text-xs text-neutral-500 mt-1">{occupiedTables}/{totalTables} tables occupied</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">Avg Order Value</CardTitle>
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">${averageOrderValue.toFixed(2)}</div>
                  <p className="text-xs text-neutral-500 mt-1">Per order</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Hour</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueByHour}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={orderStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categorySales}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categorySales.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Daily Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600">Total Orders</p>
                          <p className="text-xl">{totalOrders}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600">Items Sold</p>
                          <p className="text-xl">{totalItemsSold}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600">Total Revenue</p>
                          <p className="text-xl">${totalRevenue.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600">Avg Order Value</p>
                          <p className="text-xl">${averageOrderValue.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Menu Performance Tab */}
          <TabsContent value="menu" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {popularItems.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div>
                          <h3>{item.name}</h3>
                          <p className="text-neutral-500 mt-1">Sold: {item.count} units</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-neutral-900">${item.revenue.toFixed(2)}</p>
                        <p className="text-neutral-500 mt-1">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tables Tab */}
          <TabsContent value="tables" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Empty Tables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-green-600">{emptyTables}</div>
                  <p className="text-neutral-500 mt-2">Available for seating</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Occupied Tables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-red-600">{occupiedTables}</div>
                  <p className="text-neutral-500 mt-2">Currently serving</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booked Tables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-yellow-600">{bookedTables}</div>
                  <p className="text-neutral-500 mt-2">Reserved for later</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Table Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tables.map(table => (
                    <div key={table.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          table.status === 'empty' ? 'bg-green-500' :
                          table.status === 'serving' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <span>Table {table.id}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {table.status === 'serving' && (
                          <>
                            <span className="text-neutral-600">{table.customerCount} guests</span>
                            <span className="text-neutral-600">{table.timeElapsed}</span>
                          </>
                        )}
                        {table.status === 'booked' && (
                          <>
                            <span className="text-neutral-600">{table.bookingTime}</span>
                            <span className="text-neutral-600">{table.bookingName}</span>
                          </>
                        )}
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          table.status === 'empty' ? 'bg-green-100 text-green-700' :
                          table.status === 'serving' ? 'bg-red-100 text-red-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}