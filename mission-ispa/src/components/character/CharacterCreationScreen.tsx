import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../engine/gameState';
import { audio } from '../../engine/audioEngine';

export default function CharacterCreationScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [level, setLevel] = useState<'A2' | 'B1' | 'B2'>('B1');
  const [profileType, setProfileType] = useState('');
  
  const setGameProfile = useGameStore(state => state.setProfile);
  const setGameName = useGameStore(state => state.setName);

  const handleComplete = () => {
    audio.playUnlock();
    setGameName(name);
    
    // Base stats
    const stats = {
      comprehension: 10,
      grammar: 10,
      lexicon: 10,
      autonomy: 10,
      sociability: 10,
      organization: 10,
    };

    // Apply profile bonuses
    if (profileType === 'studieux') {
      stats.grammar += 5;
      stats.organization += 5;
    } else if (profileType === 'sociable') {
      stats.sociability += 5;
      stats.lexicon += 5;
    } else if (profileType === 'debrouillard') {
      stats.autonomy += 5;
      stats.comprehension += 5;
    }

    setGameProfile(profileType, stats);
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black z-0"></div>
      
      <div className="z-10 w-full max-w-xl glass-panel p-8 md:p-12 rounded-3xl shadow-2xl relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-serif font-bold text-white mb-2">Bienvenue à Amiens !</h2>
              <p className="text-slate-400 mb-8">Avant de commencer votre inscription, comment vous appelez-vous ?</p>
              
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Votre prénom..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white font-medium focus:outline-none focus:border-ispa-accent transition-colors"
                autoFocus
              />
              
              <button 
                disabled={name.length < 2}
                onClick={() => { audio.playClick(); setStep(2); }}
                className="mt-8 w-full py-4 bg-ispa-accent hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-all shadow-lg"
              >
                Suivant
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-serif font-bold text-white mb-2">Votre Niveau</h2>
              <p className="text-slate-400 mb-8">Quel est votre niveau de français estimé ?</p>
              
              <div className="flex gap-4">
                {['A2', 'B1', 'B2'].map(lvl => (
                  <button 
                    key={lvl}
                    onClick={() => { audio.playClick(); setLevel(lvl as any); }}
                    className={`flex-1 py-6 rounded-xl border-2 font-bold text-xl transition-all ${level === lvl ? 'border-ispa-accent bg-ispa-accent/20 text-ispa-accent' : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500'}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-4 mt-8">
                <button onClick={() => { audio.playClick(); setStep(1); }} className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all">Retour</button>
                <button onClick={() => { audio.playClick(); setStep(3); }} className="flex-1 py-4 bg-ispa-accent hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg">Suivant</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-serif font-bold text-white mb-2">Votre Profil</h2>
              <p className="text-slate-400 mb-8">Quel type d'étudiant êtes-vous ? Cela influencera vos atouts initiaux.</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => { audio.playClick(); setProfileType('studieux'); }}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${profileType === 'studieux' ? 'border-ispa-accent bg-ispa-accent/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}`}
                >
                  <h3 className={`font-bold ${profileType === 'studieux' ? 'text-ispa-accent' : 'text-slate-200'}`}>Studieux</h3>
                  <p className="text-sm text-slate-400">Vous êtes organisé et bon en grammaire.</p>
                </button>
                
                <button 
                  onClick={() => { audio.playClick(); setProfileType('sociable'); }}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${profileType === 'sociable' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}`}
                >
                  <h3 className={`font-bold ${profileType === 'sociable' ? 'text-emerald-500' : 'text-slate-200'}`}>Sociable</h3>
                  <p className="text-sm text-slate-400">Vous adorez parler et enrichir votre vocabulaire.</p>
                </button>
                
                <button 
                  onClick={() => { audio.playClick(); setProfileType('debrouillard'); }}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${profileType === 'debrouillard' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}`}
                >
                  <h3 className={`font-bold ${profileType === 'debrouillard' ? 'text-blue-500' : 'text-slate-200'}`}>Débrouillard</h3>
                  <p className="text-sm text-slate-400">Vous vous adaptez vite et comprenez l'essentiel.</p>
                </button>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button onClick={() => { audio.playClick(); setStep(2); }} className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all">Retour</button>
                <button 
                  disabled={!profileType}
                  onClick={handleComplete} 
                  className="flex-1 py-4 bg-ispa-accent hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Arriver en ville
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
