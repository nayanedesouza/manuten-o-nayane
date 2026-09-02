import React, { useState } from 'react';
import { 
  Car, 
  User, 
  FileText, 
  Play, 
  Workflow, 
  Code2, 
  Printer, 
  Download, 
  ChevronDown,
  Edit2,
  Check,
  ShieldCheck,
  Fuel
} from 'lucide-react';
import { Vehicle } from '../types';

interface NavbarProps {
  currentTab: 'spec' | 'prototype' | 'diagrams' | 'api';
  onSelectTab: (tab: 'spec' | 'prototype' | 'diagrams' | 'api') => void;
  ownerName: string;
  onUpdateOwnerName: (newName: string) => void;
  vehicles: Vehicle[];
  activeVehicleId: string;
  onSelectVehicle: (id: string) => void;
  onExportMarkdown: () => void;
  onPrint: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  ownerName,
  onUpdateOwnerName,
  vehicles,
  activeVehicleId,
  onSelectVehicle,
  onExportMarkdown,
  onPrint
}) => {
  const [isEditingOwner, setIsEditingOwner] = useState(false);
  const [tempOwner, setTempOwner] = useState(ownerName);
  const activeVehicle = vehicles.find(v => v.id === activeVehicleId) || vehicles[0];

  const handleSaveOwner = () => {
    if (tempOwner.trim()) {
      onUpdateOwnerName(tempOwner.trim());
      setIsEditingOwner(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top Banner com Destaque Obrigatório do Proprietário Responsável */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 px-4 py-2 text-xs border-b border-blue-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            ET-AUTO-2026 • Versão 1.0.0
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Especificação Arquitetural de Software & Protótipo Funcional
          </span>
        </div>

        {/* Nome do Proprietário/Responsável no Topo da Página */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-md border border-slate-700/80">
          <User className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 font-medium">Proprietário Responsável:</span>
          {isEditingOwner ? (
            <div className="flex items-center gap-1">
              <input 
                type="text"
                value={tempOwner}
                onChange={(e) => setTempOwner(e.target.value)}
                className="bg-slate-900 text-amber-300 text-xs px-2 py-0.5 rounded border border-amber-500 focus:outline-none"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveOwner()}
              />
              <button 
                onClick={handleSaveOwner} 
                className="text-emerald-400 hover:text-emerald-300 p-0.5"
                title="Salvar Nome"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <strong className="text-amber-400 font-semibold">{ownerName}</strong>
              <button 
                onClick={() => { setTempOwner(ownerName); setIsEditingOwner(true); }}
                className="text-slate-400 hover:text-white p-0.5 transition-colors"
                title="Editar Nome do Responsável"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Barra Principal de Navegação */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Identidade do Aplicativo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border border-blue-400/30">
              <Car className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">AutoTrack</span>
                <span className="text-xs px-2 py-0.5 font-bold uppercase rounded bg-amber-400 text-slate-950">
                  Manutenção
                </span>
              </div>
              <p className="text-xs text-slate-400">Controle e Manutenção Veicular</p>
            </div>
          </div>

          {/* Abas de Navegação Principal */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => onSelectTab('spec')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'spec'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-300" />
              Especificação Técnica
            </button>

            <button
              onClick={() => onSelectTab('prototype')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'prototype'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              Protótipo Funcional
              <span className="px-1.5 py-0.2 text-[10px] uppercase font-bold rounded bg-slate-900 text-amber-300">
                Live App
              </span>
            </button>

            <button
              onClick={() => onSelectTab('diagrams')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'diagrams'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Workflow className="w-4 h-4 text-amber-300" />
              Diagramas & ERD
            </button>

            <button
              onClick={() => onSelectTab('api')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'api'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Code2 className="w-4 h-4 text-amber-300" />
              APIs & Contratos
            </button>
          </nav>

          {/* Seletor de Veículo Ativo e Botões de Exportação */}
          <div className="flex items-center gap-2">
            {/* Seletor de Veículo Ativo */}
            {vehicles.length > 0 && (
              <div className="relative group">
                <div className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-white cursor-pointer transition-colors">
                  <Car className="w-3.5 h-3.5 text-amber-400" />
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block leading-none">Veículo Ativo</span>
                    <span className="font-semibold text-xs leading-tight">
                      {activeVehicle ? `${activeVehicle.model.split(' ')[0]} • ${activeVehicle.licensePlate}` : 'Selecionar'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </div>
                
                {/* Dropdown de Veículos */}
                <div className="absolute right-0 mt-1 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 hidden group-hover:block z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700">
                    Selecione o Veículo:
                  </div>
                  {vehicles.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => onSelectVehicle(v.id)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700 transition-colors ${
                        v.id === activeVehicleId ? 'bg-blue-900/40 text-amber-300 font-semibold' : 'text-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{v.brand} {v.model}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{v.licensePlate} • {v.currentMileage.toLocaleString('pt-BR')} km</div>
                      </div>
                      {v.id === activeVehicleId && (
                        <Check className="w-4 h-4 text-amber-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ações de Documentação */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onExportMarkdown}
                title="Exportar Especificação Técnica (.md)"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onPrint}
                title="Imprimir / Salvar em PDF"
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-800 gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => onSelectTab('spec')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentTab === 'spec' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400'}`}
          >
            Especificação
          </button>
          <button
            onClick={() => onSelectTab('prototype')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentTab === 'prototype' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
          >
            Protótipo Live
          </button>
          <button
            onClick={() => onSelectTab('diagrams')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentTab === 'diagrams' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400'}`}
          >
            Diagramas
          </button>
          <button
            onClick={() => onSelectTab('api')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentTab === 'api' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400'}`}
          >
            APIs
          </button>
        </div>
      </div>
    </header>
  );
};
