import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveMap from './InteractiveMap';
import LocationModal from './LocationModal';
import MissionModal from '../mission/MissionModal';
import CharacterModal from './CharacterModal';
import InventoryModal from '../inventory/InventoryModal';
import { MISSIONS } from '../../data/missions';
import { useGameStore } from '../../engine/gameState';
import { audio } from '../../engine/audioEngine';

export default function MapScreen() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState<number>(1);
  const currentNarrativeLevel = useGameStore(state => state.currentNarrativeLevel);

  useEffect(() => {
    if (currentNarrativeLevel > prevLevel) {
      setShowLevelUp(true);
      audio.playUnlock(); // or another specific sound
      setPrevLevel(currentNarrativeLevel);
      setTimeout(() => setShowLevelUp(false), 4000);
    }
  }, [currentNarrativeLevel, prevLevel]);

  const activeMission = selectedMission ? MISSIONS.find(m => m.id === selectedMission) : null;
  return (
    <div className="flex-1 w-full h-full relative">
      <InteractiveMap onLocationClick={setSelectedLocation} />
      
      {/* Navigation Bottom Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-panel px-8 py-4 rounded-2xl flex gap-12 z-20 shadow-2xl">
        <button onClick={() => { audio.playClick(); setShowProfile(true); }} className="flex flex-col items-center text-slate-400 hover:text-white transition-colors group">
          <div className="p-2 rounded-xl group-hover:bg-slate-700/50 transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest mt-1">Profil</span>
        </button>
        <button onClick={() => audio.playClick()} className="flex flex-col items-center text-ispa-accent hover:text-amber-400 transition-colors group">
          <div className="p-2 rounded-xl bg-ispa-accent/10 group-hover:bg-ispa-accent/20 transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest mt-1">Carte</span>
        </button>
        <button onClick={() => { audio.playClick(); setShowInventory(true); }} className="flex flex-col items-center text-slate-400 hover:text-white transition-colors group">
          <div className="p-2 rounded-xl group-hover:bg-slate-700/50 transition-colors">
             <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest mt-1">Inventaire</span>
        </button>
      </div>

      {selectedLocation && (
        <LocationModal 
          locationId={selectedLocation} 
          onClose={() => setSelectedLocation(null)}
          onSelectMission={(missionId) => {
            setSelectedLocation(null);
            setSelectedMission(missionId);
          }}
        />
      )}

      {activeMission && (
        <MissionModal 
          mission={activeMission}
          onClose={() => setSelectedMission(null)}
        />
      )}

      {showProfile && (
        <CharacterModal onClose={() => setShowProfile(false)} />
      )}

      {showInventory && (
        <InventoryModal onClose={() => setShowInventory(false)} />
      )}

      <AnimatePresence>
        {showLevelUp && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-amber-500/20 backdrop-blur-sm pointer-events-none"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-slate-900 border-2 border-amber-500 p-8 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.5)] text-center max-w-lg"
            >
              <h2 className="text-4xl font-serif font-bold text-amber-500 mb-4">Niveau {currentNarrativeLevel} Débloqué !</h2>
              <p className="text-xl text-white">De nouveaux lieux et de nouvelles missions sont maintenant disponibles.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
