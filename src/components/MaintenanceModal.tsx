import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wrench, 
  Droplet, 
  Disc, 
  ShieldCheck, 
  AlertTriangle,
  Calendar,
  Gauge,
  DollarSign,
  Building2,
  FileText,
  Check
} from 'lucide-react';
import { MaintenanceRecord, MaintenanceType, Vehicle } from '../types';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => void;
  vehicle: Vehicle;
  initialType?: MaintenanceType;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vehicle,
  initialType = 'troca_oleo'
}) => {
  const [type, setType] = useState<MaintenanceType>(initialType);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mileageAtService, setMileageAtService] = useState(vehicle?.currentMileage || 0);
  const [cost, setCost] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [nextScheduledMileage, setNextScheduledMileage] = useState<number | undefined>(undefined);

  useEffect(() => {
    setType(initialType);
    setMileageAtService(vehicle?.currentMileage || 0);
  }, [initialType, vehicle, isOpen]);

  useEffect(() => {
    // Títulos e projeções padrão para cada tipo para facilitar a vida do leigo
    if (type === 'troca_oleo') {
      setTitle('Troca de Óleo do Motor e Filtro');
      setDescription('Substituição de óleo lubrificante sintético e filtro de óleo.');
      setNextScheduledMileage(mileageAtService + 10000);
    } else if (type === 'rodizio_pneus') {
      setTitle('Rodízio e Alinhamento de Pneus');
      setDescription('Inversão de posições dianteiras/traseiras e balanceamento.');
      setNextScheduledMileage(mileageAtService + 10000);
    } else if (type === 'preventiva') {
      setTitle('Revisão Preventiva Programada');
      setDescription('Checagem de pastilhas de freio, filtros e fluidos.');
      setNextScheduledMileage(mileageAtService + 10000);
    } else if (type === 'corretiva') {
      setTitle('Reparo Mecânico Corretivo');
      setDescription('Substituição de componente com desgaste ou defeito.');
      setNextScheduledMileage(undefined);
    }
  }, [type, mileageAtService]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !cost) return;

    onSave({
      vehicleId: vehicle.id,
      type,
      title,
      description,
      date,
      mileageAtService: Number(mileageAtService),
      cost: parseFloat(cost.replace(',', '.')),
      serviceProvider,
      receiptNumber,
      nextScheduledMileage: nextScheduledMileage || undefined,
      nextScheduledDate: type === 'troca_oleo' 
        ? new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
        : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Registrar Manutenção</h3>
              <p className="text-xs text-blue-200">
                {vehicle.brand} {vehicle.model} • Placa: <span className="font-mono text-amber-300 font-bold">{vehicle.licensePlate}</span>
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          
          {/* Seletor dos 4 Tipos Exigidos */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Selecione o Tipo de Serviço:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('troca_oleo')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  type === 'troca_oleo'
                    ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-sm ring-2 ring-amber-400/20 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Droplet className={`w-4 h-4 ${type === 'troca_oleo' ? 'text-amber-600' : 'text-slate-400'}`} />
                Troca de Óleo
              </button>

              <button
                type="button"
                onClick={() => setType('rodizio_pneus')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  type === 'rodizio_pneus'
                    ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-sm ring-2 ring-amber-400/20 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Disc className={`w-4 h-4 ${type === 'rodizio_pneus' ? 'text-amber-600' : 'text-slate-400'}`} />
                Rodízio de Pneus
              </button>

              <button
                type="button"
                onClick={() => setType('preventiva')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  type === 'preventiva'
                    ? 'border-blue-500 bg-blue-50 text-blue-950 shadow-sm ring-2 ring-blue-400/20 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 ${type === 'preventiva' ? 'text-blue-600' : 'text-slate-400'}`} />
                Preventiva
              </button>

              <button
                type="button"
                onClick={() => setType('corretiva')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  type === 'corretiva'
                    ? 'border-red-500 bg-red-50 text-red-950 shadow-sm ring-2 ring-red-400/20 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <AlertTriangle className={`w-4 h-4 ${type === 'corretiva' ? 'text-red-600' : 'text-slate-400'}`} />
                Corretiva (Reparo)
              </button>
            </div>
          </div>

          {/* Título do Serviço */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título / Descrição Resumida *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Troca de óleo 5W-30 sintético"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          {/* Data e Quilometragem */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Data da Realização *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-slate-400" />
                Quilometragem no Serviço (Km) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={mileageAtService}
                onChange={(e) => setMileageAtService(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Custo e Prestador */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                Custo Total (R$) *
              </label>
              <input
                type="text"
                required
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="Ex: 380.00"
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Oficina / Centro Automotivo
              </label>
              <input
                type="text"
                value={serviceProvider}
                onChange={(e) => setServiceProvider(e.target.value)}
                placeholder="Ex: LubriFast, Concessionária"
                className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </div>

          {/* Detalhes e Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Observações Adicionais (Marca do óleo, peças trocadas)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Utilizado filtro Fram e óleo 0W-20 sintético conforme manual..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          {/* Sugestão de Próximo Lembrete Automático */}
          {(type === 'troca_oleo' || type === 'rodizio_pneus') && (
            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-800">
                <Check className="w-3.5 h-3.5 text-amber-600" />
                Agendamento Automático do Próximo Lembrete
              </span>
              <p className="text-[11px] text-amber-700">
                O sistema programará o próximo alerta para <strong>{(mileageAtService + 10000).toLocaleString('pt-BR')} km</strong> ou daqui a <strong>6 meses</strong>.
              </p>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Salvar Manutenção
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
