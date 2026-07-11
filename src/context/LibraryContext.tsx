/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, Checkout, User, LibraryNotification, BookRequest } from '../types';
import { INITIAL_BOOKS, INITIAL_CHECKOUTS, INITIAL_USER, INITIAL_NOTIFICATIONS } from '../data/initialData';

interface LibraryContextType {
  currentUser: User | null;
  books: Book[];
  checkouts: Checkout[];
  notifications: LibraryNotification[];
  activeView: string;
  setActiveView: (view: string) => void;
  login: (userId: string, role?: 'student' | 'staff' | 'admin') => boolean;
  loginWithQR: (qrData: string) => boolean;
  logout: () => void;
  addBook: (book: Omit<Book, 'id'>) => Book;
  editBook: (book: Book) => void;
  deleteBook: (bookId: string) => void;
  issueBook: (bookId: string, studentId: string) => { success: boolean; message: string };
  returnBook: (checkoutId: string) => { success: boolean; message: string };
  renewBook: (checkoutId: string) => { success: boolean; message: string };
  payFine: (checkoutId: string) => { success: boolean; message: string };
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  updateBookProgress: (bookId: string, progress: number) => void;
  
  // Book Requests
  bookRequests: BookRequest[];
  addBookRequest: (bookTitle: string, bookAuthor: string) => void;
  approveBookRequest: (id: string) => void;
  rejectBookRequest: (id: string) => void;

  // Manage Students and Staff
  usersList: User[];
  addUser: (userData: Omit<User, 'id'>) => User;
  editUser: (userData: User) => void;
  deleteUser: (userId: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lib_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('lib_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [checkouts, setCheckouts] = useState<Checkout[]>(() => {
    const saved = localStorage.getItem('lib_checkouts');
    const raw = saved ? JSON.parse(saved) : INITIAL_CHECKOUTS;
    return raw.map((c: any) => ({
      ...c,
      studentId: c.studentId || 'CS-2024-4091'
    }));
  });

