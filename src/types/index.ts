/**
 * Definições de Tipos para o Sistema de Gestão de Manutenção Veicular
 * e para a Especificação Técnica Arquitetural.
 */

export type MaintenanceType = 'troca_oleo' | 'rodizio_pneus' | 'preventiva' | 'corretiva';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  currentMileage: number;
  color?: string;
  fuelType?: 'flex' | 'gasolina' | 'etanol' | 'diesel' | 'eletrico' | 'hibrido';
  primaryDriverId?: string;
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string; // CNH
  phone: string;
  email: string;
  associatedVehicleIds: string[];
  isPrimary?: boolean;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: MaintenanceType;
  title: string;
  description?: string;
  date: string; // ISO date string YYYY-MM-DD
  mileageAtService: number;
  cost: number;
  serviceProvider?: string;
  receiptNumber?: string;
  nextScheduledMileage?: number; // Para troca de óleo ou rodízio
  nextScheduledDate?: string; // Para tempo (ex: 6 meses)
  createdAt: string;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: string;
  mileage: number;
  liters: number;
  totalCost: number;
  fuelType: 'gasolina' | 'etanol' | 'diesel';
  isFullTank: boolean;
}

export interface MaintenanceReminder {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  type: MaintenanceType;
  title: string;
  targetMileage?: number;
  targetDate?: string;
  currentMileage: number;
  kmRemaining?: number;
  daysRemaining?: number;
  urgency: 'ok' | 'warning' | 'critical';
  reason: string;
}

export interface DefensiveDrivingTip {
  id: string;
  category: 'condicoes_adversas' | 'inspecao_veicular' | 'comportamento' | 'distancias_seguranca';
  title: string;
  summary: string;
  content: string[];
  keyAction: string;
  iconName: string;
}

export interface SectionSpec {
  id: string;
  title: string;
  badge: string;
  summary: string;
}
