import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Mission } from '../../types/mission';
import { useGameStore } from '../../engine/gameState';
import { audio } from '../../engine/audioEngine';
import { validateMissionAnswer } from '../../engine/missionValidation';
import { UNSUPPORTED_MISSION_TYPES } from '../../constants/gameConstants';

const unsupportedMissionTypes = UNSUPPORTED_MISSION_TYPES;

interface Props {
  mission: Mission;
  onClose: () => void;
}

export default function MissionModal({ mission, onClose }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [selectedChoicesIds, setSelectedChoicesIds] = useState<string[]>([]);
  const [orderingChoiceIds, setOrderingChoiceIds] = useState<string[]>(() => (mission.choices || mission.steps?.[0]?.choices || []).map(choice => choice.id));
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showTranslation, setShowTranslation] = useState(false);

  const completeMission = useGameStore(state => state.completeMission);
  const advanceChapter = useGameStore(state => state.advanceChapter);
  const advanceNarrativeLevel = useGameStore(state => state.advanceNarrativeLevel);
  const addItem = useGameStore(state => state.addItem);
  const unlockCourse = useGameStore(state => state.unlockCourse);
  const updateStat = useGameStore(state => state.updateStat);
  const updateCondition = useGameStore(state => state.updateCondition);

  const steps = mission.steps || [];
  const currentStep = steps.length > 0 ? steps[currentStepIndex] : null;
  
  const question = currentStep ? currentStep.question : mission.question;
  const choices = currentStep ? currentStep.choices : (mission.choices || []);
  const isUnsupportedMissionType = unsupportedMissionTypes.includes(mission.missionType as typeof unsupportedMissionTypes[number]);

  const handleValidate = (overrideChoiceId?: string) => {
    if (showFeedback) return;
    
    const actualChoiceId = overrideChoiceId || selectedChoiceId;
    
    const { correct, feedbackText, effectsToApply } = validateMissionAnswer({
      mission,
      currentStep,
      actualChoiceId,
      selectedChoicesIds,
      orderingChoiceIds,
      choices
    });

    setIsSuccess(correct);
    setFeedbackMessage(feedbackText);
    setShowFeedback(true);

    if (correct) {
      audio.playSuccess();
    } else {
      audio.playError();
    }
    
    // Apply effects
    effectsToApply.forEach(effect => {
      if (['comprehension', 'grammar', 'lexicon', 'autonomy', 'sociability', 'organization'].includes(effect.target)) {
        updateStat(effect.target as any, effect.amount);
      } else {
        updateCondition(effect.target as any, effect.amount);
      }
    });

    if (correct) {
      if (mission.missionType !== 'multiStep' || currentStepIndex === steps.length - 1) {
        completeMission(mission.id);
        
        // Handles backward compatibility for chapter
        if (mission.unlocks?.chapter) {
          advanceChapter(mission.unlocks.chapter);
        }
        
        if (mission.unlocksWhenCompleted) {
           mission.unlocksWhenCompleted.forEach(reward => {
              if (reward.type === 'giveItem') addItem(reward.itemId);
              if (reward.type === 'advanceNarrativeLevel') advanceNarrativeLevel(reward.level);
              if (reward.type === 'unlockCourse') unlockCourse(reward.courseId);
              // Location rewards are currently derived by unlockEngine.ts from
              // revealConditions/unlockConditions in locations.ts.
           });
        }
        
        // Backward compat items
        if (mission.unlocks?.items) {
          mission.unlocks.items.forEach(itemId => addItem(itemId));
        }
      }
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedChoiceId(null);
      setOrderingChoiceIds(steps[currentStepIndex + 1]?.choices.map(choice => choice.id) || []);
      setFeedbackMessage("");
      setShowFeedback(false);
    } else {
      onClose();
    }
  };

  const toggleSelection = (id: string) => {
    if (showFeedback) return;
    setSelectedChoicesIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const moveOrderingChoice = (id: string, direction: -1 | 1) => {
    if (showFeedback) return;
    setOrderingChoiceIds(prev => {
      const currentIndex = prev.indexOf(id);
      const targetIndex = currentIndex + direction;
      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= prev.length) return prev;

      const next = [...prev];
      [next[currentIndex], next[targetIndex]] = [next[targetIndex], next[currentIndex]];
      return next;
    });
  };

  const getDocumentStyle = (style?: string) => {
    switch (style) {
      case 'mail': return 'bg-white text-slate-800 p-8 rounded-lg shadow-inner border-t-8 border-blue-500 font-sans';
      case 'poster': return 'bg-amber-50 text-slate-900 p-10 rounded-sm shadow-md font-sans text-center uppercase tracking-wide border-8 border-double border-amber-200';
      case 'note': return 'bg-yellow-100 text-slate-700 p-8 rounded-sm shadow-md font-handwriting rotate-1 transform';
      default: return 'paper-doc'; // Default style defined in index.css
    }
  };

  const renderDocument = (doc: any) => (
    <div key={doc.title} className={`mt-2 ${getDocumentStyle(doc.visualStyle)} relative shadow-2xl`}>
       <div className="absolute top-4 right-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{doc.sourceType}</div>
       <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-current opacity-60 font-serif">{doc.title}</h3>
       <div className="whitespace-pre-wrap leading-relaxed text-lg">
         {doc.body}
         {showTranslation && doc.bodyZh && (
           <div className="mt-4 pt-4 border-t border-slate-400/20 text-base text-slate-600/90 font-medium">
             {doc.bodyZh}
           </div>
         )}
       </div>
    </div>
  );

  const docs = mission.documents || (mission.document ? [mission.document] : []);

  // MultiSelect Renderer
  const renderMultiSelect = () => (
    <div className="flex flex-col gap-3">
      {choices.map(choice => (
        <label 
          key={choice.id}
          className={`flex items-center gap-4 text-left p-4 rounded-xl transition-all duration-300 border cursor-pointer ${
            showFeedback 
              ? (mission.correctSelection?.includes(choice.id) 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100'
                  : selectedChoicesIds.includes(choice.id) ? 'bg-rose-500/20 border-rose-500/50 text-rose-100' : 'bg-slate-800/30 border-slate-700/30 text-slate-500'
                )
              : selectedChoicesIds.includes(choice.id)
                ? 'bg-ispa-accent/20 border-ispa-accent text-white'
                : 'bg-slate-700/50 border-slate-600 hover:bg-slate-600 hover:border-slate-400 text-slate-200'
          }`}
        >
          <input 
            type="checkbox" 
            checked={selectedChoicesIds.includes(choice.id)}
            onChange={() => toggleSelection(choice.id)}
            disabled={showFeedback}
            className="w-5 h-5 accent-ispa-accent rounded"
          />
          <span className="flex-1">{choice.text}</span>
        </label>
      ))}
      {!showFeedback && (
        <button 
          onClick={() => handleValidate()}
          disabled={selectedChoicesIds.length === 0}
          className="mt-4 px-8 py-3 bg-ispa-accent hover:bg-amber-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Valider ma sélection
        </button>
      )}
    </div>
  );

  const renderUnsupportedMission = () => (
    <div className="flex flex-col gap-3">
      {!showFeedback && (
        <button
          onClick={() => handleValidate()}
          className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors"
        >
          Valider
        </button>
      )}
    </div>
  );

  const renderOrdering = () => (
    <div className="flex flex-col gap-3">
      {orderingChoiceIds.map((choiceId, index) => {
        const choice = choices.find(item => item.id === choiceId);
        if (!choice) return null;

        return (
          <div
            key={choice.id}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
              showFeedback
                ? 'bg-slate-800/30 border-slate-700/30 text-slate-400'
                : 'bg-slate-700/50 border-slate-600 text-slate-200'
            }`}
          >
            <span className="w-7 h-7 shrink-0 rounded-full bg-slate-900/70 text-slate-300 text-xs font-bold flex items-center justify-center">
              {index + 1}
            </span>
            <span className="flex-1 text-sm md:text-base leading-snug">{choice.text}</span>
            <div className="flex gap-1 shrink-0">
              <button
                type="button"
                onClick={() => moveOrderingChoice(choice.id, -1)}
                disabled={showFeedback || index === 0}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-600 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Monter ce choix"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveOrderingChoice(choice.id, 1)}
                disabled={showFeedback || index === orderingChoiceIds.length - 1}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-600 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Descendre ce choix"
              >
                ↓
              </button>
            </div>
          </div>
        );
      })}
      {!showFeedback && (
        <button
          onClick={() => handleValidate()}
          disabled={orderingChoiceIds.length === 0}
          className="mt-4 px-8 py-3 bg-ispa-accent hover:bg-amber-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Valider l'ordre
        </button>
      )}
    </div>
  );

  // Single/Step Renderer
  const renderSingleChoice = () => (
    <div className="flex flex-col gap-3">
      {choices.map(choice => (
        <button 
          key={choice.id}
          onClick={() => { setSelectedChoiceId(choice.id); handleValidate(choice.id); }}
          disabled={showFeedback}
          className={`text-left p-4 rounded-xl transition-all duration-300 border ${
            showFeedback 
              ? choice.id === selectedChoiceId
                ? choice.isCorrect 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-rose-500/20 border-rose-500/50 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                : choice.isCorrect
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200/50'
                  : 'bg-slate-800/30 border-slate-700/30 text-slate-500'
              : 'bg-slate-700/50 border-slate-600 hover:bg-slate-600 hover:border-slate-400 text-slate-200 hover:-translate-y-1 hover:shadow-lg'
          }`}
        >
          {choice.text}
        </button>
      ))}
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 md:p-8"
      >
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-4xl bg-slate-800 border border-slate-600 rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden"
        >
          {/* Header */}
          <div className="h-20 shrink-0 bg-slate-900 flex items-center justify-between px-6 border-b border-slate-700">
            <h2 className="text-xl font-bold font-serif text-white flex items-center gap-3">
              {mission.missionType === 'documentComparison' && <svg className="w-5 h-5 text-ispa-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
              Mission : {mission.title}
              {mission.missionType === 'multiStep' && <span className="text-sm font-normal text-slate-400 ml-4">Étape {currentStepIndex + 1}/{steps.length}</span>}
            </h2>
            <div className="flex items-center gap-4">
              {(mission.narrativeContextZh || mission.questionZh || mission.document?.bodyZh || docs.some(d => d.bodyZh)) && (
                <button
                  onClick={() => { audio.playClick(); setShowTranslation(p => !p); }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors border ${showTranslation ? 'bg-ispa-accent text-white border-ispa-accent shadow-lg shadow-ispa-accent/20' : 'bg-slate-800 text-slate-400 border-slate-600 hover:text-white'}`}
                >
                  {showTranslation ? 'Masquer 中文' : 'Aide 中文'}
                </button>
              )}
              <button 
                onClick={() => { audio.playClick(); onClose(); }}
                className="text-slate-400 hover:text-white bg-slate-800/50 rounded-full p-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <p className="text-slate-300 italic">
              {mission.narrativeContext}
              {showTranslation && mission.narrativeContextZh && (
                 <span className="block mt-2 text-amber-400/80 not-italic font-medium">{mission.narrativeContextZh}</span>
              )}
            </p>
            
            <div className={`grid gap-6 ${docs.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {docs.map(renderDocument)}
            </div>

            {/* Choices and Feedback */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col shadow-lg border border-slate-700/50 bg-slate-800/80">
                <h3 className="text-xl font-medium text-white mb-6 leading-snug">
                  {question}
                  {showTranslation && mission.questionZh && (
                    <span className="block mt-2 text-amber-400/80 text-base">{mission.questionZh}</span>
                  )}
                </h3>
                
                {mission.missionType === 'multiSelect'
                  ? renderMultiSelect()
                  : mission.missionType === 'ordering'
                    ? renderOrdering()
                  : isUnsupportedMissionType
                    ? renderUnsupportedMission()
                    : renderSingleChoice()}

                <AnimatePresence>
                  {showFeedback && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                      className={`p-5 rounded-xl border ${isSuccess ? 'bg-emerald-900/40 border-emerald-500/50' : 'bg-rose-900/40 border-rose-500/50'}`}
                    >
                      <h4 className={`font-bold text-lg mb-2 flex items-center gap-2 ${isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isSuccess ? (
                          <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Succès !</>
                        ) : (
                          <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Oups !</>
                        )}
                      </h4>
                      <p className="text-slate-200 text-sm mb-4 leading-relaxed">
                        {feedbackMessage}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {(isSuccess ? mission.successEffects : mission.failureEffects)?.map((eff, i) => (
                           <span key={i} className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-black/40 ${eff.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {eff.amount > 0 ? '+' : ''}{eff.amount} {eff.target}
                           </span>
                        ))}
                      </div>

                      <button 
                        onClick={() => { 
                          audio.playClick(); 
                          if (isSuccess && mission.missionType === 'multiStep') {
                            handleNextStep();
                          } else {
                            onClose(); 
                          }
                        }}
                        className="w-full px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                      >
                        {isSuccess 
                          ? (mission.missionType === 'multiStep' && currentStepIndex < steps.length - 1 ? 'Étape suivante' : 'Continuer')
                          : 'Fermer'
                        }
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
