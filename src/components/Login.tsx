/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { motion } from 'motion/react';
import { Html5Qrcode } from 'html5-qrcode';
import QRCode from 'qrcode';
import { 
  KeyRound, 
  QrCode, 
  Shield, 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Heart, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Camera,
  Volume2,
  AlertTriangle,
  RotateCcw,
  BookUp,
  Search,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  History,
  Check,
  Download,
  RefreshCw,
  BookOpenCheck as BookOpenCheckIcon
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login, books, checkouts, issueBook, returnBook, payFine, renewBook, usersList } = useLibrary();
  
  // Tabs: 'student' | 'staff' | 'admin'
  const [activeTab, setActiveTab] = useState<'student' | 'staff' | 'admin'>('student');
  
  // Student Login states
  const [studentRegNo, setStudentRegNo] = useState('CS-2024-4091');
  const [studentPassword, setStudentPassword] = useState('password');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [studentQrUrl, setStudentQrUrl] = useState<string>('');
  const [showStudentQR, setShowStudentQR] = useState<boolean>(false);
  
  // Staff Login states
  const [staffId, setStaffId] = useState('STF-5001');
  const [staffPassword, setStaffPassword] = useState('password');
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [staffQrUrl, setStaffQrUrl] = useState<string>('');
  const [showStaffQR, setShowStaffQR] = useState<boolean>(false);

  // Admin Login states
  const [adminId, setAdminId] = useState('ADMIN-9901');
  const [adminPassword, setAdminPassword] = useState('password');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  
  // Camera Scanner states
  const [scannedStatus, setScannedStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [scannedRegNo, setScannedRegNo] = useState('CS-2024-4091');
  const [muteSound, setMuteSound] = useState(false);
  const [cameraError, setCameraError] = useState('');
  
  // Action state (issue, return, borrowed, fine)
  const [selectedOption, setSelectedOption] = useState<'issue' | 'return' | 'borrowed' | 'fine' | null>(null);
  const [issueBookId, setIssueBookId] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Authentication animations
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginProgress, setLoginProgress] = useState(0);
  const [loginStatusText, setLoginStatusText] = useState('');
  const [loginSuccessBanner, setLoginSuccessBanner] = useState(false);
  const [authError, setAuthError] = useState('');

  // Success flash overlay state for QR scan identification
  const [showSuccessFlash, setShowSuccessFlash] = useState(false);

  // Trigger flash animation when student is successfully scanned
  useEffect(() => {
    if (scannedStatus === 'success') {
      setShowSuccessFlash(true);
      const timer = setTimeout(() => {
        setShowSuccessFlash(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [scannedStatus]);

  // REAL Camera Scanning Integration via html5-qrcode
  useEffect(() => {
    let html5QrCode: any = null;

    if (activeTab === 'admin' && adminLoggedIn && scannedStatus === 'scanning') {
      setCameraError('');
      
      const timer = setTimeout(() => {
        try {
          const element = document.getElementById('reader');
          if (!element) return;

          html5QrCode = new Html5Qrcode("reader");
          html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 12,
              qrbox: (width, height) => {
                const size = Math.min(width, height) * 0.75;
                return { width: size, height: size };
              }
            },
            (decodedText: string) => {
              handleQrScanSuccess(decodedText);
            },
            () => {
              // Ignore scanning frame failures (noise/no QR found)
            }
          ).catch((err: any) => {
            console.warn("Html5Qrcode camera access failure:", err);
            setCameraError("Camera access restricted. Fall back to manual simulated scans below.");
          });
        } catch (err: any) {
          console.error("Html5Qrcode initialisation error:", err);
          setCameraError("Scanner setup failed. Please use manual simulation shortcuts.");
        }
      }, 450);

      return () => {
        clearTimeout(timer);
        if (html5QrCode) {
          try {
            if (html5QrCode.isScanning) {
              html5QrCode.stop().catch((e: any) => console.log("Stop scanning:", e));
            }
          } catch (e) {
            // Safe cleanup catch
          }
        }
      };
    }
  }, [activeTab, adminLoggedIn, scannedStatus]);

  // Unified QR Decode Success Pipeline
  const handleQrScanSuccess = (decodedText: string) => {
    let regNo = decodedText;
    
    // Attempt decoding as JSON payload
    try {
      const parsed = JSON.parse(decodedText);
      if (parsed) {
        regNo = parsed.studentId || parsed.regNo || decodedText;
      }
    } catch (e) {
      // String format register numbers
    }

    setScannedRegNo(regNo);
    setScannedStatus('success');
    setSelectedOption(null);
    setActionSuccess('');
    setActionError('');
    
    // Sound buzzer beep
    if (!muteSound) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High-pitched beep
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
      } catch (e) {
        // Safe silence for audio blockades
      }
    }
  };

  const triggerScanSimulation = (regNo: string) => {
    setScannedStatus('scanning');
    setSelectedOption(null);
    setActionSuccess('');
    setActionError('');
    setCameraError('');
    
    setTimeout(() => {
      handleQrScanSuccess(regNo);
    }, 1200);
  };

  // Student Details lookup list
  const getStudentDetails = (regNo: string) => {
    const normalized = regNo.trim().toUpperCase();
    const foundUser = usersList.find(u => u.studentId.toUpperCase() === normalized);
    
    if (foundUser) {
      return {
        name: foundUser.name,
        regNo: foundUser.studentId,
        dept: foundUser.department,
        year: foundUser.semester.includes('Semester') ? foundUser.semester : 'Faculty Staff',
        email: foundUser.email,
        avatarUrl: foundUser.avatarUrl,
        role: foundUser.role
      };
    }

    if (normalized.includes('CS-2024-4091') || normalized.includes('ALEX')) {
      return {
        name: 'Alex Mercer',
        regNo: 'CS-2024-4091',
        dept: 'Computer Science & Engineering',
        year: '3rd Year',
        email: 'alex.mercer@college.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        role: 'student' as const
      };
    } else if (normalized.includes('MECH') || normalized.includes('1002')) {
      return {
        name: 'Rohan Sharma',
        regNo: 'MECH-2025-1002',
        dept: 'Mechanical Engineering',
        year: '2nd Year',
        email: 'rohan.sharma@college.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        role: 'student' as const
      };
    } else if (normalized.includes('STF-5001') || normalized.includes('TURING')) {
      return {
        name: 'Prof. Alan Turing',
        regNo: 'STF-5001',
        dept: 'Computer Science',
        year: 'Senior Faculty',
        email: 'alan.turing@college.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        role: 'staff' as const
      };
    } else {
      return {
        name: normalized.startsWith('STF') ? 'Prof. Faculty Guest' : 'Guest Reader',
        regNo: normalized || 'GUEST-ID-01',
        dept: 'General Academic Studies',
        year: normalized.startsWith('STF') ? 'Senior Lecturer' : '1st Year',
        email: 'guest.reader@college.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        role: (normalized.startsWith('STF') ? 'staff' : 'student') as 'student' | 'staff'
      };
    }
  };

  // Student details and checkout metrics computations
  const scannedStudentDetails = getStudentDetails(scannedRegNo);
  const studentCheckouts = checkouts.filter(c => c.studentId === scannedStudentDetails.regNo);
  const activeStudentLoans = studentCheckouts.filter(c => c.status !== 'returned');
  const studentHistory = studentCheckouts.filter(c => c.status === 'returned');
  
  const totalFineOwed = activeStudentLoans.reduce((sum, c) => sum + c.fineAmount, 0);
  const nearestDueDate = activeStudentLoans.length > 0 
    ? activeStudentLoans.reduce((nearest, current) => {
        return new Date(current.dueDate) < new Date(nearest.dueDate) ? current : nearest;
      }).dueDate 
    : 'No active loans';

  // Issue Book handler
  const handleOnTheSpotIssue = (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess('');
    setActionError('');
    
    if (!issueBookId) {
      setActionError('Please select a book to issue.');
      return;
    }
    
    const res = issueBook(issueBookId, scannedStudentDetails.regNo);
    if (res.success) {
      setActionSuccess(res.message);
      setIssueBookId('');
    } else {
      setActionError(res.message);
    }
  };

  // Return Book handler
  const handleOnTheSpotReturn = (checkoutId: string) => {
    setActionSuccess('');
    setActionError('');
    
    const res = returnBook(checkoutId);
    if (res.success) {
      setActionSuccess(res.message);
    } else {
      setActionError(res.message);
    }
  };

  // Pay Fine & Return Book
  const handleOnTheSpotSettleFineAndReturn = (checkoutId: string) => {
    setActionSuccess('');
    setActionError('');
    
    const resPay = payFine(checkoutId);
    if (resPay.success) {
      const resRet = returnBook(checkoutId);
      if (resRet.success) {
        setActionSuccess(`Fine settled & book "${resRet.message.split('"')[1] || 'returned'}" checked in successfully.`);
      } else {
        setActionError(resRet.message);
      }
    } else {
      setActionError(resPay.message);
    }
  };

  // Settle All student fines
  const handleSettleAllFines = () => {
    setActionSuccess('');
    setActionError('');
    
    const overdueLoans = activeStudentLoans.filter(c => c.status === 'overdue' && c.fineAmount > 0);
    if (overdueLoans.length === 0) {
      setActionError('No outstanding fines found.');
      return;
    }
    
    let settledCount = 0;
    overdueLoans.forEach(loan => {
      const res = payFine(loan.id);
      if (res.success) {
        settledCount++;
      }
    });
    
    setActionSuccess(`Successfully settled fine balances for ${settledCount} physical loans.`);
  };

  // Student Show My QR action handler
  const handleStudentShowQR = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (!studentRegNo.trim()) {
      setAuthError('Please enter your Student Register Number.');
      return;
    }

    try {
      const details = getStudentDetails(studentRegNo);
      const payload = {
        studentId: details.regNo,
        regNo: details.regNo,
        name: details.name,
        department: details.dept,
        year: details.year
      };

      const url = await QRCode.toDataURL(JSON.stringify(payload), {
        width: 320,
        margin: 2,
        color: {
          dark: '#1e3b8b', // High-contrast deep blue
          light: '#ffffff'
        }
      });
      setStudentQrUrl(url);
      setShowStudentQR(true);
    } catch (err: any) {
      console.error("QR Code Generation failed:", err);
      setAuthError('Failed to generate dynamic security QR code.');
    }
  };

  // Staff Show My QR action handler
  const handleStaffShowQR = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (!staffId.trim()) {
      setAuthError('Please enter your Staff ID.');
      return;
    }

    try {
      const details = getStudentDetails(staffId);
      const payload = {
        studentId: details.regNo,
        regNo: details.regNo,
        name: details.name,
        department: details.dept,
        year: 'Faculty Staff'
      };

      const url = await QRCode.toDataURL(JSON.stringify(payload), {
        width: 320,
        margin: 2,
        color: {
          dark: '#1e3b8b',
          light: '#ffffff'
        }
      });
      setStaffQrUrl(url);
      setShowStaffQR(true);
    } catch (err: any) {
      console.error("Staff QR Code Generation failed:", err);
      setAuthError('Failed to generate staff security QR code.');
    }
  };

  // Admin authenticate action handler
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!adminId.trim()) {
      setAuthError('Please enter Admin ID.');
      return;
    }
    if (!adminPassword.trim()) {
      setAuthError('Please enter Admin Password.');
      return;
    }

    setIsLoggingIn(true);
    setLoginProgress(10);
    setLoginStatusText('Authenticating terminal...');

    const interval = setInterval(() => {
      setLoginProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoginStatusText('Terminal secured!');
          setAdminLoggedIn(true);
          setIsLoggingIn(false);
          setScannedStatus('scanning');
          return 100;
        }
        return prev + 30;
      });
    }, 120);
  };

  // Unified login proceed action
  const handleProceedToDashboard = (role: 'student' | 'staff' | 'admin', userId: string) => {
    setIsLoggingIn(true);
    setLoginProgress(20);
    setLoginStatusText('Synchronising security keys...');

    const interval = setInterval(() => {
      setLoginProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoginStatusText('Redirecting...');
          setLoginSuccessBanner(true);
          
          setTimeout(() => {
            login(userId, role);
          }, 600);
          return 100;
        }
        return prev + 40;
      });
    }, 80);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans" id="login-screen-root">
      {/* Decorative Blur Background Circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-400/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

      {/* Auth Loader overlay */}
      {isLoggingIn && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-fade-in text-white">
          <div className="p-8 max-w-sm w-full text-center space-y-4">
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-400 to-indigo-500" 
                animate={{ width: `${loginProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="text-sm font-bold tracking-wider uppercase font-mono animate-pulse">{loginStatusText}</p>
          </div>
        </div>
      )}

      {/* Success banner redirect */}
      {loginSuccessBanner && (
        <div className="fixed inset-0 bg-gradient-to-r from-brand-900 to-indigo-950 z-50 flex flex-col items-center justify-center text-center text-white">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4 max-w-md px-6"
          >
            <div className="h-20 w-20 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-extrabold font-display leading-tight">Access Granted Successfully</h2>
            <p className="text-brand-200 text-sm">Welcome back to Athena State University Library LMS.</p>
          </motion.div>
        </div>
      )}

      <div className="max-w-xl w-full space-y-6 z-10 relative">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="h-14 w-14 bg-gradient-to-tr from-brand-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-brand-500/20">
            <BookOpen className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
            Athena State University
          </h2>
          <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
            Integrated Library Management System (LMS)
          </p>
        </div>

        {/* Unified 3-Tab Login Card Container */}
        <div className="glass bento-shadow rounded-[32px] border border-white/40 overflow-hidden bg-white/70">
          
          {/* 3 tabs header */}
          {!showStudentQR && !showStaffQR && !adminLoggedIn && (
            <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/50 p-2 gap-1.5">
              <button
                onClick={() => { setActiveTab('student'); setAuthError(''); }}
                className={`py-3.5 px-2 rounded-2xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer leading-none ${
                  activeTab === 'student'
                    ? 'bg-white text-brand-700 shadow-md border border-slate-200/50'
                    : 'text-slate-550 hover:bg-white/40'
                }`}
              >
                <GraduationCap className="h-4.5 w-4.5 shrink-0" />
                <span>Student Login</span>
              </button>
              
              <button
                onClick={() => { setActiveTab('staff'); setAuthError(''); }}
                className={`py-3.5 px-2 rounded-2xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer leading-none ${
                  activeTab === 'staff'
                    ? 'bg-white text-brand-700 shadow-md border border-slate-200/50'
                    : 'text-slate-550 hover:bg-white/40'
                }`}
              >
                <span>👨🏫 Staff Login</span>
              </button>

              <button
                onClick={() => { setActiveTab('admin'); setAuthError(''); }}
                className={`py-3.5 px-2 rounded-2xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer leading-none ${
                  activeTab === 'admin'
                    ? 'bg-white text-brand-700 shadow-md border border-slate-200/50'
                    : 'text-slate-550 hover:bg-white/40'
                }`}
              >
                <Shield className="h-4.5 w-4.5 shrink-0" />
                <span>Admin Login</span>
              </button>
            </div>
          )}

          {/* Error Alert panel */}
          {authError && (
            <div className="m-6 p-4 bg-red-550/10 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <div className="p-6 sm:p-8">

            {/* TAB 1: Student Login Form */}
            {activeTab === 'student' && (
              <div className="space-y-6">
                {!showStudentQR ? (
                  <form onSubmit={handleStudentShowQR} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Register Number</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="text"
                          required
                          value={studentRegNo}
                          onChange={(e) => setStudentRegNo(e.target.value)}
                          placeholder="e.g. CS-2024-4091"
                          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-semibold text-sm shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type={showStudentPassword ? "text" : "password"}
                          required
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-12 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-semibold text-sm shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowStudentPassword(!showStudentPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showStudentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-brand-100 font-sans tracking-wide uppercase mt-6"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>Authenticate & Show QR</span>
                    </button>

                    <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between text-xs mt-4">
                      <span className="text-slate-500 font-bold font-mono">Student ID Card demo:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setStudentRegNo('CS-2024-4091');
                          setStudentPassword('password');
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-200 rounded-lg shadow-xs text-[10px] transition-all cursor-pointer font-sans"
                      >
                        Load Alex Mercer
                      </button>
                    </div>
                  </form>
                ) : (
                  /* POST-LOGIN STUDENT QR CARD */
                  <div className="flex flex-col items-center space-y-6 animate-scale-in">
                    <div className="text-center space-y-1">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-brand-50 text-brand-700 border border-brand-100 tracking-wider font-mono">
                        Digital Reader Library Card
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-800 font-display">Student Access Code</h3>
                      <p className="text-xs text-slate-550">Present this QR Code to librarian counters or scanners for automatic issues.</p>
                    </div>

                    <div className="p-5 bg-white rounded-[24px] border border-slate-200/80 shadow-md relative group">
                      {studentQrUrl ? (
                        <img src={studentQrUrl} alt="Student Library Pass" className="w-48 h-48 object-contain" />
                      ) : (
                        <div className="w-48 h-48 bg-slate-50 flex items-center justify-center rounded-xl">
                          <QrCode className="h-8 w-8 text-blue-400 animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Student details display */}
                    <div className="w-full bg-slate-50 border border-slate-200/60 rounded-[20px] p-4 text-xs font-semibold text-slate-700 space-y-2.5">
                      <div className="flex justify-between border-b border-slate-200/50 pb-2">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block font-mono">Student ID / Reg No</span>
                        <span className="text-slate-800 font-mono">{studentRegNo.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/50 pb-2">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block font-mono">Full Name</span>
                        <span className="text-slate-800">{getStudentDetails(studentRegNo).name}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/50 pb-2">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block font-mono">Department</span>
                        <span className="text-slate-800">{getStudentDetails(studentRegNo).dept}</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block font-mono">Academic Year</span>
                        <span className="text-slate-800">{getStudentDetails(studentRegNo).year}</span>
                      </div>
                    </div>

                    {/* Actions and redirection */}
                    <div className="w-full flex gap-3">
                      <button
                        onClick={() => { setShowStudentQR(false); setStudentQrUrl(''); }}
                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-250 flex items-center justify-center gap-1 cursor-pointer font-sans"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Reset Card</span>
                      </button>
                      <button
                        onClick={() => handleProceedToDashboard('student', studentRegNo)}
                        className="flex-2 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-brand-100 font-sans"
                      >
                        <span>Proceed to Student Dashboard</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* TAB 2: Staff Login Form */}
            {activeTab === 'staff' && (
              <div className="space-y-6">
                {!showStaffQR ? (
                  <form onSubmit={handleStaffShowQR} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Staff / Faculty ID</label>
                      <div className="relative">
                        <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="text"
                          required
                          value={staffId}
                          onChange={(e) => setStaffId(e.target.value)}
                          placeholder="e.g. STF-5001"
                          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-semibold text-sm shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type={showStaffPassword ? "text" : "password"}
                          required
                          value={staffPassword}
                          onChange={(e) => setStaffPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-12 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-semibold text-sm shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowStaffPassword(!showStaffPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showStaffPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-brand-100 font-sans tracking-wide uppercase mt-6"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>Authenticate & Show Staff QR</span>
                    </button>

                    <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between text-xs mt-4">
                      <span className="text-slate-500 font-bold font-mono">Faculty Staff demo:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setStaffId('STF-5001');
                          setStaffPassword('password');
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-200 rounded-lg shadow-xs text-[10px] transition-all cursor-pointer font-sans"
                      >
                        Load Prof. Alan Turing
                      </button>
                    </div>
                  </form>
                ) : (
                  /* POST-LOGIN STAFF QR CARD */
                  <div className="flex flex-col items-center space-y-6 animate-scale-in">
                    <div className="text-center space-y-1">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-100 tracking-wider font-mono">
                        Faculty Staff Library Pass
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-800 font-display">Staff Security Access</h3>
                      <p className="text-xs text-slate-550">Authenticated security signature for terminal kiosks and scanner systems.</p>
                    </div>

                    <div className="p-5 bg-white rounded-[24px] border border-slate-200/80 shadow-md relative group">
                      {staffQrUrl ? (
                        <img src={staffQrUrl} alt="Staff Library Pass" className="w-48 h-48 object-contain" />
                      ) : (
                        <div className="w-48 h-48 bg-slate-50 flex items-center justify-center rounded-xl">
                          <QrCode className="h-8 w-8 text-amber-500 animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Staff details display */}
                    <div className="w-full bg-slate-50 border border-slate-200/60 rounded-[20px] p-4 text-xs font-semibold text-slate-700 space-y-2.5">
                      <div className="flex justify-between border-b border-slate-200/50 pb-2">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block font-mono">Staff ID</span>
                        <span className="text-slate-800 font-mono">{staffId.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/50 pb-2">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block font-mono">Full Name</span>
                        <span className="text-slate-800">{getStudentDetails(staffId).name}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/50 pb-2">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block font-mono">Department</span>
                        <span className="text-slate-800">{getStudentDetails(staffId).dept}</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block font-mono">Designation</span>
                        <span className="text-slate-800">{getStudentDetails(staffId).year}</span>
                      </div>
                    </div>

                    {/* Actions and redirection */}
                    <div className="w-full flex gap-3">
                      <button
                        onClick={() => { setShowStaffQR(false); setStaffQrUrl(''); }}
                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-250 flex items-center justify-center gap-1 cursor-pointer font-sans"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Reset Card</span>
                      </button>
                      <button
                        onClick={() => handleProceedToDashboard('staff', staffId)}
                        className="flex-2 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-100 font-sans"
                      >
                        <span>Proceed to Staff Dashboard</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* TAB 3: Admin Login Form */}
            {activeTab === 'admin' && (
              <div className="space-y-6">
                {!adminLoggedIn ? (
                  <form onSubmit={handleAdminAuth} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Administrator ID</label>
                      <div className="relative">
                        <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="text"
                          required
                          value={adminId}
                          onChange={(e) => setAdminId(e.target.value)}
                          placeholder="e.g. ADMIN-9901"
                          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-sm shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Security Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type={showAdminPassword ? "text" : "password"}
                          required
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-12 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-sm shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPassword(!showAdminPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-100 font-sans tracking-wide uppercase mt-6"
                    >
                      <KeyRound className="h-4 w-4" />
                      <span>Authenticate Terminal</span>
                    </button>

                    <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between text-xs mt-4">
                      <span className="text-slate-500 font-bold font-mono">Admin Access demo:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminId('ADMIN-9901');
                          setAdminPassword('password');
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-200 rounded-lg shadow-xs text-[10px] transition-all cursor-pointer"
                      >
                        Fill Admin Demo
                      </button>
                    </div>
                  </form>
                ) : (
                  /* POST-LOGIN ADMIN SCANNER CONSOLE (REAL QR SCANNER AFTER LOGIN) */
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <div>
                        <h3 className="text-lg font-extrabold font-display tracking-tight text-slate-900">Admin Scan Station</h3>
                        <p className="text-slate-500 text-[11px] mt-0.5">Session Operator: <span className="font-bold text-slate-700">{adminId}</span></p>
                      </div>
                      <button
                        onClick={() => {
                          setAdminLoggedIn(false);
                          setScannedStatus('idle');
                        }}
                        className="px-3 py-1.5 text-red-650 hover:bg-red-50 font-bold rounded-xl text-xs transition-colors border border-transparent hover:border-red-100"
                      >
                        Lock Station
                      </button>
                    </div>

                    {/* Viewfinder scanner box */}
                    <div className="relative aspect-video rounded-3xl bg-slate-950 border-2 border-slate-900 overflow-hidden flex flex-col items-center justify-center text-white shadow-xl">
                      
                      {/* Success Flash Overlay */}
                      {showSuccessFlash && (
                        <motion.div
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 0 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="absolute inset-0 bg-emerald-500/95 flex flex-col items-center justify-center pointer-events-none z-30"
                        >
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: [1, 1.2, 1], opacity: [1, 1, 0] }}
                            transition={{ duration: 0.7 }}
                            className="flex flex-col items-center gap-2"
                          >
                            <CheckCircle2 className="h-16 w-16 text-white" />
                            <span className="text-lg font-bold tracking-wider text-white uppercase font-display">USER PASS DETECTED</span>
                          </motion.div>
                        </motion.div>
                      )}

                      {scannedStatus === 'scanning' ? (
                        <>
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent)] pointer-events-none"></div>
                          
                          {/* Real Camera reader Target element */}
                          <div id="reader" className="absolute inset-0 w-full h-full object-cover"></div>

                          {/* Pulsing laser scan line */}
                          <motion.div
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_#6366f1] z-10"
                          />

                          {/* Corner Bracket Braces */}
                          <div className="absolute top-5 left-8 w-6 h-6 border-t-2 border-l-2 border-indigo-400 rounded-tl-lg z-10"></div>
                          <div className="absolute top-5 right-8 w-6 h-6 border-t-2 border-r-2 border-indigo-400 rounded-tr-lg z-10"></div>
                          <div className="absolute bottom-5 left-8 w-6 h-6 border-b-2 border-l-2 border-indigo-400 rounded-bl-lg z-10"></div>
                          <div className="absolute bottom-5 right-8 w-6 h-6 border-b-2 border-r-2 border-indigo-400 rounded-br-lg z-10"></div>

                          {cameraError && (
                            <div className="absolute inset-0 bg-slate-950/85 p-6 flex flex-col items-center justify-center text-center z-20">
                              <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
                              <p className="text-xs font-bold text-slate-200">Device Camera Restricted</p>
                              <p className="text-[10px] text-slate-400 mt-1 max-w-[280px] leading-relaxed">{cameraError}</p>
                            </div>
                          )}

                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/85 border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-mono tracking-wider font-bold animate-pulse z-20 flex items-center gap-1.5 whitespace-nowrap">
                            <Camera className="h-3 w-3 text-indigo-400" /> CAMERA ACTIVE...
                          </div>
                        </>
                      ) : scannedStatus === 'success' ? (
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="flex flex-col items-center text-center p-4 text-emerald-400 z-10"
                        >
                          <div className="h-14 w-14 bg-emerald-500/15 border border-emerald-500 rounded-full flex items-center justify-center mb-2.5">
                            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                          </div>
                          <p className="text-sm font-bold font-display uppercase tracking-wider">Identified Successfully</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-mono">User ID: {scannedRegNo}</p>
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center p-6 text-center text-slate-500 z-10">
                          <div className="h-16 w-16 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-center mb-3">
                            <QrCode className="h-8 w-8 text-indigo-400" />
                          </div>
                          <p className="text-xs font-bold text-slate-300 font-display">Viewfinder Offline</p>
                          <button
                            onClick={() => setScannedStatus('scanning')}
                            className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-all cursor-pointer"
                          >
                            Enable Device Camera
                          </button>
                        </div>
                      )}

                      {/* Audio beep Indicator toggle */}
                      <button
                        onClick={() => setMuteSound(!muteSound)}
                        className="absolute top-3 right-3 p-2 bg-slate-900/70 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer z-20"
                      >
                        <Volume2 className={`h-3.5 w-3.5 ${muteSound ? 'opacity-40 text-red-400' : ''}`} />
                      </button>
                    </div>

                    {/* Simulator Controls Shortcut list */}
                    {scannedStatus !== 'success' && (
                      <div className="space-y-3 pt-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center font-mono">Or Simulate Instant Pass Scans</p>
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            onClick={() => triggerScanSimulation('CS-2024-4091')}
                            disabled={scannedStatus === 'scanning'}
                            className="py-2 px-3 rounded-xl bg-blue-50/50 hover:bg-blue-100 disabled:opacity-50 text-blue-700 border border-blue-150 font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <GraduationCap className="h-4 w-4 text-blue-500" />
                            <span>Student: Alex Mercer</span>
                          </button>
                          <button
                            onClick={() => triggerScanSimulation('STF-5001')}
                            disabled={scannedStatus === 'scanning'}
                            className="py-2 px-3 rounded-xl bg-amber-50/50 hover:bg-amber-100 disabled:opacity-50 text-amber-700 border border-amber-150 font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>👨🏫 Staff: Alan Turing</span>
                          </button>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Type Custom ID..."
                              defaultValue="ECE-2024-1003"
                              id="custom-scan-input"
                              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-semibold text-xs"
                            />
                            <button
                              onClick={() => {
                                const val = (document.getElementById('custom-scan-input') as HTMLInputElement)?.value || 'ECE-2024-1003';
                                triggerScanSimulation(val);
                              }}
                              disabled={scannedStatus === 'scanning'}
                              className="bg-indigo-650 hover:bg-indigo-950 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer whitespace-nowrap"
                            >
                              Mock Scan Pass
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Decoded Details and Actions Options */}
                    {scannedStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        {/* Real Dynamic Details Card */}
                        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4 text-xs">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                            <span className="font-extrabold text-slate-800 font-display uppercase tracking-wider text-[10px]">Identified Account</span>
                            <button
                              onClick={() => {
                                setScannedStatus('scanning');
                                setSelectedOption(null);
                                setActionSuccess('');
                                setActionError('');
                              }}
                              className="text-indigo-600 hover:underline font-bold text-[10px] cursor-pointer flex items-center gap-1 font-sans"
                            >
                              <RotateCcw className="h-3 w-3" /> Scan Next Pass
                            </button>
                          </div>

                          {/* Student/Staff Info Row */}
                          <div className="flex gap-4 items-center">
                            <img 
                              src={scannedStudentDetails.avatarUrl} 
                              alt={scannedStudentDetails.name} 
                              className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100 shadow-sm"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-extrabold font-display text-slate-900 truncate leading-snug">{scannedStudentDetails.name}</h4>
                              <p className="text-[11px] text-slate-500 font-semibold">{scannedStudentDetails.dept}</p>
                              <p className="text-[10px] font-mono text-indigo-600 mt-0.5">{scannedStudentDetails.regNo} • {scannedStudentDetails.year} • <span className="capitalize text-slate-600 font-bold">{scannedStudentDetails.role}</span></p>
                            </div>
                          </div>

                          {/* Real Dynamic Live Summary Row */}
                          <div className="grid grid-cols-3 gap-2 pt-1">
                            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">On Loan</span>
                              <div className="text-sm font-extrabold text-slate-800 mt-0.5">{activeStudentLoans.length} books</div>
                            </div>
                            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Next Due</span>
                              <div className="text-[10px] font-bold text-slate-800 mt-0.5 truncate" title={nearestDueDate}>{nearestDueDate}</div>
                            </div>
                            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Fine Outstanding</span>
                              <div className={`text-sm font-extrabold mt-0.5 font-mono ${totalFineOwed > 0 ? 'text-red-650' : 'text-emerald-650'}`}>₹{totalFineOwed}</div>
                            </div>
                          </div>
                        </div>

                        {/* Options Selector Grid with Exactly 4 Buttons */}
                        <div className="grid grid-cols-4 gap-1.5">
                          <button
                            onClick={() => { setSelectedOption('issue'); setActionSuccess(''); setActionError(''); }}
                            className={`py-3 px-1 rounded-xl border font-bold text-[10px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer font-sans leading-none ${
                              selectedOption === 'issue'
                                ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 font-extrabold ring-2 ring-indigo-100'
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <BookUp className="h-4.5 w-4.5 text-indigo-650 shrink-0" />
                            <span>Issue Book</span>
                          </button>
                          <button
                            onClick={() => { setSelectedOption('return'); setActionSuccess(''); setActionError(''); }}
                            className={`py-3 px-1 rounded-xl border font-bold text-[10px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer font-sans leading-none ${
                              selectedOption === 'return'
                                ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 font-extrabold ring-2 ring-indigo-100'
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <RotateCcw className="h-4.5 w-4.5 text-indigo-650 shrink-0" />
                            <span>Return Book</span>
                          </button>
                          <button
                            onClick={() => { setSelectedOption('borrowed'); setActionSuccess(''); setActionError(''); }}
                            className={`py-3 px-1 rounded-xl border font-bold text-[10px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer font-sans leading-none ${
                              selectedOption === 'borrowed'
                                ? 'border-amber-500 bg-amber-50/50 text-amber-700 font-extrabold ring-2 ring-amber-100'
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <BookOpenCheckIcon className="h-4.5 w-4.5 text-amber-650 shrink-0" />
                            <span>Borrowed</span>
                          </button>
                          <button
                            onClick={() => { setSelectedOption('fine'); setActionSuccess(''); setActionError(''); }}
                            className={`py-3 px-1 rounded-xl border font-bold text-[10px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer font-sans leading-none ${
                              selectedOption === 'fine'
                                ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700 font-extrabold ring-2 ring-emerald-100'
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <CreditCard className="h-4.5 w-4.5 text-emerald-650 shrink-0" />
                            <span>Check Fine</span>
                          </button>
                        </div>

                        {/* Action alerts */}
                        {actionSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-emerald-500/10 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2"
                          >
                            <CheckCircle2 className="h-4 w-4 text-emerald-650 shrink-0" />
                            <span>{actionSuccess}</span>
                          </motion.div>
                        )}
                        {actionError && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2"
                          >
                            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                            <span>{actionError}</span>
                          </motion.div>
                        )}

                        {/* Render option interactive panel */}
                        {selectedOption && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-2xl bg-slate-100 border border-slate-200"
                          >
                            {/* Issue Book Form */}
                            {selectedOption === 'issue' && (
                              <form onSubmit={handleOnTheSpotIssue} className="space-y-3">
                                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Select Volume to Issue</h4>
                                <select
                                  value={issueBookId}
                                  onChange={(e) => setIssueBookId(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-semibold text-xs cursor-pointer"
                                >
                                  <option value="">-- Choose Book --</option>
                                  {books.map(b => (
                                    <option key={b.id} value={b.id} disabled={(b.copiesAvailable || 0) <= 0}>
                                      {b.title} by {b.author} ({(b.copiesAvailable || 0)} left)
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="submit"
                                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                                >
                                  Confirm Issue Checkout
                                </button>
                              </form>
                            )}

                            {/* Return Book Form */}
                            {selectedOption === 'return' && (
                              <div className="space-y-2.5">
                                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Active Book Loans</h4>
                                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                                  {activeStudentLoans.length === 0 ? (
                                    <p className="text-center py-4 text-slate-400 text-xs font-semibold">No active loans currently checked out.</p>
                                  ) : (
                                    activeStudentLoans.map(c => {
                                      const isOverdue = c.status === 'overdue';
                                      return (
                                        <div key={c.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs shadow-sm">
                                          <div className="min-w-0 flex-1">
                                            <p className="font-bold text-slate-800 truncate">{c.bookTitle}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Due: {c.dueDate} {isOverdue && <span className="text-red-500 font-bold">(Overdue)</span>}</p>
                                          </div>
                                          {isOverdue && c.fineAmount > 0 ? (
                                            <button
                                              onClick={() => handleOnTheSpotSettleFineAndReturn(c.id)}
                                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg transition-all shrink-0 cursor-pointer text-[10px] border border-red-100"
                                            >
                                              Pay ₹{c.fineAmount} & Return
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() => handleOnTheSpotReturn(c.id)}
                                              className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-all shrink-0 cursor-pointer text-[10px]"
                                            >
                                              Return Book
                                            </button>
                                          )}
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              </div>
                            )}

                            {/* View Borrowed Books Panel */}
                            {selectedOption === 'borrowed' && (
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Borrowed Volumes</h4>
                                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                                  <div>
                                    <h5 className="text-[9px] uppercase font-bold text-slate-450 tracking-wider mb-1">Active Loans</h5>
                                    {activeStudentLoans.length === 0 ? (
                                      <p className="text-[10px] text-slate-400 italic py-1">No active books currently borrowed.</p>
                                    ) : (
                                      <div className="space-y-1.5">
                                        {activeStudentLoans.map(c => (
                                          <div key={c.id} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-xs">
                                            <div className="min-w-0 flex-1">
                                              <p className="font-bold text-slate-800 truncate">{c.bookTitle}</p>
                                              <p className="text-[9px] text-slate-400 mt-0.5">Due Date: {c.dueDate}</p>
                                            </div>
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0 ${
                                              c.status === 'overdue' ? 'bg-red-50 text-red-650 border border-red-100' : 'bg-blue-50 text-blue-605 border border-blue-100'
                                            }`}>
                                              {c.status.toUpperCase()}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <div>
                                    <h5 className="text-[9px] uppercase font-bold text-slate-450 tracking-wider mb-1">Returned History</h5>
                                    {studentHistory.length === 0 ? (
                                      <p className="text-[10px] text-slate-400 italic py-1">No previous return history recorded.</p>
                                    ) : (
                                      <div className="space-y-1.5">
                                        {studentHistory.map(c => (
                                          <div key={c.id} className="p-2.5 bg-white/70 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                                            <div className="min-w-0 flex-1">
                                              <p className="font-semibold text-slate-600 truncate">{c.bookTitle}</p>
                                              <p className="text-[9px] text-slate-400 mt-0.5">Returned on time</p>
                                            </div>
                                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-150 text-slate-500 border border-slate-200">
                                              RETURNED
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Check Fine Panel */}
                            {selectedOption === 'fine' && (
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Outstanding Fines</h4>
                                
                                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-xs">
                                  <div>
                                    <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Total outstanding</span>
                                    <span className={`text-base font-extrabold font-mono ${totalFineOwed > 0 ? 'text-red-650' : 'text-emerald-650'}`}>
                                      ₹{totalFineOwed} Owed
                                    </span>
                                  </div>
                                  {totalFineOwed > 0 && (
                                    <button
                                      onClick={handleSettleAllFines}
                                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer font-sans"
                                    >
                                      Settle All
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* Standard Admin Dashboard Entrance */}
                    <div className="w-full mt-6 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => handleProceedToDashboard('admin', adminId)}
                        className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer font-sans animate-fade-in"
                      >
                        <span>Proceed to Admin Dashboard</span>
                        <ArrowRight className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
