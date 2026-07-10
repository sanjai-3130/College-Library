/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  QrCode, 
  BookOpen, 
  User, 
  MapPin, 
  CheckCircle, 
  Search, 
  Camera, 
  Volume2, 
  Play, 
  ArrowRight,
  Shield,
  Layers
} from 'lucide-react';

export const QRScanner: React.FC = () => {
  const { books, currentUser, loginWithQR, setActiveView } = useLibrary();

  // Scanner States
  const [activeScan, setActiveScan] = useState(false);
  const [scanResult, setScanResult] = useState<{ type: 'book' | 'student'; value: string; detail: any } | null>(null);
  const [muteSound, setMuteSound] = useState(false);

  const simulateScan = (type: 'book' | 'student', codeId: string) => {
    setActiveScan(true);
    setScanResult(null);

    // Simulated camera sweeping grid delay
    setTimeout(() => {
      setActiveScan(false);

      // Play Beep sound visually / audio
      if (!muteSound) {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, audioCtx.currentTime); // high note beep
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.12);
        } catch (e) {
          // ignore context blocked failures
        }
      }

      if (type === 'student') {
        const studentDetail = {
          id: codeId,
          name: codeId.includes('ADMIN') ? 'Dr. Elizabeth Vance' : 'Alex Mercer',
          role: codeId.includes('ADMIN') ? 'Library Staff' : 'Engineering Student',
          dept: codeId.includes('ADMIN') ? 'Library Operations' : 'Computer Science Dept'
        };
        setScanResult({
          type: 'student',
          value: `STU-ALEX-${codeId}`,
          detail: studentDetail
        });
      } else {
        const matchedBook = books.find(b => b.id === codeId) || books[0];
        setScanResult({
          type: 'book',
          value: matchedBook.isbn,
          detail: matchedBook
        });
      }

    }, 2000);
  };

  const handleContextAction = () => {
    if (!scanResult) return;
    
    if (scanResult.type === 'student') {
      // Simulate quick logging in with this card
      loginWithQR(scanResult.value);
      setActiveView('dashboard');
    } else {
      // It is a book. Open catalog details
      setActiveView('search');
    }
  };

  return (
    <div className="space-y-6" id="qr-scanner-view">
      {/* View Header */}
      <div className="glass bento-shadow rounded-3xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-slate-900 font-display">Simulated QR Code Scanner</h2>
        <p className="text-xs text-slate-500">Scan book ISBN barcodes or digital member cards to quickly index database metadata.</p>
      </div>

      {/* Main Grid: Viewport on left, shortcuts on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Viewport Frame */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-950 rounded-3xl border-2 border-slate-900 overflow-hidden relative aspect-video flex flex-col items-center justify-center text-white bento-shadow">
            
            {activeScan ? (
              <>
                {/* Sweep lines and radar matrix */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent)] pointer-events-none"></div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_#3b82f6] scanner-line"></div>
                
                {/* Corners */}
                <div className="absolute top-8 left-16 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl-xl"></div>
                <div className="absolute top-8 right-16 w-8 h-8 border-t-2 border-r-2 border-blue-400 rounded-tr-xl"></div>
                <div className="absolute bottom-8 left-16 w-8 h-8 border-b-2 border-l-2 border-blue-400 rounded-bl-xl"></div>
                <div className="absolute bottom-8 right-16 w-8 h-8 border-b-2 border-r-2 border-blue-400 rounded-br-xl"></div>

                <div className="relative flex flex-col items-center">
                  <Camera className="h-12 w-12 text-blue-400 animate-pulse mb-3" />
                  <p className="text-sm font-bold tracking-widest text-blue-200 animate-pulse font-display">ACTIVE HARDWARE SCAN...</p>
                  <p className="text-[10px] text-slate-500 mt-1.5 font-mono">Camera resolution: 1080p HD Lens</p>
                </div>
              </>
            ) : scanResult ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-emerald-400 animate-fade-in">
                <div className="h-16 w-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="h-10 w-10 text-emerald-400" />
                </div>
                <p className="text-lg font-bold font-display">DECODED SUCCESS</p>
                <p className="text-xs text-slate-400 mt-1.5 font-mono">Format: QR_CODE_MATRIX</p>
              </div>
            ) : (
              <div className="flex flex-col items-center p-8 text-center text-slate-500">
                <div className="qr-overlay h-24 w-24 rounded-2xl flex items-center justify-center mb-4 p-2 bg-slate-900 border-blue-500/30">
                  <QrCode className="h-12 w-12 text-blue-400 animate-pulse" />
                </div>
                <p className="text-sm font-bold text-slate-400 font-display">Scanner Stream Standby</p>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Trigger mock scans from the right console panel to test card authentication or instant book routing.
                </p>
              </div>
            )}

            {/* Audio Toggle button */}
            <button 
              onClick={() => setMuteSound(!muteSound)}
              className="absolute bottom-4 right-4 p-2.5 bg-slate-900/80 hover:bg-slate-800/80 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <Volume2 className={`h-4 w-4 ${muteSound ? 'opacity-40 stroke-red-400' : ''}`} />
            </button>
          </div>

          {/* Render Decoded Scan Result Sheet */}
          {scanResult && (
            <div className="glass bento-shadow rounded-3xl p-6 border border-emerald-200/40 space-y-4 animate-fade-in" id="scan-result-card">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/50 px-2.5 py-1 rounded-md uppercase font-mono">
                    Decoded Value
                  </span>
                  <h3 className="text-base font-extrabold text-slate-800 mt-2 font-mono tracking-tight break-all">
                    {scanResult.value}
                  </h3>
                </div>
                
                <span className="text-xs font-bold text-emerald-600 font-mono">Beep beep! 🔊</span>
              </div>

              {/* Decoded Body metadata */}
              <div className="p-4 bg-white/45 rounded-2xl border border-slate-200/40">
                {scanResult.type === 'student' ? (
                  <div className="flex gap-3 items-center">
                    <div className="h-11 w-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <User className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{scanResult.detail.name}</h4>
                      <p className="text-xs text-slate-500">{scanResult.detail.role} • {scanResult.detail.dept}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 items-center">
                    <img 
                      src={scanResult.detail.coverUrl} 
                      alt={scanResult.detail.title} 
                      className="w-10 h-14 rounded-lg object-cover shadow-sm shrink-0 border border-slate-200" 
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate leading-tight">{scanResult.detail.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">by {scanResult.detail.author}</p>
                      
                      <div className="flex items-center gap-1.5 mt-2 text-[10px]">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span className="font-semibold text-slate-500 font-mono">Rack: {scanResult.detail.shelfLocation}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 justify-end pt-1">
                <button
                  onClick={() => setScanResult(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                >
                  Dismiss Scan
                </button>
                <button
                  onClick={handleContextAction}
                  className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition-all shadow shadow-brand-200 flex items-center gap-1.5 cursor-pointer"
                  id="scan-followup-action"
                >
                  {scanResult.type === 'student' ? 'Access Student Portal' : 'Open Catalog Details'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Scan Controllers */}
        <div className="lg:col-span-1">
          <div className="glass bento-shadow rounded-3xl p-6 border border-white/20 space-y-4">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-150 pb-3 font-display">Scan Sim Console</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select any of the mock campus codes below to feed them into the scanning camera viewport frame:
            </p>

            {/* Student ID triggers */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Student ID Cards</span>
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  onClick={() => simulateScan('student', 'CS20244091')}
                  disabled={activeScan}
                  className="w-full text-left p-3.5 rounded-2xl border border-slate-200/50 bg-white/40 hover:border-brand-300 hover:bg-brand-50 hover:shadow-sm text-xs font-bold text-slate-700 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-brand-50 border border-brand-100 text-brand-600">
                    <User className="h-4 w-4" />
                  </div>
                  <span>Scan Card: CS-2024-4091 (Alex)</span>
                </button>
                <button
                  onClick={() => simulateScan('student', 'CS-ADMIN-9901')}
                  disabled={activeScan}
                  className="w-full text-left p-3.5 rounded-2xl border border-slate-200/50 bg-white/40 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm text-xs font-bold text-slate-700 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
                    <Shield className="h-4 w-4" />
                  </div>
                  <span>Scan Card: ADMIN-9901 (Staff)</span>
                </button>
              </div>
            </div>

            {/* Book Barcode triggers */}
            <div className="space-y-2.5 pt-4 border-t border-slate-200/40">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Book Barcodes (ISBN)</span>
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  onClick={() => simulateScan('book', 'B001')}
                  disabled={activeScan}
                  className="w-full text-left p-3.5 rounded-2xl border border-slate-200/50 bg-white/40 hover:border-brand-300 hover:bg-brand-50 hover:shadow-sm text-xs font-bold text-slate-700 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="truncate">Scan: Algorithms (CLRS)</span>
                </button>
                <button
                  onClick={() => simulateScan('book', 'B004')}
                  disabled={activeScan}
                  className="w-full text-left p-3.5 rounded-2xl border border-slate-200/50 bg-white/40 hover:border-brand-300 hover:bg-brand-50 hover:shadow-sm text-xs font-bold text-slate-700 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="truncate">Scan: Math Analysis (Rudin)</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
