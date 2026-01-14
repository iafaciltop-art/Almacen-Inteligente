
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie } from 'recharts';
import { Sale, Product } from '../types';
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardProps {
  sales: Sale[];
  inventory: Product[];
  insights: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ sales, inventory, insights }) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const todaysSales = sales.filter(s => s.timestamp >= today);
  const totalDailyProfit = todaysSales.reduce((acc, s) => acc + s.totalProfit, 0);
  const totalDailyRevenue = todaysSales.reduce((acc, s) => acc + s.totalAmount, 0);

  // Group sales by day for the chart (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    const daySales = sales.filter(s => {
      const saleDate = new Date(s.timestamp);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === d.getTime();
    });
    return {
      day: d.toLocaleDateString('es-UY', { weekday: 'short' }),
      ganancia: daySales.reduce((acc, s) => acc + s.totalProfit, 0),
      venta: daySales.reduce((acc, s) => acc + s.totalAmount, 0),
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
            <Wallet size={14} />
            <span>Venta de hoy</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">${totalDailyRevenue}</div>
          <div className="flex items-center text-[10px] text-green-500 mt-1">
            <ArrowUpRight size={10} />
            <span>+12% vs ayer</span>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl shadow-sm border border-blue-100">
          <div className="flex items-center gap-2 text-blue-600 text-xs mb-1">
            <TrendingUp size={14} />
            <span>Ganancia hoy</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">${totalDailyProfit}</div>
          <div className="flex items-center text-[10px] text-blue-500 mt-1">
            <span className="font-semibold">¡Viene bien!</span>
          </div>
        </div>
      </div>

      <section>
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center justify-between">
          Evolución de Ganancia
          <span className="text-[10px] font-normal text-slate-400">Últimos 7 días</span>
        </h3>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }} 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="ganancia" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-slate-700 mb-3">Consejos del Almacenero IA</h3>
        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <div key={idx} className="bg-indigo-50 border-l-4 border-indigo-400 p-3 rounded-r-xl animate-in slide-in-from-left duration-300">
              <p className="text-sm text-indigo-700 leading-snug">"{insight}"</p>
            </div>
          ))}
          {insights.length === 0 && (
            <div className="text-center py-4 text-slate-400 text-sm">
              Cargando consejos...
            </div>
          )}
        </div>
      </section>

      <div className="h-10" />
    </div>
  );
};

export default Dashboard;
