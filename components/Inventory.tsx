
import React, { useState } from 'react';
import { Product } from '../types';
import { CATEGORIES } from '../constants';
import { Plus, Search, AlertCircle, PackagePlus, ArrowUpCircle, Image as ImageIcon } from 'lucide-react';

interface InventoryProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onAddProduct, onUpdateProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);
  const [stockChange, setStockChange] = useState<string>('');

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: CATEGORIES[0],
    costPrice: 0,
    sellingPrice: 0,
    stock: 0,
    minStockAlert: 5
  });

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = () => {
    if (newProduct.name && newProduct.costPrice && newProduct.sellingPrice) {
      onAddProduct({
        ...newProduct as Product,
        id: Math.random().toString(36).substring(7),
        imageUrl: `https://source.unsplash.com/featured/?${newProduct.name.replace(/\s/g, ',')}`
      });
      setIsAdding(false);
      setNewProduct({ category: CATEGORIES[0], costPrice: 0, sellingPrice: 0, stock: 0, minStockAlert: 5 });
    }
  };

  const handleQuickStockUpdate = (p: Product) => {
    const val = parseInt(stockChange);
    if (!isNaN(val)) {
      onUpdateProduct({ ...p, stock: p.stock + val });
      setUpdatingStockId(null);
      setStockChange('');
    }
  };

  return (
    <div className="space-y-4 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-800">Inventario Total</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg active:scale-90 transition-transform flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="text-sm font-bold">Agregar</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Buscá mercadería..."
          className="w-full bg-white border-2 border-slate-100 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-3xl shadow-2xl border-2 border-blue-50 animate-in zoom-in-95 duration-200">
          <h3 className="font-black text-lg mb-4 text-slate-700 flex items-center gap-2">
            <PackagePlus size={24} className="text-blue-600" />
            Nuevo Producto
          </h3>
          <div className="space-y-4">
            <input 
              type="text"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 focus:border-blue-500 focus:outline-none font-bold text-lg"
              placeholder="¿Qué producto es?"
              onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl">
                <label className="text-[10px] font-black text-slate-400 uppercase">Costo ($)</label>
                <input 
                  type="number"
                  className="w-full bg-transparent font-black text-xl text-slate-700 outline-none"
                  onChange={e => setNewProduct({...newProduct, costPrice: Number(e.target.value)})}
                />
              </div>
              <div className="bg-blue-50 p-3 rounded-xl border-2 border-blue-100">
                <label className="text-[10px] font-black text-blue-400 uppercase">Venta ($)</label>
                <input 
                  type="number"
                  className="w-full bg-transparent font-black text-xl text-blue-700 outline-none"
                  onChange={e => setNewProduct({...newProduct, sellingPrice: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl">
                <label className="text-[10px] font-black text-slate-400 uppercase">Stock Actual</label>
                <input 
                  type="number"
                  className="w-full bg-transparent font-black text-xl text-slate-700 outline-none"
                  onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                />
              </div>
              <div className="bg-red-50 p-3 rounded-xl">
                <label className="text-[10px] font-black text-red-400 uppercase">Avisar si bajá de</label>
                <input 
                  type="number"
                  className="w-full bg-transparent font-black text-xl text-red-700 outline-none"
                  onChange={e => setNewProduct({...newProduct, minStockAlert: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-4 text-slate-400 font-black">CANCELAR</button>
              <button onClick={handleSave} className="flex-2 bg-blue-600 text-white rounded-2xl py-4 font-black shadow-lg">GUARDAR</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {filtered.map(p => (
          <div key={p.id} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-50 relative">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ImageIcon size={24} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-black text-slate-800 leading-tight">{p.name}</h4>
              <p className="text-[10px] font-bold text-blue-500 uppercase">{p.category}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs font-black text-slate-700">${p.sellingPrice}</span>
                <span className="text-[10px] bg-green-50 text-green-700 px-1 rounded font-bold">Ganás ${p.sellingPrice - p.costPrice}</span>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              {updatingStockId === p.id ? (
                <div className="flex items-center gap-1 animate-in slide-in-from-right duration-200">
                  <input 
                    type="number" 
                    className="w-16 border-2 border-blue-200 rounded-lg p-1 text-center font-bold"
                    placeholder="+/-"
                    value={stockChange}
                    onChange={e => setStockChange(e.target.value)}
                    autoFocus
                  />
                  <button onClick={() => handleQuickStockUpdate(p)} className="bg-blue-600 text-white p-1 rounded-lg">OK</button>
                </div>
              ) : (
                <>
                  <div className={`text-xl font-black ${p.stock <= p.minStockAlert ? 'text-red-500' : 'text-slate-800'}`}>
                    {p.stock}
                  </div>
                  <button 
                    onClick={() => setUpdatingStockId(p.id)}
                    className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-full flex items-center gap-1"
                  >
                    <ArrowUpCircle size={10} /> RECIBIR
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
