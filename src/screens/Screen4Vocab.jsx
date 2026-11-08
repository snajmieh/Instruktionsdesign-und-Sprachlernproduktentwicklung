import React from 'react';

export default function Screen4Vocab({ vocabList, onClose }) {
  return (
    <div className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">Screen 4</span>
          <h2 className="text-lg font-bold text-white">Vocabulary Bank</h2>
        </div>
        <button onClick={onClose} className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer">
          ✕ Close
        </button>
      </div>
      <p className="text-xs text-slate-400">Review phrases and terms collected during active conversations.</p>
      
      <div className="space-y-2 flex-1 overflow-y-auto pt-2">
        {vocabList.map((item) => (
          <div key={item.id} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">{item.term}</div>
              <div className="text-[10px] text-slate-400">{item.translation}</div>
            </div>
            <span className={`text-[9px] font-mono px-2 py-1 rounded-full ${item.mastered ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>
              {item.mastered ? 'Mastered' : 'Learning'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}