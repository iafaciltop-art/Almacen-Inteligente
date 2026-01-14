
export interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStockAlert: number;
  supplier?: string;
  imageUrl?: string;
  lastSoldAt?: number;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  priceAtSale: number;
  costAtSale: number;
}

export interface Sale {
  id: string;
  timestamp: number;
  items: SaleItem[];
  totalAmount: number;
  totalProfit: number;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  SALES = 'sales',
  INVENTORY = 'inventory',
  STRATEGIES = 'strategies',
  ALERTS = 'alerts'
}

export interface Strategy {
  title: string;
  description: string;
  type: 'offer' | 'liquidation' | 'bundle';
  impact: 'high' | 'medium';
}
