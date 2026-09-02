import React, { useState } from 'react';
import { X, User, Check } from 'lucide-react';
import { Driver, Vehicle } from '../types';

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driver: Omit<Driver, 'id'>) => void;
  vehicles: Vehicle[];
}

export const DriverModal: React.FC<DriverModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicles
}) => {
  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [isPrimary, setIsPrimary] = useState(false);

  if (!isOpen) return null;

  const handleToggleVehicle = (id: string) => {
    if (selectedVehicleIds.includes(id)) {
      setSelectedVehicleIds(selectedVehicleIds.filter(vId => vId !== id));
    } else {
      setSelectedVehicleIds([...selectedVehicleIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      licenseNumber: licenseNumber.trim(),
      phone: phone.trim(),
      email: email.trim(),
      associatedVehicleIds: selectedVehicleIds,
      isPrimary
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Cadastrar Condutor</h3>
              <p className="text-xs text-blue-200">Vincule motoristas autorizados aos veículos</p>
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
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo do Condutor *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Mariana Silva"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Número da CNH</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="Ex: 05829184710"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-0000"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail para Avisos</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="condutor@email.com"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Veículos Autorizados a Conduzir:</label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50">
              {vehicles.map(v => (
                <label key={v.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedVehicleIds.includes(v.id)}
                    onChange={() => handleToggleVehicle(v.id)}
                    className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300"
                  />
                  <span className="font-medium text-slate-800">{v.brand} {v.model}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({v.licensePlate})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPrimary"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300"
            />
            <label htmlFor="isPrimary" className="text-xs text-slate-700 cursor-pointer font-medium">
              Definir como condutor principal / proprietário
            </label>
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
              Salvar Condutor
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
