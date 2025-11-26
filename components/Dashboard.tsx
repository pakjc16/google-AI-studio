import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tenant, PaymentRecord, PaymentStatus, Unit, Property } from '../types';
import { DollarSign, Users, AlertCircle, Home } from 'lucide-react';

interface DashboardProps {
  tenants: Tenant[];
  payments: PaymentRecord[];
  units: Unit[];
  properties: Property[];
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color} text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ tenants, payments, units, properties }) => {
  // Calculate Stats
  const totalMonthlyPotential = tenants.reduce((acc, t) => acc + t.rentAmount + t.maintenanceAmount, 0);
  const totalCollectedThisMonth = payments
    .filter(p => p.status === PaymentStatus.PAID && p.date.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((acc, p) => acc + p.amount, 0);
  
  const overdueCount = payments.filter(p => p.status === PaymentStatus.OVERDUE).length;
  // Occupancy rate calculation (Tenants / Total Units * 100)
  const occupancyRate = units.length > 0 ? (tenants.length / units.length) * 100 : 0;

  // Chart Data Preparation (Mock monthly trend)
  const chartData = [
    { name: '1월', 수입: totalMonthlyPotential * 0.9, 예상: totalMonthlyPotential },
    { name: '2월', 수입: totalMonthlyPotential * 0.95, 예상: totalMonthlyPotential },
    { name: '3월', 수입: totalMonthlyPotential * 0.8, 예상: totalMonthlyPotential },
    { name: '4월', 수입: totalMonthlyPotential, 예상: totalMonthlyPotential },
    { name: '5월', 수입: totalCollectedThisMonth, 예상: totalMonthlyPotential },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="이번 달 예상 수익" 
          value={`₩${totalMonthlyPotential.toLocaleString()}`} 
          icon={<DollarSign size={24} />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="현재 입주율" 
          value={`${occupancyRate.toFixed(1)}%`} 
          icon={<Home size={24} />} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="미납 건수" 
          value={`${overdueCount}건`} 
          icon={<AlertCircle size={24} />} 
          color="bg-rose-500" 
        />
        <StatCard 
          title="총 관리 호실" 
          value={`${units.length}개`} 
          icon={<Users size={24} />} 
          color="bg-indigo-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">월별 수입 현황</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => `₩${value.toLocaleString()}`} />
                <Bar dataKey="예상" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="수입" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">최근 미납 현황</h3>
          <div className="space-y-4">
            {payments.filter(p => p.status === PaymentStatus.OVERDUE).slice(0, 5).map(p => {
              const tenant = tenants.find(t => t.id === p.tenantId);
              const unit = units.find(u => u.id === tenant?.unitId);
              const property = properties.find(prop => prop.id === unit?.propertyId);
              
              return (
                <div key={p.id} className="flex items-center justify-between p-3 bg-rose-50 rounded-lg border border-rose-100">
                  <div>
                    <p className="font-medium text-rose-900">{tenant?.name} ({unit?.name})</p>
                    <p className="text-xs text-rose-700">{property?.name}</p>
                  </div>
                  <span className="font-bold text-rose-600">₩{p.amount.toLocaleString()}</span>
                </div>
              );
            })}
            {payments.filter(p => p.status === PaymentStatus.OVERDUE).length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">미납 내역이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;