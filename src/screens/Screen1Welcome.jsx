import React from 'react';

export default function Screen1Welcome({ onNext }) {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 text-center">
      <div className="my-auto space-y-4">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-lg">
          ⚡
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
          Privacy-First / Offline-Ready
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Lilt German</h1>
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          Master active German speech production with lightning-fast AI feedback and secure local state management.
        </p>
      </div>
      <button
        onClick={onNext}
        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-sm font-mono transition shadow-lg cursor-pointer"
      >
        Get Started →
      </button>
    </div>
  );
}