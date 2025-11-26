import React, { useState, useEffect, useRef } from 'react';
import { Property, Landlord, Unit, Tenant } from '../types';
import { Building, MapPin, Plus, Layers, Search, User, DollarSign, X } from 'lucide-react';

interface PropertyManagementProps {
  properties: Property[];
  landlords: Landlord[];
  units: Unit[];
  tenants?: Tenant[];
  onAddProperty: (property: Property) => void;
  onAddUnit: (unit: Unit) => void;
}

declare global {
    interface Window {
        daum: any;
    }
}

const PropertyManagement: React.FC<PropertyManagementProps> = ({ properties, landlords, units, tenants = [], onAddProperty, onAddUnit }) => {
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isAddressSearchOpen, setIsAddressSearchOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const addressLayerRef = useRef<HTMLDivElement>(null);
  
  // Property Form State
  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    name: '',
    address: '',
    landlordId: '',
    type: 'Villa',
    totalFloors: 1,
  });

  // Unit Form State
  const [newUnit, setNewUnit] = useState<Partial<Unit>>({
    name: '',
    floor: 1,
    area: undefined,
    memo: '',
  });

  // Address Search Effect
  useEffect(() => {
    if (isAddressSearchOpen && addressLayerRef.current && window.daum && window.daum.Postcode) {
        new window.daum.Postcode({
            oncomplete: function(data: any) {
                let fullAddress = data.roadAddress || data.jibunAddress;
                let extraAddress = '';

                if (data.userSelectedType === 'R') {
                    if (data.bname !== '') extraAddress += data.bname;
                    if (data.buildingName !== '') extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
                    fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
                }

                setNewProperty(prev => ({ ...prev, address: fullAddress }));
                setIsAddressSearchOpen(false);
            },
            width: '100%',
            height: '100%',
        }).embed(addressLayerRef.current);
    }
  }, [isAddressSearchOpen]);

  const handlePropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProperty.name && newProperty.address && newProperty.landlordId) {
      onAddProperty({
        ...newProperty as Property,
        id: Math.random().toString(36).substr(2, 9),
      });
      setIsPropertyModalOpen(false);
      setNewProperty({ name: '', address: '', landlordId: '', type: 'Villa', totalFloors: 1 });
    }
  };

  const handleUnitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPropertyId && newUnit.name && newUnit.floor) {
        onAddUnit({
            ...newUnit as Unit,
            propertyId: selectedPropertyId,
            id: Math.random().toString(36).substr(2, 9),
        });
        setIsUnitModalOpen(false);
        setNewUnit({ name: '', floor: 1, area: undefined, memo: '' });
    }
  };

  const getUnitsByProperty = (propId: string) => {
      return units.filter(u => u.propertyId === propId).sort((a, b) => b.floor - a.floor || a.name.localeCompare(b.name));
  };

  const getTenantForUnit = (unitId: string) => {
      return tenants.find(t => t.unitId === unitId);
  };

  const inputClass = "w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">부동산 정보 관리</h2>
        <button 
          onClick={() => setIsPropertyModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          건물 등록
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Property List (Left) */}
          <div className="lg:col-span-4 space-y-4">
            {properties.map(property => {
                const landlord = landlords.find(l => l.id === property.landlordId);
                const isSelected = selectedPropertyId === property.id;

                return (
                    <div 
                        key={property.id} 
                        className={`bg-white rounded-xl shadow-sm border transition-all cursor-pointer ${isSelected ? 'border-blue-500 ring-2 ring-blue-500' : 'border-slate-200 hover:border-blue-300'}`}
                        onClick={() => setSelectedPropertyId(property.id)}
                    >
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <Building className={isSelected ? "text-blue-600" : "text-slate-400"} size={20} />
                                    <h3 className="text-lg font-bold text-slate-900">{property.name}</h3>
                                </div>
                                <span className="text-xs font-medium px-2 py-1 bg-slate-50 border border-slate-200 rounded-full text-slate-600">{property.type}</span>
                            </div>
                            <div className="text-sm text-slate-600 space-y-1 mb-4">
                                <p className="flex items-center gap-2 text-xs text-slate-500"><MapPin size={12} /> {property.address}</p>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                                <span className="text-slate-600 font-medium">임대인: {landlord?.name}</span>
                                <span className="flex items-center gap-1">
                                    <Layers size={12} /> {property.totalFloors}개 층
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
            {properties.length === 0 && (
                <div className="text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500">등록된 건물이 없습니다.</p>
                </div>
            )}
          </div>

          {/* Unit Management Panel (Right) */}
          <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[600px] flex flex-col">
            {selectedPropertyId ? (
                <>
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">
                                {properties.find(p => p.id === selectedPropertyId)?.name} 
                                <span className="text-sm font-normal text-slate-500 ml-2">호실 및 계약 현황</span>
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">층별로 호실의 임대 상태를 한눈에 확인하세요.</p>
                        </div>
                        <button 
                            onClick={() => setIsUnitModalOpen(true)}
                            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors shadow-sm"
                        >
                            <Plus size={16} /> 호실 추가
                        </button>
                    </div>

                    <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                        {Array.from(new Set(getUnitsByProperty(selectedPropertyId).map(u => u.floor))).sort((a: number, b: number) => b - a).map(floor => (
                            <div key={floor} className="relative pl-12">
                                <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                                    <span className="text-slate-500 font-bold text-sm">{floor}F</span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    {getUnitsByProperty(selectedPropertyId).filter(u => u.floor === floor).map(unit => {
                                        const tenant = getTenantForUnit(unit.id);
                                        return (
                                            <div key={unit.id} className={`group border rounded-xl p-4 transition-all shadow-sm ${tenant ? 'bg-blue-50/30 border-blue-200 hover:border-blue-400' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-bold text-slate-800 flex items-center gap-2">
                                                        {unit.name}
                                                        {unit.area && <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{unit.area}m²</span>}
                                                    </div>
                                                    {tenant ? (
                                                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">임대중</span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">공실</span>
                                                    )}
                                                </div>

                                                {tenant ? (
                                                    <div className="space-y-1.5 mt-3">
                                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                                            <User size={14} className="text-blue-600" />
                                                            {tenant.name}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white/50 p-1 rounded">
                                                            <DollarSign size={12} className="text-slate-400" />
                                                            보 {(tenant.deposit / 10000).toLocaleString()} / 월 {(tenant.rentAmount / 10000).toLocaleString()}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 mt-1 pl-1">
                                                            만료일: {tenant.leaseEndDate}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="mt-3 flex flex-col justify-center h-[60px] text-center border-t border-dashed border-slate-200 pt-2">
                                                        <p className="text-xs text-slate-400">현재 임차인 없음</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                        {getUnitsByProperty(selectedPropertyId).length === 0 && (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                <Layers size={48} className="mb-4 opacity-20" />
                                <p>등록된 호실이 없습니다. '호실 추가' 버튼을 눌러주세요.</p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <Building size={64} className="mb-6 opacity-10" />
                    <p className="text-lg font-medium text-slate-500">관리할 건물을 선택해주세요.</p>
                    <p className="text-sm">좌측 목록에서 건물을 선택하면 층별 호실 현황을 볼 수 있습니다.</p>
                </div>
            )}
          </div>
      </div>

      {/* Property Modal */}
      {isPropertyModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl overflow-hidden">
            <h3 className="text-xl font-bold mb-4 text-slate-900">새 건물 등록</h3>
            <form onSubmit={handlePropertySubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">건물명</label>
                    <input required type="text" className={inputClass} value={newProperty.name} onChange={e => setNewProperty({...newProperty, name: e.target.value})} placeholder="예: 선샤인 빌라" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">임대인 (소유주)</label>
                    <select required className={inputClass} value={newProperty.landlordId} onChange={e => setNewProperty({...newProperty, landlordId: e.target.value})}>
                        <option value="">선택해주세요</option>
                        {landlords.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">주소</label>
                    <div className="flex gap-2">
                        <input 
                            required 
                            readOnly 
                            type="text" 
                            className={`${inputClass} bg-slate-50 cursor-pointer`}
                            value={newProperty.address} 
                            placeholder="주소 검색 버튼을 눌러주세요"
                            onClick={() => setIsAddressSearchOpen(true)}
                        />
                        <button type="button" onClick={() => setIsAddressSearchOpen(true)} className="bg-slate-800 hover:bg-slate-900 text-white px-3 rounded-lg flex-shrink-0 transition-colors shadow-sm">
                            <Search size={18} />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">건물 유형</label>
                        <select className={inputClass} value={newProperty.type} onChange={e => setNewProperty({...newProperty, type: e.target.value})}>
                            <option value="Villa">빌라/다세대</option>
                            <option value="Apartment">아파트</option>
                            <option value="Commercial">상가</option>
                            <option value="Office">오피스텔</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">총 층수</label>
                        <input type="number" className={inputClass} value={newProperty.totalFloors} onChange={e => setNewProperty({...newProperty, totalFloors: Number(e.target.value)})} />
                    </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100 mt-2">
                    <button type="button" onClick={() => setIsPropertyModalOpen(false)} className="flex-1 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700 transition-colors">취소</button>
                    <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md transition-colors">등록하기</button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* Unit Modal */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-slate-900">호실 추가</h3>
            <form onSubmit={handleUnitSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">호실명 (예: 101호)</label>
                    <input required type="text" className={inputClass} value={newUnit.name} onChange={e => setNewUnit({...newUnit, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">해당 층</label>
                        <input required type="number" className={inputClass} value={newUnit.floor} onChange={e => setNewUnit({...newUnit, floor: Number(e.target.value)})} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">전용면적 (m²)</label>
                        <input type="number" className={inputClass} value={newUnit.area || ''} onChange={e => setNewUnit({...newUnit, area: Number(e.target.value)})} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">메모</label>
                    <textarea className={inputClass} value={newUnit.memo} onChange={e => setNewUnit({...newUnit, memo: e.target.value})} rows={3} />
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100 mt-2">
                    <button type="button" onClick={() => setIsUnitModalOpen(false)} className="flex-1 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700 transition-colors">취소</button>
                    <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md transition-colors">추가하기</button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* Address Search Modal (Embedded) */}
      {isAddressSearchOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl w-full max-w-md h-[500px] flex flex-col shadow-2xl overflow-hidden relative">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800">주소 검색</h3>
                    <button onClick={() => setIsAddressSearchOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-1 w-full relative" ref={addressLayerRef}>
                    {/* Daum Postcode will be embedded here */}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;