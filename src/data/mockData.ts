import { Vehicle, Driver, MaintenanceRecord, FuelRecord, DefensiveDrivingTip } from '../types';

export const initialOwnerName = "Carlos Eduardo Silva";

export const initialDrivers: Driver[] = [
  {
    id: "drv-1",
    name: "Carlos Eduardo Silva",
    licenseNumber: "05829184710",
    phone: "(11) 98765-4321",
    email: "carlos.silva@email.com",
    associatedVehicleIds: ["veh-1", "veh-2"],
    isPrimary: true
  },
  {
    id: "drv-2",
    name: "Juliana Mendes Silva",
    licenseNumber: "04938271640",
    phone: "(11) 97654-3210",
    email: "juliana.mendes@email.com",
    associatedVehicleIds: ["veh-1"],
    isPrimary: false
  },
  {
    id: "drv-3",
    name: "Lucas Mendes Silva",
    licenseNumber: "06271938455",
    phone: "(11) 99123-8844",
    email: "lucas.silva@email.com",
    associatedVehicleIds: ["veh-2"],
    isPrimary: false
  }
];

export const initialVehicles: Vehicle[] = [
  {
    id: "veh-1",
    brand: "Toyota",
    model: "Corolla Cross XRE 2.0",
    year: 2023,
    licensePlate: "BRA-2E19",
    currentMileage: 38450,
    color: "Prata Lunar",
    fuelType: "flex",
    primaryDriverId: "drv-1",
    createdAt: "2023-03-15"
  },
  {
    id: "veh-2",
    brand: "Chevrolet",
    model: "Onix Premier Turbo 1.0",
    year: 2022,
    licensePlate: "RTO-8A45",
    currentMileage: 49800,
    color: "Azul Seeker",
    fuelType: "flex",
    primaryDriverId: "drv-2",
    createdAt: "2022-08-20"
  }
];

export const initialMaintenances: MaintenanceRecord[] = [
  {
    id: "maint-1",
    vehicleId: "veh-1",
    type: "troca_oleo",
    title: "Troca de Óleo e Filtro (Sintético 0W-20)",
    description: "Substituição de 4.2L de óleo 0W-20 API SP, troca do filtro de óleo genuíno e anel de vedação.",
    date: "2026-06-10",
    mileageAtService: 30000,
    cost: 420.00,
    serviceProvider: "Concessionária Toyota Nippo",
    receiptNumber: "NF-89210",
    nextScheduledMileage: 40000,
    nextScheduledDate: "2026-12-10",
    createdAt: "2026-06-10"
  },
  {
    id: "maint-2",
    vehicleId: "veh-1",
    type: "rodizio_pneus",
    title: "Rodízio e Balanceamento dos 4 Pneus",
    description: "Inversão dos pneus dianteiros e traseiros em X, calibragem e alinhamento a laser.",
    date: "2026-05-18",
    mileageAtService: 28500,
    cost: 160.00,
    serviceProvider: "Auto Center Pneus & Cia",
    receiptNumber: "OS-4412",
    nextScheduledMileage: 38500,
    createdAt: "2026-05-18"
  },
  {
    id: "maint-3",
    vehicleId: "veh-1",
    type: "preventiva",
    title: "Substituição de Pastilhas de Freio Dianteiras",
    description: "Instalação de pastilhas de cerâmica Cobreq e higienização do sistema de ar-condicionado com troca do filtro de cabine.",
    date: "2026-07-22",
    mileageAtService: 34200,
    cost: 650.00,
    serviceProvider: "Oficina Mecânica Especializada",
    receiptNumber: "NF-3321",
    createdAt: "2026-07-22"
  },
  {
    id: "maint-4",
    vehicleId: "veh-1",
    type: "corretiva",
    title: "Substituição da Lâmpada do Farol de Neblina",
    description: "Troca da lâmpada H11 que queimou após impacto com buraco.",
    date: "2026-08-05",
    mileageAtService: 36100,
    cost: 95.00,
    serviceProvider: "Auto Elétrica São Paulo",
    receiptNumber: "CUPOM-102",
    createdAt: "2026-08-05"
  },
  {
    id: "maint-5",
    vehicleId: "veh-2",
    type: "troca_oleo",
    title: "Troca de Óleo Motor Turbo (5W-30)",
    description: "Óleo Dexos1 Gen3 com troca de filtro de óleo e filtro de combustível.",
    date: "2026-02-14",
    mileageAtService: 40000,
    cost: 360.00,
    serviceProvider: "LubriFast Express",
    receiptNumber: "NF-1120",
    nextScheduledMileage: 50000,
    nextScheduledDate: "2026-08-14",
    createdAt: "2026-02-14"
  },
  {
    id: "maint-6",
    vehicleId: "veh-2",
    type: "corretiva",
    title: "Reparo no Fecho Elétrico do Porta-Malas",
    description: "Troca do atuador da trava do porta-malas que não travava pelo telecomando.",
    date: "2026-04-03",
    mileageAtService: 42300,
    cost: 310.00,
    serviceProvider: "Auto Elétrica Paulista",
    receiptNumber: "NF-4091",
    createdAt: "2026-04-03"
  }
];

