/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  type: 'physical' | 'ebook';
  coverUrl: string;
  description: string;
  publisher: string;
  publishYear: number;
  pages: number;
  rating: number;
  // Physical-specific
  copiesTotal?: number;
  copiesAvailable?: number;
  shelfLocation?: string;
  // Ebook-specific
  downloadUrl?: string;
  fileSize?: string;
  readProgress?: number; // percentage read
}

export interface Checkout {
  id: string;
  studentId?: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  coverUrl: string;
  issueDate: string;
  dueDate: string;
  returnedDate?: string;
  status: 'active' | 'renewed' | 'returned' | 'overdue';
  fineAmount: number;
  progress: number; // reading progress 0-100
}

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  semester: string;
  avatarUrl: string;
  qrCodeData: string;
  role: 'student' | 'admin';
  cardIssueDate: string;
}

export interface LibraryNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'alert' | 'info' | 'success' | 'fine';
  read: boolean;
}

export interface LibraryStats {
  totalBooks: number;
  physicalBooks: number;
  ebooks: number;
  activeCheckouts: number;
  overdueBooks: number;
  totalFines: number;
}
