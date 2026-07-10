/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  User, 
  Mail, 
  IdCard, 
  Layers, 
  Lock, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  QrCode, 
  BookOpen, 
  HelpCircle,
  Clock,
  Settings,
  Shield,
  GraduationCap
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, checkouts } = useLibrary();
  
  // States
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [semester, setSemester] = useState(currentUser?.semester || '');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Digital Card Flip State
  const [isFlipped, setIsFlipped] = useState(false);

  if (!currentUser) return null;

  // Stats calculation
  const totalCheckoutsEver = checkouts.length;
  const currentIssuedCount = checkouts.filter(c => c.status !== 'returned').length;
  const totalFinesOwed = checkouts
    .filter(c => c.status !== 'returned')
    .reduce((sum, c) => sum + c.fineAmount, 0);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    if (!name.trim() || !email.trim()) {
      setError('Name and Email fields are required.');
      return;
    }
    
    // Simulate updating
    setSuccess('Profile details successfully updated on the college database!');
    
    // Auto clear
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    if (pin.length !== 4 || isNaN(Number(pin))) {
      setError('PIN must be a 4-digit number.');
      return;
    }
    
    if (pin !== confirmPin) {
      setError('PIN confirmation does not match.');
      return;
    }
    
    setSuccess('Your Security PIN has been updated successfully!');
    setPin('');
    setConfirmPin('');
    
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="space-y-6" id="profile-view">
      {/* View Header */}
      <div className="glass bento-shadow rounded-3xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-slate-900 font-display">Student Portal & Identity</h2>
        <p className="text-xs text-slate-500">View your physical digital ID card, manage academic details, and set your portal PIN.</p>
      </div>

      {/* Grid Content: ID Card on the Left, Forms on the Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: ID Card rendering (Flip Animation Card) */}
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-sm font-bold text-slate-450 uppercase tracking-widest font-mono">Digital Student ID Card</h3>
          
          {/* Flip Card Wrapper Container */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-[340px] aspect-[1.58/1] hover-perspective cursor-pointer relative"
            style={{ minHeight: '215px' }}
            id="digital-id-card"
          >
            {/* Inner Flip Body */}
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}>
              
              {/* CARD FRONT SIDE */}
              <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white p-5 flex flex-col justify-between overflow-hidden shadow-xl backface-hidden border border-white/10">
                {/* Glow decor */}
                <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-[-20%] left-[-20%] w-32 h-32 rounded-full bg-sky-500/20 blur-xl pointer-events-none"></div>

                {/* Card Header Branding */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4.5 w-4.5 text-blue-300" />
                    <div>
                      <h4 className="text-[10px] font-extrabold tracking-wider font-display uppercase">Athena State</h4>
                      <p className="text-[6px] tracking-widest font-mono text-blue-300 uppercase leading-none">University Library</p>
                    </div>
                  </div>
                  <span className="text-[7px] bg-blue-500/30 border border-white/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold text-blue-200 animate-pulse">
                    Active Member
                  </span>
                </div>

                {/* Card Middle: Profile Details */}
                <div className="flex gap-4 items-center my-auto relative z-10">
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.name} 
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-white/15 shadow-sm" 
                  />
                  <div className="min-w-0">
                    <h5 className="text-sm font-extrabold font-display tracking-tight truncate leading-tight">{currentUser.name}</h5>
                    <p className="text-[9px] text-blue-200 truncate font-semibold leading-tight">{currentUser.department}</p>
                    <p className="text-[8px] text-blue-300 mt-1 font-mono">{currentUser.semester}</p>
                  </div>
                </div>

                {/* Card Footer: Codes & dates */}
                <div className="flex justify-between items-end relative z-10 border-t border-white/15 pt-2">
                  <div>
                    <span className="text-[6px] text-blue-300/80 uppercase font-mono block">Student ID Code</span>
                    <span className="text-xs font-bold font-mono tracking-wide">{currentUser.studentId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[6px] text-blue-300/80 uppercase font-mono block">Issued Date</span>
                    <span className="text-[9px] font-bold font-mono">{currentUser.cardIssueDate}</span>
                  </div>
                </div>
              </div>

              {/* CARD BACK SIDE */}
              <div className="absolute inset-0 w-full h-full rounded-2xl bg-slate-900 text-white p-5 flex flex-col justify-between overflow-hidden shadow-xl backface-hidden rotate-y-180 border border-white/10">
                {/* Magnetic stripe simulator */}
                <div className="absolute top-4 left-0 right-0 h-7 bg-slate-800"></div>

                <div className="mt-8 flex gap-3 items-center">
                  {/* Dynamic generated-like QR code box */}
                  <div className="h-20 w-20 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center shadow-inner relative group">
                    {/* Visual QR Simulator */}
                    <div className="w-full h-full bg-slate-900 rounded flex flex-col items-center justify-center p-1 text-[8px] font-mono select-none overflow-hidden">
                      <QrCode className="h-10 w-10 text-white" />
                      <span className="text-[5px] text-blue-400 mt-0.5 truncate max-w-full">ALEX-MERCER</span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5 text-slate-300">
                    <div className="text-[10px] font-bold uppercase text-blue-400">Digital Library pass</div>
                    <p className="text-[8px] leading-tight text-slate-400">
                      Scan this code at checkout kiosks to self-issue physical copies or login instantly to campus networks.
                    </p>
                    <div className="text-[8px] font-mono font-bold bg-white/5 border border-white/10 p-1 rounded inline-block">
                      STU-ALEX-MERCER-CS20244091
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[7px] text-slate-500 border-t border-white/5 pt-2">
                  <span>ATHENA STATE UNIVERSITY • LIBRARY PORTAL</span>
                  <span>Click to flip card</span>
                </div>
              </div>

            </div>
          </div>
          
          <span className="text-[11px] font-bold text-slate-450 flex items-center gap-1.5 select-none">
            <QrCode className="h-3.5 w-3.5" /> Tap card to rotate showing barcode QR
          </span>

          {/* Quick Metrics details */}
          <div className="w-full max-w-[340px] grid grid-cols-3 gap-2 mt-2">
            <div className="p-3 bg-white/50 border border-slate-200/50 rounded-2xl text-center backdrop-blur-md bento-shadow">
              <span className="text-[9px] font-bold text-slate-450 uppercase font-mono">Issued</span>
              <div className="text-lg font-extrabold text-slate-800 tracking-tight mt-0.5">{totalCheckoutsEver}</div>
            </div>
            <div className="p-3 bg-white/50 border border-slate-200/50 rounded-2xl text-center backdrop-blur-md bento-shadow">
              <span className="text-[9px] font-bold text-slate-450 uppercase font-mono">Reading</span>
              <div className="text-lg font-extrabold text-slate-800 tracking-tight mt-0.5">{currentIssuedCount}</div>
            </div>
            <div className="p-3 bg-white/50 border border-slate-200/50 rounded-2xl text-center backdrop-blur-md bento-shadow">
              <span className="text-[9px] font-bold text-slate-450 uppercase font-mono">Fines</span>
              <div className="text-lg font-extrabold text-red-650 tracking-tight mt-0.5">₹{totalFinesOwed}</div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Information update fields */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Responses */}
          {success && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle className="h-5 w-5 text-emerald-650 shrink-0" />
              <span>{success}</span>
            </div>
          )}
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <AlertCircle className="h-5 w-5 text-red-650 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form 1: Profile metadata */}
          <div className="glass bento-shadow rounded-3xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-200/40 pb-3">
              <Settings className="h-5 w-5 text-blue-650" />
              <h3 className="text-base font-bold text-slate-800 font-display">University Membership Profiles</h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">Member Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-850 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-850 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">College Department</label>
                  <input 
                    type="text" 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-850 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">Semester Term</label>
                  <input 
                    type="text" 
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-850 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-750 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                  id="save-profile-btn"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Form 2: Security PIN parameters */}
          <div className="glass bento-shadow rounded-3xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-200/40 pb-3">
              <Lock className="h-5 w-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-800 font-display">Change Portal Security PIN</h3>
            </div>

            <form onSubmit={handleUpdatePin} className="space-y-4">
              <p className="text-xs text-slate-450 font-semibold leading-relaxed">
                This 4-digit PIN secures your self-checkout actions at library physical terminals. Do not share your login passcode.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">New 4-Digit Security PIN</label>
                  <input 
                    type="password" 
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={4}
                    placeholder="••••"
                    className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-center tracking-widest font-extrabold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">Confirm PIN Code</label>
                  <input 
                    type="password" 
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    maxLength={4}
                    placeholder="••••"
                    className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-center tracking-widest font-extrabold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-650 hover:from-indigo-700 hover:to-violet-750 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                  id="save-pin-btn"
                >
                  Update Portal PIN
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
