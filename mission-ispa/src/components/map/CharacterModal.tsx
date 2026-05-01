import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../engine/gameState';
import { NARRATIVE_LEVELS, MISSION_GROUPS } from '../../data/narrativeLevels';
import { MISSIONS } from '../../data/missions';
import { getMissingRequirementsLabel, isMissionAvailable } from '../../engine/unlockEngine';
import { ITEMS } from '../../data/items';

export default function CharacterModal({ onClose }: { onClose: () => void }) {
  const gameState = useGameStore();
  const { name, profile, level, stats, currentNarrativeLevel, completedMissions, inventory } = gameState;
  const currentLevel = NARRATIVE_LEVELS[currentNarrativeLevel];
  const [activeTab, setActiveTab] = useState<'progression' | 'inventory'>('progression');
  
  // Track logic
  const track = gameState.pedagogicalTrack || 'b1-b2';
  const installationGroupId = track === 'a2-b1' ? 'installation-ispa-a2-b1' : 'installation-ispa';
  
  const activeGroup = currentLevel?.mainMissionGroups[0] ? MISSION_GROUPS[currentLevel.mainMissionGroups[0]] : null;
  const completedInGroup = activeGroup ? activeGroup.missionIds.filter(id => completedMissions.includes(id)).length : 0;
  
  const installationGroup = MISSION_GROUPS[installationGroupId];
  const installationMissions = MISSIONS.filter(mission => mission.missionGroupId === installationGroupId);
  const requiredInstallationCount = installationGroup?.requiredCompletedCount || installationMissions.length;
  const completedInstallationCount = installationGroup
    ? installationGroup.missionIds.filter(id => completedMissions.includes(id)).length
    : installationMissions.filter(mission => completedMissions.includes(mission.id)).length;
  const displayedCompletedInstallationCount = Math.min(completedInstallationCount, requiredInstallationCount);
  const nodeMissionId = track === 'a2-b1' ? 'm8_validation_dossier_a2' : 'm8_validation_dossier';
  const nodeMission = MISSIONS.find(mission => mission.id === nodeMissionId);
  const hasReachedLevel2 = currentNarrativeLevel >= 2;

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

  const isNodeMission = (missionId: string) => {
    const mission = MISSIONS.find(item => item.id === missionId);
    return mission?.isNodeMission === true || mission?.isNodeQuest === true || mission?.narrativePriority === 'node';
  };

  const getMissionStatus = (missionId: string) => {
    const mission = MISSIONS.find(item => item.id === missionId);
    if (!mission) return 'verrouillée';
    if (completedMissions.includes(mission.id)) return 'terminée';
    return isMissionAvailable(mission, gameState) ? 'disponible' : 'verrouillée';
  };

  const nodeMissionStatus = nodeMission
    ? completedMissions.includes(nodeMission.id)
      ? 'terminée'
      : isMissionAvailable(nodeMission, gameState)
        ? 'à faire'
        : 'verrouillée'
    : 'verrouillée';

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
          className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-800 border border-slate-600 p-6 md:p-8 rounded-3xl flex flex-col gap-6 shadow-2xl"
        >
          <div className="flex justify-between items-center border-b border-slate-700 pb-4">
            <h2 className="text-2xl font-serif text-white">Profil Étudiant</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-700/50 p-2 rounded-full">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
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

          <div className="flex rounded-xl bg-slate-900/50 p-1">
            <button 
              onClick={() => setActiveTab('progression')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'progression' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Progression
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex justify-center items-center gap-2 ${activeTab === 'inventory' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Sac à dos
              {inventory.length > 0 && (
                <span className="bg-ispa-accent text-white text-[10px] px-1.5 py-0.5 rounded-full">{inventory.length}</span>
              )}
            </button>
          </div>

          {activeTab === 'progression' && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
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

              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/60">
                <div className="flex flex-col gap-1 mb-4">
                  <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                    Progression vers le Niveau 2 — {track === 'a2-b1' ? 'Parcours A2/B1' : 'Parcours B1/B2'}
                  </h3>
                  <p className="text-sm font-semibold text-white">{installationGroup?.title || 'Installation ISPA'}</p>
                  <p className="text-xs text-slate-400">
                    {displayedCompletedInstallationCount} / {requiredInstallationCount} missions nécessaires terminées
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {installationMissions.map(mission => {
                    const status = getMissionStatus(mission.id);
                    const lockedReason = status === 'verrouillée'
                      ? getMissingRequirementsLabel(mission.prerequisites, gameState)
                      : '';

                    return (
                      <div key={mission.id} className="flex flex-col gap-1 rounded-lg border border-slate-700/60 bg-slate-800/60 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-100 leading-snug">{mission.title}</p>
                            {lockedReason && (
                              <p className="text-[11px] text-slate-500 mt-1 leading-snug">{lockedReason}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              status === 'terminée'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : status === 'disponible'
                                  ? 'bg-ispa-accent/20 text-ispa-accent'
                                  : 'bg-slate-700 text-slate-400'
                            }`}>
                              {status}
                            </span>
                            {isNodeMission(mission.id) && (
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                                Mission-nœud
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/60">
                  <p className="text-sm text-slate-200">
                    Validation du dossier : <span className="font-bold text-white">{nodeMissionStatus}</span>
                  </p>
                  <p className={`text-xs mt-2 leading-relaxed ${hasReachedLevel2 ? 'text-emerald-300' : 'text-slate-400'}`}>
                    {hasReachedLevel2
                      ? 'Niveau 2 débloqué : vous pouvez accéder aux cours de FOU, aux certifications et aux nouveaux lieux.'
                      : 'Terminez au moins 5 missions du groupe Installation ISPA puis validez votre dossier au secrétariat.'}
                  </p>
                </div>
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
          )}

          {activeTab === 'inventory' && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
              <p className="text-sm text-slate-400 italic mb-2">Retrouvez ici tous les documents et objets que vous avez collectés.</p>
              
              {inventory.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-600 rounded-2xl bg-slate-800/50">
                  <svg className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  <p className="text-slate-400 font-medium">Votre sac est vide.</p>
                  <p className="text-xs text-slate-500 mt-1">Complétez des missions pour obtenir vos premiers documents.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {inventory.map(itemId => {
                    const item = ITEMS[itemId];
                    if (!item) return null;
                    return (
                      <div key={itemId} className="flex gap-4 p-4 rounded-xl border border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                        <div className="w-12 h-12 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-600">
                           <svg className="w-6 h-6 text-ispa-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d={item.icon} />
                           </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{item.name}</h4>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
