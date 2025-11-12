import { useState } from 'react';
import { Customer } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ArrowLeft, Search, Plus, Gift, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface LoyaltyManagementScreenProps {
  customers: Customer[];
  onCustomerUpdate: (customers: Customer[]) => void;
  onBack: () => void;
}

export default function LoyaltyManagementScreen({ customers, onCustomerUpdate, onBack }: LoyaltyManagementScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(0);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const getTierColor = (tier: Customer['tier']) => {
    switch (tier) {
      case 'Silver': return 'bg-neutral-300 text-neutral-800';
      case 'Gold': return 'bg-yellow-400 text-yellow-900';
      case 'Platinum': return 'bg-purple-500 text-white';
    }
  };

  const getTierBenefits = (tier: Customer['tier']) => {
    switch (tier) {
      case 'Silver': return '5% giảm giá';
      case 'Gold': return '10% giảm giá';
      case 'Platinum': return '15% giảm giá + Ưu tiên đặt bàn';
    }
  };

  const handleAddPoints = () => {
    if (selectedCustomer && pointsToAdd > 0) {
      const updatedCustomers = customers.map(c =>
        c.id === selectedCustomer.id
          ? { ...c, points: c.points + pointsToAdd }
          : c
      );
      onCustomerUpdate(updatedCustomers);
      setShowDialog(false);
      setSelectedCustomer(null);
      setPointsToAdd(0);
    }
  };

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
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1>Quản lý khách hàng thân thiết</h1>
              <p className="text-neutral-500 mt-1">Tra cứu và quản lý điểm tích lũy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Tổng khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">{customers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Khách VIP (Gold+)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">
                {customers.filter(c => c.tier === 'Gold' || c.tier === 'Platinum').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tổng chi tiêu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">
                ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer List */}
        <div className="space-y-3">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2>{customer.name}</h2>
                      <Badge className={getTierColor(customer.tier)}>
                        {customer.tier}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-neutral-500">Số điện thoại</p>
                        <p>{customer.phone}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Điểm tích lũy</p>
                        <p className="flex items-center gap-1">
                          <Gift className="w-4 h-4 text-orange-500" />
                          {customer.points} điểm
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Tổng chi tiêu</p>
                        <p>${customer.totalSpent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Số lần ghé thăm</p>
                        <p>{customer.visits} lần</p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
                      <p className="text-sm text-neutral-600">
                        <strong>Ưu đãi:</strong> {getTierBenefits(customer.tier)}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowDialog(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tích điểm
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-neutral-500">Không tìm thấy khách hàng nào</p>
          </Card>
        )}
      </div>

      {/* Add Points Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tích điểm cho khách hàng</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h3>{selectedCustomer.name}</h3>
                <p className="text-neutral-600 mt-1">
                  Điểm hiện tại: {selectedCustomer.points}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="points">Số điểm cộng thêm</Label>
                <Input
                  id="points"
                  type="number"
                  min="0"
                  value={pointsToAdd}
                  onChange={(e) => setPointsToAdd(parseInt(e.target.value) || 0)}
                  placeholder="Nhập số điểm"
                />
              </div>

              {pointsToAdd > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-900">
                    Điểm sau khi cộng: {selectedCustomer.points + pointsToAdd}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDialog(false);
                    setSelectedCustomer(null);
                    setPointsToAdd(0);
                  }}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button onClick={handleAddPoints} className="flex-1" disabled={pointsToAdd <= 0}>
                  Xác nhận
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
