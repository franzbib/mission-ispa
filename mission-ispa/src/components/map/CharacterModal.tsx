import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../engine/gameState';
import { NARRATIVE_LEVELS, MISSION_GROUPS } from '../../data/narrativeLevels';

export default function CharacterModal({ onClose }: { onClose: () => void }) {
  const { name, profile, level, stats, currentNarrativeLevel, completedMissions } = useGameStore();
  const currentLevel = NARRATIVE_LEVELS[currentNarrativeLevel];
  const activeGroup = currentLevel?.mainMissionGroups[0] ? MISSION_GROUPS[currentLevel.mainMissionGroups[0]] : null;
  const completedInGroup = activeGroup ? activeGroup.missionIds.filter(id => completedMissions.includes(id)).length : 0;

  const getStatLabel = (key: string) => {
    const labels: Record<string, string> = {
      comprehension: 'Compréhension',
      grammar: 'Grammaire',
      lexicon: 'Lexique',
      autonomy: 'Autonomie',
      sociability: 'Sociabilité',
      organization: 'Organisation'
    };
    return labels[key] || key;
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-md bg-slate-800 border border-slate-600 p-8 rounded-3xl flex flex-col gap-6 shadow-2xl"
        >
          <div className="flex justify-between items-center border-b border-slate-700 pb-4">
            <h2 className="text-2xl font-serif text-white">Profil Étudiant</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-700/50 p-2 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-ispa-accent rounded-xl flex items-center justify-center text-2xl font-bold font-serif text-white shadow-lg shadow-ispa-accent/20">
              {level}
            </div>
            <div>
              <p className="text-xl font-bold text-white">{name || "Étudiant Anonyme"}</p>
              <p className="text-slate-400 text-sm italic">{profile || "Nouvel arrivant à Amiens"}</p>
            </div>
          </div>

          <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">{currentLevel?.title} : {currentLevel?.subtitle}</h3>
            <p className="text-sm text-slate-300 italic mb-3">{currentLevel?.description}</p>
            
            {activeGroup && (
              <div className="mt-3 pt-3 border-t border-slate-600/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-400 font-bold uppercase">{activeGroup.title}</span>
                  <span className="text-xs font-bold text-ispa-accent">{completedInGroup} / {activeGroup.requiredCompletedCount}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-ispa-accent h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (completedInGroup / activeGroup.requiredCompletedCount) * 100)}%` }}></div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            {Object.entries(stats).map(([key, value]) => (
               <div key={key} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex flex-col justify-between">
                 <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-bold">{getStatLabel(key)}</div>
                 <div className="text-2xl font-bold text-emerald-400">{value}</div>
               </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
