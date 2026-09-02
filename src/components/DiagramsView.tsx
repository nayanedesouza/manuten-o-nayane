import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  Workflow, 
  GitBranch, 
  CheckCircle2, 
  ArrowRight, 
  Key, 
  Link2,
  Cpu,
  Clock,
  Car,
  Fuel,
  Wrench,
  AlertTriangle
} from 'lucide-react';
import { entityRelationshipModel } from '../data/specificationData';

export const DiagramsView: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<'erd' | 'c4' | 'flow'>('erd');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <Workflow className="w-3.5 h-3.5" />
            Modelagem Visual de Software
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Diagramas Arquiteturais & Modelo de Dados
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Visualização interativa do modelo relacional (ERD), arquitetura em camadas e fluxos de decisão do sistema.
          </p>
        </div>

        {/* Seletor de Diagrama */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveDiagram('erd')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeDiagram === 'erd' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            Modelo de Dados (ERD)
          </button>
          <button
            onClick={() => setActiveDiagram('c4')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeDiagram === 'c4' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            Arquitetura C4
          </button>
          <button
            onClick={() => setActiveDiagram('flow')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeDiagram === 'flow' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            Fluxo da Manutenção
          </button>
        </div>
      </div>

      {/* 1. MODELO ERD INTERATIVO */}
      {activeDiagram === 'erd' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Diagrama Entidade-Relacionamento (ERD Normalizado)
            </h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              4 Tabelas Principais • 100% Relacional
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {entityRelationshipModel.map((table) => (
              <div 
                key={table.table}
                className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all hover:border-blue-400"
              >
                {/* Header da Tabela */}
                <div className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-400" />
                    <span className="font-mono font-bold text-sm">{table.table}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900 text-blue-200 font-semibold uppercase">
                    Tabela
                  </span>
                </div>

                <div className="p-2 bg-slate-50 border-b border-slate-100 text-[11px] text-slate-500 italic">
                  {table.description}
                </div>

                {/* Lista de Colunas */}
                <div className="p-3 space-y-2 divide-y divide-slate-100 flex-1">
                  {table.columns.map((col) => {
                    const isPK = col.type.includes('PK');
                    const isFK = col.type.includes('FK');
                    return (
                      <div key={col.name} className="pt-2 first:pt-0 flex items-start justify-between text-xs gap-2">
                        <div className="flex items-center gap-1.5">
                          {isPK && <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" title="Chave Primária" />}
                          {isFK && <Link2 className="w-3.5 h-3.5 text-blue-500 shrink-0" title="Chave Estrangeira" />}
                          <span className={`font-mono ${isPK ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                            {col.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isPK 
                              ? 'bg-amber-100 text-amber-800 font-bold' 
                              : isFK 
                              ? 'bg-blue-100 text-blue-800 font-bold' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {col.type}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500">
                  Total de {table.columns.length} campos mapeados
                </div>
              </div>
            ))}
          </div>

          {/* Relações Explicadas */}
          <div className="bg-blue-50/70 rounded-2xl p-5 border border-blue-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-blue-700" />
              Relacionamentos e Chaves Estrangeiras (Constraints)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-blue-950">
              <div className="p-3 bg-white rounded-xl border border-blue-200">
                <strong>veiculos ── (1:N) ──&gt; condutores:</strong>
                <p className="text-slate-600 mt-1">
                  Cada veículo pode ter um condutor primário (<code className="text-blue-700 font-mono">condutor_principal_id</code>) e múltiplos autorizados.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-blue-200">
                <strong>veiculos ── (1:N) ──&gt; manutencoes:</strong>
                <p className="text-slate-600 mt-1">
                  Um veículo concentra todo o histórico de trocas de óleo, pneus, preventivas e corretivas com <code className="text-blue-700 font-mono">ON DELETE CASCADE</code>.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-blue-200">
                <strong>veiculos ── (1:N) ──&gt; abastecimentos:</strong>
                <p className="text-slate-600 mt-1">
                  Histórico de abastecimentos vinculados ao veículo para cálculo contínuo da média de consumo em km/L.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ARQUITETURA C4 */}
      {activeDiagram === 'c4' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Diagrama de Contêineres e Componentes (C4 Model Nível 2)
            </h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              SPA + Offline First + API REST
            </span>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 space-y-8">
            
            {/* Usuário / Ator */}
            <div className="flex flex-col items-center">
              <div className="bg-amber-400 text-slate-950 px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-400/20">
                <Car className="w-5 h-5" />
                Usuário Leigo / Proprietário Veicular
              </div>
              <div className="h-8 w-0.5 bg-slate-600 my-1"></div>
              <div className="text-[11px] text-slate-400 font-mono">Navegador Web Mobile ou Desktop</div>
              <div className="h-8 w-0.5 bg-slate-600 my-1"></div>
            </div>

            {/* Contêiner Front-End */}
            <div className="border-2 border-blue-500/60 rounded-2xl p-6 bg-slate-800/60 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span className="font-bold text-sm text-blue-300">Contêiner 1: Aplicação Web Front-End (SPA)</span>
                </div>
                <span className="text-xs bg-blue-900/60 text-blue-200 px-3 py-1 rounded-full font-mono">
                  React 19 + TypeScript + Vite + Tailwind
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 space-y-1">
                  <span className="font-bold text-amber-300 block">Camada de Visão (UI)</span>
                  <p className="text-slate-400">
                    Topbar com Nome do Proprietário, Dashboard de Alertas, Abas de Manutenções e Cartões de Direção Defensiva.
                  </p>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 space-y-1">
                  <span className="font-bold text-amber-300 block">Motores de Lógica (Engines)</span>
                  <p className="text-slate-400">
                    ReminderEngine calcula prazos de óleo/pneus por km e dias; FuelEconomyEngine calcula km/L em tempo real.
                  </p>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 space-y-1">
                  <span className="font-bold text-amber-300 block">Persistência Resiliente</span>
                  <p className="text-slate-400">
                    Armazenamento local imediato (LocalStorage/IndexedDB) garantindo que nenhum dado seja perdido sem internet.
                  </p>
                </div>
              </div>
            </div>

            {/* Conexão HTTPS */}
            <div className="flex flex-col items-center">
              <div className="h-6 w-0.5 bg-slate-600"></div>
              <div className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300">
                JSON over HTTPS / RESTful API
              </div>
              <div className="h-6 w-0.5 bg-slate-600"></div>
            </div>

            {/* Contêiner Back-End e Banco */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-purple-500/60 rounded-2xl p-5 bg-slate-800/60 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="font-bold text-sm text-purple-300">Contêiner 2: API RESTful</span>
                  <span className="text-[10px] bg-purple-900/60 text-purple-200 px-2 py-0.5 rounded font-mono">
                    Node.js / Express
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Responsável por autenticar usuários, validar regras de negócio através de Zod e expor rotas protegidas de CRUD veicular.
                </p>
              </div>

              <div className="border-2 border-emerald-500/60 rounded-2xl p-5 bg-slate-800/60 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="font-bold text-sm text-emerald-300">Contêiner 3: Banco de Dados</span>
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded font-mono">
                    PostgreSQL 16
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Armazenamento permanente e relacional com suporte a tipos monetários, chaves estrangeiras e índices em placas e datas de revisão.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. FLUXO DE DECISÃO DA MANUTENÇÃO */}
      {activeDiagram === 'flow' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-blue-600" />
              Ciclo de Vida do Lembrete e Registro de Manutenção
            </h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              Automação Baseada em Km e Tempo
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h4 className="font-bold text-sm text-blue-950">Gatilho de Monitoramento</h4>
                <p className="text-xs text-slate-600">
                  O sistema compara o hodômetro atual com o limite de <strong>10.000 km</strong> ou <strong>180 dias</strong> desde a última troca de óleo.
                </p>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h4 className="font-bold text-sm text-amber-950">Alerta Proativo</h4>
                <p className="text-xs text-slate-600">
                  Card de destaque amarelo no topo do Dashboard com botão de ação direta: &quot;Troca de óleo necessária em 450 km&quot;.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h4 className="font-bold text-sm text-blue-950">Registro Guiado (3 Toques)</h4>
                <p className="text-xs text-slate-600">
                  Usuário preenche apenas valor e data (o hodômetro já vem pré-carregado). Salva com validação imediata.
                </p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <h4 className="font-bold text-sm text-emerald-950">Recálculo & Histórico</h4>
                <p className="text-xs text-slate-600">
                  Histórico atualizado instantaneamente, status volta para regular e nova meta de km é projetada automaticamente.
                </p>
              </div>

            </div>

            {/* Visual Box do Algoritmo */}
            <div className="p-4 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs space-y-2 border border-slate-800">
              <span className="text-amber-400 font-bold block">// Algoritmo do Motor de Lembretes (JavaScript/TypeScript Engine)</span>
              <pre className="text-slate-300 overflow-x-auto">
{`function calculateOilChangeStatus(currentKm, lastServiceKm, lastServiceDate) {
  const KM_INTERVAL = 10000;
  const DAYS_INTERVAL = 180; // 6 meses
  
  const kmRemaining = (lastServiceKm + KM_INTERVAL) - currentKm;
  const daysElapsed = (Date.now() - new Date(lastServiceDate).getTime()) / (1000 * 3600 * 24);
  const daysRemaining = Math.max(0, Math.round(DAYS_INTERVAL - daysElapsed));
  
  if (kmRemaining <= 0 || daysRemaining <= 0) {
    return { urgency: 'critical', message: 'VENCIDA! Agende a troca imediatamente.' };
  } else if (kmRemaining <= 1000 || daysRemaining <= 30) {
    return { urgency: 'warning', message: \`ATENÇÃO: Vence em \${kmRemaining} km ou \${daysRemaining} dias.\` };
  }
  return { urgency: 'ok', message: \`Regular: Próxima em \${kmRemaining} km.\` };
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
