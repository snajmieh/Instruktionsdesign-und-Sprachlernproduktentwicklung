import React from 'react';

export default function Screen3ChatHub({
  selectedLevel,
  messages,
  inputText,
  setInputText,
  isRecording,
  isProcessing,
  onStartRecording,
  onStopRecording,
  onTextSubmit,
  onOpenSettings
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onOpenSettings}
            className="text-slate-400 hover:text-white text-xs font-mono mr-1 cursor-pointer"
            title="Settings"
          >
            ⚙️
          </button>
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Screen 3: Live Coach ({selectedLevel})
            </span>
            <h1 className="text-sm font-bold text-white tracking-tight">Active Speech Session</h1>
          </div>
        </div>
        <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-full">
          {isProcessing ? '⏳ Thinking...' : isRecording ? '🔴 Recording...' : '🟢 Connected'}
        </span>
      </div>

      {/* Chat Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none font-medium'
                  : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none font-medium'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[9px] font-mono text-slate-400 pt-1 px-1">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Microphone Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6">
        <span className="text-[10px] font-mono text-slate-400">
          {isRecording ? 'Recording... Tap to send' : 'Tap mic to speak German'}
        </span>
        <button
          onClick={isRecording ? onStopRecording : onStartRecording}
          disabled={isProcessing}
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition shadow-lg cursor-pointer disabled:opacity-50 ${
            isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isRecording ? '⏹' : '🎙️'}
        </button>
      </div>

      {/* Text Input Bar */}
      <form
        onSubmit={onTextSubmit}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Oder schreiben Sie auf Deutsch..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={isProcessing}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs font-mono transition cursor-pointer disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}