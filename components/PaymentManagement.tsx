import React from 'react';
import { PaymentRecord, Tenant, PaymentStatus, PaymentType, Unit, Property } from '../types';
import { CheckCircle, AlertCircle, Clock, Filter } from 'lucide-react';

interface PaymentManagementProps {
  payments: PaymentRecord[];
  tenants: Tenant[];
  units: Unit[];
  properties: Property[];
  onUpdateStatus: (id: string, status: PaymentStatus) => void;
}

const PaymentManagement: React.FC<PaymentManagementProps> = ({ payments, tenants, units, properties, onUpdateStatus }) => {
  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID: return 'bg-emerald-100 text-emerald-800';
      case PaymentStatus.OVERDUE: return 'bg-rose-100 text-rose-800';
      case PaymentStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID: return <CheckCircle size={16} />;
      case PaymentStatus.OVERDUE: return <AlertCircle size={16} />;
      case PaymentStatus.PENDING: return <Clock size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">납부 현황</h2>
        <button className="text-slate-500 hover:text-slate-800 flex items-center gap-2 border px-3 py-1.5 rounded-lg bg-white">
            <Filter size={16} /> 필터
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">납부기한</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">임차 정보</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">종류</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">금액</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">상태</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">관리</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {payments.map(payment => {
                    const tenant = tenants.find(t => t.id === payment.tenantId);
                    const unit = units.find(u => u.id === tenant?.unitId);
                    const property = properties.find(p => p.id === unit?.propertyId);

                    return (
                        <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-slate-600">{payment.date}</td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-900">{tenant?.name}</div>
                                <div className="text-xs text-slate-500">{property?.name} {unit?.name}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${payment.type === PaymentType.RENT ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
                                    {payment.type}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-700">₩{payment.amount.toLocaleString()}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                    {getStatusIcon(payment.status)}
                                    {payment.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {payment.status !== PaymentStatus.PAID && (
                                    <button 
                                        onClick={() => onUpdateStatus(payment.id, PaymentStatus.PAID)}
                                        className="text-emerald-600 hover:text-emerald-800 text-sm font-medium hover:underline"
                                    >
                                        납부 처리
                                    </button>
                                )}
                                {payment.status === PaymentStatus.PAID && (
                                    <span className="text-slate-400 text-sm">완료됨</span>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentManagement;