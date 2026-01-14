
import React, { useState, useRef } from 'react';
import { Mic, Camera, ListPlus, Send, X, Loader2, CheckCircle2 } from 'lucide-react';
import { processSalesInput, processImageSale } from '../services/geminiService';
import { Product, SaleItem } from '../types';

interface SalesInputProps {
  inventory: Product[];
  onAddSale: (items: { productId: string, quantity: number }[]) => void;
}

const SalesInput: React.FC<SalesInputProps> = ({ inventory, onAddSale }) => {
  const [inputType, setInputType] = useState<'none' | 'voice' | 'photo' | 'manual'>('none');
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    setIsLoading(true);
    const result = await processSalesInput(textInput, inventory);
    if (result && result.length > 0) {
      onAddSale(result);
      showSuccess();
    } else {
      alert("No entendí bien qué vendiste. ¿Podrás repetirlo?");
    }
    setIsLoading(false);
    setTextInput('');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const result = await processImageSale(base64, inventory);
      if (result && result.length > 0) {
        onAddSale(result);
        showSuccess();
      } else {
        alert("No pude leer el ticket. Probá de nuevo con más luz.");
      }
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const showSuccess = () => {
    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      setInputType('none');
    }, 1500);
  };

  if (isDone) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in duration-300">
        <CheckCircle2 size={64} className="text-green-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">¡Venta anotada!</h2>
        <p className="text-slate-500">Stock actualizado al toque.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h2 className="text-2xl font-black text-slate-800">¿Qué vendiste hoy?</h2>
        <p className="text-slate-500">Elegí cómo querés anotar</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={() => setInputType('voice')}
          className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between active:scale-95 transition-transform"
        >
          <div className="text-left">
            <div className="font-bold text-lg">Por Voz</div>
            <div className="text-blue-100 text-xs italic">"Vendí 2 Cocas de 2L"</div>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Mic size={32} />
          </div>
        </button>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-indigo-600 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between active:scale-95 transition-transform"
        >
          <div className="text-left">
            <div className="font-bold text-lg">Por Foto</div>
            <div className="text-indigo-100 text-xs">Tickets o anotaciones</div>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Camera size={32} />
          </div>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handlePhotoUpload}
        />

        <button 
          onClick={() => setInputType('manual')}
          className="bg-white border-2 border-slate-200 text-slate-700 p-6 rounded-3xl shadow-sm flex items-center justify-between active:scale-95 transition-transform"
        >
          <div className="text-left">
            <div className="font-bold text-lg">Elegir de la lista</div>
            <div className="text-slate-400 text-xs">Carga manual de toda la vida</div>
          </div>
          <div className="bg-slate-100 p-3 rounded-full text-slate-500">
            <ListPlus size={32} />
          </div>
        </button>
      </div>

      {inputType === 'voice' && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-end justify-center p-4">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700">Contame qué vendiste</h3>
              <button onClick={() => setInputType('none')}><X size={20}/></button>
            </div>
            <p className="text-sm text-slate-500 mb-4 italic">Ejemplo: "3 fideos y una leche"</p>
            <div className="relative">
              <textarea 
                className="w-full border-2 border-slate-100 rounded-2xl p-4 min-h-[100px] focus:border-blue-500 focus:outline-none"
                placeholder="Escribí o pegá lo que dijo el cliente..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              <button 
                onClick={handleTextSubmit}
                disabled={isLoading}
                className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-xl shadow-lg disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              </button>
            </div>
            {isLoading && <p className="text-center mt-4 text-xs font-bold text-blue-600 animate-pulse">Analizando productos...</p>}
          </div>
        </div>
      )}

      {inputType === 'manual' && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-h-[80vh] overflow-y-auto rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl">Lista de Productos</h3>
                <button onClick={() => setInputType('none')}><X size={24}/></button>
              </div>
              <div className="space-y-4">
                {inventory.map(p => (
                  <div key={p.id} className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="font-bold">{p.name}</div>
                      <div className="text-xs text-slate-400">Stock: {p.stock}</div>
                    </div>
                    <div className="flex items-center gap-3">
                       <button 
                        onClick={() => {
                          onAddSale([{ productId: p.id, quantity: 1 }]);
                          showSuccess();
                        }}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-bold"
                       >
                         +1
                       </button>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SalesInput;
