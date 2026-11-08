import React from 'react';

export default function Screen2LevelSelect({ onSelectLevel, onBack }) {
  const levels = [
    { code: 'A1', label: 'A1 - Beginner (Anfänger)' },
    { code: 'A2', label: 'A2 - Elementary (Grundlegende)' },
    { code: 'B1', label: 'B1 - Intermediate (Mittelstufe)' },
    { code: 'B2+', label: 'B2+ - Advanced / TestDaF (Fortgeschritten)' }
  ];

  return (
    <div className="flex-1 flex flex-col justify-between p-6">
      <div className="space-y-4">
        <button 
          onClick={onBack} 
          className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
        >
          ← Back
        </button>
        <h2 className="text-xl font-bold text-white tracking-tight">Select Your Target Level</h2>
        <p className="text-xs text-slate-400">Choose your CEFR baseline for tailored prompt pacing.</p>
        
        <div className="space-y-2 pt-2">
          {levels.map((lvl, idx) => (
            <div 
              key={idx}
              onClick={() => onSelectLevel(lvl.code)}
              className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500 rounded-2xl cursor-pointer transition flex items-center justify-between text-xs font-medium text-slate-200"
            >
              <span>{lvl.label}</span>
              <span className="font-mono text-emerald-400">Select</span>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center pb-2">
        <span className="text-[10px] font-mono text-slate-400">Screen 2 of 14</span>
      </div>
    </div>
  );
}