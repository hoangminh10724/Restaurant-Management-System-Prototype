import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { UtensilsCrossed, ChefHat, Users, UserCog, ShieldCheck, Calendar } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: 'waitstaff' | 'kitchen' | 'manager' | 'admin') => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'waitstaff' | 'kitchen' | 'manager' | 'admin'>('waitstaff');
  const [showCustomerPortal, setShowCustomerPortal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin(selectedRole);
    }
  };

  const roles = [
    { id: 'waitstaff' as const, name: 'Nhân viên phục vụ', icon: Users },
    { id: 'kitchen' as const, name: 'Bếp', icon: ChefHat },
    { id: 'manager' as const, name: 'Quản lý', icon: UserCog },
    { id: 'admin' as const, name: 'Admin', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Hệ thống quản lý nhà hàng</CardTitle>
          <CardDescription>Đăng nhập để sử dụng hệ thống POS</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Chọn vai trò</Label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <Button
                      key={role.id}
                      type="button"
                      variant={selectedRole === role.id ? 'default' : 'outline'}
                      className="h-20 flex flex-col gap-2"
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{role.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t">
            <p className="text-center text-sm text-neutral-600 mb-3">Dành cho khách hàng</p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Đặt bàn Online
              </Button>
              <Button variant="outline" className="w-full">
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                Thanh toán tự động
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}