import { useState } from 'react';
import MapScreen from './components/map/MapScreen';
import CharacterCreationScreen from './components/character/CharacterCreationScreen';
import { useGameStore } from './engine/gameState';
import { audio } from './engine/audioEngine';

function App() {
  const [appState, setAppState] = useState<'landing' | 'creation' | 'playing'>('landing');
  const { name, level, conditions } = useGameStore();

  if (appState === 'landing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black z-0"></div>
        <div className="z-10 text-center glass-panel p-12 rounded-2xl max-w-lg w-full transform transition-all duration-1000 ease-out translate-y-0 opacity-100">
          <div className="w-20 h-20 mx-auto mb-6 bg-ispa-accent rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(217,119,6,0.4)]">
             <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h1 className="text-5xl font-serif font-bold text-white mb-3 tracking-tight">Mission ISPA</h1>
          <p className="text-xl text-slate-300 mb-10 font-light">Chroniques d'Amiens</p>
          
          {!name ? (
            <button 
              onClick={() => {
                audio.playClick();
                setAppState('creation');
              }}
              className="px-8 py-4 bg-ispa-accent hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full text-lg"
            >
              Nouvelle partie
            </button>
          ) : (
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  audio.playClick();
                  setAppState('playing');
                }}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:-translate-y-1 w-full flex items-center justify-center gap-3 text-lg"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Continuer ({name})
              </button>
              
              <button 
                onClick={() => {
                  audio.playClick();
                  if (window.confirm("Voulez-vous vraiment recommencer à zéro ? Toute votre progression, vos objets et vos missions seront définitivement effacés.")) {
                     useGameStore.getState().resetGame();
                     setAppState('creation');
                  }
                }}
                className="px-8 py-3 bg-slate-800 hover:bg-rose-900/50 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50 font-semibold rounded-xl shadow-lg transition-all duration-300 w-full flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Recommencer à zéro
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (appState === 'creation') {
    return <CharacterCreationScreen onComplete={() => setAppState('playing')} />;
  }

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden bg-slate-900 text-slate-100">
      {/* Top Bar / Profil */}
      <header className="h-16 glass-panel flex items-center justify-between px-6 z-20 shrink-0 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-ispa-accent rounded-md flex items-center justify-center font-bold font-serif text-white">{level}</div>
            <div className="font-bold text-lg tracking-wider text-slate-100">ISPA</div>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-300 uppercase tracking-wider text-[10px]">Énergie</span>
            <div className="w-24 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500" style={{ width: `${conditions.energy}%` }}></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-300 uppercase tracking-wider text-[10px]">Stress</span>
            <div className="w-24 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)] transition-all duration-500" style={{ width: `${conditions.stress}%` }}></div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <MapScreen />
      </main>
    </div>
  );
}

export default App;
