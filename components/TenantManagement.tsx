import React, { useState } from 'react';
import { Tenant, Property, Unit } from '../types';
import { Plus, Search, Phone, Calendar, MoreHorizontal, Home, DollarSign, FileText, User } from 'lucide-react';

interface TenantManagementProps {
  tenants: Tenant[];
  properties: Property[];
  units: Unit[];
  onAddTenant: (tenant: Tenant) => void;
}

const TenantManagement: React.FC<TenantManagementProps> = ({ tenants, properties, units, onAddTenant }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [newTenant, setNewTenant] = useState<Partial<Tenant>>({
    unitId: '',
    name: '',
    type: 'Individual',
    registrationNumber: '',
    phone: '',
    rentAmount: 0,
    maintenanceAmount: 0,
    deposit: 0,
    leaseStartDate: '',
    leaseEndDate: '',
  });

  const getUnitInfo = (unitId: string) => {
      const unit = units.find(u => u.id === unitId);
      const property = properties.find(p => p.id === unit?.propertyId);
      return { unit, property };
  };

  const filteredTenants = tenants.filter(t => {
      const { unit } = getUnitInfo(t.unitId);
      return t.name.includes(searchTerm) || unit?.name.includes(searchTerm);
  });

  const availableUnits = units.filter(u => 
    u.propertyId === selectedPropertyId && 
    !tenants.some(t => t.unitId === u.id) // Only show vacant units
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTenant.name && newTenant.unitId) {
      onAddTenant({
        ...newTenant as Tenant,
        id: Math.random().toString(36).substr(2, 9),
      });
      setIsModalOpen(false);
      setNewTenant({ 
        unitId: '', name: '', type: 'Individual', registrationNumber: '', phone: '', 
        rentAmount: 0, maintenanceAmount: 0, deposit: 0, leaseStartDate: '', leaseEndDate: '' 
      });
      setSelectedPropertyId('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">임차인/계약 관리</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          임차인 등록
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder="이름 또는 호수 검색..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTenants.map(tenant => {
                const { unit, property } = getUnitInfo(tenant.unitId);
                return (
                    <div key={tenant.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-blue-300 transition-all shadow-sm group">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="text-xs text-slate-500 mb-0.5">{property?.name}</div>
                                <div className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-md text-sm inline-block">
                                    {unit?.name}
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between mb-1">
                             <h3 className="text-lg font-bold text-slate-800">{tenant.name}</h3>
                             <span className="text-xs bg-white border px-1.5 py-0.5 rounded text-slate-500">{tenant.type === 'Individual' ? '개인' : '법인'}</span>
                        </div>
                        
                        <div className="flex items-center text-slate-500 text-sm mb-4">
                            <Phone size={14} className="mr-1" />
                            {tenant.phone}
                        </div>

                        <div className="space-y-2 text-sm border-t border-slate-200 pt-3 group-hover:border-blue-200 transition-colors">
                            <div className="flex justify-between">
                                <span className="text-slate-500 flex items-center gap-1"><Home size={14} />보증금</span>
                                <span className="font-medium">₩{(tenant.deposit / 10000).toLocaleString()}만</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 flex items-center gap-1"><DollarSign size={14} />월세/관리비</span>
                                <span className="font-medium text-blue-600">₩{(tenant.rentAmount/10000).toLocaleString()}만 / ₩{(tenant.maintenanceAmount/10000).toLocaleString()}만</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 flex items-center gap-1"><Calendar size={14} />계약기간</span>
                                <span className="font-medium text-xs text-slate-700">{tenant.leaseStartDate} ~ {tenant.leaseEndDate}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4">새 임차인(계약) 등록</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2"><Home size={16}/> 계약 호실 선택</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">건물</label>
                            <select required className="w-full border rounded-lg p-2 text-sm" value={selectedPropertyId} onChange={e => setSelectedPropertyId(e.target.value)}>
                                <option value="">건물을 선택하세요</option>
                                {properties.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">호실 (공실만 표시)</label>
                            <select required className="w-full border rounded-lg p-2 text-sm" value={newTenant.unitId} onChange={e => setNewTenant({...newTenant, unitId: e.target.value})} disabled={!selectedPropertyId}>
                                <option value="">호실을 선택하세요</option>
                                {availableUnits.map(u => (
                                    <option key={u.id} value={u.id}>{u.floor}층 {u.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">임차인 유형</label>
                        <select className="w-full border rounded-lg p-2" value={newTenant.type} onChange={e => setNewTenant({...newTenant, type: e.target.value as any})}>
                            <option value="Individual">개인</option>
                            <option value="Corporate">법인</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">이름</label>
                        <input required type="text" className="w-full border rounded-lg p-2" value={newTenant.name} onChange={e => setNewTenant({...newTenant, name: e.target.value})} placeholder="홍길동" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">주민/사업자 번호</label>
                    <input type="text" className="w-full border rounded-lg p-2" value={newTenant.registrationNumber} onChange={e => setNewTenant({...newTenant, registrationNumber: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">연락처</label>
                    <input required type="tel" className="w-full border rounded-lg p-2" value={newTenant.phone} onChange={e => setNewTenant({...newTenant, phone: e.target.value})} placeholder="010-0000-0000" />
                </div>
                
                <div className="border-t border-slate-100 my-4"></div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">보증금</label>
                        <input required type="number" className="w-full border rounded-lg p-2" value={newTenant.deposit || ''} onChange={e => setNewTenant({...newTenant, deposit: Number(e.target.value)})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">월세</label>
                        <input required type="number" className="w-full border rounded-lg p-2" value={newTenant.rentAmount || ''} onChange={e => setNewTenant({...newTenant, rentAmount: Number(e.target.value)})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">관리비</label>
                        <input required type="number" className="w-full border rounded-lg p-2" value={newTenant.maintenanceAmount || ''} onChange={e => setNewTenant({...newTenant, maintenanceAmount: Number(e.target.value)})} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">계약 시작일</label>
                        <input required type="date" className="w-full border rounded-lg p-2" value={newTenant.leaseStartDate} onChange={e => setNewTenant({...newTenant, leaseStartDate: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">계약 종료일</label>
                        <input required type="date" className="w-full border rounded-lg p-2" value={newTenant.leaseEndDate} onChange={e => setNewTenant({...newTenant, leaseEndDate: e.target.value})} />
                    </div>
                </div>
                <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">취소</button>
                    <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">등록</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagement;