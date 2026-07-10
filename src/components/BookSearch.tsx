/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book } from '../types';
import { BOOK_CATEGORIES } from '../data/initialData';
import { 
  Search, 
  BookOpen, 
  Library, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Download, 
  BookOpenCheck, 
  Star, 
  X,
  FileText,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const BookSearch: React.FC = () => {
  const { books, currentUser, issueBook } = useLibrary();
  
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState<'all' | 'physical' | 'ebook'>('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  // Reader Mock states
  const [isReading, setIsReading] = useState(false);
  const [activeChapter, setActiveChapter] = useState(1);
  const [issueSuccessMsg, setIssueSuccessMsg] = useState('');
  const [issueErrorMsg, setIssueErrorMsg] = useState('');

  // Filtering Logic
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
      
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesType = selectedType === 'all' || book.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleIssueRequest = (bookId: string) => {
    if (!currentUser) return;
    setIssueSuccessMsg('');
    setIssueErrorMsg('');

    const res = issueBook(bookId, currentUser.studentId);
    if (res.success) {
      setIssueSuccessMsg(res.message);
      // Update local copies count in selectedBook display
      if (selectedBook) {
        setSelectedBook(prev => prev ? {
          ...prev,
          copiesAvailable: Math.max(0, (prev.copiesAvailable || 1) - 1)
        } : null);
      }
    } else {
      setIssueErrorMsg(res.message);
    }
  };

  const mockChapters = [
    { num: 1, title: "Introduction & Foundations", text: "Welcome to Chapter 1. This text serves as a digital preview of our educational catalog. In this section, we analyze the conceptual frameworks and fundamental models. Knowledge is structured through a series of logical progressions..." },
    { num: 2, title: "Core Methodologies", text: "Chapter 2 covers the structural methodologies in depth. Here, we outline the primary paradigms, testing approaches, and historical patterns that define standard field procedures. Practitioners must understand the variables..." },
    { num: 3, title: "Advanced Applications", text: "Chapter 3 delves into specialized topics. By inspecting complex schemas, algorithmic architectures, and case studies, students acquire the precise technical acumen required for modern industrial applications..." }
  ];

  return (
    <div className="space-y-6" id="book-search-view">
      {/* Search Header Banner */}
      <div className="glass bento-shadow rounded-3xl p-6 border border-white/20 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Academic Catalog</h2>
          <p className="text-xs text-slate-500">Search through physical library books and instant-access electronic volumes.</p>
        </div>

        {/* Inputs row */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Text input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-450" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, author, or ISBN..."
              className="w-full bg-white/50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-semibold placeholder-slate-400 text-slate-800"
              id="catalog-search-input"
            />
          </div>

          {/* Type filters */}
          <div className="flex gap-1 bg-slate-200/50 backdrop-blur-md p-1 rounded-xl self-start md:self-auto shrink-0 border border-white/10">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedType === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setSelectedType('physical')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedType === 'physical' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Physical
            </button>
            <button
              onClick={() => setSelectedType('ebook')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedType === 'ebook' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              E-Books
            </button>
          </div>
        </div>

        {/* Categories Horizontal Scrollbar */}
        <div className="flex gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-thin">
          {BOOK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white border-blue-600 shadow-sm shadow-blue-100'
                  : 'bg-white/60 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Results Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="catalog-grid">
          {filteredBooks.map((book) => (
            <div 
              key={book.id}
              onClick={() => { setSelectedBook(book); setIsReading(false); setIssueSuccessMsg(''); setIssueErrorMsg(''); }}
              className="glass bento-shadow hover-perspectives hover-3d flex flex-col h-full rounded-3xl border border-white/20 overflow-hidden cursor-pointer hover:border-blue-400/50 hover:shadow-xl transition-all duration-300"
            >
              {/* Cover Art Wrapper */}
              <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden group">
                <img 
                  src={book.coverUrl} 
                  alt={book.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                {/* Book Type indicator banner */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/35 shadow-sm">
                  {book.type === 'ebook' ? (
                    <>
                      <BookOpen className="h-3 w-3 text-blue-600" />
                      <span className="text-[10px] font-bold text-slate-700 uppercase">E-Book</span>
                    </>
                  ) : (
                    <>
                      <Library className="h-3 w-3 text-indigo-600" />
                      <span className="text-[10px] font-bold text-slate-700 uppercase">Physical</span>
                    </>
                  )}
                </div>

                {/* Rating flag */}
                <div className="absolute top-3 right-3 flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-sm">
                  ★ {book.rating}
                </div>
              </div>

              {/* Text metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-blue-700 bg-blue-50/50 px-2 py-0.5 rounded-md uppercase font-mono border border-blue-100/20">{book.category}</span>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mt-1.5 leading-tight font-display">{book.title}</h3>
                  <p className="text-xs text-slate-450 mt-1">by {book.author}</p>
                </div>

                {/* Footer status / Action trigger */}
                <div className="border-t border-slate-200/40 mt-4 pt-3 flex items-center justify-between">
                  {book.type === 'ebook' ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50/50 px-2 py-0.5 rounded-md border border-emerald-100/20 font-mono">
                      Instant Read
                    </span>
                  ) : book.copiesAvailable && book.copiesAvailable > 0 ? (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50/50 px-2 py-0.5 rounded-md border border-blue-100/20 font-mono">
                      {book.copiesAvailable} Available
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-700 bg-red-50/50 px-2 py-0.5 rounded-md border border-red-100/20 font-mono">
                      Checked Out
                    </span>
                  )}

                  <span className="text-xs font-bold text-slate-400 hover:text-blue-600 group flex items-center gap-1 transition-colors">
                    Details <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass bento-shadow border border-white/20 rounded-3xl">
          <Search className="h-12 w-12 text-slate-350 mx-auto mb-3" />
          <p className="text-lg font-bold text-slate-600 font-display">No matching volumes found</p>
          <p className="text-xs text-slate-450 mt-1.5 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or changing the format filters.
          </p>
        </div>
      )}

      {/* Book Detail Modal Sheet (Immersive Experience) */}
      {selectedBook && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass bento-shadow border border-white/35 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-200/50 flex justify-between items-center bg-white/40">
              <span className="text-xs font-bold text-blue-700 bg-blue-50/50 px-2.5 py-0.5 rounded-md uppercase tracking-widest font-mono border border-blue-100/20">
                {selectedBook.type === 'ebook' ? 'E-Book Details Panel' : 'Physical Library Copy'}
              </span>
              <button 
                onClick={() => { setSelectedBook(null); setIsReading(false); }}
                className="p-1.5 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors cursor-pointer"
                id="close-book-details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Scroll */}
            <div className="p-6 overflow-y-auto flex-1 bg-white/10">
              {!isReading ? (
                /* Primary details sheet layout */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Cover art */}
                  <div className="md:col-span-1 space-y-4">
                    <img 
                      src={selectedBook.coverUrl} 
                      alt={selectedBook.title} 
                      className="w-full aspect-[3/4] object-cover rounded-2xl shadow-md border border-slate-200" 
                    />
                    
                    {/* Status Box */}
                    <div className="p-4.5 rounded-2xl border border-slate-200/30 bg-white/50 space-y-2.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Status & Mapping</div>
                      
                      {selectedBook.type === 'ebook' ? (
                        <div className="flex items-center gap-2 text-emerald-750 font-bold text-xs">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span>E-Book (Unlimited access)</span>
                        </div>
                      ) : selectedBook.copiesAvailable && selectedBook.copiesAvailable > 0 ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-blue-750 font-bold text-xs">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span>In Stock ({selectedBook.copiesAvailable} copy available)</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-550 border-t border-slate-200/40 pt-2">
                            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                            <span>Shelf: <span className="font-bold text-slate-700">{selectedBook.shelfLocation}</span></span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-red-750 font-bold text-xs">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span>Out of Stock (Issued)</span>
                          </div>
                          <p className="text-[10px] text-slate-400">Estimated return restock queue: 4 days.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right 2 columns: Complete metadata */}
                  <div className="md:col-span-2 space-y-5">
                    <div>
                      <span className="text-[9px] font-bold text-blue-750 bg-blue-55/10 px-2 py-0.5 rounded-md uppercase font-mono border border-blue-200/20">{selectedBook.category}</span>
                      <h3 className="text-2xl font-extrabold text-slate-800 mt-1.5 leading-tight font-display">{selectedBook.title}</h3>
                      <p className="text-sm font-semibold text-slate-550 mt-1">Written by <span className="text-slate-800">{selectedBook.author}</span></p>
                      
                      <div className="flex items-center gap-4 mt-3.5">
                        <div className="flex items-center gap-1">
                          <Star className="h-4.5 w-4.5 fill-amber-450 text-amber-450" />
                          <span className="text-xs font-bold text-slate-700">{selectedBook.rating} / 5.0</span>
                        </div>
                        <span className="h-4 w-px bg-slate-200/50"></span>
                        <span className="text-xs font-bold text-slate-400 font-mono">ISBN: {selectedBook.isbn}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 border-t border-b border-slate-200/50 py-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Description / Summary</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{selectedBook.description}</p>
                    </div>

                    {/* Book Metadata parameters list */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs border-b border-slate-200/40 pb-4">
                      <div>
                        <span className="text-slate-400 font-medium">Publisher</span>
                        <div className="font-bold text-slate-700 mt-0.5">{selectedBook.publisher}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Publish Year</span>
                        <div className="font-bold text-slate-700 mt-0.5">{selectedBook.publishYear}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Page Count</span>
                        <div className="font-bold text-slate-700 mt-0.5">{selectedBook.pages} pages</div>
                      </div>
                      {selectedBook.type === 'ebook' && selectedBook.fileSize && (
                        <div>
                          <span className="text-slate-400 font-medium">File Size</span>
                          <div className="font-bold text-slate-700 mt-0.5">{selectedBook.fileSize}</div>
                        </div>
                      )}
                    </div>

                    {/* Actions Panel */}
                    <div className="pt-2 space-y-3">
                      {/* Interactive alert responses */}
                      {issueSuccessMsg && (
                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                          <CheckCircle className="h-4.5 w-4.5 shrink-0" />
                          <span>{issueSuccessMsg}</span>
                        </div>
                      )}
                      {issueErrorMsg && (
                        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                          <XCircle className="h-4.5 w-4.5 shrink-0" />
                          <span>{issueErrorMsg}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3">
                        {selectedBook.type === 'ebook' ? (
                          <>
                            <button
                              onClick={() => setIsReading(true)}
                              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-750 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
                              id="read-ebook-btn"
                            >
                              <BookOpenCheck className="h-4.5 w-4.5" />
                              Open Interactive Reader
                            </button>
                            <a
                              href={selectedBook.downloadUrl}
                              className="px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer hover:bg-slate-50"
                            >
                              <Download className="h-4.5 w-4.5" />
                              Download EPUB
                            </a>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleIssueRequest(selectedBook.id)}
                              disabled={!selectedBook.copiesAvailable || selectedBook.copiesAvailable <= 0}
                              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-750 disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
                              id="issue-physical-btn"
                            >
                              <UserCheck className="h-4.5 w-4.5" />
                              Request Self Checkout
                            </button>
                            
                            <button 
                              className="p-3 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
                              title="Bookmark for Later"
                            >
                              <Bookmark className="h-4.5 w-4.5" />
                            </button>
                            <button 
                              className="p-3 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
                              title="Share Reference"
                            >
                              <Share2 className="h-4.5 w-4.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Interactive E-Book Mock Reader View */
                <div className="space-y-4" id="ebook-reader">
                  {/* Reader Nav header */}
                  <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex justify-between items-center">
                    <button
                      onClick={() => setIsReading(false)}
                      className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" /> Exit Reader
                    </button>
                    <div className="text-center font-display">
                      <div className="text-xs font-bold text-blue-300 uppercase tracking-widest font-mono">EPUB ACTIVE PREVIEW</div>
                      <div className="text-[10px] text-slate-400 font-bold truncate max-w-[200px] sm:max-w-xs">{selectedBook.title}</div>
                    </div>
                    <span className="text-xs font-bold font-mono text-blue-350">Chapter {activeChapter} of 3</span>
                  </div>

                  {/* Active Page Sheet simulating book pages */}
                  <div className="border border-amber-900/10 rounded-2xl p-8 bg-amber-50/25 font-serif text-slate-800 shadow-inner min-h-[250px] relative">
                    <h3 className="text-lg font-bold border-b border-amber-950/10 pb-2 mb-4 font-display text-slate-900">
                      Chapter {activeChapter}: {mockChapters[activeChapter - 1].title}
                    </h3>
                    <p className="text-sm leading-relaxed tracking-wide text-slate-750 indent-8 font-medium">
                      {mockChapters[activeChapter - 1].text}
                    </p>
                    <p className="text-sm leading-relaxed tracking-wide text-slate-750 mt-4 indent-8 font-medium">
                      The core objectives are clear. This campus database provides access to reference materials for valid research. Under the Athena state library regulations, students must maintain diligent study schedules and avoid arbitrary content modifications...
                    </p>
                  </div>

                  {/* Reader Control Footers */}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      disabled={activeChapter <= 1}
                      onClick={() => setActiveChapter(prev => Math.max(1, prev - 1))}
                      className="px-4 py-2 bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous Chapter
                    </button>
                    
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">
                      Athena Digital E-Library Reader
                    </span>

                    <button
                      disabled={activeChapter >= 3}
                      onClick={() => setActiveChapter(prev => Math.min(3, prev + 1))}
                      className="px-4 py-2 bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      Next Chapter <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
