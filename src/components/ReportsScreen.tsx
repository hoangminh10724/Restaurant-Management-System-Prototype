import { Order, Table, Ingredient, Staff } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportsScreenProps {
  orders: Order[];
  tables: Table[];
  ingredients: Ingredient[];
  staff: Staff[];
  onBack: () => void;
}

export default function ReportsScreen({ orders, tables, ingredients, staff, onBack }: ReportsScreenProps) {
  const totalRevenue = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0), 0);
  const totalCost = ingredients.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);
  const profit = totalRevenue - (totalCost * 0.3); // Simplified calculation

  // Mock data for charts
  const revenueData = [
    { date: '11/05', revenue: 4200, orders: 45 },
    { date: '11/06', revenue: 3800, orders: 38 },
    { date: '11/07', revenue: 4500, orders: 52 },
    { date: '11/08', revenue: 5100, orders: 58 },
    { date: '11/09', revenue: 4800, orders: 51 },
    { date: '11/10', revenue: 5300, orders: 61 },
    { date: '11/11', revenue: totalRevenue, orders: orders.length },
  ];

  const bestSellers = [
    { name: 'Beef Steak', sold: 156, revenue: 5146 },
    { name: 'Grilled Salmon', sold: 134, revenue: 3885 },
    { name: 'Red Wine', sold: 98, revenue: 4410 },
    { name: 'Caesar Salad', sold: 89, revenue: 1156 },
    { name: 'Pasta Carbonara', sold: 76, revenue: 1443 },
  ];

  const worstSellers = [
    { name: 'Soup of the Day', sold: 12, revenue: 108 },
    { name: 'Bruschetta', sold: 18, revenue: 180 },
  ];

  const staffPerformance = staff.filter(s => s.role === 'waitstaff').map((s, idx) => ({
    name: s.name,
    orders: Math.floor(Math.random() * 50) + 20,
    revenue: Math.floor(Math.random() * 3000) + 1000,
  }));

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
                  <p className="text-sm text-green-600 mt-1">+12% so với hôm qua</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Số đơn hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl">{orders.length}</div>
                  <p className="text-sm text-green-600 mt-1">+8% so với hôm qua</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Giá trị TB/Đơn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl">${(totalRevenue / orders.length).toFixed(2)}</div>
                  <p className="text-sm text-neutral-500 mt-1">Trung bình</p>
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
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Top 5 món bán chạy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bestSellers.map((item, idx) => (
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
                        <p className="font-medium">${item.revenue}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    Món bán chậm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {worstSellers.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h3>{item.name}</h3>
                          <p className="text-sm text-neutral-500">{item.sold} đã bán</p>
                        </div>
                        <p className="font-medium">${item.revenue}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-neutral-500 mt-4 p-3 bg-orange-50 rounded">
                    💡 Gợi ý: Cân nhắc tạo combo hoặc khuyến mãi cho các món này
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hiệu suất nhân viên phục vụ</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={staffPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffPerformance.map((s, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle>{s.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Số đơn:</span>
                      <span className="font-medium">{s.orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Doanh số:</span>
                      <span className="font-medium">${s.revenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">TB/Đơn:</span>
                      <span className="font-medium">${(s.revenue / s.orders).toFixed(2)}</span>
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
                  <CardTitle>Tổng doanh thu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-green-600">+${totalRevenue.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Chi phí NVL</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-red-600">-${(totalCost * 0.3).toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Chi phí vận hành</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-red-600">-$850.00</div>
                  <p className="text-sm text-neutral-500 mt-1">Lương, điện, nước</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Lợi nhuận ròng</CardTitle>
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
