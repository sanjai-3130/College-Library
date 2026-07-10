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
  BookOpenCheck,
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
  const { login, books, checkouts, issueBook, returnBook, payFine, renewBook } = useLibrary();
  
  // Tabs: 'student' or 'staff'
  const [activeTab, setActiveTab] = useState<'student' | 'staff'>('student');
  
  // Student Login states
  const [studentRegNo, setStudentRegNo] = useState('CS-2024-4091');
  const [studentPassword, setStudentPassword] = useState('password');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [studentQrUrl, setStudentQrUrl] = useState<string>('');
  const [showStudentQR, setShowStudentQR] = useState<boolean>(false);
  
  // Staff Login states
  const [staffLoggedIn, setStaffLoggedIn] = useState(false);
  const [staffId, setStaffId] = useState('ADMIN-9901');
  const [staffPassword, setStaffPassword] = useState('password');
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  
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

    if (activeTab === 'staff' && staffLoggedIn && scannedStatus === 'scanning') {
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
      }, 400);

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
  }, [activeTab, staffLoggedIn, scannedStatus]);

  // Unified QR Decode Success Pipeline
  const handleQrScanSuccess = (decodedText: string) => {
    let regNo = decodedText;
    
    // Attempt decoding as JSON payload
    try {
      const parsed = JSON.parse(decodedText);
      if (parsed && parsed.regNo) {
        regNo = parsed.regNo;
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
    if (normalized.includes('CS-2024-4091') || normalized.includes('ALEX')) {
      return {
        name: 'Alex Mercer',
        regNo: 'CS-2024-4091',
        dept: 'Computer Science & Engineering',
        year: '3rd Year',
        email: 'alex.mercer@college.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      };
    } else if (normalized.includes('MECH') || normalized.includes('1002')) {
      return {
        name: 'Rohan Sharma',
        regNo: 'MECH-2025-1002',
        dept: 'Mechanical Engineering',
        year: '2nd Year',
        email: 'rohan.sharma@college.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
      };
    } else if (normalized.includes('ECE') || normalized.includes('1003')) {
      return {
        name: 'Priya Patel',
        regNo: 'ECE-2024-1003',
        dept: 'Electronics & Communication',
        year: '4th Year',
        email: 'priya.patel@college.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
      };
    } else {
      return {
        name: 'Guest Reader',
        regNo: normalized || 'GUEST-ID-01',
        dept: 'General Academic Studies',
        year: '1st Year',
        email: 'guest.reader@college.edu',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
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

  // Renew Book handler
  const handleOnTheSpotRenew = (checkoutId: string) => {
    setActionSuccess('');
    setActionError('');
    
    const res = renewBook(checkoutId);
    if (res.success) {
      setActionSuccess(res.message);
    } else {
      setActionError(res.message);
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
      const qrText = studentRegNo.trim().toUpperCase();
      const url = await QRCode.toDataURL(qrText, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1e3a8a', // High-contrast deep blue
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

  // Login as student handler to still access full student dashboard
  const handleStudentDashboardLogin = () => {
    setIsLoggingIn(true);
    setLoginProgress(10);
    setLoginStatusText('Synchronising profile...');

    const interval = setInterval(() => {
      setLoginProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoginStatusText('Session dynamic!');
          setLoginSuccessBanner(true);
          
          setTimeout(() => {
            login(studentRegNo, 'student');
          }, 800);
          return 100;
        }
        return prev + 30;
      });
    }, 100);
  };

  // Staff Authentication
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (!staffId.trim()) {
      setAuthError('Please enter your Librarian ID.');
      return;
    }
    if (!staffPassword.trim()) {
      setAuthError('Please enter your password.');
      return;
    }

    setIsLoggingIn(true);
    setLoginProgress(15);
    setLoginStatusText('Connecting to administration nodes...');

    const interval = setInterval(() => {
      setLoginProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoginStatusText('Credentials approved!');
          setLoginSuccessBanner(true);
          
          setTimeout(() => {
            setIsLoggingIn(false);
            setStaffLoggedIn(true);
            setScannedStatus('scanning'); // Instantly launch scanner after login
            setLoginSuccessBanner(false);
          }, 800);
          return 100;
        }
        if (prev === 50) {
          setLoginStatusText('Validating administrative permissions...');
        }
        return prev + 25;
      });
    }, 150);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 text-slate-800 selection:bg-brand-500 selection:text-white" id="login-container">
      {/* Left Panel: Information & Branding */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 text-white p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Abstract background ambient glows */}
        <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-3xl glow-bg"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full bg-sky-500/15 blur-3xl glow-bg"></div>
        
        {/* Header Branding */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-11 w-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
            <BookOpen className="h-6 w-6 text-brand-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight font-display">ATHENA STATE</h1>
            <p className="text-xs text-brand-300 tracking-wider">UNIVERSITY LIBRARY</p>
          </div>
        </div>

        {/* Center Welcome Typography */}
        <div className="my-12 md:my-auto relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-brand-300 mb-6">
            <Sparkles className="h-3 w-3 animate-pulse" /> Digital Pass Portal v5.0
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display leading-[1.1] mb-6 tracking-tight">
            Seamless access, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-sky-200">unlimited</span> reading.
          </h2>
          <p className="text-sm text-brand-100/90 leading-relaxed mb-8">
            Access millions of physical volumes, electronic journals, research archives, and high-security self-service booking modules through our cloud campus network.
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <Users className="h-5 w-5 text-brand-300 mb-2" />
              <div className="text-lg font-bold">14,200+</div>
              <div className="text-xs text-brand-200">Active Members</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <Clock className="h-5 w-5 text-brand-300 mb-2" />
              <div className="text-lg font-bold">24 / 7</div>
              <div className="text-xs text-brand-200">Self-Service Study</div>
            </div>
          </div>
        </div>

        {/* Footer Support */}
        <div className="text-xs text-brand-300/80 relative z-10 flex items-center justify-between border-t border-white/10 pt-6">
          <span>Need support? Visit Library Front Desk</span>
          <div className="flex items-center gap-1 text-red-300">
            <Heart className="h-3.5 w-3.5 fill-current text-red-400" />
            <span>Built for Academic Excellence</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Login Interactive Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-16 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-md py-6">
          
          {/* Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-200/60 backdrop-blur-sm mb-6 border border-slate-200/40">
            <button
              onClick={() => { setActiveTab('student'); setAuthError(''); }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md shadow-blue-100/40'
                  : 'text-slate-650 hover:text-slate-950 hover:bg-white/40'
              }`}
            >
              <GraduationCap className="h-4.5 w-4.5" />
              Student Login
            </button>
            <button
              onClick={() => { setActiveTab('staff'); setAuthError(''); }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'staff'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md shadow-blue-100/40'
                  : 'text-slate-650 hover:text-slate-950 hover:bg-white/40'
              }`}
            >
              <Shield className="h-4.5 w-4.5" />
              Staff Login
            </button>
          </div>

          {/* Loader Overlay for Authentic Logins */}
          {isLoggingIn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-3xl p-8 border border-white/30 bg-white/90 shadow-2xl flex flex-col items-center justify-center text-center space-y-6 min-h-[340px]"
            >
              {loginSuccessBanner ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  className="flex flex-col items-center space-y-3 text-emerald-600"
                >
                  <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200 shadow-inner">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold font-display">Authentication Successful</h3>
                  <p className="text-xs text-slate-500 font-semibold">{loginStatusText}</p>
                </motion.div>
              ) : (
                <div className="w-full flex flex-col items-center space-y-5">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <div className="space-y-1.5 w-full">
                    <p className="text-sm font-bold text-slate-800">{loginStatusText}</p>
                    <div className="w-full max-w-[200px] h-1.5 bg-slate-100 rounded-full overflow-hidden mx-auto border border-slate-200/50">
                      <motion.div 
                        className="h-full bg-blue-600" 
                        animate={{ width: `${loginProgress}%` }}
                        transition={{ ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Student Login Flow */}
          {!isLoggingIn && activeTab === 'student' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-extrabold font-display tracking-tight text-slate-900 font-sans">Student Identity Pass</h3>
                <p className="text-slate-500 text-xs mt-1">
                  Enter your Student Register Number to generate and display your library checkout QR code.
                </p>
              </div>

              {authError && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-650 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleStudentShowQR} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Student Register Number</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={studentRegNo}
                      onChange={(e) => {
                        setStudentRegNo(e.target.value);
                        setShowStudentQR(false); // Hide outdated QR until they request new one
                      }}
                      placeholder="e.g., CS-2024-4091"
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm font-semibold text-sm"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>Show My QR</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Quick fill demo student */}
              {!showStudentQR && (
                <div className="p-4 bg-white/50 border border-slate-200/40 rounded-2xl shadow-sm text-xs space-y-2.5">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Quick-Select Demo Students:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setStudentRegNo('CS-2024-4091');
                        setShowStudentQR(false);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-blue-600 font-bold border border-slate-200 rounded-xl shadow-xs transition-all text-[11px] cursor-pointer"
                    >
                      Alex Mercer (CS)
                    </button>
                    <button
                      onClick={() => {
                        setStudentRegNo('MECH-2025-1002');
                        setShowStudentQR(false);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-blue-600 font-bold border border-slate-200 rounded-xl shadow-xs transition-all text-[11px] cursor-pointer"
                    >
                      Rohan Sharma (MECH)
                    </button>
                    <button
                      onClick={() => {
                        setStudentRegNo('ECE-2024-1003');
                        setShowStudentQR(false);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-blue-600 font-bold border border-slate-200 rounded-xl shadow-xs transition-all text-[11px] cursor-pointer"
                    >
                      Priya Patel (ECE)
                    </button>
                  </div>
                </div>
              )}

              {/* Generated QR Pass Visual Block */}
              {showStudentQR && studentQrUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-3xl border border-blue-100 bg-gradient-to-b from-white to-blue-50/20 shadow-lg space-y-5"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    {/* The real QR code image element */}
                    <div className="p-3 bg-white rounded-2xl border border-slate-150 shadow-inner inline-block relative group">
                      <img
                        src={studentQrUrl}
                        alt="Student Library QR Pass"
                        className="w-48 h-48 block mx-auto object-contain"
                      />
                      {/* Interactive overlay design accent */}
                      <div className="absolute inset-0 border-2 border-dashed border-blue-400/30 rounded-2xl pointer-events-none m-1"></div>
                    </div>

                    {/* QR Code helper utility buttons */}
                    <div className="flex gap-2 mt-4 w-full max-w-[240px]">
                      <a
                        href={studentQrUrl}
                        download={`library_pass_${studentRegNo.toUpperCase()}.png`}
                        className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs text-center"
                      >
                        <Download className="h-3.5 w-3.5 text-slate-650" />
                        <span>Download QR</span>
                      </a>
                      <button
                        onClick={handleStudentShowQR}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        title="Re-generate pass"
                      >
                        <RefreshCw className="h-3.5 w-3.5 text-slate-650" />
                        <span>Refresh QR</span>
                      </button>
                    </div>
                  </div>

                  {/* Student Details Card (Direct Requirement #2) */}
                  <div className="p-4 bg-white border border-slate-150 rounded-2xl shadow-xs space-y-3">
                    <div className="text-[10px] font-bold text-slate-450 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                      Verified Library Pass Details
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <img
                        src={getStudentDetails(studentRegNo).avatarUrl}
                        alt={getStudentDetails(studentRegNo).name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-150 ring-2 ring-slate-100/50 shadow-xs"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider text-[9px]">Name</div>
                        <div className="text-sm font-extrabold text-slate-900 font-display truncate leading-none">
                          {getStudentDetails(studentRegNo).name}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 pt-1.5 border-t border-slate-100">
                      <div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider text-[9px]">Register Number</div>
                        <div className="text-xs font-mono font-extrabold text-blue-600">
                          {getStudentDetails(studentRegNo).regNo}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider text-[9px]">Department</div>
                        <div className="text-xs font-bold text-slate-700 truncate">
                          {getStudentDetails(studentRegNo).dept}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider text-[9px]">Year of Study</div>
                        <div className="text-xs font-bold text-slate-700">
                          {getStudentDetails(studentRegNo).year}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Option to log in to dashboard to search books, etc. */}
                  <div className="pt-2">
                    <button
                      onClick={handleStudentDashboardLogin}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                    >
                      <span>Proceed to Student Portal Dashboard</span>
                      <ArrowRight className="h-3.5 w-3.5 text-white" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Staff Login Flow */}
          {!isLoggingIn && activeTab === 'staff' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* librarian login form first if not logged in */}
              {!staffLoggedIn ? (
                <>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-extrabold font-display tracking-tight text-slate-900">Librarian Access Station</h3>
                    <p className="text-slate-500 text-xs mt-1">Log in using your Staff credentials to access the high-performance camera scan interface.</p>
                  </div>

                  {authError && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-650 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleStaffLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Librarian ID Code</label>
                      <input
                        type="text"
                        value={staffId}
                        onChange={(e) => setStaffId(e.target.value)}
                        placeholder="e.g., ADMIN-9901"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm font-semibold text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Security Password</label>
                      <div className="relative">
                        <input
                          type={showStaffPassword ? "text" : "password"}
                          value={staffPassword}
                          onChange={(e) => setStaffPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm font-semibold text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowStaffPassword(!showStaffPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                        >
                          {showStaffPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 bg-gradient-to-r from-slate-850 to-slate-950 hover:from-slate-900 hover:to-black text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Shield className="h-4.5 w-4.5" />
                      <span>Authenticate Librarian ID</span>
                    </button>
                  </form>

                  <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">Librarian Access Credentials:</span>
                    <button
                      onClick={() => {
                        setStaffId('ADMIN-9901');
                        setStaffPassword('password');
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-200 rounded-xl shadow-xs transition-all text-xs cursor-pointer"
                    >
                      Fill Demo Credentials
                    </button>
                  </div>
                </>
              ) : (
                /* Authenticated Scanner View */
                <>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="text-xl font-extrabold font-display tracking-tight text-slate-900">Scan Activity Station</h3>
                      <p className="text-slate-500 text-[11px] mt-0.5">Scanned Session: <span className="font-bold text-slate-700">{staffId}</span></p>
                    </div>
                    <button
                      onClick={() => {
                        setStaffLoggedIn(false);
                        setScannedStatus('idle');
                      }}
                      className="px-3 py-1.5 text-red-650 hover:bg-red-50 font-bold rounded-xl text-xs transition-colors border border-transparent hover:border-red-100"
                    >
                      Logout Station
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
                          <span className="text-lg font-bold tracking-wider text-white uppercase font-display">STUDENT FOUND</span>
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
                          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_#3b82f6] z-10"
                        />

                        {/* Corner Bracket Braces */}
                        <div className="absolute top-5 left-8 w-6 h-6 border-t-2 border-l-2 border-blue-400 rounded-tl-lg z-10"></div>
                        <div className="absolute top-5 right-8 w-6 h-6 border-t-2 border-r-2 border-blue-400 rounded-tr-lg z-10"></div>
                        <div className="absolute bottom-5 left-8 w-6 h-6 border-b-2 border-l-2 border-blue-400 rounded-bl-lg z-10"></div>
                        <div className="absolute bottom-5 right-8 w-6 h-6 border-b-2 border-r-2 border-blue-400 rounded-br-lg z-10"></div>

                        {cameraError && (
                          <div className="absolute inset-0 bg-slate-950/80 p-6 flex flex-col items-center justify-center text-center z-20">
                            <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
                            <p className="text-xs font-bold text-slate-200">Device Camera Restricted</p>
                            <p className="text-[10px] text-slate-400 mt-1 max-w-[280px] leading-relaxed">{cameraError}</p>
                          </div>
                        )}

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/85 border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-mono tracking-wider font-bold animate-pulse z-20 flex items-center gap-1.5 whitespace-nowrap">
                          <Camera className="h-3 w-3 text-blue-400" /> CAMERA SCANNER ACTIVE...
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
                        <p className="text-sm font-bold font-display uppercase tracking-wider">Pass Identified Successfully</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">Register No: {scannedRegNo}</p>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center p-6 text-center text-slate-500 z-10">
                        <div className="h-16 w-16 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-center mb-3">
                          <QrCode className="h-8 w-8 text-blue-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-300 font-display">Viewfinder Offline</p>
                        <button
                          onClick={() => setScannedStatus('scanning')}
                          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-all cursor-pointer"
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
                    <div className="space-y-3 pt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center font-mono">Or Simulate Instant Pass Scans</p>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => triggerScanSimulation('CS-2024-4091')}
                          disabled={scannedStatus === 'scanning'}
                          className="py-2.5 px-3 rounded-xl bg-blue-50/50 hover:bg-blue-100 disabled:opacity-50 text-blue-700 border border-blue-150 font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                        >
                          <GraduationCap className="h-4 w-4 text-blue-500" />
                          <span>Alex Mercer</span>
                        </button>
                        <button
                          onClick={() => triggerScanSimulation('MECH-2025-1002')}
                          disabled={scannedStatus === 'scanning'}
                          className="py-2.5 px-3 rounded-xl bg-indigo-50/50 hover:bg-indigo-100 disabled:opacity-50 text-indigo-700 border border-indigo-150 font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                        >
                          <GraduationCap className="h-4 w-4 text-indigo-500" />
                          <span>Rohan Sharma</span>
                        </button>
                      </div>

                      <div className="pt-2.5 border-t border-slate-200/60">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type Custom Reg No..."
                            defaultValue="ECE-2024-1003"
                            id="custom-scan-input"
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold text-xs"
                          />
                          <button
                            onClick={() => {
                              const val = (document.getElementById('custom-scan-input') as HTMLInputElement)?.value || 'ECE-2024-1003';
                              triggerScanSimulation(val);
                            }}
                            disabled={scannedStatus === 'scanning'}
                            className="bg-slate-850 hover:bg-slate-950 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer whitespace-nowrap"
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
                        <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                          <span className="font-extrabold text-slate-800 font-display uppercase tracking-wider text-[10px]">Identified Student Account</span>
                          <button
                            onClick={() => {
                              setScannedStatus('scanning');
                              setSelectedOption(null);
                              setActionSuccess('');
                              setActionError('');
                            }}
                            className="text-blue-600 hover:underline font-bold text-[10px] cursor-pointer flex items-center gap-1 font-sans"
                          >
                            <RotateCcw className="h-3 w-3" /> Scan Next Pass
                          </button>
                        </div>

                        {/* Student Info Row */}
                        <div className="flex gap-4 items-center">
                          <img 
                            src={scannedStudentDetails.avatarUrl} 
                            alt={scannedStudentDetails.name} 
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100 shadow-sm"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-extrabold font-display text-slate-900 truncate leading-snug">{scannedStudentDetails.name}</h4>
                            <p className="text-[11px] text-slate-500 font-semibold">{scannedStudentDetails.dept}</p>
                            <p className="text-[10px] font-mono text-blue-600 mt-0.5">{scannedStudentDetails.regNo} • {scannedStudentDetails.year}</p>
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

                      {/* Options Selector Grid with Exactly 4 Requested Buttons */}
                      <div className="grid grid-cols-4 gap-1.5">
                        <button
                          onClick={() => { setSelectedOption('issue'); setActionSuccess(''); setActionError(''); }}
                          className={`py-3 px-1 rounded-xl border font-bold text-[10px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer font-sans leading-none ${
                            selectedOption === 'issue'
                              ? 'border-blue-500 bg-blue-50/50 text-blue-700 font-extrabold ring-2 ring-blue-100'
                              : 'border-slate-250/20 bg-white hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <BookUp className="h-4.5 w-4.5 text-blue-650 shrink-0" />
                          <span>Issue Book</span>
                        </button>
                        <button
                          onClick={() => { setSelectedOption('return'); setActionSuccess(''); setActionError(''); }}
                          className={`py-3 px-1 rounded-xl border font-bold text-[10px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer font-sans leading-none ${
                            selectedOption === 'return'
                              ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 font-extrabold ring-2 ring-indigo-100'
                              : 'border-slate-250/20 bg-white hover:bg-slate-50 text-slate-600'
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
                              : 'border-slate-250/20 bg-white hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <BookOpenCheckIcon className="h-4.5 w-4.5 text-amber-600 shrink-0" />
                          <span>Borrowed Books</span>
                        </button>
                        <button
                          onClick={() => { setSelectedOption('fine'); setActionSuccess(''); setActionError(''); }}
                          className={`py-3 px-1 rounded-xl border font-bold text-[10px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer font-sans leading-none ${
                            selectedOption === 'fine'
                              ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700 font-extrabold ring-2 ring-emerald-100'
                              : 'border-slate-250/20 bg-white hover:bg-slate-50 text-slate-600'
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
                          className="p-3.5 bg-emerald-500/10 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-650 shrink-0" />
                          <span>{actionSuccess}</span>
                        </motion.div>
                      )}
                      {actionError && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2"
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
                          className="p-4 rounded-2xl bg-slate-100 border border-slate-200/60"
                        >
                          {/* Issue Book Form */}
                          {selectedOption === 'issue' && (
                            <form onSubmit={handleOnTheSpotIssue} className="space-y-3">
                              <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Select Catalog Volume to Issue</h4>
                              <select
                                value={issueBookId}
                                onChange={(e) => setIssueBookId(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-semibold text-xs cursor-pointer"
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
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer font-sans"
                              >
                                Confirm Issue Checkout
                              </button>
                            </form>
                          )}

                          {/* Return Book Form */}
                          {selectedOption === 'return' && (
                            <div className="space-y-2.5">
                              <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Active Book Loans list</h4>
                              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                                {activeStudentLoans.length === 0 ? (
                                  <p className="text-center py-4 text-slate-400 text-xs font-semibold">No active loans currently checked out.</p>
                                ) : (
                                  activeStudentLoans.map(c => {
                                    const isOverdue = c.status === 'overdue';
                                    return (
                                      <div key={c.id} className="p-3 bg-white border border-slate-200/50 rounded-xl flex items-center justify-between gap-3 text-xs shadow-sm">
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
                                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-all shrink-0 cursor-pointer text-[10px]"
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
                              <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Currently Borrowed Volumes</h4>
                              <div className="space-y-3.5 max-h-52 overflow-y-auto pr-1">
                                <div>
                                  <h5 className="text-[9px] uppercase font-bold text-slate-450 tracking-wider mb-1">Active Loans</h5>
                                  {activeStudentLoans.length === 0 ? (
                                    <p className="text-[10px] text-slate-400 italic py-1">No active books currently borrowed.</p>
                                  ) : (
                                    <div className="space-y-1.5">
                                      {activeStudentLoans.map(c => (
                                        <div key={c.id} className="p-2.5 bg-white border border-slate-200/45 rounded-xl flex items-center justify-between text-xs shadow-xs">
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
                                        <div key={c.id} className="p-2.5 bg-white/70 border border-slate-200/40 rounded-xl flex items-center justify-between text-xs">
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
                              <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Fine Outstanding Details</h4>
                              
                              <div className="p-3 bg-white border border-slate-200/50 rounded-xl flex items-center justify-between text-xs shadow-xs">
                                <div>
                                  <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Total fine balance</span>
                                  <span className={`text-base font-extrabold font-mono ${totalFineOwed > 0 ? 'text-red-650' : 'text-emerald-650'}`}>
                                    ₹{totalFineOwed} Owed
                                  </span>
                                </div>
                                {totalFineOwed > 0 && (
                                  <button
                                    onClick={handleSettleAllFines}
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer font-sans"
                                  >
                                    Collect Full Fine
                                  </button>
                                )}
                              </div>

                              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                                <h5 className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Overdue Fine Breakdown</h5>
                                {activeStudentLoans.filter(c => c.fineAmount > 0).length === 0 ? (
                                  <p className="text-[10px] text-slate-400 italic py-1">No active outstanding fines for this student.</p>
                                ) : (
                                  activeStudentLoans.filter(c => c.fineAmount > 0).map(c => (
                                    <div key={c.id} className="p-2.5 bg-white border border-red-100 rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs">
                                      <div className="min-w-0 flex-1">
                                        <p className="font-bold text-slate-800 truncate">{c.bookTitle}</p>
                                        <p className="text-[9px] text-red-500 font-bold font-mono">Overdue Fine: ₹{c.fineAmount}</p>
                                      </div>
                                      <button
                                        onClick={() => handleOnTheSpotSettleFineAndReturn(c.id)}
                                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg transition-all shrink-0 cursor-pointer text-[10px] border border-red-100"
                                      >
                                        Settle Fine
                                      </button>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Settle fines shortcut button if student owes fine */}
                      {totalFineOwed > 0 && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between animate-fade-in text-xs font-semibold">
                          <div>
                            <span className="text-[9px] font-mono uppercase text-red-450 block font-bold">Unpaid Student Fines</span>
                            <span className="text-sm font-extrabold text-red-600 font-mono">₹{totalFineOwed} Total</span>
                          </div>
                          <button
                            onClick={handleSettleAllFines}
                            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded-lg shadow-sm transition-all cursor-pointer font-sans"
                          >
                            Collect Fine in Full
                          </button>
                        </div>
                      )}

                    </motion.div>
                  )}

                  {/* Standard Staff Portal Entry button */}
                  <div className="w-full mt-6 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => login('ADMIN-9901', 'admin')}
                      className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer font-sans animate-fade-in"
                    >
                      <span>Proceed to Admin Dashboard</span>
                      <ArrowRight className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};
