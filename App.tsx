
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import SalesInput from './components/SalesInput';
// Removed non-existent Insight member from import to fix compilation error on line 7
import { AppTab, Product, Sale, Strategy } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { getSmartInsights, getSalesStrategies } from './services/geminiService';
import { AlertTriangle, TrendingDown, Lightbulb, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('sales');
    return saved ? JSON.parse(saved) : [];
  });
  const [insights, setInsights] = useState<string[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loadingStrategies, setLoadingStrategies] = useState(false);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  const loadInsights = useCallback(async () => {
    const result = await getSmartInsights(sales, products);
    setInsights(result);
  }, [sales, products]);

  const loadStrategies = useCallback(async () => {
    setLoadingStrategies(true);
    const result = await getSalesStrategies(products, sales);
    setStrategies(result);
    setLoadingStrategies(false);
  }, [products, sales]);

  useEffect(() => {
    loadInsights();
    loadStrategies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSale = (items: { productId: string, quantity: number }[]) => {
    const saleItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;
      return {
        productId: item.productId,
        quantity: item.quantity,
        priceAtSale: product.sellingPrice,
        costAtSale: product.costPrice
      };
    }).filter(Boolean) as any[];

    if (saleItems.length === 0) return;

    const totalAmount = saleItems.reduce((acc, item) => acc + (item.priceAtSale * item.quantity), 0);
    const totalProfit = saleItems.reduce((acc, item) => acc + ((item.priceAtSale - item.costAtSale) * item.quantity), 0);

    const newSale: Sale = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      items: saleItems,
      totalAmount,
      totalProfit
    };

    setSales(prev => [...prev, newSale]);
    setProducts(prev => prev.map(p => {
      const soldItem = items.find(i => i.productId === p.id);
      if (soldItem) {
        return { ...p, stock: Math.max(0, p.stock - soldItem.quantity), lastSoldAt: Date.now() };
      }
      return p;
    }));
  };

  const alertProducts = products.filter(p => p.stock <= p.minStockAlert);
  const lowMarginProducts = products.filter(p => (p.sellingPrice - p.costPrice) / p.sellingPrice < 0.15);

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      alertCount={alertProducts.length + lowMarginProducts.length}
    >
      {activeTab === AppTab.DASHBOARD && (
        <div className="space-y-6">
          <Dashboard sales={sales} inventory={products} insights={insights} />
          
          <section className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-5 shadow-lg text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} />
              <h3 className="font-black text-sm uppercase tracking-wider">Estrategia para Hoy</h3>
            </div>
            {strategies.length > 0 ? (
              <div className="space-y-1">
                <p className="font-black text-lg leading-tight">{strategies[0].title}</p>
                <p className="text-sm opacity-90">{strategies[0].description}</p>
                <button 
                  onClick={() => setActiveTab(AppTab.STRATEGIES)}
                  className="mt-3 bg-white text-orange-600 font-black text-xs px-4 py-2 rounded-full shadow-sm"
                >
                  VER MÁS ESTRATEGIAS
                </button>
              </div>
            ) : (
              <p className="text-sm italic animate-pulse">Pensando cómo vender más...</p>
            )}
          </section>
        </div>
      )}
      
      {activeTab === AppTab.SALES && (
        <SalesInput inventory={products} onAddSale={handleAddSale} />
      )}

      {activeTab === AppTab.INVENTORY && (
        <Inventory 
          products={products} 
          onAddProduct={(p) => setProducts(prev => [...prev, p])}
          onUpdateProduct={(up) => setProducts(prev => prev.map(p => p.id === up.id ? up : p))}
        />
      )}

      {activeTab === AppTab.STRATEGIES && (
        <div className="space-y-6 pb-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800">Estrategias de Venta</h2>
            <button onClick={loadStrategies} className="text-blue-600 font-bold text-xs underline">ACTUALIZAR</button>
          </div>
          <p className="text-slate-500 text-sm italic">Che, usá estos consejos para que la mercadería no se quede quieta en el estante.</p>
          
          {loadingStrategies ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Sparkles className="animate-spin text-blue-500" size={48} />
              <p className="font-black text-slate-400">Analizando tu stock...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {strategies.map((s, i) => (
                <div key={i} className={`p-6 rounded-3xl shadow-sm border-2 ${
                  s.type === 'offer' ? 'bg-blue-50 border-blue-100' :
                  s.type === 'liquidation' ? 'bg-red-50 border-red-100' :
                  'bg-green-50 border-green-100'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb size={18} className={s.type === 'offer' ? 'text-blue-600' : 'text-slate-600'} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.type}</span>
                    <span className="ml-auto bg-white px-2 py-0.5 rounded text-[10px] font-black text-slate-500 border border-slate-100">
                      IMPACTO {s.impact === 'high' ? 'ALTO' : 'MEDIO'}
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-slate-800 leading-tight mb-2">{s.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{s.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === AppTab.ALERTS && (
        <div className="space-y-6 pb-10">
          <h2 className="text-2xl font-black text-slate-800">Alertas Críticas</h2>
          
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Falta mercadería (¡Comprá ya!)</h3>
            {alertProducts.length > 0 ? (
              <div className="space-y-3">
                {alertProducts.map(p => (
                  <div key={p.id} className="bg-white border-2 border-red-100 p-4 rounded-3xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-500 p-2 rounded-2xl text-white">
                        <AlertTriangle size={24} />
                      </div>
                      <div>
                        <div className="font-black text-slate-800">{p.name}</div>
                        <div className="text-xs font-bold text-red-600">Quedan solo {p.stock}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setProducts(prev => prev.map(prod => prod.id === p.id ? {...prod, stock: prod.stock + 12} : prod))}
                      className="bg-red-600 text-white font-black text-[10px] px-4 py-3 rounded-2xl shadow-lg active:scale-95"
                    >
                      REPONER +12
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-green-50 p-6 rounded-3xl border-2 border-green-100 text-center">
                <p className="text-green-700 font-black">¡Estás bien de stock che!</p>
              </div>
            )}
          </section>

          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Margen muy bajo</h3>
            {lowMarginProducts.length > 0 ? (
              <div className="space-y-3">
                {lowMarginProducts.map(p => {
                   const margin = Math.round(((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100);
                   return (
                    <div key={p.id} className="bg-white border-2 border-orange-100 p-4 rounded-3xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-400 p-2 rounded-2xl text-white">
                          <TrendingDown size={24} />
                        </div>
                        <div>
                          <div className="font-black text-slate-800">{p.name}</div>
                          <div className="text-xs font-bold text-orange-600">Ganás solo el {margin}%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400">Sugiero:</div>
                        <div className="font-black text-xl text-orange-600">${Math.ceil(p.costPrice * 1.3)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">Tus precios están bárbaros.</p>
            )}
          </section>
        </div>
      )}
    </Layout>
  );
};

export default App;
