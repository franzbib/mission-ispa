import { motion, AnimatePresence } from 'framer-motion';
import { MISSIONS } from '../../data/missions';
import { useGameStore } from '../../engine/gameState';
import { getLocationState, isMissionAvailable, getMissingRequirementsLabel, isMissionInCurrentTrack } from '../../engine/unlockEngine';
import { LOCATIONS } from '../../data/locations';
import type { Mission } from '../../types/mission';
import ArcadeHub from '../arcade/ArcadeHub';

interface Props {
  locationId: string;
  onClose: () => void;
  onSelectMission: (missionId: string) => void;
}

export default function LocationModal({ locationId, onClose, onSelectMission }: Props) {
  const gameState = useGameStore(state => state);
  const completedMissions = gameState.completedMissions;
  const locationMissions = MISSIONS.filter(m => m.locationId === locationId && isMissionInCurrentTrack(m, gameState));
  const locData = LOCATIONS.find(l => l.id === locationId);
  const locState = getLocationState(locationId, gameState);
  
  const name = locData?.name || 'Lieu inconnu';
  const desc = locState === 'discovered' 
    ? (locData?.descriptionWhenLocked || 'Tu as entendu parler de ce lieu, mais tu ne sais pas encore comment y accéder.') 
    : (locData?.descriptionWhenUnlocked || '');

  const renderMissionButton = (mission: Mission) => {
    const isCompleted = completedMissions.includes(mission.id);
    const isAvailable = isMissionAvailable(mission, gameState);
    const lockedReason = (!isAvailable && !isCompleted) ? getMissingRequirementsLabel(mission.prerequisites, gameState) : '';
    const isNodeMission = mission.isNodeMission === true || mission.isNodeQuest === true || mission.narrativePriority === 'node';

    return (
      <button 
        key={mission.id}
        onClick={() => {
          if (isAvailable) onSelectMission(mission.id);
        }}
        disabled={!isAvailable && !isCompleted}
        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 text-left relative overflow-hidden ${
          isCompleted 
            ? 'bg-slate-800/30 border-slate-700 opacity-60 hover:opacity-100 hover:bg-slate-800/50' 
            : isAvailable
              ? `bg-slate-700/50 border-slate-600 hover:bg-slate-600 hover:shadow-lg hover:-translate-y-0.5 ${isNodeMission ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'hover:border-slate-400'}`
              : 'bg-slate-900/50 border-slate-800 cursor-not-allowed opacity-70'
        }`}
      >
        {isNodeMission && isAvailable && (
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
        )}
        
        <div className="flex-1">
           <div className="flex items-center gap-2 mb-1">
             <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${isCompleted ? 'bg-slate-800 text-slate-400' : 'bg-ispa-accent/20 text-ispa-accent'}`}>
               {mission.level}
             </span>
             {mission.narrativePriority === 'main' && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
                  Principal
                </span>
             )}
             {isNodeMission && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                  Noeud
                </span>
             )}
             <h4 className={`font-medium ${isCompleted ? 'text-slate-400 line-through' : !isAvailable ? 'text-slate-500' : 'text-slate-100'}`}>
               {mission.title}
             </h4>
           </div>
           
           {!isAvailable && !isCompleted ? (
             <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-400/80 font-medium">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                {lockedReason}
             </div>
           ) : (
             <p className={`text-xs truncate max-w-sm mt-1 ${isCompleted ? 'text-slate-500' : 'text-slate-400'}`}>{mission.narrativeContext}</p>
           )}
        </div>
        
        {isCompleted && (
          <svg className="w-6 h-6 text-emerald-500 shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        )}
        {!isCompleted && isAvailable && (
          <svg className="w-6 h-6 text-slate-400 shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        )}
        {!isAvailable && !isCompleted && (
          <svg className="w-6 h-6 text-slate-600 shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        )}
      </button>
    );
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-2xl bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className={`h-40 p-8 relative overflow-hidden flex items-end ${locState === 'discovered' ? 'bg-slate-800' : 'bg-gradient-to-r from-slate-900 to-slate-800'}`}>
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9zdmc+')]"></div>
            <h2 className={`text-3xl font-serif font-bold relative z-10 ${locState === 'discovered' ? 'text-slate-500' : 'text-white'}`}>
              {name}
            </h2>
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/50 rounded-full p-2 transition-colors">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          {/* Body */}
          <div className="p-8 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            <p className={`mb-8 italic leading-relaxed ${locState === 'discovered' ? 'text-slate-400' : 'text-slate-300'}`}>
              {desc}
            </p>

            {locState !== 'discovered' && (
              <>
                {locationId === 'salle_jeu' ? (
                  <ArcadeHub onClose={onClose} />
                ) : (
                  <>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4 text-ispa-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      Missions disponibles
                    </h3>

                    <div className="grid gap-3">
                      {locationMissions.length === 0 ? (
                         <div className="p-6 text-center border border-dashed border-slate-600 rounded-xl">
                           <p className="text-slate-500 text-sm">Aucune mission disponible ici pour le moment.</p>
                         </div>
                      ) : (
                        locationMissions.map(renderMissionButton)
                      )}
                    </div>
                  </>
                )}
              </>
            )}
            
            {locState === 'discovered' && (
               <div className="p-6 text-center border border-slate-700 bg-slate-800/50 rounded-xl">
                 <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                 <p className="text-slate-400 text-sm">Ce lieu est actuellement inaccessible. Continuez votre aventure pour le débloquer.</p>
               </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
