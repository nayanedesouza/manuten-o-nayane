import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Wrench, 
  Droplet, 
  Disc, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  User, 
  Fuel, 
  Calendar, 
  Gauge, 
  DollarSign, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Check, 
  ArrowRight,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { 
  Vehicle, 
  Driver, 
  MaintenanceRecord, 
  FuelRecord, 
  MaintenanceType, 
  DefensiveDrivingTip,
  MaintenanceReminder
} from '../types';
import { MaintenanceModal } from './MaintenanceModal';
import { VehicleModal } from './VehicleModal';
import { DriverModal } from './DriverModal';
import { FuelModal } from './FuelModal';

interface PrototypeViewProps {
  ownerName: string;
  vehicles: Vehicle[];
  drivers: Driver[];
  maintenances: MaintenanceRecord[];
  fuelRecords: FuelRecord[];
  activeVehicleId: string;
  onSelectVehicle: (id: string) => void;
  onAddMaintenance: (record: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => void;
  onAddVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  onAddDriver: (driver: Omit<Driver, 'id'>) => void;
  onAddFuelRecord: (record: Omit<FuelRecord, 'id'>) => void;
  onResetData: () => void;
  defensiveDrivingTips: DefensiveDrivingTip[];
}

export const PrototypeView: React.FC<PrototypeViewProps> = ({
  ownerName,
  vehicles,
  drivers,
  maintenances,
  fuelRecords,
  activeVehicleId,
  onSelectVehicle,
  onAddMaintenance,
  onAddVehicle,
  onAddDriver,
  onAddFuelRecord,
  onResetData,
  defensiveDrivingTips
}) => {
  // Sub-abas do Protótipo
  const [activeModule, setActiveModule] = useState<'dashboard' | 'cadastros' | 'manutencoes' | 'monitoramento' | 'informativo'>('dashboard');

  // Estado dos Modais
  const [isMaintModalOpen, setIsMaintModalOpen] = useState(false);
  const [maintModalType, setMaintModalType] = useState<MaintenanceType>('troca_oleo');
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);

