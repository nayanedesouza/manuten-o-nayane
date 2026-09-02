import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Layers, 
  Database, 
  Layout, 
  Compass, 
  Cpu, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { technicalSpecificationMarkdown } from '../data/specificationData';

interface SpecificationViewProps {
  onGoToPrototype: () => void;
  onPrint: () => void;
  onExportMarkdown: () => void;
}

export const SpecificationView: React.FC<SpecificationViewProps> = ({
  onGoToPrototype,
  onPrint,
  onExportMarkdown
}) => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('sec-1');

  const handleCopy = () => {
    navigator.clipboard.writeText(technicalSpecificationMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const sections = [
    { id: 'sec-1', label: '1. Visão Geral & Objetivos', icon: BookOpen },
    { id: 'sec-2', label: '2. Arquitetura do Sistema', icon: Layers },
    { id: 'sec-3', label: '3. Modelo de Banco de Dados', icon: Database },
    { id: 'sec-4', label: '4. Layouts & Design System', icon: Layout },
    { id: 'sec-5', label: '5. Fluxo de Navegação', icon: Compass },
    { id: 'sec-6', label: '6. Stack Técnico Recomendado', icon: Cpu },
    { id: 'sec-7', label: '7. Cronograma Realista (8 Sem.)', icon: Calendar },
    { id: 'sec-8', label: '8. Contratos de API & Regras', icon: ShieldCheck }
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Banner de Ação Rápida e Handoff para Engenharia */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl mb-8 border border-blue-700/50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Documento Oficial de Engenharia de Software
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Especificação Técnica: Controle de Manutenção Veicular
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Documentação arquitetural de ponta a ponta desenvolvida para repasse direto ao desenvolvedor.
              Inclui requisitos funcionais, modelo relacional DDL, design system azul & amarelo, fluxos de usuário leigo e cronograma de 8 semanas.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onGoToPrototype}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-400/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              Testar Protótipo Funcional
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-blue-700/60 hover:bg-blue-700 text-white font-medium text-sm border border-blue-500/40 flex items-center gap-2 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar Markdown'}
            </button>
            <button
              onClick={onPrint}
              className="px-4 py-2.5 rounded-xl bg-blue-700/60 hover:bg-blue-700 text-white font-medium text-sm border border-blue-500/40 flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimir / PDF
            </button>
          </div>
        </div>

        {/* Metadados Técnicos Rápidos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-700/60 text-xs text-blue-200">
          <div>
            <span className="text-blue-300 block font-medium">Código do Documento:</span>
            <span className="font-mono font-bold text-white">ET-AUTO-2026-V1.0</span>
          </div>
          <div>
            <span className="text-blue-300 block font-medium">Público-Alvo:</span>
            <span className="font-semibold text-white">Engenharia / Full-Stack</span>
          </div>
          <div>
            <span className="text-blue-300 block font-medium">Complexidade:</span>
            <span className="font-semibold text-amber-300">Média (Foco em UX Simples)</span>
          </div>
          <div>
            <span className="text-blue-300 block font-medium">Prazo Estimado:</span>
            <span className="font-semibold text-white">8 Semanas (4 Sprints)</span>
          </div>
        </div>
      </div>

      {/* Grid Principal: Sumário Flutuante à Esquerda + Conteúdo Técnico Estruturado */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sumário Navegável (Sidebar) */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Sumário Executivo
            </div>
            <nav className="space-y-1">
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">{sec.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs space-y-1.5">
                <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Pronto para Desenvolvimento
                </span>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  O desenvolvedor pode copiar o script SQL DDL e iniciar a modelagem de tabelas e rotas imediatamente.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Corpo Completo da Especificação Técnica */}
        <div className="lg:col-span-3 space-y-8 text-slate-800">
          
          {/* Seção 1: Visão Geral */}
          <section id="sec-1" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Seção 01</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Visão Geral e Objetivos do Sistema</h2>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              O <strong>AutoTrack Manutenção</strong> é uma aplicação web concebida para atender proprietários e condutores veiculares com pouca ou nenhuma familiaridade técnica com termos de engenharia automotiva. O foco é transformar anotações dispersas em lembretes proativos e economia financeira.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-1">🎯 Objetivo Primário</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Garantir que o proprietário jamais perca o prazo de troca de óleo, rodízio de pneus ou manutenção preventiva, evitando prejuízos mecânicos graves e aumentando a segurança viária.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-1">💡 Princípio de UX para Leigos</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Qualquer cadastro essencial (óleo, abastecimento ou condutor) deve ser executável em até <strong>3 toques</strong>. Formulários possuem máscaras automáticas e valores pré-preenchidos inteligentes.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 2: Arquitetura do Sistema */}
          <section id="sec-2" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Seção 02</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Arquitetura de Software</h2>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Adota-se uma <strong>Arquitetura em Camadas (Layered / Clean Architecture)</strong> orientada a serviços leves, com estratégia <strong>Offline-First / Client-Side Resilient</strong>:
            </p>

            {/* Diagrama Arquitetural Ilustrativo */}
            <div className="bg-slate-900 text-slate-100 rounded-xl p-5 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
              <div className="text-amber-400 font-bold mb-2">// Visão Geral dos Componentes Arquiteturais</div>
              <pre className="text-slate-300 leading-normal">
{`+-------------------------------------------------------------------------+
|                  CAMADA DE APRESENTAÇÃO (UI / SPA)                     |
|  - Topbar com Nome do Responsável ("Proprietário: Carlos Eduardo Silva") |
|  - Paleta: Azul (#1E3A8A / #2563EB) e Amarelo Destaque (#F59E0B)        |
|  - Módulos: Dashboard, Cadastro, Manutenções, Monitoramento, Dicas      |
+------------------------------------+------------------------------------+
                                     |
              [Calculation Engines & Domain Logic]
              - FuelEconomyEngine (km/litro e médias móveis)
              - ReminderEngine (Hodômetro x Prazos de 10.000km / 6 meses)
                                     |
+------------------------------------v------------------------------------+
|                  CAMADA DE REPOSITÓRIO & PERSISTÊNCIA                  |
|  - Suporte Offline com LocalStorage / IndexedDB                         |
|  - Sincronização RESTful via Fetch / Axios com Backend                  |
+------------------------------------+------------------------------------+
                                     | JSON over HTTPS
                                     v
+-------------------------------------------------------------------------+
|                    BACKEND REST API (NODE.JS / EXPRESS)                 |
|  - Rotas: /veiculos, /condutores, /manutencoes, /abastecimentos         |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                  BANCO DE DADOS RELACIONAL (POSTGRESQL)                 |
|  - Integridade referencial ACID, índices em placas e datas de revisão   |
+-------------------------------------------------------------------------+`}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="text-xs font-bold text-blue-700 uppercase">Apresentação</div>
                <div className="text-sm font-semibold text-slate-900 mt-1">SPA Responsiva</div>
                <p className="text-xs text-slate-600 mt-1">
                  Interface leve e fluida compatível com navegadores mobile e desktop sem recarregamento de página.
                </p>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="text-xs font-bold text-blue-700 uppercase">Motores de Domínio</div>
                <div className="text-sm font-semibold text-slate-900 mt-1">Calculation Engines</div>
                <p className="text-xs text-slate-600 mt-1">
                  Lógica pura desacoplada para alertas de óleo, pneus e estatísticas de consumo médio de combustível.
                </p>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="text-xs font-bold text-blue-700 uppercase">Persistência Híbrida</div>
                <div className="text-sm font-semibold text-slate-900 mt-1">Offline-Resilient</div>
                <p className="text-xs text-slate-600 mt-1">
                  Dados salvos localmente de imediato com replicação assíncrona para o banco de dados em nuvem.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 3: Modelo de Banco de Dados */}
          <section id="sec-3" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Seção 03</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Estrutura de Banco de Dados & Modelo Físico</h2>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Estrutura relacional normalizada em 3FN (Terceira Forma Normal) com suporte a múltiplos veículos, múltiplos condutores, e histórico tipado de manutenções:
            </p>

            {/* Script DDL SQL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Script DDL PostgreSQL (Pronto para Execução):</span>
                <span className="text-[11px] text-slate-500 font-mono">schema.sql</span>
              </div>
              <div className="bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto shadow-inner">
                <pre className="text-emerald-400">
{`-- 1. TABELA DE CONDUTORES
CREATE TABLE condutores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(120) NOT NULL,
    cnh VARCHAR(20),
    telefone VARCHAR(20),
    email VARCHAR(120),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE VEÍCULOS
CREATE TABLE veiculos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    marca VARCHAR(60) NOT NULL,
    modelo VARCHAR(80) NOT NULL,
    ano_fabricacao INTEGER NOT NULL,
    placa VARCHAR(10) NOT NULL UNIQUE,
    quilometragem_atual INTEGER NOT NULL DEFAULT 0,
    cor VARCHAR(40),
    tipo_combustivel VARCHAR(20) DEFAULT 'flex',
    condutor_principal_id UUID REFERENCES condutores(id) ON DELETE SET NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE MANUTENÇÕES (Histórico Completo)
CREATE TYPE tipo_manutencao_enum AS ENUM ('troca_oleo', 'rodizio_pneus', 'preventiva', 'corretiva');

CREATE TABLE manutencoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    veiculo_id UUID NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    tipo tipo_manutencao_enum NOT NULL,
    titulo VARCHAR(140) NOT NULL,
    descricao TEXT,
    data_servico DATE NOT NULL,
    quilometragem_servico INTEGER NOT NULL,
    custo NUMERIC(10, 2) NOT NULL CHECK (custo >= 0),
    oficina_prestador VARCHAR(120),
    km_proxima_revisao INTEGER,
    data_proxima_revisao DATE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABELA DE ABASTECIMENTOS (Para Consumo Médio)
CREATE TABLE abastecimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    veiculo_id UUID NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    data_abastecimento DATE NOT NULL,
    quilometragem INTEGER NOT NULL,
    litros NUMERIC(6, 2) NOT NULL CHECK (litros > 0),
    valor_total NUMERIC(8, 2) NOT NULL CHECK (valor_total >= 0),
    tipo_combustivel VARCHAR(20) NOT NULL DEFAULT 'gasolina',
    tanque_cheio BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`}
                </pre>
              </div>
            </div>
          </section>

          {/* Seção 4: Layouts & Design System */}
          <section id="sec-4" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                <Layout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Seção 04</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Layout das Principais Telas & Guia de Design</h2>
              </div>
            </div>

            {/* Paleta de Cores Exigida */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Paleta de Cores do Projeto (Tons de Azul e Amarelo):
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200">
                  <div className="w-8 h-8 rounded-md bg-blue-900 border border-slate-300"></div>
                  <div className="text-[11px]">
                    <span className="font-bold block text-slate-900">Azul Marinho</span>
                    <span className="text-slate-500 font-mono">#1E3A8A</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200">
                  <div className="w-8 h-8 rounded-md bg-blue-600 border border-slate-300"></div>
                  <div className="text-[11px]">
                    <span className="font-bold block text-slate-900">Azul Real</span>
                    <span className="text-slate-500 font-mono">#2563EB</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200">
                  <div className="w-8 h-8 rounded-md bg-amber-500 border border-slate-300"></div>
                  <div className="text-[11px]">
                    <span className="font-bold block text-slate-900">Amarelo Ouro</span>
                    <span className="text-slate-500 font-mono">#F59E0B</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200">
                  <div className="w-8 h-8 rounded-md bg-amber-100 border border-amber-300"></div>
                  <div className="text-[11px]">
                    <span className="font-bold block text-slate-900">Amarelo Suave</span>
                    <span className="text-slate-500 font-mono">#FEF3C7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Descrição das 5 Telas Principais */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-slate-900">Especificação Detalhada das 5 Telas Principais:</h4>
              
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-4 bg-slate-50/50">
                  <span className="text-xs font-bold text-blue-700">Tela 1: Dashboard Geral (Visão 360°)</span>
                  <p className="text-xs text-slate-600 mt-1">
                    Exibe no topo o <strong>Nome do Proprietário Responsável</strong>, resumo do veículo ativo, alerta com borda amarela caso a troca de óleo esteja próxima (ex: &quot;Troca de óleo vence em 500 km&quot;), consumo médio do mês e 4 botões de ação rápida em destaque.
                  </p>
                </div>
                <div className="p-4">
                  <span className="text-xs font-bold text-blue-700">Tela 2: Módulo de Cadastro (Veículos & Condutores)</span>
                  <p className="text-xs text-slate-600 mt-1">
                    Cartões individuais para cada veículo (marca, modelo, ano, placa com visual Mercosul e km atualizado). Seção de condutores com nome, CNH, telefone e lista de veículos autorizados.
                  </p>
                </div>
                <div className="p-4 bg-slate-50/50">
                  <span className="text-xs font-bold text-blue-700">Tela 3: Módulo de Manutenção (Histórico Completo)</span>
                  <p className="text-xs text-slate-600 mt-1">
                    Listagem cronológica com filtros por tipo: <strong>Troca de óleo</strong> (km e data), <strong>Rodízio de pneus</strong>, <strong>Preventivas</strong> e <strong>Corretivas</strong>. Cada registro destaca custos em R$ e comprovantes.
                  </p>
                </div>
                <div className="p-4">
                  <span className="text-xs font-bold text-blue-700">Tela 4: Módulo de Monitoramento (Consumo & Custos)</span>
                  <p className="text-xs text-slate-600 mt-1">
                    Gráficos de evolução mensal de gastos, calculadora de consumo médio (km/L) a partir dos abastecimentos e painel com histórico consolidado de despesas.
                  </p>
                </div>
                <div className="p-4 bg-slate-50/50">
                  <span className="text-xs font-bold text-blue-700">Tela 5: Módulo Informativo (Direção Defensiva)</span>
                  <p className="text-xs text-slate-600 mt-1">
                    Cards com ilustrações e orientações práticas: como agir em aquaplanagem, a regra dos 2 segundos de distância, postura ao volante e checklist pré-viagem de 5 minutos.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 5: Fluxo de Navegação */}
          <section id="sec-5" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Seção 05</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Fluxo de Navegação e Jornada do Usuário</h2>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              O fluxo de navegação foi projetado para eliminar atritos para usuários não técnicos. Todas as ações primárias estão a 1 clique de distância da tela inicial:
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <ol className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <span><strong>Identificação & Seleção:</strong> Ao abrir o app, o usuário visualiza seu nome no topo e seleciona o veículo desejado pelo seletor de topo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <span><strong>Visualização de Alertas:</strong> Se houver troca de óleo próxima de vencer, um card amarelo com botão direto &quot;Registrar Troca Agora&quot; aparece em destaque.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <span><strong>Registro Guiado:</strong> O modal abre com a quilometragem atual já preenchida e sugere a data de hoje, solicitando apenas o valor e detalhes adicionais opcionais.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                  <span><strong>Recálculo Automático:</strong> Ao salvar, o odômetro do veículo é atualizado, os alertas são recalculados e o histórico é atualizado instantaneamente sem reload.</span>
                </li>
              </ol>
            </div>
          </section>

          {/* Seção 6: Tecnologias Recomendadas */}
          <section id="sec-6" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Seção 06</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Stack Técnico Recomendado</h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Camada</th>
                    <th className="p-3">Tecnologia</th>
                    <th className="p-3">Justificativa para a Escolha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-blue-900">Front-End</td>
                    <td className="p-3 font-mono font-bold text-slate-800">React 19 + TypeScript + Vite</td>
                    <td className="p-3 text-slate-600">Carregamento instantâneo, renderização veloz e forte tipagem contra erros em cálculos.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-blue-900">Estilização</td>
                    <td className="p-3 font-mono font-bold text-slate-800">Tailwind CSS v4</td>
                    <td className="p-3 text-slate-600">Implementação fiel da paleta azul/amarelo com CSS compilado ultraleve (&lt; 20KB).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-blue-900">Ícones</td>
                    <td className="p-3 font-mono font-bold text-slate-800">Lucide React</td>
                    <td className="p-3 text-slate-600">Ícones vetoriais com semântica automotiva e sem impacto na velocidade de carregamento.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-blue-900">Back-End API</td>
                    <td className="p-3 font-mono font-bold text-slate-800">Node.js + Express / Fastify</td>
                    <td className="p-3 text-slate-600">Simplicidade de manutenção, excelente throughput de requisições JSON e validação com Zod.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-blue-900">Banco de Dados</td>
                    <td className="p-3 font-mono font-bold text-slate-800">PostgreSQL</td>
                    <td className="p-3 text-slate-600">Garantia de integridade referencial ACID, consultas agregadas de custos e robustez.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-blue-900">Offline Cache</td>
                    <td className="p-3 font-mono font-bold text-slate-800">LocalStorage / IndexedDB</td>
                    <td className="p-3 text-slate-600">Garante funcionamento ininterrupto em garagens subterrâneas ou áreas sem sinal de internet.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Seção 7: Cronograma Realista */}
          <section id="sec-7" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Seção 07</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Cronograma Realista de Desenvolvimento (8 Semanas)</h2>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Plano de entrega estruturado em 4 sprints quinzenais com marcos bem definidos:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-blue-600 text-white">Sprint 1 • Semanas 1-2</span>
                  <span className="text-xs text-blue-700 font-semibold">Fundação</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Arquitetura & Módulo de Cadastro</h4>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Setup do projeto, Tailwind CSS (Azul/Amarelo) e pipeline CI/CD.</li>
                  <li>Migração do banco de dados (tabelas veiculos e condutores).</li>
                  <li>Topbar com Nome do Proprietário e CRUD de veículos/condutores.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-blue-600 text-white">Sprint 2 • Semanas 3-4</span>
                  <span className="text-xs text-blue-700 font-semibold">Manutenções</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Motor de Manutenção & Histórico</h4>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Formulários de troca de óleo, rodízio de pneus, preventiva e corretiva.</li>
                  <li>Linha do tempo cronológica com filtros rápidos por tipo de serviço.</li>
                  <li>Cálculo da próxima quilometragem programada (+10.000 km).</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">Sprint 3 • Semanas 5-6</span>
                  <span className="text-xs text-amber-800 font-semibold">Monitoramento</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Consumo & Lembretes Automáticos</h4>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Registro de abastecimento e cálculo contínuo de km/L.</li>
                  <li>Mecanismo de alertas automáticos por data ou quilometragem.</li>
                  <li>Histórico e gráficos mensais de custos operacionais.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">Sprint 4 • Semanas 7-8</span>
                  <span className="text-xs text-amber-800 font-semibold">Homologação</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Direção Defensiva & Deploy</h4>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Módulo informativo de Direção Defensiva e Checklist interativo.</li>
                  <li>Testes de usabilidade com usuários leigos e auditoria de acessibilidade.</li>
                  <li>Otimização de performance (Lighthouse 95+) e publicação oficial.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Seção 8: Contratos de API & Regras de Negócio */}
          <section id="sec-8" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Seção 08</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Contratos de API REST & Regras de Negócio</h2>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Fórmula de Cálculo de Consumo de Combustível:</h4>
              <div className="p-3.5 bg-slate-900 text-amber-300 rounded-xl font-mono text-xs">
                Consumo Médio (km/L) = (Km_Hodômetro_Atual - Km_Hodômetro_Anterior) / Litros_Abastecidos
              </div>
              <p className="text-xs text-slate-600">
                *Nota de Negócio: O cálculo é disparado sempre que o usuário registra abastecimento com tanque cheio, garantindo precisão matemática contra variações de bomba.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-slate-900">Regra do Lembrete Automático de Troca de Óleo:</h4>
              <div className="p-3.5 bg-blue-950 text-blue-200 rounded-xl font-mono text-xs space-y-1">
                <div>IF (Km_Atual &gt;= Km_Ultima_Troca + 10000) OR (Dias_Decorridos &gt;= 180) THEN:</div>
                <div className="text-amber-400 pl-4">STATUS = &apos;CRITICAL&apos; (Troca de Óleo Vencida!)</div>
                <div>ELSE IF (Km_Atual &gt;= Km_Ultima_Troca + 9000) OR (Dias_Decorridos &gt;= 150) THEN:</div>
                <div className="text-amber-300 pl-4">STATUS = &apos;WARNING&apos; (Troca de Óleo Próxima do Vencimento)</div>
                <div>ELSE:</div>
                <div className="text-emerald-400 pl-4">STATUS = &apos;OK&apos; (Em dia)</div>
              </div>
            </div>

            {/* Chamada Final para Teste do Protótipo */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Quer ver esta especificação em execução real?</h4>
                <p className="text-xs text-slate-600">Teste o protótipo funcional com os dados pré-carregados na aba ao lado.</p>
              </div>
              <button
                onClick={onGoToPrototype}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                Abrir Protótipo Funcional Agora
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
