/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book, Checkout } from '../types';
import QRCode from 'qrcode';
import { 
  BookOpen, 
  BookMarked, 
  AlertTriangle, 
  Coins, 
  ArrowRight, 
  PlusCircle, 
  BookUp, 
  QrCode, 
  Search, 
  Sparkles,
  Calendar,
  CheckCircle,
  HelpCircle,
  GraduationCap,
  Download,
  RefreshCw
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser, books, checkouts, setActiveView } = useLibrary();

  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [refreshCount, setRefreshCount] = useState<number>(0);

  useEffect(() => {
    if (currentUser && currentUser.role === 'student') {
      const qrPayload = {
        studentId: currentUser.studentId,
        regNo: currentUser.studentId,
        name: currentUser.name,
        department: currentUser.department,
        year: currentUser.semester === '4th Semester' ? '2nd Year' : currentUser.semester === '8th Semester' ? '4th Year' : '3rd Year',
        refreshedAt: new Date().toISOString(),
        salt: refreshCount
      };

      QRCode.toDataURL(JSON.stringify(qrPayload), {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
      .then(url => {
        setQrCodeUrl(url);
      })
      .catch(err => {
        console.error('Error generating QR Code', err);
      });
    }
  }, [currentUser, refreshCount]);

  if (!currentUser) return null;

  // Calculate statistics
  const totalBooks = books.length;
  const activeCheckouts = checkouts.filter(c => c.status !== 'returned').length;
  const overdueCheckouts = checkouts.filter(c => c.status === 'overdue').length;
  
  const totalFines = checkouts
    .filter(c => c.status !== 'returned')
    .reduce((sum, c) => sum + c.fineAmount, 0);

  // Time based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get recommendations (e-books or high rating books)
  const recommendations = books
    .filter(b => b.rating >= 4.7)
    .slice(0, 3);

  // Get active books being read (active checkouts)
  const currentReadCheckouts = checkouts
    .filter(c => c.status !== 'returned')
    .slice(0, 2);

  // Date formatted
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6" id="dashboard-view">
      {/* Top Banner section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 to-indigo-950 p-6 md:p-8 text-white bento-shadow">
        {/* Glow rings */}
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 rounded-full bg-brand-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-30%] left-[20%] w-64 h-64 rounded-full bg-sky-500/20 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-brand-300" />
              <span className="text-xs font-bold text-brand-200 tracking-wider uppercase font-mono">{formattedDate}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display leading-tight">
              {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-100 to-sky-200">{currentUser.name}</span>!
            </h1>
            <p className="text-sm text-brand-100/80 max-w-xl">
              Welcome back to your educational dashboard. You have <span className="font-bold text-brand-300">{activeCheckouts} active book checkouts</span>. Check below for deadlines and self-service options.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 shrink-0 flex items-center gap-3 shadow-md">
            <div className="p-2 rounded-xl bg-brand-500/20">
              <Sparkles className="h-5 w-5 text-brand-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-brand-200 tracking-wider">Today's Quote</div>
              <div className="text-xs font-semibold max-w-xs italic leading-tight">"A room without books is like a body without a soul."</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Statistics (Bento Grid cards with glass backdrop blur and elegant shadows) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" id="stats-grid">
        {/* Stat Card 1 */}
        <div className="glass bento-shadow hover-3d p-5 md:p-6 rounded-3xl flex items-center gap-4 hover:border-brand-400/50 transition-all">
          <div className="h-12 w-12 rounded-2xl bg-brand-100/50 flex items-center justify-center text-brand-700 shrink-0 border border-brand-200/40">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Catalog Count</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-none">{totalBooks}</h2>
              <span className="text-[10px] font-semibold text-brand-600 whitespace-nowrap bg-brand-100/30 px-1.5 py-0.5 rounded-md">Live Database</span>
            </div>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="glass bento-shadow hover-3d p-5 md:p-6 rounded-3xl flex items-center gap-4 hover:border-emerald-400/50 transition-all">
          <div className="h-12 w-12 rounded-2xl bg-emerald-100/50 flex items-center justify-center text-emerald-700 shrink-0 border border-emerald-200/40">
            <BookMarked className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Active Loans</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-none">{activeCheckouts}</h2>
              <span className="text-[10px] font-semibold text-emerald-600 whitespace-nowrap bg-emerald-100/30 px-1.5 py-0.5 rounded-md">In Reading</span>
            </div>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="glass bento-shadow hover-3d p-5 md:p-6 rounded-3xl flex items-center gap-4 hover:border-red-400/50 transition-all">
          <div className="h-12 w-12 rounded-2xl bg-red-100/50 flex items-center justify-center text-red-700 shrink-0 border border-red-200/40">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Overdue Items</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-none">{overdueCheckouts}</h2>
              <span className={`text-[10px] font-semibold whitespace-nowrap px-1.5 py-0.5 rounded-md ${overdueCheckouts > 0 ? 'text-red-600 bg-red-100/30 animate-pulse' : 'text-slate-500 bg-slate-100/50'}`}>
                {overdueCheckouts > 0 ? 'Requires Action' : 'No Penalties'}
              </span>
            </div>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="glass bento-shadow hover-3d p-5 md:p-6 rounded-3xl flex items-center gap-4 hover:border-amber-400/50 transition-all">
          <div className="h-12 w-12 rounded-2xl bg-amber-100/50 flex items-center justify-center text-amber-700 shrink-0 border border-amber-200/40">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Pending Fines</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-none">₹{totalFines.toFixed(2)}</h2>
              <span className="text-[10px] font-semibold text-amber-700 whitespace-nowrap bg-amber-100/30 px-1.5 py-0.5 rounded-md">Gate Fine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel Content (Split column grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Core Reading tracking & Visual Analytics Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Checked out list details */}
          <div className="glass bento-shadow rounded-3xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Active Reading Status</h3>
                <p className="text-xs text-slate-500">Track and renew physical loans or read active digital copy chapters.</p>
              </div>
              <button 
                onClick={() => setActiveView(currentUser.role === 'admin' ? 'book-list' : 'my-books')}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
              >
                <span>View All Details</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {currentReadCheckouts.length > 0 ? (
              <div className="space-y-4" id="active-reading-list">
                {currentReadCheckouts.map((checkout) => (
                  <div key={checkout.id} className="p-4 rounded-2xl border border-slate-200/60 bg-white/45 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white/60 hover:shadow-sm">
                    <div className="flex gap-3">
                      <img 
                        src={checkout.coverUrl} 
                        alt={checkout.bookTitle} 
                        className="w-12 h-16 rounded-lg object-cover shadow-sm shrink-0 border border-slate-200" 
                      />
                      <div className="min-w-0">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-1.5 ${
                          checkout.status === 'overdue' 
                            ? 'bg-red-100 text-red-700' 
                            : checkout.status === 'renewed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {checkout.status}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 truncate leading-tight">{checkout.bookTitle}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">by {checkout.bookAuthor}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Due Date</div>
                        <div className={`text-xs font-bold font-mono mt-0.5 ${
                          checkout.status === 'overdue' ? 'text-red-500 font-extrabold animate-pulse' : 'text-slate-700'
                        }`}>{checkout.dueDate}</div>
                      </div>
                      
                      {/* Reading Progress indicator */}
                      <div className="w-24 shrink-0">
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1 font-mono font-bold">
                          <span>Progress</span>
                          <span>{checkout.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              checkout.status === 'overdue' ? 'bg-red-500' : 'bg-brand-500'
                            }`}
                            style={{ width: `${checkout.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
                <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-600">No active issued books</p>
                <p className="text-xs text-slate-400 mt-1">Browse our academic selection to checkout first.</p>
                <button
                  onClick={() => setActiveView('search')}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
                >
                  Browse catalog <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Library visit frequency analytical SVG graph */}
          <div className="glass bento-shadow rounded-3xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">University Reading Engagement Trends</h3>
                <p className="text-xs text-slate-500">Simulated average book issues and reader counts by college division.</p>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-white/60 text-slate-600 rounded-full font-mono border border-slate-200/40">Academic Term 2026</span>
            </div>

            {/* Custom high fidelity SVG Bar Chart */}
            <div className="relative pt-2 h-48 w-full flex items-end justify-between gap-2" id="div-graph">
              <div className="absolute inset-x-0 top-0 flex flex-col justify-between h-[85%] text-[9px] font-mono font-bold text-slate-300 pointer-events-none">
                <div className="border-b border-dashed border-slate-200/60 pb-1 w-full flex justify-between">
                  <span>100 Book Issues (Max Capacity)</span>
                  <span>100%</span>
                </div>
                <div className="border-b border-dashed border-slate-200/60 pb-1 w-full flex justify-between">
                  <span>50 Book Issues</span>
                  <span>50%</span>
                </div>
                <div className="border-b border-slate-200/60 pb-1 w-full flex justify-between">
                  <span>Baseline</span>
                  <span>0%</span>
                </div>
              </div>

              {/* Bar 1 */}
              <div className="flex-1 flex flex-col items-center justify-end h-full z-10 group cursor-help">
                <div className="w-full bg-brand-500/10 hover:bg-brand-500/20 border-t border-brand-300/40 transition-all rounded-t-xl relative flex justify-center items-end" style={{ height: '75%' }}>
                  <div className="w-4/5 bg-brand-600 rounded-t-lg transition-all group-hover:bg-brand-500 shadow-md" style={{ height: '100%' }}></div>
                  {/* Tooltip */}
                  <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-mono py-0.5 px-2 rounded font-bold whitespace-nowrap shadow-md">
                    CS: 75 Issues (Peak)
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 mt-2 truncate max-w-full font-mono">Computer Sci</span>
              </div>

              {/* Bar 2 */}
              <div className="flex-1 flex flex-col items-center justify-end h-full z-10 group cursor-help">
                <div className="w-full bg-brand-500/10 hover:bg-brand-500/20 border-t border-brand-300/40 transition-all rounded-t-xl relative flex justify-center items-end" style={{ height: '40%' }}>
                  <div className="w-4/5 bg-brand-600 rounded-t-lg transition-all group-hover:bg-brand-500 shadow-md" style={{ height: '100%' }}></div>
                  <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-mono py-0.5 px-2 rounded font-bold whitespace-nowrap shadow-md">
                    Mathematics: 40 Issues
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 mt-2 truncate max-w-full font-mono">Math</span>
              </div>

              {/* Bar 3 */}
              <div className="flex-1 flex flex-col items-center justify-end h-full z-10 group cursor-help">
                <div className="w-full bg-brand-500/10 hover:bg-brand-500/20 border-t border-brand-300/40 transition-all rounded-t-xl relative flex justify-center items-end" style={{ height: '60%' }}>
                  <div className="w-4/5 bg-brand-600 rounded-t-lg transition-all group-hover:bg-brand-500 shadow-md" style={{ height: '100%' }}></div>
                  <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-mono py-0.5 px-2 rounded font-bold whitespace-nowrap shadow-md">
                    Physics: 60 Issues
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 mt-2 truncate max-w-full font-mono">Physics</span>
              </div>

              {/* Bar 4 */}
              <div className="flex-1 flex flex-col items-center justify-end h-full z-10 group cursor-help">
                <div className="w-full bg-brand-500/10 hover:bg-brand-500/20 border-t border-brand-300/40 transition-all rounded-t-xl relative flex justify-center items-end" style={{ height: '52%' }}>
                  <div className="w-4/5 bg-brand-600 rounded-t-lg transition-all group-hover:bg-brand-500 shadow-md" style={{ height: '100%' }}></div>
                  <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-mono py-0.5 px-2 rounded font-bold whitespace-nowrap shadow-md">
                    Business: 52 Issues
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 mt-2 truncate max-w-full font-mono">Business</span>
              </div>

              {/* Bar 5 */}
              <div className="flex-1 flex flex-col items-center justify-end h-full z-10 group cursor-help">
                <div className="w-full bg-brand-500/10 hover:bg-brand-500/20 border-t border-brand-300/40 transition-all rounded-t-xl relative flex justify-center items-end" style={{ height: '28%' }}>
                  <div className="w-4/5 bg-brand-600 rounded-t-lg transition-all group-hover:bg-brand-500 shadow-md" style={{ height: '100%' }}></div>
                  <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-mono py-0.5 px-2 rounded font-bold whitespace-nowrap shadow-md">
                    Literature: 28 Issues
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 mt-2 truncate max-w-full font-mono">Lit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Top Picks Suggestions */}
        <div className="space-y-6">
          {/* Student QR Card Display */}
          {currentUser.role === 'student' && (
            <div className="glass bento-shadow rounded-3xl p-6 border border-white/20 bg-white/70 relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400"></div>
              
              <div className="w-full text-center mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100 tracking-wider font-mono">
                  Digital Library Pass
                </span>
                <h3 className="text-base font-extrabold text-slate-800 font-display mt-2">Active Student QR Code</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Scan this pass at physical counters to self-checkout books.</p>
              </div>

              {/* QR Image Container */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-inner mb-4 relative group flex items-center justify-center">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="Student Library QR Code Pass" className="w-40 h-40 object-contain" />
                ) : (
                  <div className="w-40 h-40 bg-slate-50 flex items-center justify-center rounded-xl border border-dashed border-slate-200">
                    <QrCode className="h-8 w-8 text-blue-400 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Mini Details */}
              <div className="w-full bg-slate-100/40 border border-slate-250/20 rounded-2xl px-4 py-3.5 mb-4 text-xs font-semibold text-slate-700 space-y-2">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">Register No</span>
                  <span className="text-slate-800 font-mono text-right">{currentUser.studentId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">Full Name</span>
                  <span className="text-slate-800 text-right">{currentUser.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">Department</span>
                  <span className="text-slate-800 text-right truncate max-w-[155px]">{currentUser.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">Year</span>
                  <span className="text-slate-800 text-right">{currentUser.semester === '4th Semester' ? '2nd Year' : currentUser.semester === '8th Semester' ? '4th Year' : '3rd Year'}</span>
                </div>
              </div>

              {/* Control Buttons Row */}
              <div className="grid grid-cols-2 gap-2.5 w-full">
                <button
                  onClick={() => setRefreshCount(prev => prev + 1)}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                  title="Generate dynamic key with updated signature token"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-slate-550" />
                  <span>Refresh QR</span>
                </button>
                <button
                  onClick={() => {
                    if (qrCodeUrl) {
                      const link = document.createElement('a');
                      link.href = qrCodeUrl;
                      link.download = `student_library_pass_${currentUser.studentId}.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                  className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-100 font-sans"
                >
                  <Download className="h-3.5 w-3.5 text-white" />
                  <span>Download QR</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions Panel */}
          <div className="glass bento-shadow rounded-3xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-display">Interactive Desk Actions</h3>
            
            <div className="grid grid-cols-1 gap-3.5">
              {currentUser.role === 'admin' ? (
                <>
                  <button
                    onClick={() => setActiveView('book-entry')}
                    className="flex items-center gap-4 p-4 text-slate-800 bg-white/50 border border-slate-200/40 rounded-2xl hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all text-left font-semibold text-sm group cursor-pointer bento-shadow"
                  >
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 group-hover:border-transparent group-hover:text-brand-600 shadow-sm shrink-0">
                      <PlusCircle className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <div className="font-bold group-hover:text-white">Register Physical Book</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-blue-100 font-medium">Add new physical volumes to shelves</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveView('issue-return')}
                    className="flex items-center gap-4 p-4 text-slate-800 bg-white/50 border border-slate-200/40 rounded-2xl hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all text-left font-semibold text-sm group cursor-pointer bento-shadow"
                  >
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 group-hover:border-transparent group-hover:text-indigo-600 shadow-sm shrink-0">
                      <BookUp className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-bold group-hover:text-white">Book Issue & Return Kiosk</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-blue-100 font-medium">Check-out volumes using student IDs</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveView('qr-scanner')}
                    className="flex items-center gap-4 p-4 text-slate-800 bg-white/50 border border-slate-200/40 rounded-2xl hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all text-left font-semibold text-sm group cursor-pointer bento-shadow"
                  >
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 group-hover:border-transparent group-hover:text-emerald-600 shadow-sm shrink-0">
                      <QrCode className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-bold group-hover:text-white">Access QR Card Scanner</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-blue-100 font-medium">Authenticate cards and books dynamically</div>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveView('qr-scanner')}
                    className="flex items-center gap-4 p-4 text-slate-800 bg-white/50 border border-slate-200/40 rounded-2xl hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all text-left font-semibold text-sm group cursor-pointer bento-shadow"
                  >
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 group-hover:border-transparent group-hover:text-brand-600 shadow-sm shrink-0">
                      <QrCode className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <div className="font-bold group-hover:text-white">Scan Book / Code</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-blue-100 font-medium">Use camera tool for quick lookup</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveView('search')}
                    className="flex items-center gap-4 p-4 text-slate-800 bg-white/50 border border-slate-200/40 rounded-2xl hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all text-left font-semibold text-sm group cursor-pointer bento-shadow"
                  >
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 group-hover:border-transparent group-hover:text-indigo-600 shadow-sm shrink-0">
                      <Search className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-bold group-hover:text-white">Catalog search engine</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-blue-100 font-medium">Filter from 10,000+ online volumes</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveView('profile')}
                    className="flex items-center gap-4 p-4 text-slate-800 bg-white/50 border border-slate-200/40 rounded-2xl hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all text-left font-semibold text-sm group cursor-pointer bento-shadow"
                  >
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 group-hover:border-transparent group-hover:text-emerald-600 shadow-sm shrink-0">
                      <GraduationCap className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-bold group-hover:text-white">My Digital Identity Card</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-blue-100 font-medium">Show barcode at checkout counters</div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Top Rated Picks Suggestion */}
          <div className="glass bento-shadow rounded-3xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-slate-900 mb-4 font-display">Recommended Reads</h3>
            <div className="space-y-4" id="recommendations-list">
              {recommendations.map((book) => (
                <div 
                  key={book.id} 
                  onClick={() => setActiveView('search')}
                  className="flex gap-4 items-center p-3 rounded-2xl hover:bg-white/60 border border-transparent hover:border-slate-200/40 cursor-pointer transition-all bg-white/20"
                >
                  <img 
                    src={book.coverUrl} 
                    alt={book.title} 
                    className="w-10 h-14 rounded-md object-cover shadow-sm shrink-0 border border-slate-200" 
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">{book.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">by {book.author}</p>
                    
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded uppercase font-mono">
                        {book.type}
                      </span>
                      <span className="text-[10px] font-bold text-amber-500 font-mono flex items-center gap-0.5">
                        ★ {book.rating}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
