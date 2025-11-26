export enum PaymentStatus {
  PAID = '납부완료',
  PENDING = '대기중',
  OVERDUE = '연체',
}

export enum PaymentType {
  RENT = '월세',
  MAINTENANCE = '관리비',
  DEPOSIT = '보증금',
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  holderName: string;
}

export interface Landlord {
  id: string;
  name: string;
  type: 'Individual' | 'Corporate'; // 개인 / 법인
  registrationNumber: string; // 주민/사업자 번호
  phone: string;
  email?: string;
  bankAccount?: BankAccount;
  memo?: string;
}

export interface Property {
  id: string;
  landlordId: string;
  name: string; // e.g., "선샤인 빌라"
  address: string;
  type: string; // 'Apartment', 'Commercial', 'Office'
  totalFloors: number;
}

export interface Unit {
  id: string;
  propertyId: string;
  floor: number;
  name: string; // e.g., "101호"
  area?: number; // m2
  memo?: string;
}

export interface Tenant {
  id: string;
  unitId: string; // Links to Unit
  name: string;
  type: 'Individual' | 'Corporate';
  registrationNumber?: string;
  phone: string;
  email?: string;
  
  // Contract Details
  deposit: number; // 보증금
  rentAmount: number; // 월세
  maintenanceAmount: number; // 관리비
  leaseStartDate: string;
  leaseEndDate: string;
  
  memo?: string;
}

export interface PaymentRecord {
  id: string;
  tenantId: string;
  date: string; // Due date
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
  paidDate?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  occupancyRate: number;
  overdueCount: number;
  totalUnits: number;
}