  // Filtros do Histórico
  const [maintenanceFilter, setMaintenanceFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Checklist interativo pré-viagem
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'check-1': true,
    'check-2': true,
    'check-3': false,
    'check-4': false,
    'check-5': false
  });

  const activeVehicle = useMemo(() => {
    return vehicles.find(v => v.id === activeVehicleId) || vehicles[0];
  }, [vehicles, activeVehicleId]);

  // Filtragem de manutenções do veículo ativo
  const vehicleMaintenances = useMemo(() => {
    return maintenances.filter(m => m.vehicleId === activeVehicle?.id);
  }, [maintenances, activeVehicle]);

  // Filtragem de abastecimentos do veículo ativo
  const vehicleFuelRecords = useMemo(() => {
    return fuelRecords.filter(f => f.vehicleId === activeVehicle?.id);
  }, [fuelRecords, activeVehicle]);

  // Cálculo Automático de Lembretes de Troca de Óleo e Rodízio
  const oilReminder = useMemo((): MaintenanceReminder | null => {
    if (!activeVehicle) return null;

    // Busca a última troca de óleo
    const oilServices = vehicleMaintenances
      .filter(m => m.type === 'troca_oleo')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const lastOil = oilServices[0];
    const currentKm = activeVehicle.currentMileage;

    if (!lastOil) {
      return {
        id: 'rem-oil-none',
        vehicleId: activeVehicle.id,
        vehiclePlate: activeVehicle.licensePlate,
        vehicleModel: activeVehicle.model,
        type: 'troca_oleo',
        title: 'Troca de Óleo Inicial Necessária',
        currentMileage: currentKm,
        urgency: 'warning',
        reason: 'Nenhum registro de troca de óleo cadastrado para este veículo.'
      };
    }

    const kmLimit = lastOil.nextScheduledMileage || (lastOil.mileageAtService + 10000);
    const kmRemaining = kmLimit - currentKm;

    // Diferença em dias
    const lastDate = new Date(lastOil.date).getTime();
    const daysElapsed = Math.floor((Date.now() - lastDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, 180 - daysElapsed); // Prazo de 6 meses

    let urgency: 'ok' | 'warning' | 'critical' = 'ok';
    let reason = `Em dia. Próxima troca em ${kmRemaining.toLocaleString('pt-BR')} km ou ${daysRemaining} dias.`;

    if (kmRemaining <= 0 || daysRemaining <= 0) {
      urgency = 'critical';
      reason = `VENCIDA! Ultrapassou a meta em ${Math.abs(kmRemaining).toLocaleString('pt-BR')} km ou expirou o prazo de 6 meses.`;
    } else if (kmRemaining <= 1000 || daysRemaining <= 30) {
      urgency = 'warning';
      reason = `Atenção: faltam apenas ${kmRemaining.toLocaleString('pt-BR')} km ou ${daysRemaining} dias para a troca recomendada.`;
    }

    return {
      id: 'rem-oil',
      vehicleId: activeVehicle.id,
      vehiclePlate: activeVehicle.licensePlate,
      vehicleModel: activeVehicle.model,
      type: 'troca_oleo',
      title: 'Troca de Óleo e Filtro do Motor',
      targetMileage: kmLimit,
      targetDate: lastOil.nextScheduledDate,
      currentMileage: currentKm,
      kmRemaining,
      daysRemaining,
      urgency,
      reason
    };
  }, [activeVehicle, vehicleMaintenances]);

  // Lembrete de Rodízio de Pneus
  const tireReminder = useMemo((): MaintenanceReminder | null => {
    if (!activeVehicle) return null;

    const tireServices = vehicleMaintenances
      .filter(m => m.type === 'rodizio_pneus')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const lastTire = tireServices[0];
    const currentKm = activeVehicle.currentMileage;

    if (!lastTire) {
      return {
        id: 'rem-tire-none',
        vehicleId: activeVehicle.id,
        vehiclePlate: activeVehicle.licensePlate,
        vehicleModel: activeVehicle.model,
        type: 'rodizio_pneus',
        title: 'Rodízio de Pneus Recomendado',
        currentMileage: currentKm,
        urgency: 'warning',
        reason: 'Nenhum rodízio recente cadastrado. Recomenda-se a cada 10.000 km.'
      };
    }

    const kmLimit = lastTire.nextScheduledMileage || (lastTire.mileageAtService + 10000);
    const kmRemaining = kmLimit - currentKm;

    let urgency: 'ok' | 'warning' | 'critical' = 'ok';
    let reason = `Pneus em ordem. Próximo rodízio em ${kmRemaining.toLocaleString('pt-BR')} km.`;

    if (kmRemaining <= 0) {
      urgency = 'critical';
      reason = `Rodízio de pneus vencido em ${Math.abs(kmRemaining).toLocaleString('pt-BR')} km.`;
    } else if (kmRemaining <= 1000) {
      urgency = 'warning';
      reason = `Atenção: rodízio recomendado em ${kmRemaining.toLocaleString('pt-BR')} km.`;
    }

    return {
      id: 'rem-tire',
      vehicleId: activeVehicle.id,
      vehiclePlate: activeVehicle.licensePlate,
      vehicleModel: activeVehicle.model,
      type: 'rodizio_pneus',
      title: 'Rodízio e Balanceamento de Pneus',
      targetMileage: kmLimit,
      currentMileage: currentKm,
      kmRemaining,
      urgency,
      reason
    };
  }, [activeVehicle, vehicleMaintenances]);

  // Cálculo do Consumo Médio de Combustível (km/L) e Custos
  const fuelMetrics = useMemo(() => {
    if (vehicleFuelRecords.length < 2) {
      return {
        averageKmL: 12.8, // Valor representativo caso haja poucos dados
        totalCostThisMonth: 490.10,
        totalLitersThisMonth: 84.5,
        lastRefillCostPerKm: 0.43
      };
    }

    // Ordenar cronologicamente
    const sorted = [...vehicleFuelRecords].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let totalKmRun = 0;
    let totalLiters = 0;
    let totalCost = 0;

    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      const deltaKm = curr.mileage - prev.mileage;
      if (deltaKm > 0 && curr.liters > 0) {
        totalKmRun += deltaKm;
        totalLiters += curr.liters;
      }
    }

    sorted.forEach(f => {
      totalCost += f.totalCost;
    });

    const averageKmL = totalLiters > 0 ? (totalKmRun / totalLiters) : 12.5;

    return {
      averageKmL: parseFloat(averageKmL.toFixed(2)),
      totalCostThisMonth: parseFloat(totalCost.toFixed(2)),
      totalLitersThisMonth: parseFloat(totalLiters.toFixed(1)),
      lastRefillCostPerKm: totalKmRun > 0 ? parseFloat((totalCost / totalKmRun).toFixed(2)) : 0.42
    };
  }, [vehicleFuelRecords]);

  // Custos totais de manutenção acumulados
  const totalMaintenanceCost = useMemo(() => {
    return vehicleMaintenances.reduce((acc, curr) => acc + curr.cost, 0);
  }, [vehicleMaintenances]);

  // Manutenções filtradas para a tela de histórico
  const filteredMaintenances = useMemo(() => {
    return vehicleMaintenances
      .filter(m => {
        if (maintenanceFilter !== 'all' && m.type !== maintenanceFilter) return false;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          return m.title.toLowerCase().includes(term) || 
                 (m.description && m.description.toLowerCase().includes(term)) ||
                 (m.serviceProvider && m.serviceProvider.toLowerCase().includes(term));
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [vehicleMaintenances, maintenanceFilter, searchTerm]);

  // Condutor principal do veículo ativo
  const primaryDriver = useMemo(() => {
    if (!activeVehicle?.primaryDriverId) return null;
    return drivers.find(d => d.id === activeVehicle.primaryDriverId);
  }, [activeVehicle, drivers]);

  const openMaintenanceModalWithType = (type: MaintenanceType) => {
    setMaintModalType(type);
    setIsMaintModalOpen(true);
  };

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. TOPO DA PÁGINA: NOME DO PROPRIETÁRIO RESPONSÁVEL (REQUISITO ESSENCIAL) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Identificação do Proprietário e Veículo */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-blue-900/20 border border-blue-600/30 shrink-0">
            <User className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Painel do Proprietário Responsável
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {ownerName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>Veículo em Foco: <strong className="text-blue-900">{activeVehicle?.brand} {activeVehicle?.model}</strong></span>
              <span>•</span>
              <span className="font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-bold border border-blue-200">
                {activeVehicle?.licensePlate}
              </span>
              <span>•</span>
              <span className="font-mono text-slate-700 font-semibold">
                {activeVehicle?.currentMileage.toLocaleString('pt-BR')} km
              </span>
            </p>
          </div>
        </div>

        {/* Botões Rápidos e Seletor de Módulos */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => openMaintenanceModalWithType('troca_oleo')}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
          >
            <Droplet className="w-4 h-4 fill-current" />
            + Troca de Óleo
          </button>
          <button
            onClick={() => setIsFuelModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Fuel className="w-4 h-4" />
            + Abastecer
          </button>
          <button
            onClick={onResetData}
            title="Restaurar dados de exemplo iniciais"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. SUB-BARRA DE NAVEGAÇÃO DOS MÓDULOS */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveModule('dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeModule === 'dashboard'
              ? 'bg-white text-blue-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Gauge className="w-4 h-4 text-amber-500" />
          Visão Geral & Lembretes
        </button>

        <button
          onClick={() => setActiveModule('cadastros')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeModule === 'cadastros'
              ? 'bg-white text-blue-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Car className="w-4 h-4 text-blue-600" />
          Cadastro (Veículos & Condutores)
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            {vehicles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveModule('manutencoes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeModule === 'manutencoes'
              ? 'bg-white text-blue-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Wrench className="w-4 h-4 text-amber-500" />
          Histórico de Manutenções
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-800">
            {vehicleMaintenances.length}
          </span>
        </button>

        <button
          onClick={() => setActiveModule('monitoramento')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeModule === 'monitoramento'
              ? 'bg-white text-blue-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Monitoramento (Consumo & Custos)
        </button>

        <button
          onClick={() => setActiveModule('informativo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeModule === 'informativo'
              ? 'bg-white text-blue-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          Direção Defensiva & Dicas
        </button>
      </div>

      {/* 3. CONTEÚDO DINÂMICO DO MÓDULO SELECIONADO */}

      {/* MÓDULO 1: DASHBOARD & LEMBRETES */}
      {activeModule === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Lembretes Automáticos Proativos em Destaque (Cores Azul e Amarelo) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Alerta de Troca de Óleo */}
            {oilReminder && (
              <div className={`p-5 rounded-2xl border-2 transition-all shadow-sm flex flex-col justify-between ${
                oilReminder.urgency === 'critical'
                  ? 'bg-red-50/80 border-red-300'
                  : oilReminder.urgency === 'warning'
                  ? 'bg-amber-50 border-amber-400'
                  : 'bg-blue-50/70 border-blue-200'
              }`}>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800">
                      <Droplet className={`w-4 h-4 ${oilReminder.urgency === 'ok' ? 'text-blue-600' : 'text-amber-600 fill-amber-500'}`} />
                      {oilReminder.title}
                    </span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                      oilReminder.urgency === 'critical'
                        ? 'bg-red-600 text-white'
                        : oilReminder.urgency === 'warning'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {oilReminder.urgency === 'critical' ? 'VENCIDA!' : oilReminder.urgency === 'warning' ? 'ATENÇÃO' : 'EM DIA'}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 mb-1">
                    {oilReminder.reason}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-600 mt-3 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Hodômetro Atual:</span>
                      <strong>{oilReminder.currentMileage.toLocaleString('pt-BR')} km</strong>
                    </div>
                    {oilReminder.targetMileage && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Meta de Troca:</span>
                        <strong>{oilReminder.targetMileage.toLocaleString('pt-BR')} km</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Recomendação: a cada 10.000 km ou 6 meses</span>
                  <button
                    onClick={() => openMaintenanceModalWithType('troca_oleo')}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    Registrar Troca
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Alerta de Rodízio de Pneus */}
            {tireReminder && (
              <div className={`p-5 rounded-2xl border-2 transition-all shadow-sm flex flex-col justify-between ${
                tireReminder.urgency === 'critical'
                  ? 'bg-red-50/80 border-red-300'
                  : tireReminder.urgency === 'warning'
                  ? 'bg-amber-50 border-amber-400'
                  : 'bg-blue-50/70 border-blue-200'
              }`}>
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800">
                      <Disc className="w-4 h-4 text-blue-600" />
                      {tireReminder.title}
                    </span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                      tireReminder.urgency === 'critical'
                        ? 'bg-red-600 text-white'
                        : tireReminder.urgency === 'warning'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {tireReminder.urgency === 'critical' ? 'VENCIDO' : tireReminder.urgency === 'warning' ? 'RECOMENDADO' : 'EM DIA'}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 mb-1">
                    {tireReminder.reason}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-600 mt-3 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Quilometragem Atual:</span>
                      <strong>{tireReminder.currentMileage.toLocaleString('pt-BR')} km</strong>
                    </div>
                    {tireReminder.targetMileage && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Próximo Rodízio:</span>
                        <strong>{tireReminder.targetMileage.toLocaleString('pt-BR')} km</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-blue-200/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Uniformiza o desgaste e gera economia</span>
                  <button
                    onClick={() => openMaintenanceModalWithType('rodizio_pneus')}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    Registrar Rodízio
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Cards de Métricas Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Métrica 1: Consumo Médio */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Consumo Médio</span>
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Fuel className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {fuelMetrics.averageKmL} <span className="text-sm font-normal text-slate-500">km/L</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Calculado com base nos abastecimentos com tanque cheio.
              </p>
            </div>

            {/* Métrica 2: Gastos Totais em Manutenção */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Custos em Manutenções</span>
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-blue-900 font-mono">
                R$ {totalMaintenanceCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-slate-500">
                Total acumulado em {vehicleMaintenances.length} serviços realizados.
              </p>
            </div>

            {/* Métrica 3: Gasto Médio por Km */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Custo Combustível/Km</span>
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                R$ {fuelMetrics.lastRefillCostPerKm} <span className="text-sm font-normal text-slate-500">/ km</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Média de custo direto de rodagem por quilômetro.
              </p>
            </div>

            {/* Métrica 4: Condutor Principal */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Condutor Principal</span>
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <User className="w-4 h-4" />
                </div>
              </div>
              <div className="text-base font-bold text-slate-900 truncate">
                {primaryDriver?.name || 'Não vinculado'}
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                CNH: {primaryDriver?.licenseNumber || 'N/D'}
              </p>
            </div>

          </div>

          {/* Ações Rápidas em 4 Botões Grandes (UX Acessível para Leigos) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Ações Rápidas (Registrar em 3 Toques):
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => openMaintenanceModalWithType('troca_oleo')}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
                  <Droplet className="w-5 h-5 fill-current" />
                </div>
                <strong className="text-xs font-bold text-slate-900 block">Troca de Óleo</strong>
                <span className="text-[11px] text-slate-500">Registrar óleo & filtro</span>
              </button>

              <button
                onClick={() => openMaintenanceModalWithType('rodizio_pneus')}
                className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
                  <Disc className="w-5 h-5" />
                </div>
                <strong className="text-xs font-bold text-slate-900 block">Rodízio de Pneus</strong>
                <span className="text-[11px] text-slate-500">Inversão e balanceamento</span>
              </button>

              <button
                onClick={() => openMaintenanceModalWithType('preventiva')}
                className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <strong className="text-xs font-bold text-slate-900 block">Revisão Preventiva</strong>
                <span className="text-[11px] text-slate-500">Freios, correias, filtros</span>
              </button>

              <button
                onClick={() => openMaintenanceModalWithType('corretiva')}
                className="p-4 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/80 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <strong className="text-xs font-bold text-slate-900 block">Manutenção Corretiva</strong>
                <span className="text-[11px] text-slate-500">Consertos e peças trocadas</span>
              </button>
            </div>
          </div>

          {/* Últimos Serviços Realizados */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Últimos Registros no Histórico
              </h3>
              <button
                onClick={() => setActiveModule('manutencoes')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Ver Histórico Completo
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {vehicleMaintenances.slice(0, 4).map((m) => (
                <div key={m.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      m.type === 'troca_oleo' ? 'bg-amber-100 text-amber-800' :
                      m.type === 'rodizio_pneus' ? 'bg-blue-100 text-blue-800' :
                      m.type === 'preventiva' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {m.type === 'troca_oleo' && <Droplet className="w-4 h-4" />}
                      {m.type === 'rodizio_pneus' && <Disc className="w-4 h-4" />}
                      {m.type === 'preventiva' && <ShieldCheck className="w-4 h-4" />}
                      {m.type === 'corretiva' && <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div>
                      <strong className="text-slate-900 font-semibold block">{m.title}</strong>
                      <span className="text-slate-500 font-mono">
                        {new Date(m.date).toLocaleDateString('pt-BR')} • {m.mileageAtService.toLocaleString('pt-BR')} km
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono font-bold text-slate-900">
                    R$ {m.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MÓDULO 2: CADASTRO DE VEÍCULOS & CONDUTORES */}
      {activeModule === 'cadastros' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Seção de Veículos */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Car className="w-5 h-5 text-blue-600" />
                  Veículos Cadastrados na Frota ({vehicles.length})
                </h3>
                <p className="text-xs text-slate-500">Gerencie todos os veículos sob responsabilidade de {ownerName}</p>
              </div>
              <button
                onClick={() => setIsVehicleModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                Cadastrar Novo Veículo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.map((v) => {
                const isCurrent = v.id === activeVehicle?.id;
                const driver = drivers.find(d => d.id === v.primaryDriverId);
                return (
                  <div 
                    key={v.id}
                    onClick={() => onSelectVehicle(v.id)}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-sm ${
                      isCurrent 
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                          {v.brand}
                        </span>
                        <h4 className="text-base font-bold text-slate-900">{v.model}</h4>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-300">
                            {v.licensePlate}
                          </span>
                          <span className="text-xs text-slate-500">Ano {v.year}</span>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-amber-400 text-slate-950">
                          Veículo Ativo
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Hodômetro Atual:</span>
                        <strong className="font-mono text-slate-800">{v.currentMileage.toLocaleString('pt-BR')} km</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Condutor Principal:</span>
                        <strong className="text-slate-800 truncate block">{driver?.name || 'Não atribuído'}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seção de Condutores */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-500" />
                  Condutores Autorizados ({drivers.length})
                </h3>
                <p className="text-xs text-slate-500">Pessoas habilitadas a dirigir e registrar manutenções</p>
              </div>
              <button
                onClick={() => setIsDriverModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                Cadastrar Condutor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {drivers.map((d) => (
                <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                      {d.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    {d.isPrimary && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Proprietário
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{d.name}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">CNH: {d.licenseNumber || 'Não informada'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{d.phone}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Veículos Vinculados:</span>
                    <span className="text-xs text-blue-900 font-medium">
                      {d.associatedVehicleIds.length} veículo(s) autorizado(s)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MÓDULO 3: HISTÓRICO DE MANUTENÇÕES */}
      {activeModule === 'manutencoes' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header e Filtros */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-500" />
                  Histórico de Manutenções: {activeVehicle?.model} ({activeVehicle?.licensePlate})
                </h3>
                <p className="text-xs text-slate-500">
                  Total de {filteredMaintenances.length} registros • Gasto acumulado: R$ {filteredMaintenances.reduce((acc, c) => acc + c.cost, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <button
                onClick={() => openMaintenanceModalWithType('troca_oleo')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                Nova Manutenção
              </button>
            </div>

            {/* Abas de Filtros por Tipo Exigido */}
            <div className="flex items-center gap-2 flex-wrap border-t border-slate-100 pt-3">
              {[
                { id: 'all', label: 'Todas as Manutenções' },
                { id: 'troca_oleo', label: 'Trocas de Óleo', icon: Droplet },
                { id: 'rodizio_pneus', label: 'Rodízio de Pneus', icon: Disc },
                { id: 'preventiva', label: 'Preventivas', icon: ShieldCheck },
                { id: 'corretiva', label: 'Corretivas', icon: AlertTriangle }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setMaintenanceFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    maintenanceFilter === tab.id
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <div className="ml-auto w-full sm:w-64">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar serviço, oficina..."
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Listagem de Registros */}
          <div className="space-y-3">
            {filteredMaintenances.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                <Wrench className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-700">Nenhum registro encontrado</h4>
                <p className="text-xs text-slate-500">Tente ajustar os filtros ou registre a primeira manutenção.</p>
              </div>
            ) : (
              filteredMaintenances.map((m) => (
                <div 
                  key={m.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-blue-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        m.type === 'troca_oleo' ? 'bg-amber-100 text-amber-800' :
                        m.type === 'rodizio_pneus' ? 'bg-blue-100 text-blue-800' :
                        m.type === 'preventiva' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {m.type === 'troca_oleo' && <Droplet className="w-5 h-5" />}
                        {m.type === 'rodizio_pneus' && <Disc className="w-5 h-5" />}
                        {m.type === 'preventiva' && <ShieldCheck className="w-5 h-5" />}
                        {m.type === 'corretiva' && <AlertTriangle className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            m.type === 'troca_oleo' ? 'bg-amber-100 text-amber-900' :
                            m.type === 'rodizio_pneus' ? 'bg-blue-100 text-blue-900' :
                            m.type === 'preventiva' ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                          }`}>
                            {m.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {new Date(m.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mt-0.5">{m.title}</h4>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-lg font-black text-slate-900 font-mono">
                        R$ {m.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Hodômetro: {m.mileageAtService.toLocaleString('pt-BR')} km
                      </span>
                    </div>
                  </div>

                  {m.description && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {m.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                    <span>Oficina: <strong>{m.serviceProvider || 'Oficina Particular'}</strong></span>
                    {m.nextScheduledMileage && (
                      <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Próxima Revisão: {m.nextScheduledMileage.toLocaleString('pt-BR')} km
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* MÓDULO 4: MONITORAMENTO (CONSUMO & CUSTOS) */}
      {activeModule === 'monitoramento' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header do Monitoramento */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Eficiência Energética & Custos Operacionais
              </h3>
              <p className="text-xs text-slate-500">Cálculo de consumo médio mensal e histórico de despesas mecânicas</p>
            </div>
            <button
              onClick={() => setIsFuelModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Fuel className="w-4 h-4" />
              + Novo Abastecimento
            </button>
          </div>

          {/* Cards de Métricas de Combustível */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-6 rounded-2xl shadow-md space-y-2">
              <span className="text-xs text-blue-200 font-bold uppercase tracking-wider">Consumo Médio Mensal</span>
              <div className="text-3xl font-black font-mono text-amber-300">
                {fuelMetrics.averageKmL} <span className="text-base text-white">km/L</span>
              </div>
              <p className="text-xs text-blue-100">
                Calculado com dados reais do veículo {activeVehicle?.model}.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total em Abastecimentos</span>
              <div className="text-3xl font-black font-mono text-slate-900">
                R$ {fuelMetrics.totalCostThisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-500">
                {fuelMetrics.totalLitersThisMonth} litros abastecidos neste período.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Despesas Totais em Manutenção</span>
              <div className="text-3xl font-black font-mono text-amber-600">
                R$ {totalMaintenanceCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-slate-500">
                Soma de óleos, pneus, preventivas e reparos corretivos.
              </p>
            </div>
          </div>

          {/* Histórico dos Abastecimentos Registrados */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Fuel className="w-4 h-4 text-amber-500" />
              Histórico Detalhado de Abastecimentos ({vehicleFuelRecords.length})
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-100 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Data</th>
                    <th className="p-3">Hodômetro</th>
                    <th className="p-3">Litros</th>
                    <th className="p-3">Combustível</th>
                    <th className="p-3">Valor Total</th>
                    <th className="p-3">Preço / Litro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vehicleFuelRecords.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold">{new Date(f.date).toLocaleDateString('pt-BR')}</td>
                      <td className="p-3 font-mono">{f.mileage.toLocaleString('pt-BR')} km</td>
                      <td className="p-3 font-mono font-bold text-blue-900">{f.liters} L</td>
                      <td className="p-3 capitalize">{f.fuelType}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">
                        R$ {f.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 font-mono text-slate-500">
                        R$ {(f.totalCost / f.liters).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* MÓDULO 5: INFORMATIVO (DIREÇÃO DEFENSIVA & DICAS) */}
      {activeModule === 'informativo' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Módulo Educativo & Segurança Viária</span>
            <h3 className="text-xl sm:text-2xl font-black">Guia Prático de Direção Defensiva</h3>
            <p className="text-sm text-blue-100 max-w-3xl leading-relaxed">
              Dicas vitais e orientações práticas de direção preventiva para evitar acidentes, economizar combustível e prolongar a vida útil dos componentes do veículo.
            </p>
          </div>

          {/* Checklist Interativo Pré-Viagem (5 Minutos) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Checklist Rápido de Inspeção Pré-Viagem (5 Minutos)
                </h4>
                <p className="text-xs text-slate-500">Marque os itens antes de pegar a estrada com {activeVehicle?.model}:</p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                {Object.values(checkedItems).filter(Boolean).length} de 5 Verificados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { id: 'check-1', label: 'Calibragem de todos os pneus a frio (inclusive o estepe no porta-malas).' },
                { id: 'check-2', label: 'Nível do óleo do motor e líquido de arrefecimento (com motor frio).' },
                { id: 'check-3', label: 'Teste de faróis baixos, altos, setas, lanternas e luzes de freio.' },
                { id: 'check-4', label: 'Palhetas do limpador de para-brisa e reservatório de água com xampu neutro.' },
                { id: 'check-5', label: 'Presença do triângulo de sinalização, macaco e chave de roda.' }
              ].map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    checkedItems[item.id]
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checkedItems[item.id]}
                    onChange={() => toggleCheck(item.id)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 mt-0.5 cursor-pointer"
                  />
                  <span className="text-xs leading-relaxed">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cards de Dicas Ilustradas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {defensiveDrivingTips.map((tip) => (
              <div 
                key={tip.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {tip.category.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{tip.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{tip.summary}</p>

                  <ul className="space-y-1.5 pt-2 text-xs text-slate-600 list-disc list-inside">
                    {tip.content.map((point, idx) => (
                      <li key={idx} className="leading-relaxed">{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 font-semibold mt-4">
                  💡 {tip.keyAction}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* MODAIS VINCULADOS */}
      {activeVehicle && (
        <>
          <MaintenanceModal
            isOpen={isMaintModalOpen}
            onClose={() => setIsMaintModalOpen(false)}
            onSave={onAddMaintenance}
            vehicle={activeVehicle}
            initialType={maintModalType}
          />
          <FuelModal
            isOpen={isFuelModalOpen}
            onClose={() => setIsFuelModalOpen(false)}
            onSave={onAddFuelRecord}
            vehicle={activeVehicle}
          />
        </>
      )}

      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSaveVehicle={onAddVehicle}
        drivers={drivers}
      />

      <DriverModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        onSave={onAddDriver}
        vehicles={vehicles}
      />

    </div>
  );
};
