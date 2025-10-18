// Mock data for development (will be replaced with real database queries)

export interface Product {
  id: string
  name: string
  category: string
  unit: string
  imageUrl?: string
  description: string
}

export interface Quota {
  id: string
  producerId: string
  producerName: string
  product: Product
  quantity: number
  unit: string
  targetPrice: number
  deliveryLocation: string
  deliveryDate: string
  status: "open" | "closed" | "completed" | "cancelled"
  participantsCount: number
  currentQuantity: number
  createdAt: string
}

export interface Bid {
  id: string
  quotaId: string
  sellerId: string
  sellerName: string
  pricePerUnit: number
  totalPrice: number
  deliveryTerms: string
  status: "pending" | "accepted" | "rejected"
  createdAt: string
}

export interface Order {
  id: string
  quotaId: string
  productName: string
  sellerName: string
  quantity: number
  totalAmount: number
  status: "pending" | "confirmed" | "delivered" | "cancelled"
  deliveryDate: string
  createdAt: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  type: "produtor" | "vendedor"
  phone: string
  location: string
  registeredAt: string
  status: "active" | "inactive" | "suspended"
  totalOrders: number
  totalSpent?: number
  totalSales?: number
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Fertilizante NPK 10-10-10",
    category: "Fertilizantes",
    unit: "kg",
    description: "Fertilizante completo para uso geral",
  },
  {
    id: "2",
    name: "Fertilizante NPK 20-05-20",
    category: "Fertilizantes",
    unit: "kg",
    description: "Fertilizante para frutíferas",
  },
  {
    id: "3",
    name: "Calcário Dolomítico",
    category: "Corretivos",
    unit: "ton",
    description: "Correção de acidez do solo",
  },
  {
    id: "4",
    name: "Ureia",
    category: "Fertilizantes",
    unit: "kg",
    description: "Fertilizante nitrogenado",
  },
  {
    id: "5",
    name: "Herbicida Glifosato",
    category: "Defensivos",
    unit: "L",
    description: "Herbicida não seletivo",
  },
  {
    id: "6",
    name: "Sementes de Milho",
    category: "Sementes",
    unit: "kg",
    description: "Sementes híbridas",
  },
]

export const mockQuotas: Quota[] = [
  {
    id: "1",
    producerId: "user1",
    producerName: "João Silva",
    product: mockProducts[0],
    quantity: 5000,
    unit: "kg",
    targetPrice: 2.5,
    deliveryLocation: "Mossoró, RN",
    deliveryDate: "2025-02-15",
    status: "open",
    participantsCount: 8,
    currentQuantity: 3500,
    createdAt: "2025-01-10",
  },
  {
    id: "2",
    producerId: "user2",
    producerName: "Maria Santos",
    product: mockProducts[2],
    quantity: 20,
    unit: "ton",
    targetPrice: 180,
    deliveryLocation: "Caicó, RN",
    deliveryDate: "2025-02-20",
    status: "open",
    participantsCount: 5,
    currentQuantity: 12,
    createdAt: "2025-01-12",
  },
  {
    id: "3",
    producerId: "user3",
    producerName: "Pedro Costa",
    product: mockProducts[4],
    quantity: 500,
    unit: "L",
    targetPrice: 18,
    deliveryLocation: "Pau dos Ferros, RN",
    deliveryDate: "2025-02-10",
    status: "open",
    participantsCount: 12,
    currentQuantity: 450,
    createdAt: "2025-01-08",
  },
  {
    id: "4",
    producerId: "user1",
    producerName: "João Silva",
    product: mockProducts[5],
    quantity: 1000,
    unit: "kg",
    targetPrice: 8.5,
    deliveryLocation: "Mossoró, RN",
    deliveryDate: "2025-03-01",
    status: "open",
    participantsCount: 6,
    currentQuantity: 600,
    createdAt: "2025-01-15",
  },
]

export const mockOrders: Order[] = [
  {
    id: "1",
    quotaId: "1",
    productName: "Fertilizante NPK 10-10-10",
    sellerName: "AgroSuprimentos Ltda",
    quantity: 500,
    totalAmount: 1250,
    status: "delivered",
    deliveryDate: "2024-12-15",
    createdAt: "2024-12-01",
  },
  {
    id: "2",
    quotaId: "2",
    productName: "Ureia",
    sellerName: "Fertilizantes do Nordeste",
    quantity: 800,
    totalAmount: 2400,
    status: "confirmed",
    deliveryDate: "2025-01-20",
    createdAt: "2025-01-05",
  },
  {
    id: "3",
    quotaId: "3",
    productName: "Calcário Dolomítico",
    sellerName: "Mineração RN",
    quantity: 5,
    totalAmount: 900,
    status: "pending",
    deliveryDate: "2025-02-01",
    createdAt: "2025-01-18",
  },
]

export const mockBids: Bid[] = [
  {
    id: "1",
    quotaId: "1",
    sellerId: "seller1",
    sellerName: "AgroSuprimentos Ltda",
    pricePerUnit: 2.45,
    totalPrice: 12250,
    deliveryTerms: "Entrega em até 7 dias úteis. Frete incluso.",
    status: "pending",
    createdAt: "2025-01-16",
  },
  {
    id: "2",
    quotaId: "2",
    sellerId: "seller1",
    sellerName: "AgroSuprimentos Ltda",
    pricePerUnit: 175,
    totalPrice: 3500,
    deliveryTerms: "Entrega em até 10 dias úteis. Frete por conta do comprador.",
    status: "accepted",
    createdAt: "2025-01-14",
  },
  {
    id: "3",
    quotaId: "3",
    sellerId: "seller1",
    sellerName: "AgroSuprimentos Ltda",
    pricePerUnit: 17.5,
    totalPrice: 8750,
    deliveryTerms: "Entrega em até 5 dias úteis. Frete incluso.",
    status: "rejected",
    createdAt: "2025-01-12",
  },
]

export const mockUsers: UserProfile[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    type: "produtor",
    phone: "(84) 99999-1111",
    location: "Mossoró, RN",
    registeredAt: "2024-06-15",
    status: "active",
    totalOrders: 12,
    totalSpent: 45000,
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    type: "produtor",
    phone: "(84) 99999-2222",
    location: "Caicó, RN",
    registeredAt: "2024-07-20",
    status: "active",
    totalOrders: 8,
    totalSpent: 32000,
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro.costa@email.com",
    type: "produtor",
    phone: "(84) 99999-3333",
    location: "Pau dos Ferros, RN",
    registeredAt: "2024-08-10",
    status: "active",
    totalOrders: 15,
    totalSpent: 58000,
  },
  {
    id: "4",
    name: "AgroSuprimentos Ltda",
    email: "contato@agrosuprimentos.com",
    type: "vendedor",
    phone: "(84) 3333-1111",
    location: "Natal, RN",
    registeredAt: "2024-05-01",
    status: "active",
    totalOrders: 45,
    totalSales: 180000,
  },
  {
    id: "5",
    name: "Fertilizantes do Nordeste",
    email: "vendas@fertnordeste.com",
    type: "vendedor",
    phone: "(84) 3333-2222",
    location: "Mossoró, RN",
    registeredAt: "2024-06-10",
    status: "active",
    totalOrders: 32,
    totalSales: 125000,
  },
]
