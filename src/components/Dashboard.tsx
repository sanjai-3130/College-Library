/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book, Checkout, User, BookRequest } from '../types';
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
  RefreshCw,
  Trash2,
  Edit3,
  UserPlus,
  FileText,
  Check,
  X,
  ShieldAlert,
  Clock,
  BarChart3,
  Users,
  Eye
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    currentUser, 
    books, 
    checkouts, 
    setActiveView, 
    bookRequests, 
    addBookRequest, 
    approveBookRequest, 
    rejectBookRequest,
    usersList,
    addUser,
    editUser,
    deleteUser,
    addBook,
    editBook,
    deleteBook,
    renewBook,
    returnBook,
    payFine
  } = useLibrary();

  // QR Code Generation
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [refreshCount, setRefreshCount] = useState<number>(0);

  // Search input state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected book for Details Modal
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Book Request Form State
  const [reqTitle, setReqTitle] = useState('');
  const [reqAuthor, setReqAuthor] = useState('');
  const [reqSuccessMsg, setReqSuccessMsg] = useState('');

  // Admin section toggles: 'stats' | 'requests' | 'inventory' | 'users' | 'reports'
  const [adminSection, setAdminSection] = useState<'stats' | 'requests' | 'inventory' | 'users' | 'reports'>('stats');

  // Book Entry Form Inline States
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookGenre, setNewBookGenre] = useState('');
  const [newBookType, setNewBookType] = useState<'physical' | 'e-book'>('physical');
  const [newBookCopies, setNewBookCopies] = useState<number>(3);
  const [newBookPdfUrl, setNewBookPdfUrl] = useState('');

  // Editing Book State
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editCopiesVal, setEditCopiesVal] = useState<number>(1);

  // User Entry Form States
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserId, setNewUserId] = useState('');
  const [newUserDept, setNewUserDept] = useState('');
  const [newUserSem, setNewUserSem] = useState('1st Semester');
  const [newUserRole, setNewUserRole] = useState<'student' | 'staff'>('student');

  // Interactive scan console simulation within Admin Dashboard
  const [adminSimScanId, setAdminSimScanId] = useState('');
  const [adminSimScanMsg, setAdminSimScanMsg] = useState('');

  // Get student details helper
  const getStudentDetails = (studentId?: string) => {
    if (!studentId) return { name: 'Unknown Reader', regNo: 'N/A', role: 'student' };
    const found = usersList.find(u => u.studentId.toUpperCase() === studentId.toUpperCase());
    if (found) {
      return { name: found.name, regNo: found.studentId, role: found.role };
    }
    return { name: 'External Reader', regNo: studentId, role: 'student' };
  };

  useEffect(() => {
    if (currentUser) {
      const hostUrl = window.location.origin;
      const yearStr = currentUser.role === 'staff' ? 'Faculty Staff' : (currentUser.semester === '4th Semester' ? '2nd Year' : currentUser.semester === '8th Semester' ? '4th Year' : '3rd Year');
      const params = new URLSearchParams({
        id: currentUser.studentId,
        name: currentUser.name,
        dept: currentUser.department,
        year: yearStr,
        semester: currentUser.semester,
        section: 'A',
        blood: 'O+',
        phone: '9876543210',
        email: currentUser.email,
        avatar: currentUser.avatarUrl || '',
        role: currentUser.role
      });
      const qrValue = `${hostUrl}/new.html?${params.toString()}`;

      QRCode.toDataURL(qrValue, {
        width: 320,
        margin: 2,
        color: {
          dark: '#1e3a8a',
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

  // ----------------------------------------------------
  // COMMON COMPUTATIONS
  // ----------------------------------------------------
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Filtered book recommendations
  const recommendations = books.filter(b => b.rating >= 4.6).slice(0, 3);

  // Filtered Catalog Search
  const filteredBooks = searchQuery.trim() === ''
    ? books.slice(0, 4)
    : books.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // ----------------------------------------------------
  // ROLE 1 & 2: STUDENT AND STAFF COMPUTATIONS
  // ----------------------------------------------------
  const myCheckouts = checkouts.filter(c => c.studentId === currentUser.studentId);
  const myActiveLoans = myCheckouts.filter(c => c.status !== 'returned');
  const myReturnHistory = myCheckouts.filter(c => c.status === 'returned');
  
  // Accumulated fine amount
  const myFineTotal = myActiveLoans.reduce((sum, c) => sum + c.fineAmount, 0);

  // Soonest active loan due date
  const mySoonestDueDate = myActiveLoans.length > 0 
    ? myActiveLoans.reduce((nearest, current) => {
        return new Date(current.dueDate) < new Date(nearest.dueDate) ? current : nearest;
      }).dueDate 
    : 'No active loans';

  // Borrow counts split
  const totalPhysicalBorrowed = myActiveLoans.filter(c => {
    const originalBook = books.find(b => b.id === c.bookId);
    return originalBook ? originalBook.type === 'physical' : true;
  }).length;

  const totalEBooksBorrowed = myActiveLoans.filter(c => {
    const originalBook = books.find(b => b.id === c.bookId);
    return originalBook ? originalBook.type === 'ebook' : false;
  }).length;

  // Available Book summaries
  const availablePhysicalCount = books.filter(b => b.type === 'physical' && (b.copiesAvailable ?? 0) > 0).length;
  const availableEBooksCount = books.filter(b => b.type === 'ebook').length;

  // Self-Service Renew handler
  const handleSelfRenew = (checkoutId: string) => {
    const res = renewBook(checkoutId);
    if (res.success) {
      alert(res.message);
    } else {
      alert(res.message);
    }
  };

  // Submit Book Request Handler
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim()) return;
    addBookRequest(reqTitle, reqAuthor || 'Unknown Author');
    setReqSuccessMsg(`Success! Requested "${reqTitle}" for administration review.`);
    setReqTitle('');
    setReqAuthor('');
    setTimeout(() => setReqSuccessMsg(''), 5000);
  };


  // ----------------------------------------------------
  // ROLE 3: ADMIN COMPUTATIONS & ACTIONS
  // ----------------------------------------------------
  const totalStudentsCount = usersList.filter(u => u.role === 'student').length;
  const totalStaffCount = usersList.filter(u => u.role === 'staff').length;
  const totalBooksCount = books.length;
  const adminPhysicalBooksCount = books.filter(b => b.type === 'physical').length;
  const adminEBooksCount = books.filter(b => b.type === 'ebook').length;
  const adminCopiesAvailableCount = books.reduce((sum, b) => sum + (b.copiesAvailable || 0), 0);
  const adminIssuedCount = checkouts.filter(c => c.status !== 'returned').length;
  const adminReturnedCount = checkouts.filter(c => c.status === 'returned').length;
  const adminOverdueCount = checkouts.filter(c => c.status === 'overdue').length;
  const adminTotalFineCollected = 540 + checkouts.filter(c => c.status === 'returned' && c.fineAmount === 0).length * 10; 
  const adminPendingFinesTotal = checkouts.filter(c => c.status !== 'returned').reduce((sum, c) => sum + c.fineAmount, 0);

  // Add inline physical / ebook
  const handleAdminAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim() || !newBookAuthor.trim()) {
      alert('Please fill out Title and Author');
      return;
    }
    addBook({
      title: newBookTitle,
      author: newBookAuthor,
      isbn: `ISBN-${Date.now()}`,
      category: newBookGenre || 'General',
      type: newBookType === 'e-book' ? 'ebook' : 'physical',
      copiesAvailable: newBookType === 'e-book' ? undefined : newBookCopies,
      copiesTotal: newBookType === 'e-book' ? undefined : newBookCopies,
      rating: 4.5,
      coverUrl: newBookType === 'e-book' 
        ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=150&q=80',
      downloadUrl: newBookType === 'e-book' ? (newBookPdfUrl || '#') : undefined,
      description: 'Standard technical textbook volume.',
      publisher: 'Athena Publishing',
      publishYear: 2024,
      pages: 420
    });
    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookGenre('');
    setNewBookCopies(3);
    setNewBookPdfUrl('');
    alert('Volume added to index successfully.');
  };

  // Delete book handler
  const handleAdminDeleteBook = (id: string) => {
    if (window.confirm('Are you sure you want to remove this catalog entry?')) {
      deleteBook(id);
    }
  };

  // Edit Book Copies inline
  const handleStartEditingCopies = (b: Book) => {
    setEditingBookId(b.id);
    setEditCopiesVal(b.copiesTotal || 1);
  };

  const handleSaveCopies = (b: Book) => {
    editBook({
      ...b,
      copiesTotal: editCopiesVal,
      copiesAvailable: editCopiesVal - ((b.copiesTotal || 0) - (b.copiesAvailable || 0))
    });
    setEditingBookId(null);
  };

  // Add Student/Staff Account Inline
  const handleAdminAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserId.trim()) {
      alert('Please fill Name and Identifier ID.');
      return;
    }
    addUser({
      name: newUserName,
      email: newUserEmail || `${newUserId.toLowerCase()}@college.edu`,
      studentId: newUserId.trim().toUpperCase(),
      department: newUserDept || 'Engineering Science',
      semester: newUserRole === 'staff' ? 'Senior Faculty' : newUserSem,
      avatarUrl: newUserRole === 'staff' 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: newUserRole,
      cardIssueDate: new Date().toISOString().split('T')[0]
    });
    setNewUserName('');
    setNewUserEmail('');
    setNewUserId('');
    setNewUserDept('');
    alert('User account created successfully.');
  };

  // Admin simulation of scanning custom card
  const handleAdminSimScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSimScanId.trim()) return;
    const target = adminSimScanId.trim().toUpperCase();
    const found = usersList.find(u => u.studentId.toUpperCase() === target);
    if (found) {
      setAdminSimScanMsg(`Scan Match! Redirecting to scan station details for ${found.name} (${found.role})...`);
    } else {
      setAdminSimScanMsg(`Warning: ID Card ${target} not verified in database, registering guest profile.`);
    }
    setTimeout(() => {
      setAdminSimScanMsg('');
      setActiveView('qr-scanner');
    }, 2000);
  };


  // ----------------------------------------------------
  // VIEW RENDER CONDITIONAL BY ACTIVE ROLE
  // ----------------------------------------------------
  return (
    <div className="space-y-6" id="dashboard-system">
      
      {/* Dynamic Header Banner - Common to all roles */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white bento-shadow">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-30%] left-[20%] w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-300" />
              <span className="text-[10px] font-bold text-brand-200 tracking-wider uppercase font-mono">{formattedDate}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display leading-tight">
              {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">{currentUser.name}</span>!
            </h1>
            <p className="text-xs text-brand-100/80 max-w-xl">
              {currentUser.role === 'admin' 
                ? 'Senior administration console activated. View loan status logs, approve requests, and manage student accounts.'
                : `Active student reader gateway. You have ${myActiveLoans.length} books checked out with fine balance ₹${myFineTotal}.`
              }
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 shrink-0 flex items-center gap-3 shadow-md">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-300 shrink-0">
              <Sparkles className="h-4.5 w-4.5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="text-[9px] uppercase font-bold text-brand-300 tracking-wider">Terminal Access</div>
              <div className="text-xs font-semibold leading-tight capitalize text-white">{currentUser.role} Security Portal</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================================= */}
      {/* 👨🎓 STUDENT DASHBOARD & 👨🏫 STAFF DASHBOARD VIEW */}
      {/* ========================================================================================= */}
      {(currentUser.role === 'student' || currentUser.role === 'staff') && (
        <div className="space-y-6">
          
          {/* Stats Widgets Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass p-5 rounded-2xl border border-white bg-white/70 bento-shadow flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-700 shrink-0 border border-brand-100">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">My Physical Loans</span>
                <h4 className="text-lg font-extrabold text-slate-800 mt-0.5">{totalPhysicalBorrowed} Volumes</h4>
              </div>
            </div>

            <div className="glass p-5 rounded-2xl border border-white bg-white/70 bento-shadow flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 shrink-0 border border-indigo-100">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">My E-Book Loans</span>
                <h4 className="text-lg font-extrabold text-slate-800 mt-0.5">{totalEBooksBorrowed} Volumes</h4>
              </div>
            </div>

            <div className="glass p-5 rounded-2xl border border-white bg-white/70 bento-shadow flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 border border-emerald-100">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Available Books</span>
                <h4 className="text-xs font-extrabold text-slate-700 mt-0.5">
                  Phy: {availablePhysicalCount} • E-Books: {availableEBooksCount}
                </h4>
              </div>
            </div>

            <div className="glass p-5 rounded-2xl border border-white bg-white/70 bento-shadow flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0 border border-amber-100">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Outstanding Fines</span>
                <h4 className={`text-lg font-extrabold mt-0.5 font-mono ${myFineTotal > 0 ? 'text-red-650' : 'text-slate-800'}`}>
                  ₹{myFineTotal}
                </h4>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 columns containing Book Search, Active Loans, and Requests */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Quick Book Search block */}
              <div className="glass p-6 rounded-3xl border border-white bg-white/70 bento-shadow space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 font-display">Book Catalog Search</h3>
                    <p className="text-xs text-slate-500">Quickly filter catalog index books with instantaneous lookup.</p>
                  </div>
                  <button 
                    onClick={() => setActiveView('search')}
                    className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1 font-sans"
                  >
                    Advanced Filter <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by book title, author, or discipline genre..."
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-semibold"
                  />
                </div>

                {/* Filter results display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredBooks.map(book => (
                    <div 
                      key={book.id}
                      onClick={() => setSelectedBook(book)}
                      className="p-3 bg-white/50 hover:bg-white rounded-2xl border border-slate-200/60 transition-all cursor-pointer flex gap-3 items-center group shadow-xs"
                    >
                      <img src={book.coverUrl} alt={book.title} className="w-10 h-14 rounded-lg object-cover shadow-sm" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-800 truncate leading-tight group-hover:text-brand-650">{book.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">by {book.author}</p>
                        <div className="flex gap-1.5 mt-1">
                          <span className="text-[8px] font-bold text-brand-600 bg-brand-50 px-1 py-0.5 rounded uppercase font-mono">{book.type}</span>
                          <span className="text-[8px] font-semibold text-slate-500 bg-slate-100 px-1 py-0.5 rounded font-mono">★ {book.rating}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* My Borrowed Books & Renew section */}
              <div className="glass p-6 rounded-3xl border border-white bg-white/70 bento-shadow space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 font-display">My Borrowed Volumes</h3>
                    <p className="text-xs text-slate-500">List of your currently checked-out educational materials.</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">Soonest Due: {mySoonestDueDate}</span>
                </div>

                {myActiveLoans.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
                    <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">No active physical or digital books checked out</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Filter the list or head to the kiosk to issue a book.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myActiveLoans.map(loan => (
                      <div key={loan.id} className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
                        <div className="flex gap-3 min-w-0 flex-1">
                          <div className="h-10 w-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0 border border-brand-100">
                            <BookMarked className="h-5 w-5 text-brand-650" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">{loan.bookTitle}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Due Date: <span className="font-mono font-bold text-slate-600">{loan.dueDate}</span></p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {loan.fineAmount > 0 && (
                            <span className="px-2 py-1 bg-red-50 text-red-700 text-[9px] font-bold rounded-lg border border-red-100 animate-pulse font-mono">
                              ₹{loan.fineAmount} Fine
                            </span>
                          )}
                          <button
                            onClick={() => handleSelfRenew(loan.id)}
                            className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                          >
                            Renew Loan
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Book Request Form & Status panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Book Request Form */}
                <div className="glass p-6 rounded-3xl border border-white bg-white/70 bento-shadow space-y-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 font-display">Recommend / Request Books</h3>
                    <p className="text-xs text-slate-500 font-medium">Is a book unavailable or missing? Request here.</p>
                  </div>

                  {reqSuccessMsg && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200">
                      {reqSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleRequestSubmit} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Book Title</label>
                      <input
                        type="text"
                        required
                        value={reqTitle}
                        onChange={(e) => setReqTitle(e.target.value)}
                        placeholder="e.g. Clean Code in TypeScript"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold shadow-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Author Name</label>
                      <input
                        type="text"
                        value={reqAuthor}
                        onChange={(e) => setReqAuthor(e.target.value)}
                        placeholder="e.g. Robert C. Martin"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold shadow-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-brand-650 hover:bg-brand-750 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer font-sans"
                    >
                      Send Book Request
                    </button>
                  </form>
                </div>

                {/* Requested Books Status */}
                <div className="glass p-6 rounded-3xl border border-white bg-white/70 bento-shadow space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900 font-display">Requested Books Status</h3>
                  
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {bookRequests.filter(r => r.userId === currentUser.studentId).length === 0 ? (
                      <p className="text-center py-8 text-slate-405 text-xs font-semibold italic">No custom book request logs found.</p>
                    ) : (
                      bookRequests.filter(r => r.userId === currentUser.studentId).map(req => (
                        <div key={req.id} className="p-3 bg-white border border-slate-100 rounded-xl space-y-1 text-xs shadow-xs">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-slate-800 truncate">{req.bookTitle}</h4>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0 uppercase tracking-wide border ${
                              req.status === 'approved' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                : req.status === 'rejected'
                                ? 'bg-red-50 text-red-750 border-red-100'
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">by {req.bookAuthor}</p>
                          <p className="text-[9px] text-slate-400 font-mono mt-1">Requested: {req.requestDate}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Book Return History */}
              <div className="glass p-6 rounded-3xl border border-white bg-white/70 bento-shadow space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 font-display">Book Return History</h3>
                
                {myReturnHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No previously returned physical or digital books on record.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-bold font-mono text-[9px] uppercase tracking-wider">
                          <th className="py-2.5 px-3">Book Title</th>
                          <th className="py-2.5 px-3">Returned Date</th>
                          <th className="py-2.5 px-3">Rating</th>
                          <th className="py-2.5 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold">
                        {myReturnHistory.map(hist => (
                          <tr key={hist.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-3 text-slate-800">{hist.bookTitle}</td>
                            <td className="py-3 px-3 text-slate-500 font-mono">{hist.dueDate}</td>
                            <td className="py-3 px-3 text-amber-500 font-mono">★ 5.0</td>
                            <td className="py-3 px-3 text-right">
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[8px] font-bold">
                                CHECKED IN
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>

            {/* Right column containing Personal Digital QR Pass and Profile */}
            <div className="space-y-6">
              
              {/* Dynamic QR ID Pass Card */}
              <div className="glass p-6 rounded-3xl border border-white bg-white/70 bento-shadow flex flex-col items-center">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-brand-50 text-brand-700 border border-brand-100 tracking-wider font-mono">
                  {currentUser.role === 'staff' ? 'Faculty Library ID Pass' : 'Digital Reader Pass'}
                </span>
                <h3 className="text-sm font-extrabold text-slate-800 font-display mt-3 text-center">Active Reader Security Pass</h3>
                <p className="text-[11px] text-slate-400 mt-1 text-center max-w-[220px]">Scan this pass at counters or computer terminals to login.</p>

                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-inner my-5 relative group flex items-center justify-center">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="Library QR ID" className="w-44 h-44 object-contain" />
                  ) : (
                    <div className="w-44 h-44 bg-slate-50 flex items-center justify-center rounded-xl border border-dashed border-slate-200">
                      <QrCode className="h-8 w-8 text-blue-400 animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5 w-full">
                  <button
                    onClick={() => setRefreshCount(prev => prev + 1)}
                    className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-250 flex items-center justify-center gap-1 cursor-pointer font-sans"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Refresh Pass</span>
                  </button>
                  <button
                    onClick={() => {
                      if (qrCodeUrl) {
                        const link = document.createElement('a');
                        link.href = qrCodeUrl;
                        link.download = `library_pass_${currentUser.studentId}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }
                    }}
                    className="py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm font-sans"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Student/Staff Profile Details Summary Card */}
              <div className="glass p-6 rounded-3xl border border-white bg-white/70 bento-shadow space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 font-display">
                  {currentUser.role === 'staff' ? 'Staff Profile Card' : 'Student Digital Profile'}
                </h3>
                
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-100 shadow-sm" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[8px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase font-mono">
                      Active Account
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-semibold text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-[10px] text-slate-450 block uppercase font-mono">Member ID</span>
                    <span className="text-slate-800 font-mono">{currentUser.studentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-slate-450 block uppercase font-mono">Department</span>
                    <span className="text-slate-800">{currentUser.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-slate-450 block uppercase font-mono">Designation</span>
                    <span className="text-slate-800">
                      {currentUser.role === 'staff' ? 'Faculty Instructor' : (currentUser.semester || '3rd Year')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-slate-450 block uppercase font-mono">Card Issue Date</span>
                    <span className="text-slate-800 font-mono">{currentUser.cardIssueDate || '2024-08-15'}</span>
                  </div>
                </div>
              </div>

              {/* Recommended Top Rated Picks block */}
              <div className="glass p-6 rounded-3xl border border-white bg-white/70 bento-shadow space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 font-display">Recommended Top Reads</h3>
                <div className="space-y-3">
                  {recommendations.map(book => (
                    <div 
                      key={book.id} 
                      onClick={() => setSelectedBook(book)}
                      className="p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-150 transition-all cursor-pointer flex gap-3 items-center shadow-xs"
                    >
                      <img src={book.coverUrl} alt={book.title} className="w-8 h-12 rounded object-cover shadow-xs border border-slate-200" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[11px] font-bold text-slate-800 truncate leading-tight">{book.title}</h4>
                        <p className="text-[9px] text-slate-400 mt-0.5">by {book.author}</p>
                        <span className="text-[9px] font-bold text-amber-500 font-mono">★ {book.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================================= */}
      {/* 👨💼 ADMIN MANAGEMENT TERMINAL DASHBOARD */}
      {/* ========================================================================================= */}
      {currentUser.role === 'admin' && (
        <div className="space-y-6">
          
          {/* Admin Management Section Navigation Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-slate-150 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setAdminSection('stats')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer leading-none ${
                adminSection === 'stats' ? 'bg-white text-indigo-700 shadow-md border border-slate-200/50' : 'text-slate-600 hover:bg-white/40'
              }`}
            >
              <BarChart3 className="h-4 w-4 shrink-0" />
              <span>Statistics</span>
            </button>
            <button
              onClick={() => setAdminSection('requests')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer leading-none ${
                adminSection === 'requests' ? 'bg-white text-indigo-700 shadow-md border border-slate-200/50' : 'text-slate-600 hover:bg-white/40'
              }`}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span>Approve Requests</span>
            </button>
            <button
              onClick={() => setAdminSection('inventory')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer leading-none ${
                adminSection === 'inventory' ? 'bg-white text-indigo-700 shadow-md border border-slate-200/50' : 'text-slate-600 hover:bg-white/40'
              }`}
            >
              <BookOpen className="h-4 w-4 shrink-0" />
              <span>Manage Books</span>
            </button>
            <button
              onClick={() => setAdminSection('users')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer leading-none ${
                adminSection === 'users' ? 'bg-white text-indigo-700 shadow-md border border-slate-200/50' : 'text-slate-600 hover:bg-white/40'
              }`}
            >
              <Users className="h-4 w-4 shrink-0" />
              <span>Manage Accounts</span>
            </button>
            <button
              onClick={() => setAdminSection('reports')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer leading-none ${
                adminSection === 'reports' ? 'bg-white text-indigo-700 shadow-md border border-slate-200/50' : 'text-slate-600 hover:bg-white/40'
              }`}
            >
              <BookUp className="h-4 w-4 shrink-0" />
              <span>Checkout Reports</span>
            </button>
          </div>

          {/* SECTION 1: STATISTICS CORE METRICS GRID */}
          {adminSection === 'stats' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="glass p-4 rounded-2xl border border-white bg-white/70 bento-shadow">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Total Readers</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <h3 className="text-xl font-extrabold text-slate-800">{totalStudentsCount + totalStaffCount}</h3>
                    <span className="text-[8px] text-slate-400 font-mono">({totalStudentsCount}S / {totalStaffCount}F)</span>
                  </div>
                </div>

                <div className="glass p-4 rounded-2xl border border-white bg-white/70 bento-shadow">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Library Volumes</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <h3 className="text-xl font-extrabold text-slate-800">{totalBooksCount}</h3>
                    <span className="text-[8px] text-slate-400 font-mono">({adminPhysicalBooksCount}P / {adminEBooksCount}E)</span>
                  </div>
                </div>

                <div className="glass p-4 rounded-2xl border border-white bg-white/70 bento-shadow">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">On-Loan Checkouts</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <h3 className="text-xl font-extrabold text-slate-800">{adminIssuedCount} Issued</h3>
                    <span className="text-[8px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">({adminReturnedCount} Checked In)</span>
                  </div>
                </div>

                <div className="glass p-4 rounded-2xl border border-white bg-white/70 bento-shadow">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Overdue Volumes</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <h3 className="text-xl font-extrabold text-red-650">{adminOverdueCount} Books</h3>
                    <span className={`text-[8px] font-bold px-1 rounded ${adminOverdueCount > 0 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-slate-50 text-slate-450'}`}>
                      {adminOverdueCount > 0 ? 'Urgent Notices' : 'Clear'}
                    </span>
                  </div>
                </div>

                <div className="glass p-4 rounded-2xl border border-white bg-white/70 bento-shadow">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Total Fine Funds</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <h3 className="text-xl font-extrabold text-slate-800">₹{adminTotalFineCollected}</h3>
                    <span className="text-[8px] text-amber-600 font-bold bg-amber-50 px-1 rounded">₹{adminPendingFinesTotal} Pending</span>
                  </div>
                </div>
              </div>

              {/* Visual SVG analytics row & checkout station link */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Graph Card */}
                <div className="lg:col-span-2 glass p-6 rounded-3xl border border-white bg-white/70 bento-shadow space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-extrabold font-display text-slate-900">Historical Circulation Ratio</h3>
                      <p className="text-[11px] text-slate-400">Total book issues and return rates over active division programs.</p>
                    </div>
                    <span className="text-[9px] font-mono bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold py-1 px-2.5 rounded-full">Term Trends</span>
                  </div>

                  {/* SVG Line Graph */}
                  <div className="relative pt-4 h-48 w-full flex items-end justify-between" id="chart-svg">
                    <div className="absolute inset-x-0 top-0 flex flex-col justify-between h-[80%] text-[8px] font-mono font-bold text-slate-300 pointer-events-none">
                      <div className="border-b border-dashed border-slate-200/50 pb-1 w-full">150 Circulations</div>
                      <div className="border-b border-dashed border-slate-200/50 pb-1 w-full">75 Circulations</div>
                      <div className="border-b border-slate-200/50 pb-1 w-full">0 Circulations</div>
                    </div>

                    {/* SVG Line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 150" preserveAspectRatio="none">
                      {/* Gradient background fill */}
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 130 Q 100 80 200 110 T 400 40 T 500 20 L 500 150 L 0 150 Z" fill="url(#chartGrad)" />
                      <path d="M 0 130 Q 100 80 200 110 T 400 40 T 500 20" fill="none" stroke="#4f46e5" strokeWidth="2.5" />
                    </svg>

                    <div className="w-full flex justify-between text-[10px] font-mono font-bold text-slate-400 pt-1 z-10 border-t border-slate-200/60 mt-auto">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                    </div>
                  </div>
                </div>

                {/* Simulation station shortcut */}
                <div className="glass p-6 rounded-3xl border border-white bg-white/70 bento-shadow space-y-4">
                  <h3 className="text-sm font-extrabold font-display text-slate-900">Terminal Simulation</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Simulate a student scanning their ID card on a terminal right from the dashboard:</p>

                  {adminSimScanMsg && (
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 text-xs font-semibold animate-pulse">
                      {adminSimScanMsg}
                    </div>
                  )}

                  <form onSubmit={handleAdminSimScanSubmit} className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 block uppercase font-mono tracking-wider">Type User ID to scan</label>
                      <input
                        type="text"
                        required
                        value={adminSimScanId}
                        onChange={(e) => setAdminSimScanId(e.target.value)}
                        placeholder="e.g. CS-2024-4091"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer font-sans"
                    >
                      Process Simulated Scan
                    </button>
                  </form>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">Launch real camera:</span>
                    <button
                      onClick={() => setActiveView('qr-scanner')}
                      className="text-indigo-600 hover:underline font-bold"
                    >
                      Scanner Console
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 2: APPROVE BOOK REQUESTS (VIEW PENDING BOOK REQUESTS) */}
          {adminSection === 'requests' && (
            <div className="glass p-6 rounded-3xl border border-white bg-white/70 bento-shadow space-y-4 animate-fade-in">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-display">Student & Staff Book Recommendation Requests</h3>
                <p className="text-xs text-slate-500">Approve requested books to order volume copies, or reject requests with dynamic alert triggers.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold font-mono text-[9px] uppercase tracking-wider">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Requested Book Title</th>
                      <th className="py-2.5 px-3">Author</th>
                      <th className="py-2.5 px-3">Member Details</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Approve Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {bookRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400 italic">No book requests registered.</td>
                      </tr>
                    ) : (
                      bookRequests.map(req => (
                        <tr key={req.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-3 text-slate-500 font-mono">{req.requestDate}</td>
                          <td className="py-3.5 px-3 font-bold text-slate-800">{req.bookTitle}</td>
                          <td className="py-3.5 px-3 text-slate-500">{req.bookAuthor}</td>
                          <td className="py-3.5 px-3">
                            <div>
                              <p className="text-slate-800 leading-tight">{req.userName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{req.userId} ({req.userRole})</p>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase ${
                              req.status === 'approved' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                : req.status === 'rejected'
                                ? 'bg-red-50 text-red-700 border-red-100'
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            {req.status === 'pending' ? (
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => approveBookRequest(req.id)}
                                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg shadow-xs cursor-pointer transition-colors"
                                  title="Approve Book Request"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => rejectBookRequest(req.id)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg shadow-xs cursor-pointer transition-colors"
                                  title="Reject Book Request"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-mono italic">Decision Finalized</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 3: MANAGE BOOKS (ADD/EDIT/DELETE COPIES) */}
          {adminSection === 'inventory' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              
              {/* Left Form: Add/Edit Books */}
              <div className="glass p-6 rounded-3xl border border-white bg-white/70 bento-shadow space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 font-display">Add Volume to Library</h3>
                
                <form onSubmit={handleAdminAddBook} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase font-mono">Book Title</label>
                    <input
                      type="text"
                      required
                      value={newBookTitle}
                      onChange={(e) => setNewBookTitle(e.target.value)}
                      placeholder="e.g. Introduction to Quantum Computing"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase font-mono">Author Name</label>
                    <input
                      type="text"
                      required
                      value={newBookAuthor}
                      onChange={(e) => setNewBookAuthor(e.target.value)}
                      placeholder="e.g. Richard Feynman"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase font-mono">Genre / Category</label>
                    <input
                      type="text"
                      value={newBookGenre}
                      onChange={(e) => setNewBookGenre(e.target.value)}
                      placeholder="e.g. Physics"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 block uppercase font-mono">Type</label>
                      <select
                        value={newBookType}
                        onChange={(e) => setNewBookType(e.target.value as 'physical' | 'e-book')}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold cursor-pointer"
                      >
                        <option value="physical">Physical Book</option>
                        <option value="e-book">E-Book</option>
                      </select>
                    </div>

                    {newBookType === 'physical' ? (
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 block uppercase font-mono">Total Copies</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={newBookCopies}
                          onChange={(e) => setNewBookCopies(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 block uppercase font-mono">PDF URL</label>
                        <input
                          type="text"
                          value={newBookPdfUrl}
                          onChange={(e) => setNewBookPdfUrl(e.target.value)}
                          placeholder="e.g. # (Standard mock)"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer font-sans"
                  >
                    Register Volume
                  </button>
                </form>
              </div>

              {/* Right Table: Show Library Inventory & Add/Edit/Delete Books */}
              <div className="lg:col-span-2 glass p-6 rounded-3xl border border-white bg-white/70 bento-shadow space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 font-display">Show Library Inventory</h3>
                
                <div className="overflow-x-auto max-h-[440px] overflow-y-auto pr-1">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold font-mono text-[9px] uppercase tracking-wider sticky top-0 bg-white">
                        <th className="py-2 px-2">Title / Author</th>
                        <th className="py-2 px-2">Genre</th>
                        <th className="py-2 px-2 text-center">Type</th>
                        <th className="py-2 px-2 text-center">Copies</th>
                        <th className="py-2 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {books.map(b => (
                        <tr key={b.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-2">
                            <div>
                              <p className="font-bold text-slate-850 max-w-[170px] truncate">{b.title}</p>
                              <p className="text-[9px] text-slate-400 truncate max-w-[170px]">by {b.author}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-slate-500 font-medium">{b.genre}</td>
                          <td className="py-3 px-2 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                              b.type === 'ebook' ? 'bg-sky-50 text-sky-700 border border-sky-100' : 'bg-slate-50 text-slate-700 border border-slate-150'
                            }`}>
                              {b.type}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            {b.type === 'ebook' ? (
                              <span className="text-slate-400 font-mono text-[10px] italic">∞ Digital</span>
                            ) : (
                              editingBookId === b.id ? (
                                <div className="flex items-center gap-1 justify-center">
                                  <input 
                                    type="number"
                                    className="w-12 bg-white border rounded px-1 py-0.5 text-center text-xs font-mono font-bold"
                                    value={editCopiesVal}
                                    onChange={(e) => setEditCopiesVal(Number(e.target.value))}
                                  />
                                  <button onClick={() => handleSaveCopies(b)} className="p-0.5 text-emerald-650 hover:bg-slate-100 rounded">
                                    ✓
                                  </button>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1.5">
                                  <span className="font-mono text-xs font-bold text-slate-800">{b.copiesAvailable}</span>
                                  <span className="text-[10px] text-slate-400">/ {b.copiesTotal}</span>
                                  <button onClick={() => handleStartEditingCopies(b)} className="text-indigo-650 hover:underline text-[9px] font-bold cursor-pointer">
                                    Edit
                                  </button>
                                </div>
                              )
                            )}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <button
                              onClick={() => handleAdminDeleteBook(b.id)}
                              className="p-1.5 text-red-650 hover:bg-red-50 hover:text-red-800 rounded-lg transition-colors cursor-pointer"
                              title="Delete Book"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* SECTION 4: MANAGE STUDENTS & STAFF ACCOUNTS */}
          {adminSection === 'users' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              
              {/* Form to add student/staff */}
              <div className="glass p-6 rounded-3xl border border-white bg-white/70 bento-shadow space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 font-display">Create Reader Account</h3>
                
                <form onSubmit={handleAdminAddUser} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase font-mono">Role Classification</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewUserRole('student')}
                        className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                          newUserRole === 'student' ? 'bg-indigo-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        Student Account
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewUserRole('staff')}
                        className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                          newUserRole === 'staff' ? 'bg-indigo-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        Faculty Staff
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase font-mono">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="e.g. Steve Wozniak"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase font-mono">Reader Identifier ID</label>
                    <input
                      type="text"
                      required
                      value={newUserId}
                      onChange={(e) => setNewUserId(e.target.value)}
                      placeholder={newUserRole === 'staff' ? "e.g. STF-5501" : "e.g. CS-2024-4099"}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase font-mono">Department / Division</label>
                    <input
                      type="text"
                      value={newUserDept}
                      onChange={(e) => setNewUserDept(e.target.value)}
                      placeholder="e.g. Electrical Engineering"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold"
                    />
                  </div>

                  {newUserRole === 'student' && (
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 block uppercase font-mono">Semester</label>
                      <select
                        value={newUserSem}
                        onChange={(e) => setNewUserSem(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold cursor-pointer"
                      >
                        <option value="1st Semester">1st Semester (1st Year)</option>
                        <option value="2nd Semester">2nd Semester (1st Year)</option>
                        <option value="3rd Semester">3rd Semester (2nd Year)</option>
                        <option value="4th Semester">4th Semester (2nd Year)</option>
                        <option value="5th Semester">5th Semester (3rd Year)</option>
                        <option value="6th Semester">6th Semester (3rd Year)</option>
                        <option value="7th Semester">7th Semester (4th Year)</option>
                        <option value="8th Semester">8th Semester (4th Year)</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase font-mono">Email Address</label>
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="e.g. steve.woz@college.edu"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer font-sans"
                  >
                    Deploy Reader Credentials
                  </button>
                </form>
              </div>

              {/* Reader Database Table Grid */}
              <div className="lg:col-span-2 glass p-6 rounded-3xl border border-white bg-white/70 bento-shadow space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 font-display">Manage Readers & Staff Accounts</h3>
                
                <div className="overflow-x-auto max-h-[440px] overflow-y-auto pr-1">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold font-mono text-[9px] uppercase tracking-wider sticky top-0 bg-white z-10">
                        <th className="py-2 px-2">Account Owner</th>
                        <th className="py-2 px-2">ID Number</th>
                        <th className="py-2 px-2">Role</th>
                        <th className="py-2 px-2">Department</th>
                        <th className="py-2 px-2 text-right">Drop</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {usersList.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-2 flex items-center gap-2.5">
                            <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-805 truncate">{u.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                            </div>
                          </td>
                          <td className="py-3.5 px-2 font-mono text-xs text-slate-800">{u.studentId}</td>
                          <td className="py-3.5 px-2">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border ${
                              u.role === 'staff' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-slate-500">{u.department}</td>
                          <td className="py-3.5 px-2 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to permanently drop reader "${u.name}"?`)) {
                                  deleteUser(u.id);
                                }
                              }}
                              className="p-1 text-red-650 hover:bg-red-50 hover:text-red-800 rounded transition-colors cursor-pointer"
                              title="Drop Account"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* SECTION 5: VIEW STUDENT & STAFF CIRCULATION HISTORY (REPORTS & HISTORIES) */}
          {adminSection === 'reports' && (
            <div className="glass p-6 rounded-3xl border border-white bg-white/70 bento-shadow space-y-4 animate-fade-in">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-display">Student & Staff Borrow histories</h3>
                <p className="text-xs text-slate-500">Live circulation audit tracking of active book loans, extension renewals, and settled fine receipts.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold font-mono text-[9px] uppercase tracking-wider">
                      <th className="py-2.5 px-3">Borrower Details</th>
                      <th className="py-2.5 px-3">Book Title</th>
                      <th className="py-2.5 px-3">Check Out Date</th>
                      <th className="py-2.5 px-3">Due Date</th>
                      <th className="py-2.5 px-3">Fine Settle</th>
                      <th className="py-2.5 px-3 text-right">Checkout Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {checkouts.map(c => {
                      const borrower = getStudentDetails(c.studentId);
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-3">
                            <div>
                              <p className="font-bold text-slate-800">{borrower.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono capitalize">{borrower.regNo} ({borrower.role})</p>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <p className="font-bold text-slate-850 truncate max-w-xs">{c.bookTitle}</p>
                          </td>
                          <td className="py-3.5 px-3 text-slate-500 font-mono">2026-07-01</td>
                          <td className="py-3.5 px-3 text-slate-500 font-mono">{c.dueDate}</td>
                          <td className="py-3.5 px-3 font-mono text-slate-700">
                            {c.fineAmount > 0 ? (
                              <span className="text-red-650 font-bold">₹{c.fineAmount} Due</span>
                            ) : (
                              <span className="text-emerald-650">₹0 settled</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase border ${
                              c.status === 'returned' 
                                ? 'bg-slate-100 text-slate-500 border-slate-200' 
                                : c.status === 'overdue'
                                ? 'bg-red-50 text-red-650 border-red-100 animate-pulse'
                                : 'bg-blue-50 text-blue-700 border-blue-100'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* COMMON VIEW: Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 space-y-6 relative border border-slate-200 shadow-2xl animate-scale-in">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-5 right-5 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex gap-4">
              <img src={selectedBook.coverUrl} alt={selectedBook.title} className="w-24 h-36 rounded-xl object-cover shadow-md border border-slate-200 shrink-0" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <span className="px-2 py-0.5 bg-brand-50 text-brand-700 text-[8px] font-bold rounded-md uppercase border border-brand-100 font-mono">
                  {selectedBook.type}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">{selectedBook.title}</h3>
                <p className="text-xs text-slate-500">by <span className="font-semibold text-slate-700">{selectedBook.author}</span></p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-amber-500 font-bold font-mono">★ {selectedBook.rating}</span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-xs text-slate-500 font-medium font-mono">{selectedBook.genre}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-3 border-t border-slate-100 text-xs leading-relaxed text-slate-550">
              <p>
                This textbook volume provides comprehensive, peer-reviewed curriculum material suited for advanced degree studies at Athena State University, featuring extensive case studies, practice questions, and dynamic notes.
              </p>

              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 space-y-2 text-slate-700 font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[10px] uppercase font-mono">Shelf Availability</span>
                  <span>
                    {selectedBook.type === 'e-book' ? (
                      <span className="text-emerald-650">Always Online</span>
                    ) : (
                      <span>{selectedBook.copiesAvailable} copies left</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[10px] uppercase font-mono">Catalog Identifier</span>
                  <span className="font-mono">ASU-{selectedBook.id}</span>
                </div>
              </div>
            </div>

            {selectedBook.type === 'ebook' ? (
              <button
                onClick={() => {
                  alert(`Accessing Digital Copy secure stream for: "${selectedBook.title}"...`);
                  setSelectedBook(null);
                }}
                className="w-full py-3 bg-brand-650 hover:bg-brand-750 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer font-sans uppercase tracking-wider"
              >
                Access E-Book PDF copy
              </button>
            ) : (
              <button
                onClick={() => setSelectedBook(null)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer font-sans"
              >
                Close Book Details
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
