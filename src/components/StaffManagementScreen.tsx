import { Staff } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Plus, UserCog } from 'lucide-react';

interface StaffManagementScreenProps {
  staff: Staff[];
  onStaffUpdate: (staff: Staff[]) => void;
  onBack: () => void;
}

export default function StaffManagementScreen({ staff, onStaffUpdate, onBack }: StaffManagementScreenProps) {
  const getRoleBadge = (role: Staff['role']) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-700',
      manager: 'bg-blue-100 text-blue-700',
      waitstaff: 'bg-green-100 text-green-700',
      kitchen: 'bg-orange-100 text-orange-700',
      cashier: 'bg-yellow-100 text-yellow-700',
      receptionist: 'bg-pink-100 text-pink-700',
    };
    return colors[role] || 'bg-neutral-100 text-neutral-700';
  };

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
              <h1>Quản lý nhân viên & Phân ca</h1>
              <p className="text-neutral-500 mt-1">Tạo hồ sơ, tài khoản & xếp lịch làm việc</p>
            </div>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm nhân viên
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {staff.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{member.name}</CardTitle>
                    <p className="text-sm text-neutral-500 mt-1">ID: {member.id}</p>
                  </div>
                  <Badge className={getRoleBadge(member.role)}>
                    {member.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-neutral-500">Điện thoại</p>
                    <p>{member.phone}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Email</p>
                    <p>{member.email}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Tài khoản</p>
                    <p>{member.username}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Trạng thái</p>
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-2">Ca làm việc</p>
                  <div className="flex gap-2">
                    {member.shifts.map((shift) => (
                      <Badge key={shift} variant="outline">{shift}</Badge>
                    ))}
                  </div>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  <UserCog className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
