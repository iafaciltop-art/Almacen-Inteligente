
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Coca Cola 2L', 
    category: 'Bebidas', 
    costPrice: 90, 
    sellingPrice: 135, 
    stock: 24, 
    minStockAlert: 5,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=100&q=80'
  },
  { 
    id: '2', 
    name: 'Yerba Canarias 1kg', 
    category: 'Almacén', 
    costPrice: 180, 
    sellingPrice: 225, 
    stock: 12, 
    minStockAlert: 3,
    imageUrl: 'https://images.unsplash.com/photo-1515694590185-73647ba02c10?auto=format&fit=crop&w=100&q=80'
  },
  { 
    id: '3', 
    name: 'Pan de Molde', 
    category: 'Panadería', 
    costPrice: 65, 
    sellingPrice: 95, 
    stock: 8, 
    minStockAlert: 2,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=100&q=80'
  },
  { 
    id: '4', 
    name: 'Fideos Adria 500g', 
    category: 'Pastas', 
    costPrice: 45, 
    sellingPrice: 65, 
    stock: 30, 
    minStockAlert: 10,
    imageUrl: 'https://images.unsplash.com/photo-1612450844493-f1ba129086e1?auto=format&fit=crop&w=100&q=80'
  },
  { 
    id: '5', 
    name: 'Leche Conaprole 1L', 
    category: 'Lácteos', 
    costPrice: 38, 
    sellingPrice: 48, 
    stock: 15, 
    minStockAlert: 5,
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e910f644e8ef?auto=format&fit=crop&w=100&q=80'
  },
];

export const CATEGORIES = ['Bebidas', 'Almacén', 'Panadería', 'Pastas', 'Lácteos', 'Limpieza', 'Otros'];
