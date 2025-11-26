import React, { useState } from 'react';
import { LayoutDashboard, Users, CreditCard, Bot, Building, User, MapPin } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TenantManagement from './components/TenantManagement';
import PaymentManagement from './components/PaymentManagement';
import LandlordManagement from './components/LandlordManagement';
import PropertyManagement from './components/PropertyManagement';
import AIAssistant from './components/AIAssistant';
import { INITIAL_TENANTS, INITIAL_PAYMENTS, INITIAL_LANDLORDS, INITIAL_PROPERTIES, INITIAL_UNITS } from './constants';
import { Tenant, PaymentRecord, PaymentStatus, Landlord, Property, Unit } from './types';

enum View {
  DASHBOARD = 'dashboard',
  LANDLORDS = 'landlords',
  PROPERTIES = 'properties',
  TENANTS = 'tenants',
  PAYMENTS = 'payments',
  AI = 'ai',
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  
  // State
  const [landlords, setLandlords] = useState<Landlord[]>(INITIAL_LANDLORDS);
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);

  // Handlers
  const handleAddLandlord = (newItem: Landlord) => setLandlords([...landlords, newItem]);
  const handleAddProperty = (newItem: Property) => setProperties([...properties, newItem]);
  const handleAddUnit = (newItem: Unit) => setUnits([...units, newItem]);
  const handleAddTenant = (newTenant: Tenant) => setTenants([...tenants, newTenant]);

  const handleUpdatePaymentStatus = (id: string, status: PaymentStatus) => {
    setPayments(payments.map(p => 
      p.id === id ? { ...p, status, paidDate: status === PaymentStatus.PAID ? new Date().toISOString().split('T')[0] : undefined } : p
    ));
  };

  const SidebarItem: React.FC<{ view: View; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        currentView === view 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-500 hover:bg-white hover:text-slate-800'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-6 fixed md:relative z-10 h-auto md:h-screen overflow-y-auto">
        <div className="flex items-center gap-2 text-2xl font-bold text-slate-800 px-2">
          <Building className="text-blue-600" />
          <span>EstateFlow</span>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <SidebarItem view={View.DASHBOARD} icon={<LayoutDashboard size={20} />} label="대시보드" />
          <div className="my-2 border-t border-slate-200 mx-2"></div>
          <SidebarItem view={View.LANDLORDS} icon={<User size={20} />} label="임대인 관리" />
          <SidebarItem view={View.PROPERTIES} icon={<MapPin size={20} />} label="부동산/호실 관리" />
          <SidebarItem view={View.TENANTS} icon={<Users size={20} />} label="임차인/계약" />
          <SidebarItem view={View.PAYMENTS} icon={<CreditCard size={20} />} label="납부 관리" />
          <div className="my-2 border-t border-slate-200 mx-2"></div>
          <SidebarItem view={View.AI} icon={<Bot size={20} />} label="AI 비서" />
        </nav>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-600 font-semibold mb-1">PRO TIP</p>
          <p className="text-sm text-slate-600">AI 비서에게 미납 안내 문자를 작성해달라고 요청해보세요.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {currentView === View.DASHBOARD && (
            <Dashboard 
                tenants={tenants} 
                payments={payments} 
                units={units}
                properties={properties}
            />
          )}
          {currentView === View.LANDLORDS && (
            <LandlordManagement 
                landlords={landlords} 
                onAddLandlord={handleAddLandlord} 
            />
          )}
          {currentView === View.PROPERTIES && (
            <PropertyManagement 
                properties={properties} 
                landlords={landlords} 
                units={units}
                tenants={tenants}
                onAddProperty={handleAddProperty}
                onAddUnit={handleAddUnit}
            />
          )}
          {currentView === View.TENANTS && (
            <TenantManagement 
                tenants={tenants} 
                properties={properties} 
                units={units}
                onAddTenant={handleAddTenant} 
            />
          )}
          {currentView === View.PAYMENTS && (
            <PaymentManagement 
                payments={payments} 
                tenants={tenants} 
                units={units}
                properties={properties}
                onUpdateStatus={handleUpdatePaymentStatus} 
            />
          )}
          {currentView === View.AI && (
            <AIAssistant 
                tenants={tenants} 
                payments={payments} 
                units={units}
                properties={properties}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;