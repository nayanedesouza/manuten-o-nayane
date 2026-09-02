import React, { useState, useEffect } from 'react';
import { 
  initialOwnerName, 
  initialVehicles, 
  initialDrivers, 
  initialMaintenances, 
  initialFuelRecords, 
  defensiveDrivingTips 
} from './data/mockData';
import { technicalSpecificationMarkdown } from './data/specificationData';
import { Vehicle, Driver, MaintenanceRecord, FuelRecord } from './types';
import { Navbar } from './components/Navbar';
import { SpecificationView } from './components/SpecificationView';
import { PrototypeView } from './components/PrototypeView';
import { DiagramsView } from './components/DiagramsView';
import { ApiSpecsView } from './components/ApiSpecsView';

export default function App() {
  // Aba ativa principal
  const [currentTab, setCurrentTab] = useState<'spec' | 'prototype' | 'diagrams' | 'api'>('spec');

  // Nome do proprietário/responsável (requisito de design com exibição obrigatória no topo)
  const [ownerName, setOwnerName] = useState<string>(() => {
    return localStorage.getItem('autotrack_owner_name') || initialOwnerName;
  });

  // Frota de veículos
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('autotrack_vehicles');
    return saved ? JSON.parse(saved) : initialVehicles;
  });

  // Veículo em foco
  const [activeVehicleId, setActiveVehicleId] = useState<string>(() => {
    return vehicles[0]?.id || 'veh-1';
  });

  // Condutores associados
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('autotrack_drivers');
    return saved ? JSON.parse(saved) : initialDrivers;
  });

  // Histórico completo de manutenções
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>(() => {
    const saved = localStorage.getItem('autotrack_maintenances');
    return saved ? JSON.parse(saved) : initialMaintenances;
  });

  // Registros de abastecimento
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>(() => {
    const saved = localStorage.getItem('autotrack_fuel_records');
    return saved ? JSON.parse(saved) : initialFuelRecords;
  });

  // Efeitos de persistência local
  useEffect(() => {
    localStorage.setItem('autotrack_owner_name', ownerName);
  }, [ownerName]);

  useEffect(() => {
    localStorage.setItem('autotrack_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('autotrack_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('autotrack_maintenances', JSON.stringify(maintenances));
  }, [maintenances]);

  useEffect(() => {
    localStorage.setItem('autotrack_fuel_records', JSON.stringify(fuelRecords));
  }, [fuelRecords]);

  // Ações de Atualização
  const handleUpdateOwnerName = (newName: string) => {
    setOwnerName(newName);
  };

  const handleAddMaintenance = (newRecord: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => {
    const record: MaintenanceRecord = {
      ...newRecord,
      id: `maint-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setMaintenances(prev => [record, ...prev]);

    // Atualiza a quilometragem do veículo se o serviço tiver km superior
    setVehicles(prev => prev.map(v => {
      if (v.id === newRecord.vehicleId && newRecord.mileageAtService > v.currentMileage) {
        return { ...v, currentMileage: newRecord.mileageAtService };
      }
      return v;
    }));
  };

  const handleAddVehicle = (newVeh: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const vehicle: Vehicle = {
      ...newVeh,
      id: `veh-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setVehicles(prev => [...prev, vehicle]);
    setActiveVehicleId(vehicle.id);
  };

  const handleAddDriver = (newDriver: Omit<Driver, 'id'>) => {
    const driver: Driver = {
      ...newDriver,
      id: `drv-${Date.now()}`
    };
    setDrivers(prev => [...prev, driver]);
  };

  const handleAddFuelRecord = (newFuel: Omit<FuelRecord, 'id'>) => {
    const fuel: FuelRecord = {
      ...newFuel,
      id: `fuel-${Date.now()}`
    };
    setFuelRecords(prev => [...prev, fuel]);

    // Atualiza quilometragem se maior
    setVehicles(prev => prev.map(v => {
      if (v.id === newFuel.vehicleId && newFuel.mileage > v.currentMileage) {
        return { ...v, currentMileage: newFuel.mileage };
      }
      return v;
    }));
  };

  const handleResetData = () => {
    if (window.confirm("Deseja restaurar os dados iniciais de demonstração?")) {
      setOwnerName(initialOwnerName);
      setVehicles(initialVehicles);
      setDrivers(initialDrivers);
      setMaintenances(initialMaintenances);
      setFuelRecords(initialFuelRecords);
      setActiveVehicleId(initialVehicles[0].id);
      localStorage.clear();
    }
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([technicalSpecificationMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'especificacao-tecnica-manutencao-veicular.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      
      {/* Topbar Obrigatória com Nome do Responsável, Tabs e Controles */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        ownerName={ownerName}
        onUpdateOwnerName={handleUpdateOwnerName}
        vehicles={vehicles}
        activeVehicleId={activeVehicleId}
        onSelectVehicle={setActiveVehicleId}
        onExportMarkdown={handleExportMarkdown}
        onPrint={handlePrint}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 pb-16">
        {currentTab === 'spec' && (
          <SpecificationView
            onGoToPrototype={() => setCurrentTab('prototype')}
            onPrint={handlePrint}
            onExportMarkdown={handleExportMarkdown}
          />
        )}

        {currentTab === 'prototype' && (
          <PrototypeView
            ownerName={ownerName}
            vehicles={vehicles}
            drivers={drivers}
            maintenances={maintenances}
            fuelRecords={fuelRecords}
            activeVehicleId={activeVehicleId}
            onSelectVehicle={setActiveVehicleId}
            onAddMaintenance={handleAddMaintenance}
            onAddVehicle={handleAddVehicle}
            onAddDriver={handleAddDriver}
            onAddFuelRecord={handleAddFuelRecord}
            onResetData={handleResetData}
            defensiveDrivingTips={defensiveDrivingTips}
          />
        )}

        {currentTab === 'diagrams' && (
          <DiagramsView />
        )}

        {currentTab === 'api' && (
          <ApiSpecsView />
        )}
      </main>

      {/* Rodapé Institucional do Documento de Engenharia */}
      <footer className="no-print bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
              <span>AutoTrack Manutenção Veicular</span>
              <span className="text-amber-400 text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                Documento de Arquitetura & Software
              </span>
            </div>
            <p className="text-slate-500 mt-1">
              Especificação técnica completa e protótipo funcional para desenvolvedores e equipes de produto.
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Proprietário: <strong className="text-slate-200">{ownerName}</strong></span>
            <span>•</span>
            <span>Versão: <strong className="text-amber-400 font-mono">1.0.0</strong></span>
            <span>•</span>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Voltar ao Topo ↑
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
