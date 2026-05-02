import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../engine/gameState';

interface Props {
  gameId: string;
  onClose: () => void;
}

const CHUTE_DES_MOTS_BASE_URL = import.meta.env.VITE_CHUTE_DES_MOTS_URL ?? "https://jeu-verbes.vercel.app/";
const TARGET_MISSION_ID = "arcade-chute-des-mots-b2-temps-niveau-3";
const TARGET_CONTENT_MODE = "tenses";
const TARGET_CEFR_LEVEL = "B2";
const MIN_ACCURACY = 70;

function isChuteDesMotsMissionSuccess(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") return false;

  const result = payload as {
    missionId?: string;
    contentMode?: string;
    cefrLevel?: string;
    accuracy?: number;
    success?: boolean;
    endedByColumnDeath?: boolean;
  };

  if (result.missionId !== TARGET_MISSION_ID) return false;
  if (result.contentMode !== TARGET_CONTENT_MODE) return false;
  if (result.cefrLevel !== TARGET_CEFR_LEVEL) return false;

  if (result.success === true) return true;

  return (
    typeof result.accuracy === "number" &&
    result.accuracy >= MIN_ACCURACY &&
    result.endedByColumnDeath !== true
  );
}

export default function ChuteDesMotsIntegration({ gameId, onClose }: Props) {
  const [gameState, setGameState] = useState<'playing' | 'success' | 'failure'>('playing');
  const [finalAccuracy, setFinalAccuracy] = useState<number>(0);
  
  const recordArcadeScore = useGameStore(state => state.recordArcadeScore);
  const completeMission = useGameStore(state => state.completeMission);
  const completedMissions = useGameStore(state => state.completedMissions);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Pour une iframe cross-origin, on doit faire attention. L'idéal est de valider l'origin.
      // Par sécurité, on se base sur le format de l'événement.
      const data = event.data;
      if (!data || data.type !== "chute-des-mots:complete" || !data.payload) return;

      const payload = data.payload;
      
      // On vérifie que c'est bien la mission qu'on a lancée
      if (payload.missionId !== TARGET_MISSION_ID) return;

      const accuracy = typeof payload.accuracy === 'number' ? payload.accuracy : 0;
      setFinalAccuracy(accuracy);

      const isSuccess = isChuteDesMotsMissionSuccess(payload);

      // Sauvegarder le score
      recordArcadeScore({
        gameId,
        score: payload.score || 0,
        accuracy: accuracy,
        level: "B2",
        details: payload
      });

      if (isSuccess) {
        setGameState('success');
        if (!completedMissions.includes(TARGET_MISSION_ID)) {
          completeMission(TARGET_MISSION_ID);
        }
      } else {
        setGameState('failure');
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [gameId, recordArcadeScore, completeMission, completedMissions]);

  const urlParams = new URLSearchParams({
    contentMode: TARGET_CONTENT_MODE,
    cefrLevel: TARGET_CEFR_LEVEL,
    playMode: 'game',
    wordsPerGame: '30',
    missionId: TARGET_MISSION_ID,
    integrationMode: '1',
    minAccuracy: MIN_ACCURACY.toString(),
    allowColumnDeath: 'false',
    autostart: '1'
  });

  const iframeSrc = `${CHUTE_DES_MOTS_BASE_URL}?${urlParams.toString()}`;

  const handleReplay = () => {
    setGameState('playing');
    // Forcer le rechargement de l'iframe
    if (iframeRef.current) {
      iframeRef.current.src = iframeSrc;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-900 rounded-xl relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 z-10 shrink-0">
        <h3 className="text-xl font-bold text-rose-400">Chute des mots</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {gameState === 'playing' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <iframe 
                ref={iframeRef}
                src={iframeSrc} 
                className="w-full h-full border-none"
                title="Chute des Mots"
                allow="autoplay"
              />
            </motion.div>
          )}

          {gameState === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-900"
            >
              <div className="w-24 h-24 mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Mission Validée !</h2>
              <p className="text-slate-300 mb-8 max-w-md">
                Tu as obtenu {finalAccuracy} % de réussite. Les temps verbaux B2 sont suffisamment maîtrisés pour avancer.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={handleReplay}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors"
                >
                  Rejouer
                </button>
                <button 
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors"
                >
                  Quitter la borne
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'failure' && (
            <motion.div 
              key="failure"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-900"
            >
              <div className="w-24 h-24 mb-6 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Objectif non atteint</h2>
              <p className="text-slate-300 mb-8 max-w-md">
                Tu as obtenu {finalAccuracy} %. Il faut atteindre {MIN_ACCURACY} % pour valider cette mission. Tu peux recommencer depuis la borne d'arcade.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={handleReplay}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-colors"
                >
                  Réessayer
                </button>
                <button 
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors"
                >
                  Quitter la borne
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
