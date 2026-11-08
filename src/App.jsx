import React, { useState, useRef } from 'react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState('A2');

  // Chat & Voice States
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'npc',
      text: 'Guten Tag! Sprechen Sie jetzt oder schreiben Sie Ihre Nachricht auf Deutsch.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Screen 4 State: Interactive Flashcard / Vocab Bank
  const [vocabIndex, setVocabIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [vocabList, setVocabList] = useState([
    { id: 1, term: 'die Sprachausgabe', translation: 'speech output', category: 'Technical' },
    { id: 2, term: 'datenschutzfreundlich', translation: 'privacy-friendly', category: 'Security' },
    { id: 3, term: 'die Grammatik', translation: 'grammar', category: 'Linguistics' },
  ]);

  // Screen 6 State: Settings Toggles
  const [offlineMode, setOfflineMode] = useState(true);
  const [autoSpeech, setAutoSpeech] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const utteranceRef = useRef(null);

  // 🔊 FIXED: NON-INTERRUPTING SPEECH SYNTHESIS
  const speakGermanText = (text) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    const playSpeech = () => {
      // Clear previous utterance reference without triggering an artificial interrupt error
      if (utteranceRef.current) {
        utteranceRef.current.onend = null;
        utteranceRef.current.onerror = null;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const germanVoice = voices.find((v) => v.lang.toLowerCase().includes('de'));
      if (germanVoice) {
        utterance.voice = germanVoice;
      }

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted') {
          console.error('Speech synthesis error:', e);
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    // Ensure voices are loaded first
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        playSpeech();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      // Small timeout allows current audio buffer to settle before starting new utterance
      setTimeout(playSpeech, 50);
    }
  };

  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        await sendAudioToBackend(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone error:', err);
      alert('Could not access microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (blob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', blob, 'recording.webm');

    try {
      const response = await fetch('http://localhost:8000/transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (response.ok && data.text) {
        handleUserMessage(data.text);
      } else {
        alert('Transcription failed: ' + (data.error || 'Unknown error'));
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Network error:', err);
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setInputText('');
    handleUserMessage(textToSend);
  };

  const handleUserMessage = async (text) => {
    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setIsProcessing(true);

    const formattedHistory = updatedMessages.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    }));

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: formattedHistory }),
      });
      const data = await res.json();

      if (res.ok && data.reply) {
        const newNpcMsg = {
          id: Date.now() + 1,
          sender: 'npc',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, newNpcMsg]);

        // Speak German response aloud via browser Web Speech API
        speakGermanText(data.reply);
      } else {
        alert('Failed to get AI reply');
      }
    } catch (err) {
      console.error('Chat network error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* --- SCREEN 1: Focus = App Identity & Mission Statement --- */}
        {currentScreen === 1 && (
          <div className="flex-1 flex flex-col justify-between p-6 text-center">
            <div className="my-auto space-y-4">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-lg">
                ⚡
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold px-3 py-1 bg-emerald-500/10 rounded-full">
                Zero Cloud Logging
              </span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Lilt German</h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                An offline-first, privacy-focused conversational partner engineered specifically for active speech production.
              </p>
            </div>
            <button
              onClick={() => setCurrentScreen(2)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs font-mono tracking-wider uppercase transition shadow-lg cursor-pointer"
            >
              Configure Session →
            </button>
          </div>
        )}

        {/* --- SCREEN 2: Focus = CEFR Proficiency Calibration --- */}
        {currentScreen === 2 && (
          <div className="flex-1 flex flex-col justify-between p-6">
            <div className="space-y-4">
              <button onClick={() => setCurrentScreen(1)} className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer">
                ← Back
              </button>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Target Proficiency</h2>
                <p className="text-xs text-slate-400 pt-0.5">Select your CEFR tier to adjust AI prompt complexity.</p>
              </div>
              
              <div className="space-y-2.5 pt-1">
                {[
                  { code: 'A1', label: 'A1 · Beginner Core', desc: 'Slow cadence, foundational syntax' },
                  { code: 'A2', label: 'A2 · Elementary', desc: 'Routine exchanges & simple descriptions' },
                  { code: 'B1', label: 'B1 · Intermediate', desc: 'Abstract thoughts & structured arguments' },
                  { code: 'B2+', label: 'B2+ · Advanced / TestDaF', desc: 'Complex idioms & academic polish' }
                ].map((lvl, idx) => (
                  <div 
                    key={idx}
                    onClick={() => { setSelectedLevel(lvl.code); setCurrentScreen(3); }}
                    className={`p-3.5 bg-slate-950 border rounded-2xl cursor-pointer transition flex flex-col space-y-1 ${
                      selectedLevel === lvl.code ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">{lvl.label}</span>
                      <span className="text-[10px] font-mono text-emerald-400">Select</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{lvl.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center"><span className="text-[10px] font-mono text-slate-400">Screen 2 of 14 · Level Calibration</span></div>
          </div>
        )}

        {/* --- SCREEN 3: Focus = Active Speech Training (Your Original Core) --- */}
        {currentScreen === 3 && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                  Lilt / Tier {selectedLevel}
                </span>
                <h1 className="text-base font-bold text-white tracking-tight">Active Speech Coach</h1>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-full">
                {isProcessing ? '⏳ Thinking...' : isRecording ? '🔴 Recording...' : '🟢 Ready'}
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
                onClick={isRecording ? stopRecording : startRecording}
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
              onSubmit={handleTextSubmit}
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
        )}

        {/* --- SCREEN 4: Focus = Interactive Micro-Flashcards --- */}
        {currentScreen === 4 && (
          <div className="flex-1 flex flex-col p-6 space-y-4 justify-between">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Screen 4</span>
                <h2 className="text-lg font-bold text-white">Active Vocabulary</h2>
              </div>
              <button onClick={() => setCurrentScreen(3)} className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer">✕ Close</button>
            </div>

            {/* Flashcard Box */}
            <div 
              onClick={() => setShowTranslation(!showTranslation)}
              className="flex-1 my-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition shadow-xl select-none"
            >
              <span className="text-[10px] font-mono text-emerald-400 pb-3 uppercase tracking-wider">
                {vocabList[vocabIndex].category} · Tap to flip
              </span>
              <div className="text-xl font-bold text-white py-4">
                {showTranslation ? vocabList[vocabIndex].translation : vocabList[vocabIndex].term}
              </div>
              <span className="text-[10px] text-slate-500 pt-2 font-mono">
                {showTranslation ? 'English Translation' : 'German Expression'}
              </span>
            </div>

            {/* Navigation buttons */}
            <div className="flex space-x-2">
              <button 
                onClick={() => { setShowTranslation(false); setVocabIndex((prev) => (prev > 0 ? prev - 1 : vocabList.length - 1)); }}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-mono transition cursor-pointer"
              >
                ← Previous
              </button>
              <button 
                onClick={() => { setShowTranslation(false); setVocabIndex((prev) => (prev + 1) % vocabList.length); }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-mono transition cursor-pointer"
              >
                Next Word →
              </button>
            </div>
          </div>
        )}

        {/* --- SCREEN 5: Focus = Concise Session Metrics --- */}
        {currentScreen === 5 && (
          <div className="flex-1 flex flex-col p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Screen 5</span>
                <h2 className="text-lg font-bold text-white">Performance Analytics</h2>
              </div>
              <button onClick={() => setCurrentScreen(3)} className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer">✕ Close</button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center">
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">14m</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider pt-1">Active Speech</div>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center">
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">88%</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider pt-1">Syntax Score</div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Streak Status</span>
              <div className="text-xs font-bold text-white">4 Day Active Streak 🔥</div>
              <p className="text-xs text-slate-400 leading-relaxed">Consistent daily conversational drills accelerate active lexical retrieval in German.</p>
            </div>
          </div>
        )}

        {/* --- SCREEN 6: Focus = Privacy & Environment Toggles --- */}
        {currentScreen === 6 && (
          <div className="flex-1 flex flex-col p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Screen 6</span>
                <h2 className="text-lg font-bold text-white">System Preferences</h2>
              </div>
              <button onClick={() => setCurrentScreen(3)} className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer">✕ Close</button>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Offline Local Cache</div>
                  <div className="text-[10px] text-slate-400">Save transcripts locally on device</div>
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
                  <div className="text-xs font-bold text-white">Auto-Play AI Voice</div>
                  <div className="text-[10px] text-slate-400">Synthesize audio output responses</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={autoSpeech} 
                  onChange={() => setAutoSpeech(!autoSpeech)}
                  className="accent-emerald-500 cursor-pointer w-4 h-4"
                />
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">High Contrast UI</div>
                  <div className="text-[10px] text-slate-400">Optimize readability metrics</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={highContrast} 
                  onChange={() => setHighContrast(!highContrast)}
                  className="accent-emerald-500 cursor-pointer w-4 h-4"
                />
              </div>
            </div>
          </div>
        )}

        {/* Persistent Bottom Nav Bar */}
        <div className="bg-slate-950 border-t border-slate-800 p-2.5 flex justify-around text-[10px] font-mono">
          <button onClick={() => setCurrentScreen(1)} className={`cursor-pointer ${currentScreen === 1 ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>Intro</button>
          <button onClick={() => setCurrentScreen(2)} className={`cursor-pointer ${currentScreen === 2 ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>Level</button>
          <button onClick={() => setCurrentScreen(3)} className={`cursor-pointer ${currentScreen === 3 ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>💬 Chat</button>
          <button onClick={() => setCurrentScreen(4)} className={`cursor-pointer ${currentScreen === 4 ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>📚 Vocab</button>
          <button onClick={() => setCurrentScreen(5)} className={`cursor-pointer ${currentScreen === 5 ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>📊 Stats</button>
          <button onClick={() => setCurrentScreen(6)} className={`cursor-pointer ${currentScreen === 6 ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}>⚙️ Settings</button>
        </div>

      </div>
    </div>
  );
}