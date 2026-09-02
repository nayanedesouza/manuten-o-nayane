/**
 * Especificação Técnica Completa do Sistema de Controle de Manutenção Veicular
 * Documento oficial de arquitetura de software para repasse ao time de desenvolvimento.
 */

export const technicalSpecificationMarkdown = `# DOCUMENTO DE ESPECIFICAÇÃO TÉCNICA DE SOFTWARE (SRS / ARCHITECTURE SPEC)
## SISTEMA DE GESTÃO E CONTROLE DE MANUTENÇÃO VEICULAR ("AUTOTRACK / MANUTENÇÃO FÁCIL")

**Documento:** ET-AUTO-2026-V1.0  
**Data:** Setembro de 2026  
**Arquiteto Responsável:** Arquiteto de Software Especialista em Aplicações Web de Gestão  
**Público-Alvo:** Engenheiros de Software, Desenvolvedores Full-Stack/Front-End, Designers de UX/UI e Product Owners  
**Status:** Aprovado para Implementação  

---

### 1. VISÃO GERAL E OBJETIVO DO PROJETO

#### 1.1 Objetivo Principal
Desenvolver uma aplicação web leve, intuitiva, acessível e responsiva voltada a proprietários de veículos (usuários leigos em tecnologia). O aplicativo tem como premissa central simplificar o controle preventivo e corretivo veicular, eliminando a dependência de anotações em papel ou planilhas complexas, garantindo segurança patrimonial e viária por meio de **lembretes proativos de manutenção** e **dicas educativas de direção defensiva**.

#### 1.2 Personas e Perfil de Acessibilidade
* **Persona Principal (Usuário Leigo):** Motoristas do dia a dia, chefes de família ou pequenos profissionais autônomos que não dominam termos mecânicos avançados.
* **Princípio de UX:** O sistema não deve exigir mais do que **3 toques/cliques** para registrar uma manutenção comum (como troca de óleo ou abastecimento). Campos técnicos complexos devem possuir sugestões automáticas e textos de apoio com linguagem simples.
* **Identificação Imediata:** O nome do proprietário/responsável deve estar sempre visível na barra superior, reforçando a titularidade e o contexto operacional.

---

### 2. ARQUITETURA DO SISTEMA

#### 2.1 Modelo Arquitetural
A aplicação adota uma **Arquitetura em Camadas (Layered Architecture)** com padrão **Client-First / Offline-Resilient SPA (Single Page Application)**, garantindo carregamento instantâneo (< 1.5s em redes 3G) e persistência confiável:

1. **Camada de Apresentação (UI / UX Layer):**
   * Interface desenvolvida em Componentes Funcionais Reativos.
   * Sistema de Design baseado em Atomic Design (Atoms: Botões, Badges; Molecules: Campos com cálculo automático, Cards de alerta; Organisms: Modais de Registro, Dashboard de Monitoramento).
2. **Camada de Lógica de Negócio (Domain & State Layer):**
   * Gerenciamento de estado previsível e desacoplado.
   * Motores de cálculo isolados (*Calculation Engines*):
     * *FuelEconomyEngine:* Cálculo de km/litro e médias móveis ponderadas.
     * *MaintenanceReminderEngine:* Comparador do hodômetro atual e datas limites para disparo de alertas preventivos.
3. **Camada de Acesso a Dados & Persistência (Data Access Layer):**
   * Repositório abstrato (*Repository Pattern*). Permite operar com persistência local instantânea (*LocalStorage / IndexedDB*) e sincronização RESTful com backend em nuvem sem refatoração de código de interface.
4. **Camada de Infraestrutura e Serviços Externos (Backend / API Layer):**
   * API RESTful em Node.js com Express e validações de esquema.

#### 2.2 Requisitos Não Funcionais (RNF)
* **RNF-01 Performance:** First Contentful Paint (FCP) < 1.2s; Time to Interactive (TTI) < 2.0s em dispositivos móveis modestos.
* **RNF-02 Responsividade:** Design fluido que atenda desde smartphones compactos (360px de largura) até monitores desktop widescreen (1920px+).
* **RNF-03 Confiabilidade & Persistência:** Dados salvos a cada alteração com cópia de segurança em armazenamento local resiliente contra fechamentos involuntários de aba.
* **RNF-04 Usabilidade (Nielsen Heuristics):** Visibilidade do estado do sistema com alertas em cores padronizadas (Amarelo para atenção, Azul para ações neutras/informativas, Verde para situação regular).

---

### 3. ESTRUTURA DO BANCO DE DADOS E MODELO DE DADOS

#### 3.1 Modelo Conceitual (Entidades & Relacionamentos)
* **Proprietário/Usuário (1)** ──possui──> **(N) Veículos**
* **Veículo (1)** ──possui──> **(N) Condutores Associados** (relação N:N permitida via tabela associativa)
* **Veículo (1)** ──acumula──> **(N) Registros de Manutenção**
* **Veículo (1)** ──acumula──> **(N) Registros de Abastecimento**
* **Veículo (1)** ──gera──> **(N) Lembretes Automáticos**

#### 3.2 Esquema Físico Relacional (SQL DDL PostgreSQL)

\`\`\`sql
-- 1. Tabela de Condutores
CREATE TABLE condutores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(120) NOT NULL,
    cnh VARCHAR(20),
    telefone VARCHAR(20),
    email VARCHAR(120),
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Veículos
CREATE TABLE veiculos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    marca VARCHAR(60) NOT NULL,
    modelo VARCHAR(80) NOT NULL,
    ano_fabricacao INTEGER NOT NULL CHECK (ano_fabricacao >= 1950),
    placa VARCHAR(10) NOT NULL UNIQUE,
    quilometragem_atual INTEGER NOT NULL DEFAULT 0,
    cor VARCHAR(40),
    tipo_combustivel VARCHAR(20) DEFAULT 'flex',
    condutor_principal_id UUID REFERENCES condutores(id) ON DELETE SET NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela Associativa Veículo-Condutores
CREATE TABLE veiculo_condutores (
    veiculo_id UUID NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    condutor_id UUID NOT NULL REFERENCES condutores(id) ON DELETE CASCADE,
    PRIMARY KEY (veiculo_id, condutor_id)
);

-- 4. Tabela de Manutenções (Troca de Óleo, Pneus, Preventiva, Corretiva)
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

-- 5. Tabela de Abastecimentos (Para Cálculo de Consumo Médio Mensal)
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
);

-- Índices de Otimização
CREATE INDEX idx_veiculos_placa ON veiculos(placa);
CREATE INDEX idx_manutencoes_veiculo ON manutencoes(veiculo_id, data_servico DESC);
CREATE INDEX idx_abastecimentos_veiculo ON abastecimentos(veiculo_id, data_abastecimento DESC);
\`\`\`

---

### 4. ESPECIFICAÇÃO DE DESIGN, TELAS E INTERFACE (UI/UX)

#### 4.1 Identidade Visual e Paleta de Cores
* **Azul Petróleo / Marinho (Cor Primária - Confiança e Solidez):**
  * Primária 900: \`#1E3A8A\` (Títulos, Topbar, Cartões Institucionais)
  * Primária 600: \`#2563EB\` (Botões de Ação Principal, Destaques Interativos)
  * Primária 50: \`#EFF6FF\` (Superfícies de apoio e badges suaves)
* **Amarelo Dourado / Âmbar (Cor Secundária e Destaque - Energia e Alerta Preventivo):**
  * Amarelo 500: \`#F59E0B\` (Badges de atenção, botões de ação rápida, ícones de manutenção preventiva)
  * Amarelo 600: \`#D97706\` (Contraste para textos informativos de segurança)
  * Amarelo 100: \`#FEF3C7\` (Fundos de alertas de revisão e avisos)
* **Neutros Sofisticados:** Fundo em \`#F8FAFC\` e Texto em \`#0F172A\`, respeitando taxa de contraste WCAG AA superior a 4.5:1.

#### 4.2 Topbar e Elemento de Cabeçalho (Obrigatório)
* **Exibição do Responsável:** Faixa superior fixa destacando:
  * Logotipo do aplicativo com ícone veicular.
  * Tag proeminente: **"Proprietário Responsável: [Nome do Usuário]"** com ícone de crachá/usuário.
  * Seletor rápido de veículo ativo (dropdown com placa e modelo).

#### 4.3 Layout das Principais Páginas/Telas
1. **Tela 1: Dashboard de Controle Geral (Visão 360°)**
   * *Header de Identificação:* Nome do Proprietário, Veículo selecionado e odômetro atual.
   * *Barra de Alertas Ativos:* Cards com borda amarela destacando: "Troca de óleo vence em 450 km" ou "Troca de óleo vencida há 5 dias".
   * *Cards de Métricas Rápidas:* 
     * Consumo Médio do Mês (ex: 12.4 km/L).
     * Gasto Total em Manutenções no Ano.
     * Última Revisão Realizada.
   * *Acesso Rápido (Quick Actions):* Botões grandes: "+ Troca de Óleo", "+ Pneus", "+ Manutenção", "+ Abastecer".

2. **Tela 2: Módulo de Cadastro (Veículos & Condutores)**
   * Listagem em cartões visuais para cada veículo (Marca, Modelo, Ano, Placa em formato padrão Mercosul, Km atual).
   * Seção de Condutores com vínculo visual direto a quais veículos cada condutor tem autorização de dirigir.
   * Formulário intuitivo sem termos técnicos difíceis: preenchimento guiado com máscaras de placa (\`AAA-0A00\`) e validação instantânea.

3. **Tela 3: Módulo de Manutenção (Histórico Detalhado)**
   * Filtros segmentados por abas ou pills: **Todas | Trocas de Óleo | Rodízio de Pneus | Preventivas | Corretivas**.
   * Formulários específicos com campos obrigatórios:
     * *Troca de Óleo:* Data, Quilometragem atual, Custo, Tipo de Óleo/Filtro e próxima troca sugerida (+10.000 km ou 6 meses).
     * *Rodízio de Pneus:* Data, Custo, Posições invertidas, Próximo rodízio (+10.000 km).
     * *Manutenção Preventiva:* Tipo (ex: Pastilhas de freio, Correia dentada, Velas), Descrição, Data, Custo.
     * *Manutenção Corretiva:* Tipo (ex: Troca de radiador, Amortecedor quebrado), Descrição do defeito, Data, Custo.
   * Timeline visual cronológica com botão de expandir recibo/detalhes.

4. **Tela 4: Módulo de Monitoramento (Consumo & Custos)**
   * Gráfico de histórico de custos mensais agrupado por categoria (Óleo, Pneus, Preventiva, Corretiva, Combustível).
   * Calculadora automática de consumo:
     * Fórmula: \`Consumo (km/L) = (Km_Atual - Km_Anterior) / Litros_Abastecidos\`
     * Médias mensais consolidadas com comparativo de economia.

5. **Tela 5: Módulo Informativo (Direção Defensiva & Segurança)**
   * Guias visuais práticos organizados em 4 categorias vitais:
     * *Condições Adversas (Chuva/Aquaplanagem, Neblina, Noite).*
     * *Regra dos Dois Segundos (Distância de Seguimento).*
     * *Inspeção Preventiva Pré-Viagem (Checklist interativo de 5 minutos).*
     * *Postura e Ergonomia ao Volante.*

---

### 5. FLUXOS DE NAVEGAÇÃO E JORNADAS DO USUÁRIO

\`\`\`
[Usuário Acessa o Sistema]
         │
         ▼
[Topbar: Exibe Proprietário Responsável & Veículo Ativo]
         │
         ├───> [Dashboard Principal] ────> Alertas de Troca de Óleo / Pneus
         │           │
         │           ├───> Botão Rápido: "+ Nova Manutenção"
         │           │            │
         │           │            ├───> [Modal: Troca de Óleo] (Data, Km, R$)
         │           │            ├───> [Modal: Rodízio de Pneus] (Data, R$)
         │           │            ├───> [Modal: Preventiva] (Tipo, Descrição, R$)
         │           │            └───> [Modal: Corretiva] (Defeito, Descrição, R$)
         │           │
         │           └───> Botão Rápido: "+ Abastecimento" ──> Recalcula Consumo km/L
         │
         ├───> [Módulo de Veículos & Condutores]
         │           ├── Cadastrar Novo Veículo (Placa, Marca, Modelo, Ano, Km)
         │           └── Cadastrar / Vincular Condutor (Nome, CNH, Telefone)
         │
         ├───> [Módulo de Histórico de Manutenções] ──> Filtros por Tipo & Exportação
         │
         ├───> [Módulo de Monitoramento & Custos] ────> Gráficos Mensais & Médias
         │
         └───> [Módulo de Direção Defensiva] ────────> Checklist e Dicas Interativas
\`\`\`

---

### 6. STACK TÉCNICO RECOMENDADO E JUSTIFICATIVAS

| Camada | Tecnologia Recomendada | Justificativa Técnica |
| :--- | :--- | :--- |
| **Front-End Framework** | **React 19 + TypeScript + Vite** | Alta velocidade de compilação, ecossistema rico, tipagem estrita para evitar erros em cálculos de quilometragem e custos. |
| **Estilização & Design** | **Tailwind CSS v4** | Utilização de classes utilitárias para garantir a paleta de cores azul e amarelo com precisão matemática, sem sobrecarga de CSS externo. |
| **Biblioteca de Ícones** | **Lucide React** | Mais de 800 ícones vetoriais consistentes, perfeitos para sinalização automotiva (chave inglesa, óleo, combustível, velocímetro, alerta). |
| **Back-End API** | **Node.js com Express ou Fastify** | Leve, performático, fácil manutenção e suporte nativo a JSON para endpoints RESTful. |
| **Banco de Dados** | **PostgreSQL (Cloud SQL / Supabase)** | Suporte a constraints ACID, tipos monetários (\`NUMERIC\`), consultas de agregação de custos e suporte a índices temporais. |
| **Armazenamento Offline** | **LocalStorage / IndexedDB** | Permite funcionamento da aplicação mesmo em locais com sinal instável (garagens subterrâneas ou estradas). |

---

### 7. CRONOGRAMA REALISTA DE DESENVOLVIMENTO (8 SEMANAS)

O projeto está estruturado em **4 Sprints de 2 semanas cada**, seguindo a metodologia ágil Scrum:

* **Sprint 1 (Semanas 1-2): Fundação & Arquitetura**
  * Configuração do repositório, pipeline CI/CD e setup do Tailwind com a paleta Azul/Amarelo.
  * Criação dos schemas de banco de dados e migrações.
  * Implementação da Topbar (com Nome do Proprietário) e Módulo de Cadastro de Veículos e Condutores.
  * *Entregável:* CRUD de veículos e condutores funcional com persistência.

* **Sprint 2 (Semanas 3-4): Motor de Manutenções & Histórico**
  * Desenvolvimento dos formulários específicos: Troca de óleo, rodízio de pneus, preventiva e corretiva.
  * Listagem com filtros de histórico, timeline e ordenação por data/km.
  * *Entregável:* Registro e visualização de todos os tipos de manutenções com cálculo de próximos prazos.

* **Sprint 3 (Semanas 5-6): Monitoramento, Consumo e Alertas Automáticos**
  * Módulo de registro de abastecimentos e cálculo automático do consumo médio (km/L) mensal.
  * Algoritmo de lembrete proativo de troca de óleo (comparação km atual x próxima revisão e dias decorridos).
  * Dashboard de relatórios de custos consolidados.
  * *Entregável:* Alertas automáticos funcionando e painel de consumo mensal ativo.

* **Sprint 4 (Semanas 7-8): Módulo Informativo, Testes & Lançamento**
  * Desenvolvimento da seção interativa de Direção Defensiva e Checklist pré-viagem.
  * Testes de usabilidade com usuários leigos, auditoria de acessibilidade (WCAG AA) e testes de responsividade mobile.
  * Otimizações de performance (Lighthouse > 90) e deploy em ambiente de produção.
  * *Entregável:* Versão 1.0 homologada e pronta para uso final.

---

### 8. CONTRATOS DE API REST (ENDPOINTS PRINCIPAIS)

#### 8.1 Endpoints de Veículos e Condutores
* \`GET /api/veiculos\` - Lista todos os veículos do proprietário
* \`POST /api/veiculos\` - Cadastra um novo veículo
* \`PUT /api/veiculos/:id/quilometragem\` - Atualiza o hodômetro atual do veículo (dispara recalculo de alertas)
* \`GET /api/condutores\` - Lista condutores cadastrados
* \`POST /api/condutores\` - Cadastra novo condutor e vincula a veículos

#### 8.2 Endpoints de Manutenção
* \`GET /api/veiculos/:id/manutencoes\` - Histórico completo de manutenções (suporta \`?tipo=troca_oleo\`)
* \`POST /api/veiculos/:id/manutencoes\` - Cria registro de manutenção (óleo, pneus, preventiva, corretiva)

#### 8.3 Endpoints de Abastecimento e Métricas
* \`POST /api/veiculos/:id/abastecimentos\` - Registra abastecimento e recalcula média
* \`GET /api/veiculos/:id/metricas-consumo\` - Retorna consumo médio mensal (km/L) e gastos totais
* \`GET /api/veiculos/:id/lembretes\` - Retorna lista de manutenções vencidas ou a vencer
`;

