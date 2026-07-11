/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navigation } from './components/Navigation';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { BookSearch } from './components/BookSearch';
import { MyBooks } from './components/MyBooks';
import { Profile } from './components/Profile';
import { Notifications } from './components/Notifications';
import { BookEntryForm } from './components/BookEntryForm';
import { PhysicalBookList } from './components/PhysicalBookList';
import { BookIssueReturn } from './components/BookIssueReturn';
import { QRScanner } from './components/QRScanner';
import { 
  Bell, 
  Search, 
  HelpCircle, 
  ShieldCheck, 
  GraduationCap 
} from 'lucide-react';

const MainPortalLayout: React.FC = () => {
  const { currentUser, activeView, setActiveView, notifications } = useLibrary();

  if (!currentUser) {
    return <Login />;
  }

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  // View routing switcher
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'search':
        return <BookSearch />;
      case 'my-books':
        return <MyBooks />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return <Notifications />;
      case 'book-entry':
        return <BookEntryForm />;
      case 'book-list':
        return <PhysicalBookList />;
      case 'issue-return':
        return <BookIssueReturn />;
      case 'qr-scanner':
        return <QRScanner />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50/50" id="portal-root">
      {/* Navigation Sidebar */}
      <Navigation />

      {/* Main Viewport panel */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar (Desktop Only) */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200/80 px-8 items-center justify-between sticky top-0 z-20 shadow-sm shrink-0">
          
          {/* Left info status */}
          <div className="flex items-center gap-2">
            {currentUser.role === 'admin' ? (
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider border border-indigo-100 font-mono">
                <ShieldCheck className="h-3 w-3" /> Secure Staff Session
              </span>
            ) : currentUser.role === 'staff' ? (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider border border-amber-100 font-mono">
                <ShieldCheck className="h-3.5 w-3.5" /> Faculty Access Portal
              </span>
            ) : (
              <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider border border-brand-100 font-mono">
                <GraduationCap className="h-3.5 w-3.5" /> Student Access Portal
              </span>
            )}
            <span className="text-xs text-slate-400 font-medium">Athena State Digital Network</span>
          </div>

          {/* Right actions header */}
          <div className="flex items-center gap-4">
            
            {/* Quick search input trigger */}
            <button 
              onClick={() => setActiveView('search')}
              className="text-xs text-slate-400 hover:text-slate-600 bg-slate-100/80 hover:bg-slate-100 px-4 py-2 rounded-xl flex items-center gap-2.5 transition-colors font-medium border border-slate-200/20"
            >
              <Search className="h-4 w-4" />
              <span>Search catalogs...</span>
              <kbd className="bg-white px-1.5 py-0.5 text-[9px] border rounded shadow-sm text-slate-500 font-mono">Ctrl+K</kbd>
            </button>

            {/* Quick Notifications panel */}
            <button
              onClick={() => setActiveView('notifications')}
              className="relative p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/40 rounded-xl transition-all shadow-inner shrink-0 cursor-pointer"
              title="View Notices"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-[10px] font-extrabold text-white flex items-center justify-center ring-4 ring-white animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Help guidelines */}
            <button 
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-colors shrink-0"
              title="Help & Info"
            >
              <HelpCircle className="h-4.5 w-4.5" />
            </button>

            {/* Micro User Avatar trigger linking to profile card */}
            <div 
              onClick={() => setActiveView('profile')}
              className="flex items-center gap-2.5 pl-3 border-l border-slate-200 cursor-pointer group"
            >
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                className="w-8 h-8 rounded-full object-cover shadow-sm ring-2 ring-transparent group-hover:ring-brand-200 transition-all" 
              />
              <div className="text-left shrink-0">
                <div className="text-xs font-bold text-slate-700 leading-none group-hover:text-brand-600 transition-colors">{currentUser.name}</div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">{currentUser.studentId}</div>
              </div>
            </div>

          </div>

        </header>

        {/* Dynamic Inner Viewport Container */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Footer info line */}
        <footer className="py-5 px-8 text-center text-[10px] text-slate-400 border-t border-slate-200/50 mt-auto shrink-0 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© 2026 Athena State University Library Systems. All rights secured.</span>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Security Policies</span>
            <span className="hover:underline cursor-pointer">Digital Services SLA</span>
            <span className="hover:underline cursor-pointer">Support Helpdesk</span>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <MainPortalLayout />
    </LibraryProvider>
  );
}
