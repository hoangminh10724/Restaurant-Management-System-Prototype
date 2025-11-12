import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { UtensilsCrossed, Calendar, AlertCircle } from 'lucide-react';
import { Staff } from '../App'; // Assuming Staff type is exported from App.tsx

interface LoginScreenProps {
  onLogin: (user: Staff) => void;
  staff: Staff[];
  onNavigate: (screen: 'online-booking' | 'customer-payment') => void;
}

// Mock password for prototype purposes. In a real app, this would be handled by a secure backend.
const MOCK_PASSWORD = "password123";

export default function LoginScreen({ onLogin, staff, onNavigate }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error on new submission

    // 4. Hệ thống kiểm tra thông tin đăng nhập so với CSDL người dùng.
    const user = staff.find((s) => s.username.toLowerCase() === username.toLowerCase());

    // 4a. Tên đăng nhập hoặc Mật khẩu sai
    if (!user || password !== MOCK_PASSWORD) {
      setError("Tên đăng nhập hoặc Mật khẩu không chính xác.");
      return; // Stop the flow
    }

    // 4b. Tài khoản đã bị vô hiệu hóa
    if (user.status === 'inactive') {
      setError("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Quản lý.");
      return; // Stop the flow
    }

    // 5. Hệ thống xác thực thông tin chính xác.
    // 6. Hệ thống kiểm tra vai trò (Role) của người dùng.
    // 7. Hệ thống chuyển hướng người dùng đến giao diện tương ứng.
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Hệ thống quản lý nhà hàng</CardTitle>
          <CardDescription>Đăng nhập để tiếp tục</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                type="text"
                placeholder="ví dụ: manager"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
               <p className="text-xs text-neutral-500">Gợi ý: Dùng bất kỳ username nào và mật khẩu "password123"</p>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t">
            <p className="text-center text-sm text-neutral-600 mb-3">Dành cho khách hàng</p>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="w-full" onClick={() => onNavigate('online-booking')}>
                <Calendar className="w-4 h-4 mr-2" />
                Đặt bàn Online
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
