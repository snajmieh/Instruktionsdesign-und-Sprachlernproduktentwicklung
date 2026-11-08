import React from 'react';

export default function Screen6Settings({ offlineMode, setOfflineMode, autoSpeech, setAutoSpeech, onClose }) {
  return (
    <div className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">Screen 6</span>
          <h2 className="text-lg font-bold text-white">App Settings</h2>
        </div>
        <button onClick={onClose} className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer">
          ✕ Close
        </button>
      </div>

      <div className="space-y-3 pt-2">
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">Offline Local Cache</div>
            <div className="text-[10px] text-slate-400">Store conversation logs locally</div>
          </div>
          <input 
            type="checkbox" 
            checked={offlineMode} 
            onChange={() => setOfflineMode(!offlineMode)}
            className="accent-emerald-500 cursor-pointer w-4 h-4"
          />
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">Auto-Play Voice</div>
            <div className="text-[10px] text-slate-400">Synthesize assistant replies</div>
          </div>
          <input 
            type="checkbox" 
            checked={autoSpeech} 
            onChange={() => setAutoSpeech(!autoSpeech)}
            className="accent-emerald-500 cursor-pointer w-4 h-4"
          />
        </div>
      </div>
    </div>
  );
}