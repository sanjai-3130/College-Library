/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Checkout } from '../types';
import { 
  BookOpen, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  RotateCcw, 
  CreditCard, 
  Sliders, 
  ArrowRight,
  BookOpenCheck,
  History
} from 'lucide-react';

export const MyBooks: React.FC = () => {
  const { checkouts, renewBook, returnBook, payFine, updateBookProgress } = useLibrary();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showProgressSlider, setShowProgressSlider] = useState<string | null>(null);
  const [tempProgress, setTempProgress] = useState(0);

  // Active checkouts
  const activeCheckouts = checkouts.filter(c => c.status !== 'returned');
  
  // History checkouts
  const historyCheckouts = checkouts.filter(c => c.status === 'returned');

  const handleRenew = (id: string) => {
    setSuccessMsg('');
    setErrorMsg('');
    const res = renewBook(id);
    if (res.success) {
      setSuccessMsg(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleReturn = (id: string) => {
    setSuccessMsg('');
    setErrorMsg('');
    const res = returnBook(id);
    if (res.success) {
      setSuccessMsg(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handlePay = (id: string) => {
    setSuccessMsg('');
    setErrorMsg('');
    const res = payFine(id);
    if (res.success) {
      setSuccessMsg(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  const triggerProgressUpdate = (checkout: Checkout) => {
    setShowProgressSlider(checkout.id);
    setTempProgress(checkout.progress);
  };

  const saveProgressUpdate = (bookId: string, checkoutId: string) => {
    updateBookProgress(bookId, tempProgress);
    setShowProgressSlider(null);
    setSuccessMsg('Reading progress successfully synchronized!');
  };

  return (
    <div className="space-y-6" id="my-books-view">
      {/* View Header */}
      <div className="glass bento-shadow rounded-3xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-slate-900 font-display">My Book Tracker</h2>
        <p className="text-xs text-slate-500">Track active checkouts, update reading progresses, perform renewals, or clear outstanding fine balances.</p>
      </div>

      {/* Message banners */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-650" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-650" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Active Checkouts Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-brand-600" />
          <h3 className="text-lg font-bold text-slate-800 font-display">Currently Issued ({activeCheckouts.length})</h3>
        </div>

        {activeCheckouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="active-loans-grid">
            {activeCheckouts.map((checkout) => {
              const isOverdue = checkout.status === 'overdue';
              const daysLeft = Math.ceil(
                (new Date(checkout.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
              );

              return (
                <div 
                  key={checkout.id} 
                  className={`glass bento-shadow p-6 rounded-3xl border transition-all ${
                    isOverdue 
                      ? 'border-red-200/80 bg-red-50/20 shadow-sm shadow-red-500/5' 
                      : 'border-white/20 hover:border-blue-400/40'
                  }`}
                >
                  <div className="flex gap-4">
                    <img 
                      src={checkout.coverUrl} 
                      alt={checkout.bookTitle} 
                      className="w-16 h-24 rounded-lg object-cover shadow shrink-0 border border-slate-200" 
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-550 border border-slate-200/40">
                          ID: {checkout.id}
                        </span>
                        
                        {isOverdue ? (
                          <span className="text-[9px] font-bold text-red-750 bg-red-55/15 px-2.5 py-0.5 rounded-md flex items-center gap-1 animate-pulse border border-red-200/30">
                            <AlertTriangle className="h-2.5 w-2.5" /> OVERDUE
                          </span>
                        ) : checkout.status === 'renewed' ? (
                          <span className="text-[9px] font-bold text-blue-750 bg-blue-55/15 px-2.5 py-0.5 rounded-md border border-blue-200/30">
                            RENEWED
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-emerald-750 bg-emerald-55/15 px-2.5 py-0.5 rounded-md border border-emerald-200/30">
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-800 truncate leading-tight font-display">{checkout.bookTitle}</h4>
                      <p className="text-xs text-slate-500 mt-1">by {checkout.bookAuthor}</p>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-medium text-slate-400">
                        <div>
                          <div>Issued Date</div>
                          <div className="text-slate-700 font-bold mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-400" /> {checkout.issueDate}
                          </div>
                        </div>
                        <div>
                          <div>Return Due Date</div>
                          <div className={`font-bold mt-1 flex items-center gap-1 ${
                            isOverdue ? 'text-red-600 font-extrabold' : 'text-slate-700'
                          }`}>
                            <Clock className="h-3 w-3" /> {checkout.dueDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reading Progress Bar & Updates */}
                  <div className="border-t border-slate-200/40 my-4 pt-4 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-500">My Reading Progress</span>
                      <button 
                        onClick={() => triggerProgressUpdate(checkout)}
                        className="text-xs font-bold text-blue-605 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Sliders className="h-3.5 w-3.5" /> 
                        <span>{showProgressSlider === checkout.id ? 'Syncing...' : 'Update'}</span>
                      </button>
                    </div>

                    {showProgressSlider === checkout.id ? (
                      <div className="p-4 bg-white/50 border border-slate-200/40 rounded-2xl space-y-3">
                        <div className="flex items-center gap-3">
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={tempProgress}
                            onChange={(e) => setTempProgress(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-650"
                          />
                          <span className="text-xs font-bold font-mono text-slate-700 shrink-0 w-8 text-right">{tempProgress}%</span>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setShowProgressSlider(null)}
                            className="px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-200 rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => saveProgressUpdate(checkout.bookId, checkout.id)}
                            className="px-3 py-1 text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
                          >
                            Save Progress
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              isOverdue ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                            }`}
                            style={{ width: `${checkout.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono font-bold">
                          <span>Progress: {checkout.progress}%</span>
                          <span>{checkout.progress === 100 ? 'Finished read! 🎉' : 'Keep reading'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fine and action row */}
                  {checkout.fineAmount > 0 && (
                    <div className="mb-4 p-4 rounded-2xl bg-red-55/10 border border-red-200/40 text-red-850 text-xs flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4.5 w-4.5 text-red-600" />
                        <span>Accumulated Fine: <span className="font-extrabold text-red-600 font-mono">₹{checkout.fineAmount}</span></span>
                      </div>
                      <button
                        onClick={() => handlePay(checkout.id)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-sm shadow-red-250"
                      >
                        <CreditCard className="h-3 w-3" /> Pay Fine
                      </button>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex gap-2.5 justify-end">
                    <button
                      onClick={() => handleRenew(checkout.id)}
                      disabled={isOverdue}
                      className="px-4 py-2 border border-slate-200 hover:border-blue-400 hover:text-blue-700 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-500 text-slate-600 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 bg-white cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Extend Loan
                    </button>
                    
                    <button
                      onClick={() => handleReturn(checkout.id)}
                      className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100/20 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Return Book
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 glass bento-shadow border border-white/20 rounded-3xl">
            <BookOpenCheck className="h-12 w-12 text-slate-350 mx-auto mb-3" />
            <p className="text-lg font-bold text-slate-600 font-display">No books currently issued</p>
            <p className="text-xs text-slate-450 mt-1">Ready to start reading? Search our online database.</p>
          </div>
        )}
      </div>

      {/* History reading Log Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 border-t border-slate-200/45 pt-6">
          <History className="h-5 w-5 text-slate-500" />
          <h3 className="text-lg font-bold text-slate-800 font-display">Borrowing History ({historyCheckouts.length})</h3>
        </div>

        {historyCheckouts.length > 0 ? (
          <div className="glass bento-shadow rounded-3xl overflow-hidden border border-white/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/50 border-b border-slate-200/60 text-slate-550 font-bold uppercase tracking-wider font-mono">
                    <th className="p-4">Record ID</th>
                    <th className="p-4">Book Title</th>
                    <th className="p-4">Issue Date</th>
                    <th className="p-4">Return Date</th>
                    <th className="p-4">Fine Settled</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {historyCheckouts.map((hist) => (
                    <tr key={hist.id} className="hover:bg-white/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-500">{hist.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={hist.coverUrl} alt={hist.bookTitle} className="w-6 h-8 rounded-md object-cover shadow-sm shrink-0 border border-slate-200" />
                          <div>
                            <div className="font-bold text-slate-800">{hist.bookTitle}</div>
                            <div className="text-[10px] text-slate-450">{hist.bookAuthor}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-650 font-mono">{hist.issueDate}</td>
                      <td className="p-4 text-slate-650 font-mono">{hist.returnedDate || '-'}</td>
                      <td className="p-4 font-bold text-emerald-600 font-mono">₹0.00 (Fully Paid)</td>
                      <td className="p-4 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-550 border border-slate-200/45">
                          RETURNED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-450 italic">No past checked-out history recorded in current database.</p>
        )}
      </div>
    </div>
  );
};