export const systemArchitectureDiagram = `
+-----------------------------------------------------------------------------------+
|                  CAMADA DE APRESENTAÇÃO (FRONTEND CLIENT - SPA)                   |
|  - Topbar com Nome do Responsável ("Proprietário: Carlos Eduardo Silva")          |
|  - Paleta de Cores: Azul Marinho (#1E3A8A / #2563EB) & Amarelo Ouro (#F59E0B)    |
|  - Componentes: Dashboard, Mód. Cadastro, Mód. Manutenção, Monitoramento, Dicas   |
+-----------------------------------------+-----------------------------------------+
                                          |
                        [Hooks & Calculation Engines]
                 - FuelEconomyEngine (km/L, custo médio)
                 - ReminderEngine (Hodômetro x Limite 10.000km / 6 meses)
                                          |
+-----------------------------------------v-----------------------------------------+
|                    REPOSITÓRIO DE DADOS & PERSISTÊNCIA                            |
|  - Camada de Abstração com Suporte Offline-First (LocalStorage / IndexedDB)       |
|  - Sincronização RESTful / HTTP Client com Backend                               |
+-----------------------------------------+-----------------------------------------+
                                          | JSON over HTTPS
                                          v
+-----------------------------------------------------------------------------------+
|                          BACKEND API REST (NODE / EXPRESS)                        |
|  - Rotas: /api/veiculos, /api/condutores, /api/manutencoes, /api/abastecimentos   |
|  - Middleware de Validação e Autenticação                                         |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                       BANCO DE DADOS (POSTGRESQL / SQLITE)                        |
|  - Tabelas: veiculos, condutores, manutencoes, abastecimentos                     |
|  - Índices em placa, data_servico e integridade referencial ACID                  |
+-----------------------------------------------------------------------------------+
`;

