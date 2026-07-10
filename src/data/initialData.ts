/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book, Checkout, User, LibraryNotification } from '../types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'B001',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '978-0262033848',
    category: 'Computer Science',
    type: 'physical',
    coverUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=300&q=80',
    description: 'A comprehensive guide to the modern study of computer algorithms. It covers a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers.',
    publisher: 'MIT Press',
    publishYear: 2009,
    pages: 1292,
    rating: 4.8,
    copiesTotal: 5,
    copiesAvailable: 3,
    shelfLocation: 'Rack 4, Shelf A'
  },
  {
    id: 'B002',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Computer Science',
    type: 'ebook',
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80',
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.',
    publisher: 'Prentice Hall',
    publishYear: 2008,
    pages: 464,
    rating: 4.9,
    fileSize: '12.4 MB',
    downloadUrl: '#ebook-clean-code',
    readProgress: 45
  },
  {
    id: 'B003',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm',
    isbn: '978-0201633610',
    category: 'Computer Science',
    type: 'physical',
    coverUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=300&q=80',
    description: 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.',
    publisher: 'Addison-Wesley',
    publishYear: 1994,
    pages: 395,
    rating: 4.7,
    copiesTotal: 3,
    copiesAvailable: 0,
    shelfLocation: 'Rack 4, Shelf B'
  },
  {
    id: 'B004',
    title: 'Principles of Mathematical Analysis',
    author: 'Walter Rudin',
    isbn: '978-0070542334',
    category: 'Mathematics',
    type: 'physical',
    coverUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80',
    description: 'The third edition of this classic text has been designed to provide a solid foundation in mathematical analysis for students of mathematics, physics, and engineering.',
    publisher: 'McGraw-Hill',
    publishYear: 1976,
    pages: 342,
    rating: 4.6,
    copiesTotal: 4,
    copiesAvailable: 2,
    shelfLocation: 'Rack 2, Shelf D'
  },
  {
    id: 'B005',
    title: 'Fundamentals of Physics',
    author: 'David Halliday',
    isbn: '978-1118230718',
    category: 'Physics',
    type: 'physical',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80',
    description: 'This book arms engineers with the tools to apply key physics concepts in the field. A number of the key figures in the new edition are revised to provide a more inviting and informative treatment.',
    publisher: 'Wiley',
    publishYear: 2013,
    pages: 1152,
    rating: 4.5,
    copiesTotal: 6,
    copiesAvailable: 4,
    shelfLocation: 'Rack 1, Shelf C'
  },
  {
    id: 'B006',
    title: 'Zero to One: Notes on Startups',
    author: 'Peter Thiel',
    isbn: '978-0804139298',
    category: 'Business & Economics',
    type: 'ebook',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
    description: 'The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create. In Zero to One, legendary entrepreneur and investor Peter Thiel shows how we can find singular ways to create those new things.',
    publisher: 'Crown Business',
    publishYear: 2014,
    pages: 224,
    rating: 4.7,
    fileSize: '4.8 MB',
    downloadUrl: '#ebook-zero-to-one',
    readProgress: 80
  },
  {
    id: 'B007',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt, David Thomas',
    isbn: '978-0135957059',
    category: 'Computer Science',
    type: 'ebook',
    coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&q=80',
    description: 'The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process—taking a requirement and producing working, maintainable code.',
    publisher: 'Addison-Wesley',
    publishYear: 2019,
    pages: 352,
    rating: 4.9,
    fileSize: '8.2 MB',
    downloadUrl: '#ebook-pragmatic',
    readProgress: 15
  },
  {
    id: 'B008',
    title: 'Quantum Mechanics and Path Integrals',
    author: 'Richard P. Feynman',
    isbn: '978-0486477220',
    category: 'Physics',
    type: 'physical',
    coverUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80',
    description: 'This classical text explores the Feynman path-integral formulation of quantum mechanics. It provides students of modern physics with an insightful description of quantum dynamics.',
    publisher: 'Dover Publications',
    publishYear: 2010,
    pages: 384,
    rating: 4.8,
    copiesTotal: 2,
    copiesAvailable: 1,
    shelfLocation: 'Rack 1, Shelf F'
  }
];

export const INITIAL_CHECKOUTS: Checkout[] = [
  {
    id: 'C001',
    bookId: 'B001',
    bookTitle: 'Introduction to Algorithms',
    bookAuthor: 'Thomas H. Cormen',
    coverUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=300&q=80',
    issueDate: '2026-06-25',
    dueDate: '2026-07-10', // Due tomorrow
    status: 'active',
    fineAmount: 0,
    progress: 35
  },
  {
    id: 'C002',
    bookId: 'B003',
    bookTitle: 'Design Patterns',
    bookAuthor: 'Erich Gamma, Richard Helm',
    coverUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=300&q=80',
    issueDate: '2026-06-10',
    dueDate: '2026-06-25', // Overdue
    status: 'overdue',
    fineAmount: 140, // 14 days late * ₹10/day
    progress: 85
  },
  {
    id: 'C003',
    bookId: 'B005',
    bookTitle: 'Fundamentals of Physics',
    bookAuthor: 'David Halliday',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80',
    issueDate: '2026-05-01',
    dueDate: '2026-05-15',
    returnedDate: '2026-05-14',
    status: 'returned',
    fineAmount: 0,
    progress: 100
  }
];

export const INITIAL_USER: User = {
  id: 'U101',
  name: 'Alex Mercer',
  email: 'alex.mercer@college.edu',
  studentId: 'CS-2024-4091',
  department: 'Computer Science & Engineering',
  semester: '6th Semester',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  qrCodeData: 'STU-ALEX-MERCER-CS20244091',
  role: 'student',
  cardIssueDate: '2024-08-15'
};

export const INITIAL_NOTIFICATIONS: LibraryNotification[] = [
  {
    id: 'N001',
    title: 'Book Overdue Alert',
    message: 'The book "Design Patterns" is 14 days overdue. Please return it to avoid accumulating further fines.',
    date: '2026-07-08',
    type: 'alert',
    read: false
  },
  {
    id: 'N002',
    title: 'Due Date Approaching',
    message: '"Introduction to Algorithms" is due tomorrow. You can renew it once if needed.',
    date: '2026-07-08',
    type: 'info',
    read: false
  },
  {
    id: 'N003',
    title: 'New Ebook Available',
    message: '"The Pragmatic Programmer (20th Anniversary Edition)" is now available in the E-Library.',
    date: '2026-07-05',
    type: 'success',
    read: true
  },
  {
    id: 'N004',
    title: 'Library Timing Extended',
    message: 'Good news! Library study rooms will remain open until 10:00 PM during the final examinations.',
    date: '2026-07-01',
    type: 'info',
    read: true
  }
];

export const BOOK_CATEGORIES = [
  'All',
  'Computer Science',
  'Mathematics',
  'Physics',
  'Business & Economics',
  'Literature',
  'Chemistry',
  'Reference'
];
