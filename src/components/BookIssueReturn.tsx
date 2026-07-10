/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  BookUp, 
  UserCheck, 
  RotateCcw, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  User, 
  BookOpen, 
  Calendar,
  AlertTriangle,
  CreditCard
} from 'lucide-react';

export const BookIssueReturn: React.FC = () => {
  const { books, checkouts, issueBook, returnBook, payFine } = useLibrary();
  
  // Console state
  const [consoleMode, setConsoleMode] = useState<'issue' | 'return'>('issue');
  
  // Issue Fields
  const [studentId, setStudentId] = useState('');
  const [bookId, setBookId] = useState('');
  
  // Messages states
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const activeLoans = checkouts.filter(c => c.status !== 'returned');

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!studentId.trim() || !bookId.trim()) {
      setError('Both Student ID and Book Catalog ID are required.');
      return;
    }

    const res = issueBook(bookId.toUpperCase(), studentId.toUpperCase());
    if (res.success) {
      setSuccess(res.message);
      setStudentId('');
      setBookId('');
    } else {
      setError(res.message);
    }
  };

  const handleQuickReturn = (checkoutId: string) => {
    setSuccess('');
    setError('');
    
    // Check if there is an overdue fine to trigger warning first or just clear
    const checkout = checkouts.find(c => c.id === checkoutId);
    if (checkout && checkout.status === 'overdue' && checkout.fineAmount > 0) {
      setError(`Cannot return overdue volume until outstanding fine of ₹${checkout.fineAmount} is settled.`);
      return;
    }

    const res = returnBook(checkoutId);
    if (res.success) {
      setSuccess(res.message);
    } else {
      setError(res.message);
    }
  };

  const handleSettleFine = (checkoutId: string) => {
    setSuccess('');
    setError('');
    const res = payFine(checkoutId);
    if (res.success) {
      setSuccess(res.message + ' You can now return the book copy safely.');
    } else {
      setError(res.message);
    }
  };

  const autofillDemo = (student: string, book: string) => {
    setStudentId(student);
    setBookId(book);
  };

  return (
    <div className="space-y-6" id="issue-return-view">
      {/* View Header */}
      <div className="glass bento-shadow rounded-3xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-slate-900 font-display">Issue & Return Console</h2>
        <p className="text-xs text-slate-500">Manage student loans, process book returns, adjust copies counts, and resolve late fine liabilities.</p>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-200/55 backdrop-blur-md max-w-sm border border-slate-200/40">
        <button
          onClick={() => { setConsoleMode('issue'); setSuccess(''); setError(''); }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            consoleMode === 'issue'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md shadow-blue-100/30'
              : 'text-slate-650 hover:text-slate-900'
          }`}
        >
          <UserCheck className="h-4 w-4" /> Issue Book Console
        </button>
        <button
          onClick={() => { setConsoleMode('return'); setSuccess(''); setError(''); }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            consoleMode === 'return'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md shadow-blue-100/30'
              : 'text-slate-650 hover:text-slate-900'
          }`}
        >
          <RotateCcw className="h-4 w-4" /> Returns & Receives
        </button>
      </div>

      {/* Response Alert messages */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab 1: Issue Book Console */}
      {consoleMode === 'issue' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Issue Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleIssueSubmit} className="glass bento-shadow rounded-3xl p-6 border border-white/20 space-y-4">
              <h3 className="text-base font-bold text-slate-800 mb-2 border-b border-slate-200/40 pb-3 font-display">New Issue Registration</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Student ID input */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">Student ID Code</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-450" />
                    <input 
                      type="text" 
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g., CS-2024-4091"
                      className="w-full bg-white/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>

                {/* Book ID input */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 mb-2">Book ID Barcode</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-450" />
                    <input 
                      type="text" 
                      value={bookId}
                      onChange={(e) => setBookId(e.target.value)}
                      placeholder="e.g., B001"
                      className="w-full bg-white/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-750 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  id="issue-submit-btn"
                >
                  <BookUp className="h-4.5 w-4.5" /> Confirm Issue Registration
                </button>
              </div>
            </form>
          </div>

          {/* Issue Shortcuts Demo Panel */}
          <div className="lg:col-span-1">
            <div className="glass bento-shadow rounded-3xl p-6 border border-white/20 space-y-4">
              <h3 className="text-base font-bold text-slate-800 font-display">Autofill Demo Rigs</h3>
              <p className="text-xs text-slate-450 leading-relaxed font-medium">
                Click a shortcut shortcut to pre-populate valid catalog books and student IDs into the console form for testing.
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => autofillDemo('CS-2024-4091', 'B004')}
                  className="w-full text-left p-3.5 rounded-2xl border border-slate-200/30 hover:border-blue-200 hover:bg-blue-50/20 text-xs font-semibold transition-all cursor-pointer bg-white/45"
                >
                  <span className="font-bold text-slate-700">Student Alex Mercer</span> checking out <span className="font-bold text-blue-700">Walter Rudin (B004)</span>
                </button>
                <button
                  onClick={() => autofillDemo('CS-2024-4091', 'B001')}
                  className="w-full text-left p-3.5 rounded-2xl border border-slate-200/30 hover:border-blue-200 hover:bg-blue-50/20 text-xs font-semibold transition-all cursor-pointer bg-white/45"
                >
                  <span className="font-bold text-slate-700">Student Alex Mercer</span> checking out <span className="font-bold text-blue-700">Thomas Cormen (B001)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Returns & Receives Panel */
        <div className="glass bento-shadow rounded-3xl p-6 border border-white/20" id="return-loans-table">
          <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-200/40 pb-3 font-display">Active Checked Out Registry</h3>
          
          {activeLoans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/50 border-b border-slate-200/60 text-slate-550 font-bold uppercase tracking-wider font-mono">
                    <th className="p-4">Loan ID</th>
                    <th className="p-4">Volume details</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Fines Due</th>
                    <th className="p-4 text-right">Quick Desk Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {activeLoans.map((loan) => {
                    const isOverdue = loan.status === 'overdue';
                    return (
                      <tr key={loan.id} className="hover:bg-white/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-500">{loan.id}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={loan.coverUrl} alt={loan.bookTitle} className="w-6 h-8 rounded-md object-cover shadow border border-slate-200 shrink-0" />
                            <div>
                              <div className="font-bold text-slate-800">{loan.bookTitle}</div>
                              <div className="text-[10px] text-slate-450">by {loan.bookAuthor}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`font-mono font-bold ${isOverdue ? 'text-red-600 animate-pulse font-extrabold' : 'text-slate-650'}`}>
                            {loan.dueDate}
                          </span>
                        </td>
                        <td className="p-4 font-mono">
                          {loan.fineAmount > 0 ? (
                            <span className="font-extrabold text-red-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 shrink-0" /> ₹{loan.fineAmount}
                            </span>
                          ) : (
                            <span className="text-slate-400">₹0.00</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            {loan.fineAmount > 0 && (
                              <button
                                onClick={() => handleSettleFine(loan.id)}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-[10px] font-bold flex items-center gap-1.5 cursor-pointer border border-red-100"
                                title="Settle Fines first"
                              >
                                <CreditCard className="h-3.5 w-3.5" /> Pay Fine
                              </button>
                            )}
                            <button
                              onClick={() => handleQuickReturn(loan.id)}
                              className="px-3 py-1.5 bg-blue-55/10 hover:bg-blue-100 text-blue-700 rounded-xl text-[10px] font-bold flex items-center gap-1.5 cursor-pointer border border-blue-100/20"
                            >
                              <RotateCcw className="h-3.5 w-3.5" /> Quick Return
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <BookOpen className="h-10 w-10 text-slate-350 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600">No active books checked out in campus system</p>
              <p className="text-xs text-slate-450 mt-1">Ready to checkout books? Toggle back to Issue mode.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
