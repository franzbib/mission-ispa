import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../engine/gameState';
import { ITEMS } from '../../data/items';
import { audio } from '../../engine/audioEngine';

export default function InventoryModal({ onClose }: { onClose: () => void }) {
  const inventory = useGameStore(state => state.inventory);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
        onClick={() => { audio.playClick(); onClose(); }}
      >
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-2xl bg-slate-800 border border-slate-600 rounded-3xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="h-20 shrink-0 bg-slate-900 flex items-center justify-between px-8 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-ispa-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
              <h2 className="text-xl font-bold font-serif text-white">Inventaire</h2>
            </div>
            <button 
              onClick={() => { audio.playClick(); onClose(); }} 
              className="text-slate-400 hover:text-white bg-slate-800/50 rounded-full p-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className="p-8 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.values(ITEMS).map(item => {
                const isOwned = inventory.includes(item.id);
                
                return (
                  <div 
                    key={item.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                      isOwned 
                        ? 'bg-slate-700/50 border-slate-600 hover:border-slate-400' 
                        : 'bg-slate-900/50 border-slate-800 opacity-50 grayscale'
                    }`}
                  >
                    <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isOwned ? 'bg-ispa-accent/20' : 'bg-slate-800'}`}>
                      <svg className={`w-6 h-6 ${isOwned ? 'text-ispa-accent' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <div>
                      <h3 className={`font-bold ${isOwned ? 'text-white' : 'text-slate-500'}`}>{isOwned ? item.name : '???'}</h3>
                      {isOwned && <p className="text-sm text-slate-400 mt-1">{item.description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {inventory.length === 0 && (
              <div className="text-center p-8 mt-4 border border-dashed border-slate-700 rounded-2xl">
                <p className="text-slate-500">Votre inventaire est vide. Complétez des missions pour obtenir des objets.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