export const entityRelationshipModel = [
  {
    table: 'veiculos',
    description: 'Armazena a frota cadastrada do proprietário',
    columns: [
      { name: 'id', type: 'UUID (PK)', desc: 'Identificador único' },
      { name: 'marca', type: 'VARCHAR(60)', desc: 'Ex: Toyota, Volkswagen, Fiat' },
      { name: 'modelo', type: 'VARCHAR(80)', desc: 'Ex: Corolla Cross, Gol, Toro' },
      { name: 'ano_fabricacao', type: 'INTEGER', desc: 'Ano do veículo' },
      { name: 'placa', type: 'VARCHAR(10)', desc: 'Placa formato Mercosul única' },
      { name: 'quilometragem_atual', type: 'INTEGER', desc: 'Hodômetro atualizado' },
      { name: 'condutor_principal_id', type: 'UUID (FK)', desc: 'Referência ao condutor' },
    ]
  },
  {
    table: 'condutores',
    description: 'Motoristas autorizados a guiar os veículos cadastrados',
    columns: [
      { name: 'id', type: 'UUID (PK)', desc: 'Identificador único do motorista' },
      { name: 'nome', type: 'VARCHAR(120)', desc: 'Nome completo do condutor' },
      { name: 'cnh', type: 'VARCHAR(20)', desc: 'Número de registro da CNH' },
      { name: 'telefone', type: 'VARCHAR(20)', desc: 'Contato com WhatsApp' },
      { name: 'email', type: 'VARCHAR(120)', desc: 'E-mail para avisos/recibos' },
    ]
  },
  {
    table: 'manutencoes',
    description: 'Histórico unificado de intervenções mecânicas',
    columns: [
      { name: 'id', type: 'UUID (PK)', desc: 'Identificador do serviço' },
      { name: 'veiculo_id', type: 'UUID (FK)', desc: 'Veículo que recebeu o serviço' },
      { name: 'tipo', type: 'ENUM', desc: 'troca_oleo | rodizio_pneus | preventiva | corretiva' },
      { name: 'titulo', type: 'VARCHAR(140)', desc: 'Resumo do serviço realizado' },
      { name: 'descricao', type: 'TEXT', desc: 'Observações, marcas das peças utilizadas' },
      { name: 'data_servico', type: 'DATE', desc: 'Data em que o serviço ocorreu' },
      { name: 'quilometragem_servico', type: 'INTEGER', desc: 'Km do veículo no momento' },
      { name: 'custo', type: 'NUMERIC(10,2)', desc: 'Valor total pago em R$' },
      { name: 'km_proxima_revisao', type: 'INTEGER', desc: 'Meta de km para próximo aviso' },
      { name: 'data_proxima_revisao', type: 'DATE', desc: 'Meta de data para próximo aviso' },
    ]
  },
  {
    table: 'abastecimentos',
    description: 'Registros para cálculo contínuo do consumo médio (km/L)',
    columns: [
      { name: 'id', type: 'UUID (PK)', desc: 'Identificador do abastecimento' },
      { name: 'veiculo_id', type: 'UUID (FK)', desc: 'Veículo abastecido' },
      { name: 'data_abastecimento', type: 'DATE', desc: 'Data do abastecimento' },
      { name: 'quilometragem', type: 'INTEGER', desc: 'Hodômetro no ato da bomba' },
      { name: 'litros', type: 'NUMERIC(6,2)', desc: 'Volume colocado em litros' },
      { name: 'valor_total', type: 'NUMERIC(8,2)', desc: 'Valor total gasto em R$' },
      { name: 'tipo_combustivel', type: 'VARCHAR(20)', desc: 'Gasolina, Etanol ou Diesel' },
      { name: 'tanque_cheio', type: 'BOOLEAN', desc: 'Se encheu até o desarme automático' },
    ]
  }
];
