import React, { useState } from 'react';
import { X, Fuel, DollarSign, Gauge, Calendar, Check, Sparkles } from 'lucide-react';
import { FuelRecord, Vehicle } from '../types';

interface FuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<FuelRecord, 'id'>) => void;
  vehicle: Vehicle;
}

export const FuelModal: React.FC<FuelModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicle
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mileage, setMileage] = useState(vehicle?.currentMileage || 0);
  const [liters, setLiters] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [fuelType, setFuelType] = useState<'gasolina' | 'etanol' | 'diesel'>('gasolina');
  const [isFullTank, setIsFullTank] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liters || !totalCost || !mileage) return;

    onSave({
      vehicleId: vehicle.id,
      date,
      mileage: Number(mileage),
      liters: parseFloat(liters.replace(',', '.')),
      totalCost: parseFloat(totalCost.replace(',', '.')),
      fuelType,
      isFullTank
    });

    onClose();
  };

  const calculatedPricePerLiter = (liters && totalCost)
    ? (parseFloat(totalCost.replace(',', '.')) / parseFloat(liters.replace(',', '.'))).toFixed(2)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Registrar Abastecimento</h3>
              <p className="text-xs text-blue-200">
                {vehicle.model} • Placa: <span className="font-mono text-amber-300 font-bold">{vehicle.licensePlate}</span>
              </p>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Data *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-slate-400" />
                Hodômetro (Km) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Litros Colocados *</label>
              <input
                type="text"
                required
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                placeholder="Ex: 42.50"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                Valor Pago (R$) *
              </label>
              <input
                type="text"
                required
                value={totalCost}
                onChange={(e) => setTotalCost(e.target.value)}
                placeholder="Ex: 245.00"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-slate-900 font-bold"
              />
            </div>
          </div>

          {calculatedPricePerLiter && (
            <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Preço por Litro Calculado:</span>
              <strong className="text-slate-900 font-mono">R$ {calculatedPricePerLiter} / L</strong>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Combustível</label>
            <div className="grid grid-cols-3 gap-2">
              {(['gasolina', 'etanol', 'diesel'] as const).map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFuelType(f)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all ${
                    fuelType === f 
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-500' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="fullTank"
              checked={isFullTank}
              onChange={(e) => setIsFullTank(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="fullTank" className="text-xs text-slate-700 cursor-pointer font-medium">
              Abastecido até o desarme da bomba (Tanque Cheio)
            </label>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold flex items-center gap-1 text-amber-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Cálculo Automático de Consumo
            </span>
            <p className="text-[11px] text-amber-800">
              O sistema computa automaticamente os km rodados desde o último abastecimento e calcula a média em km/L.
            </p>
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
              Salvar Abastecimento
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
