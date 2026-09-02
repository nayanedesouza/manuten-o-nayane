import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Send, 
  ShieldCheck, 
  FileJson, 
  Server, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const ApiSpecsView: React.FC = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      id: 'ep-veiculos-get',
      method: 'GET',
      path: '/api/veiculos',
      summary: 'Lista todos os veículos cadastrados do proprietário',
      description: 'Retorna a frota de veículos com odômetro atualizado e condutor principal vinculado.',
      responseExample: `[
  {
    "id": "c1f729b4-3a91-49b8-b192-563b711e9f1a",
    "marca": "Toyota",
    "modelo": "Corolla Cross XRE 2.0",
    "ano": 2023,
    "placa": "BRA-2E19",
    "quilometragemAtual": 38450,
    "tipoCombustivel": "flex",
    "condutorPrincipal": {
      "id": "d8201a9b-22fa-4cb2-a741-6e3e58fa21e0",
      "nome": "Carlos Eduardo Silva"
    }
  }
]`
    },
    {
      id: 'ep-manutencoes-post',
      method: 'POST',
      path: '/api/veiculos/:id/manutencoes',
      summary: 'Registra uma nova manutenção (Óleo, Pneus, Preventiva ou Corretiva)',
      description: 'Valida tipo de manutenção, atualiza odômetro do veículo caso maior e projeta próximo prazo de revisão.',
      requestExample: `{
  "tipo": "troca_oleo",
  "titulo": "Troca de Óleo e Filtro (Sintético 0W-20)",
  "data": "2026-09-02",
  "quilometragem": 38450,
  "custo": 420.00,
  "oficinaPrestador": "Concessionária Toyota",
  "observacoes": "Óleo 0W-20 API SP, trocado filtro genuíno",
  "proximaKmSugerida": 48450
}`,
      responseExample: `{
  "id": "e4418a09-5a12-4eb2-a128-4091b1fa9021",
  "status": "created",
  "proximaRevisaoKm": 48450,
  "proximaRevisaoData": "2027-03-02",
  "mensagem": "Manutenção registrada com sucesso. Alertas atualizados."
}`
    },
    {
      id: 'ep-abastecimento-post',
      method: 'POST',
      path: '/api/veiculos/:id/abastecimentos',
      summary: 'Registra abastecimento e calcula consumo médio (km/L)',
      description: 'Calcula a eficiência energética se for tanque cheio comparado ao abastecimento anterior.',
      requestExample: `{
  "data": "2026-09-02",
  "quilometragem": 38450,
  "litros": 42.5,
  "valorTotal": 246.50,
  "tipoCombustivel": "gasolina",
  "tanqueCheio": true
}`,
      responseExample: `{
  "id": "a98124b1-912a-43cf-8700-1129fca1209b",
  "kmPercorridosDesdeUltimo": 570,
  "consumoKmL": 13.41,
  "mediaMensalVeiculoKmL": 12.85,
  "mensagem": "Abastecimento salvo e média recalculada com sucesso."
}`
    },
    {
      id: 'ep-lembretes-get',
      method: 'GET',
      path: '/api/veiculos/:id/lembretes',
      summary: 'Retorna alertas ativos de trocas de óleo e revisões',
      description: 'Mecanismo de triagem de urgência (OK, Atenção, Vencida) baseado em data e km.',
      responseExample: `[
  {
    "tipo": "troca_oleo",
    "titulo": "Troca de Óleo e Filtro",
    "urgencia": "warning",
    "kmRestantes": 450,
    "diasRestantes": 22,
    "mensagem": "Troca recomendada em 450 km ou em 22 dias para preservar o motor."
  }
]`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <Code2 className="w-3.5 h-3.5" />
            Contratos de API RESTful
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Guia de Integração e Endpoints Backend
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Contratos prontos para desenvolvimento e homologação de rotas pelo desenvolvedor backend ou full-stack.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-mono">
            Content-Type: application/json
          </span>
        </div>
      </div>

      {/* Lista de Endpoints */}
      <div className="space-y-6">
        {endpoints.map((ep) => {
          const isGet = ep.method === 'GET';
          return (
            <div 
              key={ep.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Header do Endpoint */}
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold font-mono ${
                    isGet ? 'bg-blue-600 text-white' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-mono font-bold text-sm text-slate-900">{ep.path}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-medium">{ep.summary}</span>
                  <button
                    onClick={() => copyToClipboard(ep.path, ep.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                    title="Copiar Rota"
                  >
                    {copiedEndpoint === ep.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Corpo com Exemplos */}
              <div className="p-4 sm:p-6 space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">{ep.description}</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {ep.requestExample && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-bold uppercase tracking-wider text-slate-700">Request Body (JSON):</span>
                      </div>
                      <pre className="bg-slate-950 text-slate-200 p-3.5 rounded-xl font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
                        {ep.requestExample}
                      </pre>
                    </div>
                  )}

                  <div className={`space-y-1.5 ${!ep.requestExample ? 'lg:col-span-2' : ''}`}>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold uppercase tracking-wider text-emerald-700">Response (200 OK):</span>
                    </div>
                    <pre className="bg-slate-950 text-emerald-300 p-3.5 rounded-xl font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
                      {ep.responseExample}
                    </pre>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Regras de Validação Backend */}
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 space-y-3">
        <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          Regras de Validação de Entrada Obrigatórias (Business Rules):
        </h3>
        <ul className="text-xs text-amber-900 space-y-2 list-disc list-inside leading-relaxed">
          <li><strong>Placa de Veículo:</strong> Deve ser normalizada para caixa alta e validar regex padrão Mercosul (<code className="font-mono bg-amber-100 px-1 py-0.5 rounded">[A-Z]{`{3}`}[0-9][A-Z0-9][0-9]{`{2}`}</code>) ou tradicional (<code className="font-mono bg-amber-100 px-1 py-0.5 rounded">[A-Z]{`{3}`}-[0-9]{`{4}`}</code>).</li>
          <li><strong>Consistência do Hodômetro:</strong> A quilometragem informada na manutenção ou abastecimento não pode ser inferior ao último registro cadastrado daquele veículo.</li>
          <li><strong>Custos e Valores:</strong> Devem ser obrigatoriamente numéricos positivos (<code className="font-mono bg-amber-100 px-1 py-0.5 rounded">&gt;= 0.00</code>).</li>
          <li><strong>Integridade de Exclusão:</strong> Caso um veículo seja excluído, todas as manutenções e abastecimentos associados devem ser excluídos em cascata para evitar registros órfãos.</li>
        </ul>
      </div>

    </div>
  );
};
