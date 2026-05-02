import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../engine/gameState';

interface Props {
  gameId: string;
  onClose: () => void;
}

type Tense = 'Présent' | 'Imparfait' | 'Passé Composé' | 'Futur' | 'Conditionnel';

interface VerbData {
  word: string;
  tense: Tense;
}

const VERB_DATABASE: VerbData[] = [
  { word: 'je suis', tense: 'Présent' },
  { word: 'tu as', tense: 'Présent' },
  { word: 'nous allons', tense: 'Présent' },
  { word: 'vous faites', tense: 'Présent' },
  { word: 'ils disent', tense: 'Présent' },
  
  { word: 'j\'étais', tense: 'Imparfait' },
  { word: 'tu avais', tense: 'Imparfait' },
  { word: 'elle regardait', tense: 'Imparfait' },
  { word: 'nous finissions', tense: 'Imparfait' },
  { word: 'vous preniez', tense: 'Imparfait' },
  
  { word: 'j\'ai mangé', tense: 'Passé Composé' },
  { word: 'tu es parti', tense: 'Passé Composé' },
  { word: 'il a vu', tense: 'Passé Composé' },
  { word: 'nous sommes allés', tense: 'Passé Composé' },
  { word: 'elles ont pris', tense: 'Passé Composé' },
  
  { word: 'je viendrai', tense: 'Futur' },
  { word: 'tu seras', tense: 'Futur' },
  { word: 'il aura', tense: 'Futur' },
  { word: 'nous pourrons', tense: 'Futur' },
  { word: 'vous ferez', tense: 'Futur' },
  
  { word: 'je voudrais', tense: 'Conditionnel' },
  { word: 'tu aimerais', tense: 'Conditionnel' },
  { word: 'il devrait', tense: 'Conditionnel' },
  { word: 'nous serions', tense: 'Conditionnel' },
  { word: 'vous auriez', tense: 'Conditionnel' },
];

const TENSES: Tense[] = ['Présent', 'Imparfait', 'Passé Composé', 'Futur', 'Conditionnel'];

const ROUND_TIME = 10; // seconds per word
const MAX_LIVES = 3;

export default function JeuDesVerbes({ gameId, onClose }: Props) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [currentVerb, setCurrentVerb] = useState<VerbData | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  const recordArcadeScore = useGameStore(state => state.recordArcadeScore);

  const pickRandomVerb = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * VERB_DATABASE.length);
    setCurrentVerb(VERB_DATABASE[randomIndex]);
    setTimeLeft(ROUND_TIME);
    setFeedback(null);
  }, []);

  const startGame = () => {
    setScore(0);
    setLives(MAX_LIVES);
    setGameState('playing');
    pickRandomVerb();
  };

  const handleGameOver = useCallback(() => {
    setGameState('gameover');
    recordArcadeScore({
      gameId,
      score,
      maxScore: score, // Infinity mode for now
      accuracy: 1, // Optional
      durationSeconds: 0, // Optional
    });
  }, [gameId, score, recordArcadeScore]);

  useEffect(() => {
    let timer: number;
    if (gameState === 'playing' && timeLeft > 0 && !feedback) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleWrongAnswer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, feedback]);

  const handleWrongAnswer = () => {
    setFeedback('incorrect');
    setTimeout(() => {
      setLives(prev => {
        const next = prev - 1;
        if (next <= 0) {
          handleGameOver();
        } else {
          pickRandomVerb();
        }
        return next;
      });
    }, 1000);
  };

  const handleTenseClick = (tense: Tense) => {
    if (feedback !== null || gameState !== 'playing' || !currentVerb) return;

    if (tense === currentVerb.tense) {
      setFeedback('correct');
      setScore(prev => prev + 100 + (timeLeft * 10)); // Bonus points for time
      setTimeout(() => {
        pickRandomVerb();
      }, 800);
    } else {
      handleWrongAnswer();
    }
  };

  return (
    <div className="flex flex-col min-h-[600px] overflow-hidden bg-slate-900 rounded-xl relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 z-10">
        <h3 className="text-xl font-bold text-rose-400">Jeu des Verbes</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          {gameState === 'start' && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-24 h-24 mb-6 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Prêt à jouer ?</h2>
              <p className="text-slate-400 mb-8 max-w-md">
                Un verbe conjugué va apparaître. Clique le plus vite possible sur le temps correct. 
                Tu as {MAX_LIVES} vies.
              </p>
              <button 
                onClick={startGame}
                className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-lg transition-transform hover:scale-105 active:scale-95"
              >
                Démarrer
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && currentVerb && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col p-6"
            >
              {/* HUD */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-1">
                  {[...Array(MAX_LIVES)].map((_, i) => (
                    <svg key={i} className={`w-6 h-6 ${i < lives ? 'text-rose-500' : 'text-slate-700'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <div className="text-2xl font-bold font-mono text-amber-400">
                  {score.toString().padStart(5, '0')}
                </div>
              </div>

              {/* Verb Display */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-md flex flex-col items-center">
                  {/* Timer Bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-8">
                    <motion.div 
                      className={`h-full ${timeLeft > 3 ? 'bg-amber-400' : 'bg-rose-500'}`}
                      initial={{ width: '100%' }}
                      animate={{ width: `${(timeLeft / ROUND_TIME) * 100}%` }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </div>

                  {/* Word */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentVerb.word}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: 1,
                        scale: feedback === 'correct' ? 1.2 : feedback === 'incorrect' ? 0.9 : 1,
                        color: feedback === 'correct' ? '#10b981' : feedback === 'incorrect' ? '#f43f5e' : '#ffffff'
                      }}
                      exit={{ y: -20, opacity: 0 }}
                      className="text-5xl md:text-6xl font-bold mb-12 text-center"
                    >
                      {currentVerb.word}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Choices */}
                <div className="w-full max-w-lg grid grid-cols-2 gap-3 mt-auto">
                  {TENSES.map(tense => (
                    <button
                      key={tense}
                      onClick={() => handleTenseClick(tense)}
                      disabled={feedback !== null}
                      className={`
                        p-4 rounded-xl font-bold text-sm sm:text-base transition-all
                        ${feedback === null ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700' : 'opacity-50 cursor-not-allowed'}
                        ${feedback === 'correct' && currentVerb.tense === tense ? 'bg-emerald-600 border-emerald-500 text-white opacity-100 scale-105' : ''}
                        ${feedback === 'incorrect' && currentVerb.tense === tense ? 'bg-emerald-600/50 border-emerald-500 text-white opacity-100' : ''}
                        ${feedback === 'incorrect' && tense !== currentVerb.tense ? 'bg-rose-600/50 border-rose-500 text-white' : ''}
                        ${tense === 'Conditionnel' ? 'col-span-2' : ''}
                      `}
                    >
                      {tense}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'gameover' && (
            <motion.div 
              key="gameover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
            >
              <h2 className="text-4xl font-bold text-rose-500 mb-2">Game Over</h2>
              <p className="text-slate-400 mb-8">Plus de vies !</p>
              
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-8 w-full max-w-sm">
                <p className="text-sm text-slate-400 uppercase tracking-wider mb-1">Score Final</p>
                <p className="text-5xl font-bold text-amber-400 font-mono">{score}</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={startGame}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-colors"
                >
                  Rejouer
                </button>
                <button 
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors"
                >
                  Quitter
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
