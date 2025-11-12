import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { ArrowLeft, Shield, Database, Bell, DollarSign, Users } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/Background/chung.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1>Cài đặt hệ thống</h1>
              <p className="text-neutral-500 mt-1">Phân quyền, Sao lưu & Cấu hình</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Access Control */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle>Phân quyền hệ thống</CardTitle>
                <CardDescription>Quản lý quyền truy cập theo vai trò</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { role: 'Admin', permissions: ['Xem', 'Sửa', 'Xóa', 'Quản lý toàn bộ'] },
              { role: 'Manager', permissions: ['Xem', 'Sửa', 'Báo cáo'] },
              { role: 'Waitstaff', permissions: ['Xem', 'Tạo Order'] },
              { role: 'Kitchen', permissions: ['Xem Order', 'Cập nhật trạng thái'] },
              { role: 'Cashier', permissions: ['Xem', 'Thanh toán'] },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3>{item.role}</h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    {item.permissions.join(', ')}
                  </p>
                </div>
                <Button variant="outline" size="sm">Chỉnh sửa</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Backup & Restore */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-green-600" />
              <div>
                <CardTitle>Sao lưu & Phục hồi dữ liệu</CardTitle>
                <CardDescription>Tự động sao lưu CSDL hàng ngày</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="font-medium">Sao lưu tự động</p>
                <p className="text-sm text-neutral-600 mt-1">
                  Lần sao lưu gần nhất: 11/11/2025 00:00
                </p>
              </div>
              <Switch checked={true} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline">
                <Database className="w-4 h-4 mr-2" />
                Sao lưu ngay
              </Button>
              <Button variant="outline">
                Phục hồi dữ liệu
              </Button>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600">
                <strong>Lưu ý:</strong> Dữ liệu được sao lưu vào cloud storage an toàn. Bạn có thể khôi phục dữ liệu bất kỳ lúc nào.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-orange-600" />
              <div>
                <CardTitle>Thông báo tự động</CardTitle>
                <CardDescription>Cấu hình thông báo & nhắc lịch</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="booking-reminder">Nhắc lịch đặt bàn</Label>
                <p className="text-sm text-neutral-500">Gửi SMS/Email trước 1 giờ</p>
              </div>
              <Switch id="booking-reminder" checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="stock-alert">Cảnh báo hết hàng</Label>
                <p className="text-sm text-neutral-500">Thông báo khi nguyên liệu dưới ngưỡng</p>
              </div>
              <Switch id="stock-alert" checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-hide">Tự động ẩn món hết nguyên liệu</Label>
                <p className="text-sm text-neutral-500">Ẩn món khỏi menu khi NVL chính hết</p>
              </div>
              <Switch id="auto-hide" checked={true} />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <div>
                <CardTitle>Bảng giá & Hạng thành viên</CardTitle>
                <CardDescription>Cài đặt nhiều bảng giá và chính sách chiết khấu</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3>Bảng giá</h3>
              {[
                { name: 'Giá chuẩn', active: true },
                { name: 'Giá Giờ Vàng (17:00-19:00)', discount: '10%', active: false },
                { name: 'Giá Cuối tuần', discount: '5%', active: false },
              ].map((price, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{price.name}</p>
                    {price.discount && (
                      <p className="text-sm text-neutral-500">Giảm {price.discount}</p>
                    )}
                  </div>
                  <Switch checked={price.active} />
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h3>Hạng thành viên</h3>
              {[
                { tier: 'Silver', discount: '5%', requirement: '< $5,000' },
                { tier: 'Gold', discount: '10%', requirement: '$5,000 - $10,000' },
                { tier: 'Platinum', discount: '15%', requirement: '> $10,000' },
              ].map((member, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{member.tier}</p>
                    <p className="text-sm text-neutral-500">
                      Giảm {member.discount} • Chi tiêu {member.requirement}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Sửa</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-neutral-600" />
              <div>
                <CardTitle>Thông tin hệ thống</CardTitle>
                <CardDescription>Phiên bản & Thông tin kỹ thuật</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Phiên bản:</span>
              <span>v2.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Cập nhật gần nhất:</span>
              <span>11/11/2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Số người dùng:</span>
              <span>4 active</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