export const initialFuelRecords: FuelRecord[] = [
  {
    id: "fuel-1",
    vehicleId: "veh-1",
    date: "2026-07-02",
    mileage: 36800,
    liters: 42.5,
    totalCost: 246.50,
    fuelType: "gasolina",
    isFullTank: true
  },
  {
    id: "fuel-2",
    vehicleId: "veh-1",
    date: "2026-07-16",
    mileage: 37340,
    liters: 41.2,
    totalCost: 238.96,
    fuelType: "gasolina",
    isFullTank: true
  },
  {
    id: "fuel-3",
    vehicleId: "veh-1",
    date: "2026-07-30",
    mileage: 37880,
    liters: 43.0,
    totalCost: 249.40,
    fuelType: "gasolina",
    isFullTank: true
  },
  {
    id: "fuel-4",
    vehicleId: "veh-1",
    date: "2026-08-15",
    mileage: 38450,
    liters: 42.0,
    totalCost: 243.60,
    fuelType: "gasolina",
    isFullTank: true
  }
];

export const defensiveDrivingTips: DefensiveDrivingTip[] = [
  {
    id: "tip-1",
    category: "condicoes_adversas",
    title: "Chuva Intensa e Aquaplanagem",
    summary: "Como agir em caso de perda total de aderência dos pneus com o asfalto molhado.",
    content: [
      "Nunca pise bruscamente no freio se o volante ficar repentinamente leve (início da aquaplanagem).",
      "Mantenha as duas mãos firmes no volante na posição '10 para as 2' ou '9 e 15' e alivie suavemente o pé do acelerador.",
      "Mantenha a direção reta até sentir que os pneus voltaram a ter contato seguro com o pavimento.",
      "Reduza a velocidade em pelo menos 20% a 30% assim que a chuva começar, pois o óleo da pista sobe com as primeiras gotas."
    ],
    keyAction: "Pneus com sulco mínimo de 1.6mm (indicador TWI) são obrigatórios para drenar a água.",
    iconName: "CloudRain"
  },
  {
    id: "tip-2",
    category: "distancias_seguranca",
    title: "A Regra dos Dois Segundos",
    summary: "Método infalível para manter a distância correta do veículo à frente em rodovias e vias urbanas.",
    content: [
      "Escolha um ponto de referência fixo na pista (como uma placa de trânsito, poste ou árvore).",
      "Assim que a traseira do veículo à sua frente passar pelo ponto, comece a contar pausadamente: 'cinquenta e um, cinquenta e dois' (exatamente dois segundos).",
      "Se o seu carro atingir o ponto de referência antes de terminar a contagem, diminua a velocidade para aumentar a distância.",
      "Em condições de chuva, neblina ou pista escorregadia, dobre a contagem para QUATRO segundos."
    ],
    keyAction: "Dois segundos garantem tempo para reação neurológica (0.75s) mais acionamento mecânico dos freios.",
    iconName: "Timer"
  },
  {
    id: "tip-3",
    category: "inspecao_veicular",
    title: "Checklist Pré-Viagem de 5 Minutos",
    summary: "Itens essenciais que devem ser verificados antes de qualquer viagem na estrada.",
    content: [
      "1. Calibragem dos pneus: verificar sempre a frio, incluindo obrigatoriamente o pneu estepe.",
      "2. Nível do óleo do motor e líquido de arrefecimento (nunca abra a tampa do radiador com o motor quente).",
      "3. Funcionamento de todas as luzes: faróis baixos, altos, lanternas, luzes de freio e piscas.",
      "4. Palhetas do limpador de para-brisa e abastecimento do reservatório de água do limpador com aditivo desengraxante.",
      "5. Triângulo de sinalização, macaco e chave de roda em ordem no porta-malas."
    ],
    keyAction: "Mais de 35% das panes em rodovias decorrem de pneus descalibrados ou superaquecimento evitável.",
    iconName: "CheckCircle2"
  },
  {
    id: "tip-4",
    category: "comportamento",
    title: "Atenção Plena & Pontos Cegos",
    summary: "Eliminação de distrações e ajuste científico dos espelhos retrovisores.",
    content: [
      "Regule os espelhos externos apontando para fora até que você quase não veja a lateral da própria lataria do seu carro. Isso reduz drasticamente o ponto cego.",
      "O uso do celular ao volante (mesmo no viva-voz) aumenta o tempo de reação em até 4 vezes, equivalente a dirigir embriagado.",
      "Sempre sinalize com a seta com pelo menos 3 a 5 segundos de antecedência antes de iniciar a manobra de mudança de faixa.",
      "Desacelere preventivamente ao se aproximar de cruzamentos, mesmo quando a preferência for sua."
    ],
    keyAction: "Direção defensiva é a atitude permanente de prever o erro alheio antes que ele se torne um acidente.",
    iconName: "Eye"
  }
];
