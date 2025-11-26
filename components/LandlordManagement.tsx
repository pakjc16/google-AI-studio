import React, { useState } from 'react';
import { Landlord } from '../types';
import { Plus, User, Phone, Mail, MoreHorizontal, CreditCard, FileText } from 'lucide-react';

interface LandlordManagementProps {
  landlords: Landlord[];
  onAddLandlord: (landlord: Landlord) => void;
}

const LandlordManagement: React.FC<LandlordManagementProps> = ({ landlords, onAddLandlord }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLandlord, setNewLandlord] = useState<Partial<Landlord>>({
    name: '',
    type: 'Individual',
    registrationNumber: '',
    phone: '',
    email: '',
    bankAccount: { bankName: '', accountNumber: '', holderName: '' },
    memo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLandlord.name && newLandlord.phone) {
      onAddLandlord({
        ...newLandlord as Landlord,
        id: Math.random().toString(36).substr(2, 9),
      });
      setIsModalOpen(false);
      setNewLandlord({
        name: '', type: 'Individual', registrationNumber: '', phone: '', email: '', 
        bankAccount: { bankName: '', accountNumber: '', holderName: '' }, memo: '' 
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">임대인 관리</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          임대인 등록
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {landlords.map(landlord => (
          <div key={landlord.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <User size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{landlord.name}</h3>
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                            {landlord.type === 'Individual' ? '개인' : '법인'}
                        </span>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal size={20} />
                </button>
            </div>
            
            <div className="space-y-3 text-sm text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    {landlord.phone}
                </div>
                {landlord.email && (
                    <div className="flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" />
                        {landlord.email}
                    </div>
                )}
                 {landlord.bankAccount?.accountNumber && (
                    <div className="flex items-center gap-2">
                        <CreditCard size={14} className="text-slate-400" />
                        {landlord.bankAccount.bankName} {landlord.bankAccount.accountNumber}
                    </div>
                )}
                {landlord.registrationNumber && (
                    <div className="flex items-center gap-2">
                        <FileText size={14} className="text-slate-400" />
                        {landlord.registrationNumber}
                    </div>
                )}
            </div>

            {landlord.memo && (
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    {landlord.memo}
                </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4">임대인 등록</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">유형</label>
                    <select className="w-full border rounded-lg p-2" value={newLandlord.type} onChange={e => setNewLandlord({...newLandlord, type: e.target.value as any})}>
                        <option value="Individual">개인</option>
                        <option value="Corporate">법인</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">이름/상호명</label>
                    <input required type="text" className="w-full border rounded-lg p-2" value={newLandlord.name} onChange={e => setNewLandlord({...newLandlord, name: e.target.value})} placeholder="홍길동" />
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">주민/사업자 번호</label>
                <input type="text" className="w-full border rounded-lg p-2" value={newLandlord.registrationNumber} onChange={e => setNewLandlord({...newLandlord, registrationNumber: e.target.value})} placeholder="000000-0000000" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">연락처</label>
                    <input required type="tel" className="w-full border rounded-lg p-2" value={newLandlord.phone} onChange={e => setNewLandlord({...newLandlord, phone: e.target.value})} placeholder="010-0000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">이메일</label>
                    <input type="email" className="w-full border rounded-lg p-2" value={newLandlord.email} onChange={e => setNewLandlord({...newLandlord, email: e.target.value})} placeholder="email@example.com" />
                  </div>
              </div>

              <div className="border-t border-slate-100 pt-2 mt-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">계좌 정보</label>
                  <div className="grid grid-cols-3 gap-2">
                      <input type="text" className="border rounded-lg p-2" placeholder="은행명" value={newLandlord.bankAccount?.bankName} onChange={e => setNewLandlord({...newLandlord, bankAccount: {...newLandlord.bankAccount!, bankName: e.target.value}})} />
                      <input type="text" className="col-span-2 border rounded-lg p-2" placeholder="계좌번호" value={newLandlord.bankAccount?.accountNumber} onChange={e => setNewLandlord({...newLandlord, bankAccount: {...newLandlord.bankAccount!, accountNumber: e.target.value}})} />
                  </div>
                  <input type="text" className="w-full border rounded-lg p-2 mt-2" placeholder="예금주" value={newLandlord.bankAccount?.holderName} onChange={e => setNewLandlord({...newLandlord, bankAccount: {...newLandlord.bankAccount!, holderName: e.target.value}})} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">메모</label>
                <textarea className="w-full border rounded-lg p-2" value={newLandlord.memo} onChange={e => setNewLandlord({...newLandlord, memo: e.target.value})} rows={2} />
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

export default LandlordManagement;