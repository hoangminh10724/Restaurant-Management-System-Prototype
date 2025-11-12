import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export interface CostData {
  rent: number;
  salary: number;
  utilities: number;
  marketing: number;
  other: number;
}

export interface OperatingCosts {
  [period: string]: CostData; // period is "YYYY-MM"
}

interface CostManagementScreenProps {
  costs: OperatingCosts;
  onSave: (period: string, data: CostData) => void;
  onBack: () => void;
}

export default function CostManagementScreen({ costs, onSave, onBack }: CostManagementScreenProps) {
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7)); // Default to current month "YYYY-MM"
  const [formData, setFormData] = useState<CostData>({
    rent: 0,
    salary: 0,
    utilities: 0,
    marketing: 0,
    other: 0,
  });

  useEffect(() => {
    // Load existing data when period changes
    setFormData(costs[period] || { rent: 0, salary: 0, utilities: 0, marketing: 0, other: 0 });
  }, [period, costs]);

  const handleInputChange = (field: keyof CostData, value: string) => {
    const numberValue = parseFloat(value) || 0;
    if (numberValue < 0) {
      toast.error("Dữ liệu không hợp lệ. Vui lòng chỉ nhập số dương.");
      return;
    }
    setFormData(prev => ({ ...prev, [field]: numberValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(period, formData);
    toast.success(`Đã lưu chi phí cho kỳ ${period}.`);
    onBack();
  };
  
  const totalCost = Object.values(formData).reduce((sum, value) => sum + value, 0);

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
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" />Quay lại</Button>
            <div><h1>Quản lý chi phí vận hành</h1><p className="text-neutral-500 mt-1">Nhập chi phí cho từng kỳ báo cáo</p></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-8 px-6">
        <Card>
          <CardHeader>
            <CardTitle>Biểu mẫu chi phí</CardTitle>
            <CardDescription>Chọn kỳ và nhập số tiền cho các hạng mục chi phí.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="period">Chọn kỳ báo cáo</Label>
                <Input
                  id="period"
                  type="month"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full md:w-1/2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rent">Chi phí thuê mặt bằng</Label>
                  <Input id="rent" type="number" min="0" value={formData.rent} onChange={(e) => handleInputChange('rent', e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Chi phí lương nhân viên</Label>
                  <Input id="salary" type="number" min="0" value={formData.salary} onChange={(e) => handleInputChange('salary', e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utilities">Chi phí Điện/Nước/Internet</Label>
                  <Input id="utilities" type="number" min="0" value={formData.utilities} onChange={(e) => handleInputChange('utilities', e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketing">Chi phí Marketing</Label>
                  <Input id="marketing" type="number" min="0" value={formData.marketing} onChange={(e) => handleInputChange('marketing', e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="other">Chi phí khác</Label>
                  <Input id="other" type="number" min="0" value={formData.other} onChange={(e) => handleInputChange('other', e.target.value)} placeholder="0" />
                </div>
              </div>
              
              <div className="bg-neutral-100 p-4 rounded-lg text-right">
                <p className="text-lg font-bold">Tổng chi phí kỳ này: ${totalCost.toFixed(2)}</p>
              </div>

              <Button type="submit" className="w-full">Lưu chi phí</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
