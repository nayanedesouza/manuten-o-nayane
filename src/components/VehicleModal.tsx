import React, { useState } from 'react';
import { X, Car, User, Check, Plus } from 'lucide-react';
import { Vehicle, Driver } from '../types';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  onSaveDriver?: (driver: Omit<Driver, 'id'>) => void;
  drivers: Driver[];
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSaveVehicle,
  drivers
}) => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [licensePlate, setLicensePlate] = useState('');
  const [currentMileage, setCurrentMileage] = useState(0);
  const [color, setColor] = useState('');
  const [fuelType, setFuelType] = useState<'flex' | 'gasolina' | 'etanol' | 'diesel'>('flex');
  const [primaryDriverId, setPrimaryDriverId] = useState(drivers[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !licensePlate) return;

    onSaveVehicle({
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year),
      licensePlate: licensePlate.toUpperCase().trim(),
      currentMileage: Number(currentMileage),
      color: color.trim() || 'Não informada',
      fuelType,
      primaryDriverId: primaryDriverId || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Cadastrar Novo Veículo</h3>
              <p className="text-xs text-blue-200">Adicione à frota gerenciada do proprietário</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-blue-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Marca *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ex: Toyota, Fiat, VW"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Modelo *</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ex: Corolla, Onix, Toro"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ano *</label>
              <input
                type="number"
                required
                min="1970"
                max={new Date().getFullYear() + 1}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Placa (Mercosul ou Padrão) *</label>
              <input
                type="text"
                required
                maxLength={8}
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                placeholder="Ex: BRA2E19"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Quilometragem Atual (Km) *</label>
              <input
                type="number"
                required
                min="0"
                value={currentMileage}
                onChange={(e) => setCurrentMileage(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cor</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Ex: Prata, Preto, Branco"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Condutor Principal Associado</label>
            <select
              value={primaryDriverId}
              onChange={(e) => setPrimaryDriverId(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
            >
              <option value="">Nenhum específico</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>{d.name} {d.isPrimary ? '(Proprietário)' : ''}</option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Salvar Veículo
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
