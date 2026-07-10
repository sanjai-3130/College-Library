/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  LayoutDashboard, 
  Search, 
  BookOpenCheck, 
  User, 
  Bell, 
  PlusCircle, 
  Library, 
  BookUp, 
  QrCode, 
  LogOut, 
  Menu, 
  X,
  GraduationCap,
  ShieldAlert
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { currentUser, activeView, setActiveView, logout, notifications } = useLibrary();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebar_collapsed');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // ESC key keydown listener for mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev: boolean) => {
      const next = !prev;
      try {
        localStorage.setItem('sidebar_collapsed', JSON.stringify(next));
      } catch (err) {
        console.error("Failed to save sidebar state:", err);
      }
      return next;
    });
  };

  if (!currentUser) return null;

  interface MenuItem {
    id: string;
    label: string;
    icon: any;
    badge?: number;
  }

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const getMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'search', label: 'Search Books', icon: Search },
    ];

    if (currentUser.role === 'admin') {
      return [
        ...baseItems,
        { id: 'book-entry', label: 'Book Entry Form', icon: PlusCircle },
        { id: 'book-list', label: 'Physical Book List', icon: Library },
        { id: 'issue-return', label: 'Book Issue & Return', icon: BookUp },
        { id: 'qr-scanner', label: 'QR Scanner Console', icon: QrCode },
        { id: 'profile', label: 'Staff Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
      ];
    } else {
      return [
        ...baseItems,
        { id: 'my-books', label: 'My Books', icon: BookOpenCheck },
        { id: 'qr-scanner', label: 'Self QR Scanner', icon: QrCode },
        { id: 'profile', label: 'Digital ID Card', icon: User },
        { id: 'notifications', label: 'My Alerts', icon: Bell, badge: unreadNotifications },
      ];
    }
  };

  const menuItems = getMenuItems();

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <header className="md:hidden w-full h-16 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Library className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-800">ATHENA</h2>
            <p className="text-[9px] text-brand-600 font-bold uppercase tracking-wider">LMS PORTAL</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {unreadNotifications > 0 && (
            <button 
              onClick={() => setActiveView('notifications')}
              className="relative p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 bg-slate-100 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors"
            id="mobile-nav-toggle"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col h-screen sidebar-gradient text-white sticky top-0 shrink-0 z-30 shadow-md justify-between transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-[80px]' : 'w-[280px]'
      }`}>
        <div className="flex flex-col overflow-x-hidden">
          {/* Logo Branding / Header with Toggle */}
          <div className={`p-4 border-b border-blue-900/50 flex items-center transition-all duration-300 ${
            isCollapsed ? 'justify-center' : 'justify-between gap-2'
          }`}>
            {!isCollapsed ? (
              <div className="flex items-center gap-3 overflow-hidden transition-all duration-300 animate-fade-in">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-brand-900 shadow-md shrink-0">
                  <Library className="h-5.5 w-5.5" />
                </div>
                <div className="whitespace-nowrap">
                  <h1 className="text-sm font-extrabold tracking-tight text-white font-display">ATHENA STATE</h1>
                  <p className="text-[9px] text-blue-300 font-bold uppercase tracking-widest">Library System</p>
                </div>
              </div>
            ) : null}
            
            <button
              onClick={toggleCollapse}
              className="p-2 hover:bg-white/10 rounded-xl text-blue-100 hover:text-white transition-all cursor-pointer shrink-0 flex items-center justify-center"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <Menu className="h-5.5 w-5.5" />
            </button>
          </div>

          {/* User Status Chip */}
          <div className={`mx-4 my-4 rounded-xl bg-blue-950/30 border border-blue-800/40 flex items-center transition-all duration-300 ${
            isCollapsed ? 'p-2 justify-center mx-2' : 'p-3 gap-3'
          }`}>
            <div className="relative shrink-0">
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30" 
              />
              <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-brand-900 ${
                currentUser.role === 'admin' ? 'bg-emerald-400' : 'bg-green-400'
              }`}></span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0 transition-all duration-300 overflow-hidden">
                <p className="text-xs font-bold text-white truncate leading-tight">{currentUser.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {currentUser.role === 'admin' ? (
                    <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 uppercase tracking-wide shrink-0">
                      <ShieldAlert className="h-2.5 w-2.5" /> Staff
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 uppercase tracking-wide shrink-0">
                      <GraduationCap className="h-2.5 w-2.5" /> Student
                    </span>
                  )}
                  <span className="text-[9px] text-blue-200/60 font-mono truncate">{currentUser.studentId}</span>
                </div>
              </div>
            )}
          </div>

          {/* Nav List */}
          <nav className={`space-y-1 mt-2 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-3'}`}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all duration-300 group relative ${
                    isCollapsed ? 'justify-center p-3' : 'justify-between px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-white/10 text-white border-r-4 border-blue-400 font-medium'
                      : 'text-blue-100 hover:text-white hover:bg-white/5'
                  }`}
                  id={`nav-item-${item.id}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <Icon className={`h-4.5 w-4.5 transition-all duration-300 group-hover:scale-120 group-hover:rotate-3 ${
                      isActive ? 'text-white font-bold scale-105' : 'text-blue-300 group-hover:text-white'
                    }`} />
                    {!isCollapsed && <span className="transition-all duration-300 whitespace-nowrap">{item.label}</span>}
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    isCollapsed ? (
                      <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-blue-900 animate-pulse"></span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white text-brand-900' : 'bg-red-500 text-white animate-pulse'
                      }`}>
                        {item.badge}
                      </span>
                    )
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className={`transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          {!isCollapsed && (
            <div className="p-4 bg-blue-950/40 rounded-2xl border border-blue-800/30 transition-all duration-300">
              <p className="text-xs text-blue-300 uppercase font-semibold mb-2">Member Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-sm font-medium">
                  {currentUser.role === 'admin' ? 'Senior Administrator' : 'Platinum Student'}
                </span>
              </div>
            </div>
          )}
          
          <button
            onClick={logout}
            className={`w-full flex items-center text-blue-200 hover:text-red-400 hover:bg-white/5 rounded-xl text-sm font-semibold transition-all group cursor-pointer ${
              isCollapsed ? 'justify-center p-3 mt-2' : 'gap-3 px-3 py-2.5 mt-4'
            }`}
            id="nav-logout-btn"
            title={isCollapsed ? "Sign Out Portal" : undefined}
          >
            <LogOut className="h-4.5 w-4.5 text-blue-300 group-hover:text-red-400 transition-colors duration-300 group-hover:scale-110" />
            {!isCollapsed && <span>Sign Out Portal</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sliding Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <aside className={`md:hidden fixed inset-y-0 left-0 w-72 sidebar-gradient text-white z-50 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-blue-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-brand-900 shadow-md">
                <Library className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white">ATHENA STATE</h1>
                <p className="text-[9px] text-blue-300 font-bold uppercase tracking-widest">Library Portal</p>
              </div>
            </div>
            <button 
              onClick={() => setMobileOpen(false)}
              className="p-1.5 bg-white/10 rounded-lg text-blue-100 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User profile details */}
          <div className="p-4 border-b border-blue-900/50 flex items-center gap-3">
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/30" 
            />
            <div>
              <p className="text-sm font-bold text-white leading-none">{currentUser.name}</p>
              <p className="text-[10px] text-blue-200 mt-1">{currentUser.studentId} • {currentUser.department}</p>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="p-4 space-y-1 font-semibold">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-white/10 text-white border-r-4 border-blue-400'
                      : 'text-blue-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0 text-blue-300" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-brand-900' : 'bg-red-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-blue-900/50">
          <button
            onClick={() => { setMobileOpen(false); logout(); }}
            className="w-full flex items-center gap-3 px-3 py-3 text-blue-200 hover:text-red-400 hover:bg-white/5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
          >
            <LogOut className="h-5 w-5 shrink-0 text-blue-300" />
            <span>Sign Out Portal</span>
          </button>
        </div>
      </aside>
    </>
  );
};
