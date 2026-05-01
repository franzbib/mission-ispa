import { ARCADE_GAMES } from '../../data/arcadeGames';
import { useGameStore } from '../../engine/gameState';
import { getBestScore, formatArcadeScore } from '../../engine/arcadeEngine';

interface Props {
  onClose: () => void;
}

export default function ArcadeHub({ onClose }: Props) {
  const gameState = useGameStore(state => state);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mini-jeux disponibles
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800/50 rounded-full p-2 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </h3>

        <div className="grid gap-4">
          {ARCADE_GAMES.map((game) => {
            const bestScore = getBestScore(game.id, gameState);
            
            return (
              <div 
                key={game.id} 
                className={`relative overflow-hidden flex flex-col p-5 rounded-xl border transition-all duration-300 ${
                  game.status === 'external' || game.status === 'internal'
                    ? 'bg-slate-800/80 border-rose-500/30 hover:border-rose-400/60'
                    : 'bg-slate-900/50 border-slate-700 opacity-80'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-bold text-slate-100">{game.title}</h4>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      game.status === 'planned' ? 'bg-slate-700 text-slate-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {game.status === 'planned' ? 'Prévu' : game.status === 'external' ? 'Externe' : 'Interne'}
                    </span>
                  </div>
                  
                  {bestScore && (
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Meilleur score</span>
                      <span className="text-sm font-bold text-amber-400">{formatArcadeScore(bestScore.score)}</span>
                    </div>
                  )}
                </div>

                {game.subtitle && <p className="text-sm font-medium text-rose-300/80 mb-2">{game.subtitle}</p>}
                
                <p className="text-sm text-slate-400 mb-4">{game.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {game.pedagogicalFocus.map(focus => (
                    <span key={focus} className="text-[10px] uppercase px-2 py-1 bg-slate-700/50 text-slate-300 rounded-md border border-slate-600/50">
                      {focus}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-700/50 flex justify-end">
                  {game.status === 'external' && game.externalUrl ? (
                    <a 
                      href={game.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span>Ouvrir le jeu</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  ) : (
                    <button disabled className="px-4 py-2 bg-slate-800 text-slate-500 text-sm font-bold rounded-lg cursor-not-allowed">
                      Bientôt disponible
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