  const [notifications, setNotifications] = useState<LibraryNotification[]>(() => {
    const saved = localStorage.getItem('lib_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [bookRequests, setBookRequests] = useState<BookRequest[]>(() => {
    const saved = localStorage.getItem('lib_book_requests');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'REQ-1',
        userId: 'CS-2024-4091',
        userName: 'Alex Mercer',
        userRole: 'student',
        bookTitle: 'Artificial Intelligence: A Modern Approach',
        bookAuthor: 'Stuart Russell, Peter Norvig',
        requestDate: '2026-07-09',
        status: 'pending'
      },
      {
        id: 'REQ-2',
        userId: 'STF-5001',
        userName: 'Prof. Alan Turing',
        userRole: 'staff',
        bookTitle: 'Compilers: Principles, Techniques, and Tools',
        bookAuthor: 'Alfred V. Aho',
        requestDate: '2026-07-10',
        status: 'approved'
      }
    ];
  });

  const [usersList, setUsersList] = useState<User[]>(() => {
    const saved = localStorage.getItem('lib_users_list');
    return saved ? JSON.parse(saved) : [
      {
        id: 'U101',
        name: 'Alex Mercer',
        email: 'alex.mercer@college.edu',
        studentId: 'CS-2024-4091',
        department: 'Computer Science & Engineering',
        semester: '6th Semester',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        qrCodeData: '',
        role: 'student',
        cardIssueDate: '2024-08-15'
      },
      {
        id: 'U102',
        name: 'Rohan Sharma',
        email: 'rohan.sharma@college.edu',
        studentId: 'MECH-2025-1002',
        department: 'Mechanical Engineering',
        semester: '4th Semester',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        qrCodeData: '',
        role: 'student',
        cardIssueDate: '2025-01-10'
      },
      {
        id: 'U103',
        name: 'Priya Patel',
        email: 'priya.patel@college.edu',
        studentId: 'ECE-2024-1003',
        department: 'Electronics & Communication',
        semester: '8th Semester',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        qrCodeData: '',
        role: 'student',
        cardIssueDate: '2024-07-22'
      },
      {
        id: 'U201',
        name: 'Prof. Alan Turing',
        email: 'alan.turing@college.edu',
        studentId: 'STF-5001',
        department: 'Computer Science',
        semester: 'Senior Lecturer',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        qrCodeData: '',
        role: 'staff',
        cardIssueDate: '2022-06-15'
      },
      {
        id: 'U202',
        name: 'Dr. Marie Curie',
        email: 'marie.curie@college.edu',
        studentId: 'STF-5002',
        department: 'Physics & Chemistry',
        semester: 'Associate Professor',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        qrCodeData: '',
        role: 'staff',
        cardIssueDate: '2021-09-01'
      }
    ];
  });

  const [activeView, setActiveView] = useState<string>(() => {
    return currentUser ? 'dashboard' : 'login';
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('lib_user', currentUser ? JSON.stringify(currentUser) : '');
    if (currentUser) {
      if (activeView === 'login') {
        setActiveView('dashboard');
      }
    } else {
      setActiveView('login');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('lib_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('lib_checkouts', JSON.stringify(checkouts));
  }, [checkouts]);

  useEffect(() => {
    localStorage.setItem('lib_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('lib_book_requests', JSON.stringify(bookRequests));
  }, [bookRequests]);

  useEffect(() => {
    localStorage.setItem('lib_users_list', JSON.stringify(usersList));
  }, [usersList]);

  const login = (userId: string, role: 'student' | 'staff' | 'admin' = 'student'): boolean => {
    if (userId.trim() === '') return false;
    
    const formattedId = userId.toUpperCase();
    
    let name = 'Alex Mercer';
    let department = 'Computer Science & Engineering';
    let semester = '6th Semester';
    let avatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

    if (role === 'admin') {
      name = 'Dr. Elizabeth Vance';
      department = 'Library Administration';
      semester = 'Staff Coordinator';
      avatarUrl = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80';
    } else {
      const found = usersList.find(u => u.studentId.toUpperCase() === formattedId && u.role === role);
      if (found) {
        name = found.name;
        department = found.department;
        semester = found.semester;
        avatarUrl = found.avatarUrl;
      } else {
        if (role === 'staff') {
          name = 'Prof. Staff Member';
          department = 'Engineering';
          semester = 'Senior Lecturer';
          avatarUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80';
        } else {
          name = 'Guest Student';
          department = 'Information Technology';
          semester = '4th Semester';
          avatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
        }
      }
    }

    const newUser: User = {
      id: `U_${role}_${formattedId}`,
      studentId: formattedId,
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
      role: role,
      department: department,
      semester: semester,
      avatarUrl: avatarUrl,
      cardIssueDate: '2024-08-15',
      qrCodeData: JSON.stringify({
        studentId: formattedId,
        regNo: formattedId,
        name: name,
        department: department,
        year: semester.includes('Semester') 
          ? (semester.includes('1st') || semester.includes('2nd') ? '1st Year' : semester.includes('3rd') || semester.includes('4th') ? '2nd Year' : semester.includes('5th') || semester.includes('6th') ? '3rd Year' : '4th Year')
          : 'Faculty Staff',
        refreshedAt: new Date().toISOString()
      })
    };
    
    setCurrentUser(newUser);
    return true;
  };

  const loginWithQR = (qrData: string): boolean => {
    if (!qrData) return false;
    
    try {
      const parsed = JSON.parse(qrData);
      const studentId = parsed.studentId || parsed.regNo || 'CS-2024-4091';
      const role = qrData.includes('STF') || qrData.toLowerCase().includes('faculty') || (parsed.year && parsed.year.includes('Faculty')) ? 'staff' : 'student';
      
      return login(studentId, role);
    } catch (e) {
      const isStaff = qrData.includes('STF') || qrData.includes('STF-') || qrData.includes('STF_');
      const isAdmin = qrData.includes('ADMIN');
      const role = isAdmin ? 'admin' : (isStaff ? 'staff' : 'student');
      const parts = qrData.split('-');
      const studentId = parts[parts.length - 1] || 'CS-2024-4091';
      return login(studentId, role);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lib_user');
  };

  const addBook = (bookData: Omit<Book, 'id'>): Book => {
    const newId = `B00${books.length + 1}`;
    const newBook: Book = {
      ...bookData,
      id: newId
    };
    
    setBooks(prev => [newBook, ...prev]);

    // Add alert notification
    const newNotif: LibraryNotification = {
      id: `N_ADD_${Date.now()}`,
      title: 'New Book Cataloged',
      message: `"${newBook.title}" by ${newBook.author} has been added to the ${newBook.category} section.`,
      date: new Date().toISOString().split('T')[0],
      type: 'success',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newBook;
  };

  const editBook = (updatedBook: Book) => {
    setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
  };

  const deleteBook = (bookId: string) => {
    setBooks(prev => prev.filter(b => b.id !== bookId));
  };

  const issueBook = (bookId: string, studentId: string): { success: boolean; message: string } => {
    const book = books.find(b => b.id === bookId);
    if (!book) {
      return { success: false, message: 'Book not found in library catalog.' };
    }

    if (book.type === 'ebook') {
      return { success: false, message: 'E-Books do not need to be physically issued. They can be read instantly!' };
    }

    if (!book.copiesAvailable || book.copiesAvailable <= 0) {
      return { success: false, message: 'All physical copies are currently checked out.' };
    }

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 14); // 14 days loan period

    const newCheckout: Checkout = {
      id: `C00${checkouts.length + 1}`,
      studentId: studentId,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      coverUrl: book.coverUrl,
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'active',
      fineAmount: 0,
      progress: 0
    };

    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return { ...b, copiesAvailable: (b.copiesAvailable || 1) - 1 };
      }
      return b;
    }));

    setCheckouts(prev => [newCheckout, ...prev]);

    const newNotif: LibraryNotification = {
      id: `N_ISS_${Date.now()}`,
      title: 'Book Issued Successfully',
      message: `"${book.title}" has been issued to user ${studentId}. Due date: ${newCheckout.dueDate}.`,
      date: today.toISOString().split('T')[0],
      type: 'success',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { success: true, message: `Successfully issued "${book.title}". Due date: ${newCheckout.dueDate}.` };
  };

  const returnBook = (checkoutId: string): { success: boolean; message: string } => {
    const checkout = checkouts.find(c => c.id === checkoutId);
    if (!checkout) {
      return { success: false, message: 'Checkout record not found.' };
    }

    if (checkout.status === 'returned') {
      return { success: false, message: 'This book has already been returned.' };
    }

    const today = new Date().toISOString().split('T')[0];

    setCheckouts(prev => prev.map(c => {
      if (c.id === checkoutId) {
        return {
          ...c,
          status: 'returned',
          returnedDate: today,
          progress: 100
        };
      }
      return c;
    }));

    setBooks(prev => prev.map(b => {
      if (b.id === checkout.bookId) {
        return {
          ...b,
          copiesAvailable: (b.copiesAvailable || 0) + 1
        };
      }
      return b;
    }));

    const newNotif: LibraryNotification = {
      id: `N_RET_${Date.now()}`,
      title: 'Book Returned',
      message: `"${checkout.bookTitle}" has been returned. Thank you!`,
      date: today,
      type: 'info',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { success: true, message: `Successfully returned "${checkout.bookTitle}".` };
  };

  const renewBook = (checkoutId: string): { success: boolean; message: string } => {
    const checkout = checkouts.find(c => c.id === checkoutId);
    if (!checkout) {
      return { success: false, message: 'Checkout record not found.' };
    }

    if (checkout.status === 'returned') {
      return { success: false, message: 'Cannot renew a returned book.' };
    }

    if (checkout.status === 'overdue') {
      return { success: false, message: 'Cannot renew an overdue book. Please clear outstanding fines first.' };
    }

    const currentDue = new Date(checkout.dueDate);
    currentDue.setDate(currentDue.getDate() + 7);
    const newDueDate = currentDue.toISOString().split('T')[0];

    setCheckouts(prev => prev.map(c => {
      if (c.id === checkoutId) {
        return {
          ...c,
          dueDate: newDueDate,
          status: 'renewed'
        };
      }
      return c;
    }));

    const newNotif: LibraryNotification = {
      id: `N_REN_${Date.now()}`,
      title: 'Due Date Extended',
      message: `The loan period for "${checkout.bookTitle}" has been extended to ${newDueDate}.`,
      date: new Date().toISOString().split('T')[0],
      type: 'success',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { success: true, message: `Loan period extended to ${newDueDate}.` };
  };

  const payFine = (checkoutId: string): { success: boolean; message: string } => {
    const checkout = checkouts.find(c => c.id === checkoutId);
    if (!checkout) {
      return { success: false, message: 'Record not found.' };
    }

    if (checkout.fineAmount <= 0) {
      return { success: false, message: 'No pending fines for this book.' };
    }

    setCheckouts(prev => prev.map(c => {
      if (c.id === checkoutId) {
        return {
          ...c,
          fineAmount: 0,
          status: c.status === 'overdue' ? 'active' : c.status
        };
      }
      return c;
    }));

    const newNotif: LibraryNotification = {
      id: `N_PAY_${Date.now()}`,
      title: 'Fine Paid Successfully',
      message: `Fines of ₹${checkout.fineAmount} for "${checkout.bookTitle}" have been fully settled.`,
      date: new Date().toISOString().split('T')[0],
      type: 'success',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { success: true, message: `Fine of ₹${checkout.fineAmount} settled successfully.` };
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateBookProgress = (bookId: string, progress: number) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return { ...b, readProgress: progress };
      }
      return b;
    }));

    setCheckouts(prev => prev.map(c => {
      if (c.bookId === bookId && c.status !== 'returned') {
        return { ...c, progress: progress };
      }
      return c;
    }));
  };

  // Book Requests
  const addBookRequest = (bookTitle: string, bookAuthor: string) => {
    if (!currentUser) return;
    const newReq: BookRequest = {
      id: `REQ-${Date.now()}`,
      userId: currentUser.studentId,
      userName: currentUser.name,
      userRole: currentUser.role === 'staff' ? 'staff' : 'student',
      bookTitle,
      bookAuthor,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setBookRequests(prev => [newReq, ...prev]);

    const newNotif: LibraryNotification = {
      id: `N_REQ_${Date.now()}`,
      title: 'New Book Requested',
      message: `"${bookTitle}" has been requested by ${currentUser.name} (${currentUser.role}).`,
      date: new Date().toISOString().split('T')[0],
      type: 'info',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const approveBookRequest = (id: string) => {
    setBookRequests(prev => prev.map(req => {
      if (req.id === id) {
        const userNotif: LibraryNotification = {
          id: `N_REQA_${Date.now()}`,
          title: 'Book Request Approved',
          message: `Your request for "${req.bookTitle}" has been approved by the Administrator.`,
          date: new Date().toISOString().split('T')[0],
          type: 'success',
          read: false
        };
        setNotifications(prevNotifs => [userNotif, ...prevNotifs]);
        return { ...req, status: 'approved' };
      }
      return req;
    }));
  };

  const rejectBookRequest = (id: string) => {
    setBookRequests(prev => prev.map(req => {
      if (req.id === id) {
        const userNotif: LibraryNotification = {
          id: `N_REQR_${Date.now()}`,
          title: 'Book Request Rejected',
          message: `Your request for "${req.bookTitle}" was not approved by the Administrator.`,
          date: new Date().toISOString().split('T')[0],
          type: 'alert',
          read: false
        };
        setNotifications(prevNotifs => [userNotif, ...prevNotifs]);
        return { ...req, status: 'rejected' };
      }
      return req;
    }));
  };

  // Manage students & staff
  const addUser = (userData: Omit<User, 'id'>): User => {
    const newId = `U${Date.now()}`;
    const newUser: User = {
      ...userData,
      id: newId,
      qrCodeData: JSON.stringify({
        studentId: userData.studentId,
        regNo: userData.studentId,
        name: userData.name,
        department: userData.department,
        year: userData.semester,
        refreshedAt: new Date().toISOString()
      })
    };
    setUsersList(prev => [newUser, ...prev]);
    return newUser;
  };

  const editUser = (updatedUser: User) => {
    setUsersList(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const deleteUser = (userId: string) => {
    setUsersList(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <LibraryContext.Provider value={{
      currentUser,
      books,
      checkouts,
      notifications,
      activeView,
      setActiveView,
      login,
      loginWithQR,
      logout,
      addBook,
      editBook,
      deleteBook,
      issueBook,
      returnBook,
      renewBook,
      payFine,
      markNotificationRead,
      clearAllNotifications,
      updateBookProgress,
      bookRequests,
      addBookRequest,
      approveBookRequest,
      rejectBookRequest,
      usersList,
      addUser,
      editUser,
      deleteUser
    }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
