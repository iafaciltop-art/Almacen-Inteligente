
import React from 'react';
import { AppTab } from '../types';
import { LayoutDashboard, ShoppingCart, Package, Bell, Lightbulb } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  alertCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, alertCount }) => {
  const tabs = [
    { id: AppTab.DASHBOARD, label: 'Inicio', icon: LayoutDashboard },
    { id: AppTab.SALES, label: 'Vender', icon: ShoppingCart },
    { id: AppTab.INVENTORY, label: 'Stock', icon: Package },
    { id: AppTab.STRATEGIES, label: 'Estrategias', icon: Lightbulb },
    { id: AppTab.ALERTS, label: 'Avisos', icon: Bell, badge: alertCount },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 shadow-xl overflow-hidden">
      <header className="bg-blue-700 text-white p-4 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight leading-none">Mi Almacén</h1>
          <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest mt-1">Control de Ventas · Uruguay</p>
        </div>
        <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center border-2 border-blue-400">
          <span className="font-black">🇺🇾</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {children}
      </main>

      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-200 flex justify-around items-center py-3 px-1 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full transition-all relative ${
                isActive ? 'text-blue-600 scale-110' : 'text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon size={isActive ? 26 : 22} strokeWidth={isActive ? 2.5 : 2} />
                {tab.badge ? (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[9px] mt-1 font-bold ${isActive ? 'opacity-100' : 'opacity-80'}`}>{tab.label}</span>
              {isActive && <div className="absolute -bottom-2 w-6 h-1 bg-blue-600 rounded-t-full" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
