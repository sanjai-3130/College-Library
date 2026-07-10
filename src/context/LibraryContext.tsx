/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, Checkout, User, LibraryNotification } from '../types';
import { INITIAL_BOOKS, INITIAL_CHECKOUTS, INITIAL_USER, INITIAL_NOTIFICATIONS } from '../data/initialData';

interface LibraryContextType {
  currentUser: User | null;
  books: Book[];
  checkouts: Checkout[];
  notifications: LibraryNotification[];
  activeView: string;
  setActiveView: (view: string) => void;
  login: (studentId: string, role?: 'student' | 'admin') => boolean;
  loginWithQR: (qrData: string) => boolean;
  logout: () => void;
  addBook: (book: Omit<Book, 'id'>) => Book;
  issueBook: (bookId: string, studentId: string) => { success: boolean; message: string };
  returnBook: (checkoutId: string) => { success: boolean; message: string };
  renewBook: (checkoutId: string) => { success: boolean; message: string };
  payFine: (checkoutId: string) => { success: boolean; message: string };
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  updateBookProgress: (bookId: string, progress: number) => void;
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

  const login = (studentId: string, role: 'student' | 'admin' = 'student'): boolean => {
    // Normal user login simulation
    if (studentId.trim() === '') return false;
    
    const formattedId = studentId.toUpperCase();
    
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
      if (formattedId.includes('MECH') || formattedId.includes('1002')) {
        name = 'Rohan Sharma';
        department = 'Mechanical Engineering';
        semester = '4th Semester';
        avatarUrl = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80';
      } else if (formattedId.includes('ECE') || formattedId.includes('1003')) {
        name = 'Priya Patel';
        department = 'Electronics & Communication';
        semester = '8th Semester';
        avatarUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80';
      }
    }

    const newUser: User = {
      ...INITIAL_USER,
      studentId: formattedId,
      name: name,
      role: role,
      department: department,
      semester: semester,
      avatarUrl: avatarUrl,
      qrCodeData: JSON.stringify({
        studentId: `STU-${formattedId}`,
        regNo: formattedId,
        name: name,
        dept: department,
        year: semester === '4th Semester' ? '2nd Year' : semester === '8th Semester' ? '4th Year' : '3rd Year',
        timestamp: Date.now()
      })
    };
    
    setCurrentUser(newUser);
    return true;
  };

  const loginWithQR = (qrData: string): boolean => {
    if (!qrData) return false;
    
    // Simulate login based on scanned student card QR code
    // Example QR data: "STU-ALEX-MERCER-CS20244091" or "STU-ADMIN-CS-ADMIN-001"
    const isAdmin = qrData.includes('ADMIN');
    const parts = qrData.split('-');
    const studentId = parts[parts.length - 1] || 'CS-2024-4091';
    
    const newUser: User = {
      ...INITIAL_USER,
      studentId: studentId,
      name: isAdmin ? 'Dr. Elizabeth Vance' : 'Alex Mercer',
      role: isAdmin ? 'admin' : 'student',
      department: isAdmin ? 'Library Administration' : 'Computer Science & Engineering',
      qrCodeData: qrData
    };
    
    setCurrentUser(newUser);
    
    // Add login notification
    const newNotif: LibraryNotification = {
      id: `N_IN_${Date.now()}`,
      title: 'Login Successful',
      message: `Successfully authenticated via Digital Student Card QR Code. Welcome back, ${newUser.name}!`,
      date: new Date().toISOString().split('T')[0],
      type: 'success',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    
    return true;
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

    // Check if student already has this book issued
    const alreadyIssued = checkouts.some(c => c.bookId === bookId && c.status !== 'returned' && c.status !== 'overdue' && c.id !== 'fake'); // skip finished checkouts
    const activeCheckoutsForBook = checkouts.filter(c => c.bookId === bookId && (c.status === 'active' || c.status === 'overdue' || c.status === 'renewed'));
    
    if (activeCheckoutsForBook.length > 0) {
      // Allow multi checkouts for simulation if they want, but let's warn or prevent duplicate checkout of same book for same user
    }

    // Issue Book
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

    // Update copies
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return { ...b, copiesAvailable: (b.copiesAvailable || 1) - 1 };
      }
      return b;
    }));

    setCheckouts(prev => [newCheckout, ...prev]);

    // Notification
    const newNotif: LibraryNotification = {
      id: `N_ISS_${Date.now()}`,
      title: 'Book Issued Successfully',
      message: `"${book.title}" has been issued to student ${studentId}. Due date: ${newCheckout.dueDate}.`,
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

    // Update checkout
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

    // Return copy to available shelf
    setBooks(prev => prev.map(b => {
      if (b.id === checkout.bookId) {
        return {
          ...b,
          copiesAvailable: (b.copiesAvailable || 0) + 1
        };
      }
      return b;
    }));

    // Notification
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

    // Extend due date by 7 days
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

    // Notification
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
          status: c.status === 'overdue' ? 'active' : c.status // revert status if still active
        };
      }
      return c;
    }));

    // Notification
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
    // For e-books progress
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return { ...b, readProgress: progress };
      }
      return b;
    }));

    // If it is also an active checkout
    setCheckouts(prev => prev.map(c => {
      if (c.bookId === bookId && c.status !== 'returned') {
        return { ...c, progress: progress };
      }
      return c;
    }));
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
      issueBook,
      returnBook,
      renewBook,
      payFine,
      markNotificationRead,
      clearAllNotifications,
      updateBookProgress
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
