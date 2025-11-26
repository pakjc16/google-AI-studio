import { Tenant, PaymentRecord, PaymentStatus, PaymentType, Landlord, Property, Unit } from './types';

export const INITIAL_LANDLORDS: Landlord[] = [
  {
    id: 'l1',
    name: '김건물',
    type: 'Individual',
    registrationNumber: '800101-1234567',
    phone: '010-1111-2222',
    bankAccount: {
      bankName: '신한은행',
      accountNumber: '110-123-456789',
      holderName: '김건물'
    },
    memo: '주요 고객',
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop1',
    landlordId: 'l1',
    name: '강남 선샤인 빌라',
    address: '서울특별시 강남구 테헤란로 123 (역삼동)',
    type: 'Villa',
    totalFloors: 4,
  }
];

export const INITIAL_UNITS: Unit[] = [
  { id: 'u101', propertyId: 'prop1', floor: 1, name: '101호' },
  { id: 'u202', propertyId: 'prop1', floor: 2, name: '202호' },
  { id: 'u305', propertyId: 'prop1', floor: 3, name: '305호' },
  { id: 'u401', propertyId: 'prop1', floor: 4, name: '401호' },
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 't1',
    unitId: 'u101',
    name: '김철수',
    type: 'Individual',
    phone: '010-1234-5678',
    deposit: 50000000,
    rentAmount: 600000,
    maintenanceAmount: 50000,
    leaseStartDate: '2023-01-01',
    leaseEndDate: '2025-01-01',
    memo: '반려견 있음',
  },
  {
    id: 't2',
    unitId: 'u202',
    name: '이영희',
    type: 'Individual',
    phone: '010-9876-5432',
    deposit: 30000000,
    rentAmount: 450000,
    maintenanceAmount: 50000,
    leaseStartDate: '2023-06-15',
    leaseEndDate: '2025-06-15',
  },
  {
    id: 't3',
    unitId: 'u305',
    name: '박민수',
    type: 'Individual',
    phone: '010-5555-4444',
    deposit: 10000000,
    rentAmount: 800000,
    maintenanceAmount: 100000,
    leaseStartDate: '2024-01-01',
    leaseEndDate: '2025-01-01',
  },
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'p1',
    tenantId: 't1',
    date: '2024-05-01',
    type: PaymentType.RENT,
    amount: 600000,
    status: PaymentStatus.PAID,
    paidDate: '2024-05-01',
  },
  {
    id: 'p2',
    tenantId: 't1',
    date: '2024-05-01',
    type: PaymentType.MAINTENANCE,
    amount: 50000,
    status: PaymentStatus.PAID,
    paidDate: '2024-05-01',
  },
  {
    id: 'p3',
    tenantId: 't2',
    date: '2024-05-15',
    type: PaymentType.RENT,
    amount: 450000,
    status: PaymentStatus.OVERDUE,
  },
  {
    id: 'p4',
    tenantId: 't3',
    date: '2024-05-01',
    type: PaymentType.RENT,
    amount: 800000,
    status: PaymentStatus.PENDING,
  },
];