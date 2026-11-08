import React from 'react';

export default function Screen5Stats({ onClose }) {
  return (
    <div className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">Screen 5</span>
          <h2 className="text-lg font-bold text-white">Session Analytics</h2>
        </div>
        <button onClick={onClose} className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer">
          ✕ Close
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center">
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">14 min</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider pt-1">Active Speaking</div>
        </div>
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center">
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">82%</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider pt-1">Accuracy Score</div>
        </div>
      </div>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
        <div className="text-xs font-bold text-white">Current Streak</div>
        <p className="text-xs text-slate-400">You have completed active practice sessions 4 days in a row. Keep up the momentum!</p>
      </div>
    </div>
  );
}