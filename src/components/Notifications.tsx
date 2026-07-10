/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Coins, 
  Trash2, 
  CheckSquare,
  Clock,
  ExternalLink
} from 'lucide-react';

export const Notifications: React.FC = () => {
  const { notifications, markNotificationRead, clearAllNotifications } = useLibrary();

  const handleMarkAllRead = () => {
    notifications.forEach(n => markNotificationRead(n.id));
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />;
      case 'fine':
        return <Coins className="h-5 w-5 text-amber-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-brand-500 shrink-0" />;
    }
  };

  const getNotifClass = (notif: any) => {
    const baseClass = "p-4.5 rounded-2xl border flex gap-3.5 transition-all cursor-pointer";
    if (!notif.read) {
      return `${baseClass} glass bg-blue-50/15 border-blue-200/45 shadow-sm hover:bg-blue-50/25`;
    }
    return `${baseClass} bg-white/30 border-slate-200/20 text-slate-500 hover:bg-white/40`;
  };

  return (
    <div className="space-y-6" id="notifications-view">
      {/* Header Panel */}
      <div className="glass bento-shadow rounded-3xl p-6 border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">University Notice Board</h2>
          <p className="text-xs text-slate-500">View college announcements, loan reminders, and administrative notifications.</p>
        </div>

        {notifications.length > 0 && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 border border-slate-200/50 hover:border-blue-500 hover:text-blue-750 text-slate-650 text-xs font-bold rounded-xl bg-white/60 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckSquare className="h-4 w-4" /> Mark all read
            </button>
            <button
              onClick={clearAllNotifications}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-red-100/20"
            >
              <Trash2 className="h-4 w-4" /> Clear all
            </button>
          </div>
        )}
      </div>

      {/* Notices List */}
      {notifications.length > 0 ? (
        <div className="space-y-4" id="notifications-list">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={getNotifClass(notif)}
            >
              {getNotifIcon(notif.type)}
              
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <h4 className={`text-sm font-bold truncate ${
                    notif.read ? 'text-slate-650' : 'text-slate-855'
                  }`}>{notif.title}</h4>
                  
                  <span className="text-[10px] text-slate-450 font-mono flex items-center gap-1 shrink-0 font-bold">
                    <Clock className="h-3 w-3" /> {notif.date}
                  </span>
                </div>
                
                <p className="text-xs leading-relaxed font-semibold text-slate-600">{notif.message}</p>
                
                {!notif.read && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); markNotificationRead(notif.id); }}
                    className="text-[10px] font-bold text-blue-600 hover:underline mt-1.5 block cursor-pointer"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass bento-shadow rounded-3xl border border-white/20">
          <Bell className="h-12 w-12 text-slate-350 mx-auto mb-3 animate-bounce" />
          <p className="text-lg font-bold text-slate-600 font-display">Your Notice Board is empty</p>
          <p className="text-sm text-slate-450 mt-1 font-semibold">There are no unread notices or warnings currently recorded.</p>
        </div>
      )}
    </div>
  );
};
