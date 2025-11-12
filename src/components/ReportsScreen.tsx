import { useMemo, useState } from 'react';
import { Order, Table, Ingredient, Staff, Role, MenuItem } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Download, TrendingUp, TrendingDown, FileQuestion, Users } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

interface ReportsScreenProps {
  orders: Order[];
  tables: Table[];
  ingredients: Ingredient[];
  staff: Staff[];
  menuItems: MenuItem[];
  onBack: () => void;
}

// --- HELPER FUNCTIONS for data processing ---



// 2. Revenue Over Time
const getRevenueOverTime = (orders: Order[], numDays: number) => {
  const dateMap = new Map<string, { revenue: number; orders: number }>();
  const today = new Date();

  for (let i = 0; i < numDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    dateMap.set(dateString, { revenue: 0, orders: 0 });
  }

  orders.forEach(order => {
    if (dateMap.has(order.date)) {
      const dayData = dateMap.get(order.date)!;
      dayData.revenue += order.items.reduce((s, i) => s + i.price * i.quantity, 0);
      dayData.orders += 1;
    }
  });

  return Array.from(dateMap.entries())
    .map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
      ...data
    }))
    .reverse();
};


export default function ReportsScreen({ orders, tables, ingredients, staff, menuItems, onBack }: ReportsScreenProps) {
  const [staffTimeFilter, setStaffTimeFilter] = useState('all'); // 'today', '7days', 'all'
  const [staffRoleFilter, setStaffRoleFilter] = useState<Role | 'all'>('Phục vụ');
  const [salesTimeFilter, setSalesTimeFilter] = useState('all');
  const [salesCategoryFilter, setSalesCategoryFilter] = useState('all');
  const [salesSortBy, setSalesSortBy] = useState<'sold' | 'revenue'>('sold');

  // Handle case with no data
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <h1>Báo cáo & Thống kê</h1>
          </div>
        </div>
        <div className="flex-grow flex flex-col items-center justify-center text-center">
          <FileQuestion className="w-16 h-16 text-neutral-400 mb-4" />
          <h2 className="text-xl font-semibold">Không có dữ liệu</h2>
          <p className="text-neutral-500 mt-2">Chưa có đơn hàng nào được ghi nhận để tạo báo cáo.</p>
        </div>
      </div>
    );
  }

  // --- DATA AGGREGATION using useMemo for performance ---
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysOrders = useMemo(() => orders.filter(o => o.date === todayStr), [orders, todayStr]);

  const menuCategories = useMemo(() => Array.from(new Set(menuItems.map(item => item.category))), [menuItems]);

  const salesReport = useMemo(() => {
    let filteredOrders = orders;
    const today = new Date();
    if (salesTimeFilter === 'today') {
      filteredOrders = orders.filter(o => o.date === today.toISOString().split('T')[0]);
    } else if (salesTimeFilter === '7days') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      filteredOrders = orders.filter(o => new Date(o.date) >= sevenDaysAgo);
    }

    const itemSales = new Map<string, { sold: number; revenue: number; category: string }>();
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (salesCategoryFilter !== 'all' && item.category !== salesCategoryFilter) {
          return;
        }
        const current = itemSales.get(item.name) ?? { sold: 0, revenue: 0, category: item.category };
        current.sold += item.quantity;
        current.revenue += item.price * item.quantity;
        itemSales.set(item.name, current);
      });
    });

    const sortedItems = Array.from(itemSales.values())
      .map(data => ({ ...data, name: Array.from(itemSales.keys()).find(key => itemSales.get(key) === data)! }))
      .sort((a, b) => b[salesSortBy] - a[salesSortBy]);

    return {
      bestSellers: sortedItems.slice(0, 10),
      worstSellers: sortedItems.slice(-10).reverse(),
    };
  }, [orders, salesTimeFilter, salesCategoryFilter, salesSortBy]);

  const revenueData = useMemo(() => getRevenueOverTime(orders, 7), [orders]);
  const staffRoles = useMemo(() => Array.from(new Set(staff.map(s => s.role))), [staff]);

  const filteredStaffPerformance = useMemo(() => {
    let filteredOrders = orders;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (staffTimeFilter === 'today') {
      filteredOrders = orders.filter(o => o.date === todayStr);
    } else if (staffTimeFilter === '7days') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      filteredOrders = orders.filter(o => new Date(o.date) >= sevenDaysAgo);
    }

    let staffToReport = staff;
    if (staffRoleFilter !== 'all') {
      staffToReport = staff.filter(s => s.role === staffRoleFilter);
    }

    return staffToReport.map(person => {
      const personOrders = filteredOrders.filter(o => o.serverId === person.id);
      const revenue = personOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0), 0);
      return {
        name: person.name,
        role: person.role,
        orders: personOrders.length,
        revenue: revenue,
      };
    }).sort((a, b) => b.revenue - a.revenue);

  }, [orders, staff, staffTimeFilter, staffRoleFilter]);

  const totalRevenue = todaysOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0), 0);
  const totalCost = ingredients.reduce((sum, i) => sum + i.quantity * i.unitCost, 0); // Note: This is total inventory cost, not COGS. Simplified.
  const profit = totalRevenue - (totalCost * 0.1); // Simplified profit calculation

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1>Báo cáo & Thống kê</h1>
              <p className="text-neutral-500 mt-1">Doanh thu, Hiệu suất & Lãi/Lỗ</p>
            </div>
          </div>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList>
            <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
            <TabsTrigger value="sales">Bán hàng</TabsTrigger>
            <TabsTrigger value="staff">Nhân viên</TabsTrigger>
            <TabsTrigger value="profit">Lãi/Lỗ</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Doanh thu hôm nay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl">${totalRevenue.toFixed(2)}</div>
                  <p className="text-sm text-neutral-500 mt-1">Dựa trên {todaysOrders.length} đơn hàng</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Số đơn hàng hôm nay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl">{todaysOrders.length}</div>
                   <p className="text-sm text-neutral-500 mt-1">Tổng số đơn hàng</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Giá trị TB/Đơn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl">${(totalRevenue / (todaysOrders.length || 1)).toFixed(2)}</div>
                  <p className="text-sm text-neutral-500 mt-1">Trung bình hôm nay</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Doanh thu 7 ngày qua</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <CardTitle>Báo cáo bán hàng</CardTitle>
                  <div className="flex items-center gap-2 mt-4 md:mt-0 flex-wrap">
                    <Select value={salesTimeFilter} onValueChange={setSalesTimeFilter}>
                      <SelectTrigger className="w-full md:w-[160px]">
                        <SelectValue placeholder="Thời gian" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toàn thời gian</SelectItem>
                        <SelectItem value="today">Hôm nay</SelectItem>
                        <SelectItem value="7days">7 ngày qua</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={salesCategoryFilter} onValueChange={setSalesCategoryFilter}>
                      <SelectTrigger className="w-full md:w-[160px]">
                        <SelectValue placeholder="Danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả danh mục</SelectItem>
                        {menuCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <ToggleGroup type="single" value={salesSortBy} onValueChange={(value: 'sold' | 'revenue') => value && setSalesSortBy(value)} className="w-full md:w-auto">
                      <ToggleGroupItem value="sold" aria-label="Sort by quantity">Số lượng</ToggleGroupItem>
                      <ToggleGroupItem value="revenue" aria-label="Sort by revenue">Doanh thu</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
              </CardHeader>
            </Card>
            {salesReport.bestSellers.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Top 10 món bán chạy nhất
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {salesReport.bestSellers.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                              {idx + 1}
                            </div>
                            <div>
                              <h3>{item.name}</h3>
                              <p className="text-sm text-neutral-500">{item.sold} đã bán</p>
                            </div>
                          </div>
                          <p className="font-medium">${item.revenue.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      Top 10 món bán chậm nhất
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {salesReport.worstSellers.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h3>{item.name}</h3>
                            <p className="text-sm text-neutral-500">{item.sold} đã bán</p>
                          </div>
                          <p className="font-medium">${item.revenue.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="h-[300px] flex flex-col items-center justify-center text-center">
                  <FileQuestion className="w-12 h-12 text-neutral-400 mb-4" />
                  <h3 className="font-semibold">Không có dữ liệu</h3>
                  <p className="text-sm text-neutral-500">Không tìm thấy món ăn nào cho bộ lọc đã chọn.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <CardTitle>Hiệu suất nhân viên</CardTitle>
                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <Select value={staffRoleFilter} onValueChange={(value) => setStaffRoleFilter(value as Role | 'all')}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả vai trò</SelectItem>
                        {staffRoles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={staffTimeFilter} onValueChange={setStaffTimeFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn thời gian" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Hôm nay</SelectItem>
                        <SelectItem value="7days">7 ngày qua</SelectItem>
                        <SelectItem value="all">Toàn thời gian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredStaffPerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={filteredStaffPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: number, name: string) => [name === 'revenue' ? `$${value.toFixed(2)}` : value, name === 'revenue' ? 'Doanh thu' : 'Số đơn']} />
                      <Bar dataKey="revenue" fill="#3b82f6" name="Doanh thu" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex flex-col items-center justify-center text-center">
                    <Users className="w-12 h-12 text-neutral-400 mb-4" />
                    <h3 className="font-semibold">Không có dữ liệu</h3>
                    <p className="text-sm text-neutral-500">Không tìm thấy hoạt động nào cho bộ lọc đã chọn.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStaffPerformance.map((s, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle>{s.name}</CardTitle>
                    <p className="text-sm text-neutral-500">{s.role}</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Số đơn:</span>
                      <span className="font-medium">{s.orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Doanh số:</span>
                      <span className="font-medium">${s.revenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">TB/Đơn:</span>
                      <span className="font-medium">${(s.revenue / (s.orders || 1)).toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profit" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tổng doanh thu (hôm nay)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-green-600">+${totalRevenue.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Chi phí NVL (ước tính)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-red-600">-${(totalCost * 0.1).toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Chi phí vận hành (cố định)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-red-600">-$850.00</div>
                  <p className="text-sm text-neutral-500 mt-1">Lương, điện, nước</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Lợi nhuận ròng (ước tính)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-green-600">${(profit - 850).toFixed(2)}</div>
                  <p className="text-sm text-neutral-500 mt-1">Sau tất cả chi phí</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Chi tiết chi phí vận hành</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Lương nhân viên', amount: 500 },
                    { name: 'Điện', amount: 150 },
                    { name: 'Nước', amount: 80 },
                    { name: 'Internet & Điện thoại', amount: 50 },
                    { name: 'Khác', amount: 70 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <span>{item.name}</span>
                      <span className="font-medium text-red-600">-${item.amount}</span>
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