/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BOOK_CATEGORIES } from '../data/initialData';
import { 
  PlusCircle, 
  BookOpen, 
  MapPin, 
  FileText, 
  Hash, 
  Calendar, 
  FileCode, 
  CheckCircle, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const COVER_PRESETS = [
  { name: 'Red Abstract Academic', url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=300&q=80' },
  { name: 'Dark Tech Coding', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80' },
  { name: 'Modern Engineering Wire', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=300&q=80' },
  { name: 'Gold/Black Math Graphic', url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80' },
  { name: 'Blue Cybernetic Net', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80' },
  { name: 'Warm Lit Library Spine', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80' }
];

export const BookEntryForm: React.FC = () => {
  const { addBook } = useLibrary();

  // Form Fields State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [description, setDescription] = useState('');
  const [publisher, setPublisher] = useState('');
  const [publishYear, setPublishYear] = useState(2026);
  const [pages, setPages] = useState(350);
  const [copiesTotal, setCopiesTotal] = useState(3);
  const [rack, setRack] = useState('Rack 4');
  const [shelf, setShelf] = useState('Shelf A');
  const [coverUrl, setCoverUrl] = useState(COVER_PRESETS[0].url);
  const [customCover, setCustomCover] = useState('');

  // Alerts states
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!title.trim() || !author.trim() || !isbn.trim()) {
      setError('Please fill in all mandatory fields: Title, Author, and ISBN.');
      return;
    }

    const finalCover = customCover.trim() !== '' ? customCover.trim() : coverUrl;

    const newBookData = {
      title,
      author,
      isbn,
      category,
      type: 'physical' as const,
      coverUrl: finalCover,
      description: description.trim() !== '' ? description : 'An academic reference volume registered under campus directives.',
      publisher: publisher.trim() !== '' ? publisher : 'Athena Academic Publishing',
      publishYear: Number(publishYear),
      pages: Number(pages),
      rating: 4.5,
      copiesTotal: Number(copiesTotal),
      copiesAvailable: Number(copiesTotal),
      shelfLocation: `${rack}, ${shelf}`
    };

    const addedBook = addBook(newBookData);
    setSuccess(`Successfully cataloged "${addedBook.title}" in the database! Shelved at ${addedBook.shelfLocation}.`);

    // Reset Form Fields
    setTitle('');
    setAuthor('');
    setIsbn('');
    setDescription('');
    setPublisher('');
    setCustomCover('');
  };

  return (
    <div className="space-y-6" id="book-entry-view">
      {/* View Header */}
      <div className="glass bento-shadow rounded-3xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-slate-900 font-display">Physical Book Entry Form</h2>
        <p className="text-xs text-slate-500">Library Staff Console: Input metadata, catalog identifiers, and configure spatial shelf placements.</p>
      </div>

      {/* Response alert messages */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Entry Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Cover preview & cover preset selector */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-slate-450 uppercase tracking-widest font-mono">Catalog Cover Design</h3>
          
          <div className="glass bento-shadow rounded-3xl p-6 border border-white/20 flex flex-col items-center">
            {/* Live mockup frame */}
            <div className="w-full max-w-[180px] aspect-[3/4] bg-slate-50 border rounded-xl overflow-hidden shadow-md relative group mb-4">
              <img 
                src={customCover.trim() !== '' ? customCover : coverUrl} 
                alt="Catalog preview cover" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-[10px] font-bold">LIVE COVER</span>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="w-full space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Choose Library Preset Art:</label>
              <div className="grid grid-cols-3 gap-2">
                {COVER_PRESETS.map((preset, index) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => { setCoverUrl(preset.url); setCustomCover(''); }}
                    className={`aspect-square rounded-lg overflow-hidden border-2 relative transition-all cursor-pointer ${
                      coverUrl === preset.url && customCover === '' 
                        ? 'border-blue-600 scale-95 shadow-md shadow-blue-100' 
                        : 'border-transparent hover:border-slate-300'
                    }`}
                    title={preset.name}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-slate-950/80 backdrop-blur-sm text-white text-[7px] px-1 py-0.5 rounded font-bold font-mono">
                      #{index + 1}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Cover Art input field */}
              <div className="pt-3 border-t border-slate-200/40">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 mb-2">Or paste custom image link:</label>
                <input 
                  type="url" 
                  value={customCover}
                  onChange={(e) => setCustomCover(e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full bg-white/50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Metadata fields */}
        <div className="lg:col-span-2">
          <div className="glass bento-shadow rounded-3xl p-6 border border-white/20">
            <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-200/40 pb-3 font-display">General Volume Information</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">Book Title *</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-450" />
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Quantum Physics Foundations"
                      className="w-full bg-white/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                </div>

                {/* Author */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">Primary Author *</label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-450" />
                    <input 
                      type="text" 
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g., Dr. Werner Heisenberg"
                      className="w-full bg-white/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                </div>

                {/* ISBN */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 mb-2">ISBN Registry *</label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-450" />
                    <input 
                      type="text" 
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      placeholder="e.g., 978-3-16-148410-0"
                      className="w-full bg-white/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                    />
                  </div>
                </div>

                {/* Category dropdown */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">Subject Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 appearance-none"
                  >
                    {BOOK_CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Publisher */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">Academic Publisher</label>
                  <input 
                    type="text" 
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="e.g., Cambridge University Press"
                    className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>

                {/* Total Copies */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">Total Copies Shelved</label>
                  <input 
                    type="number" 
                    min={1}
                    value={copiesTotal}
                    onChange={(e) => setCopiesTotal(Number(e.target.value))}
                    className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              {/* Spatial Placement details */}
              <div className="pt-4 border-t border-slate-200/40">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 font-mono flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Spatial Library Placements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">Rack Placement</label>
                    <select
                      value={rack}
                      onChange={(e) => setRack(e.target.value)}
                      className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none text-slate-800"
                    >
                      <option value="Rack 1">Rack 1 (General Science)</option>
                      <option value="Rack 2">Rack 2 (Formal Math)</option>
                      <option value="Rack 3">Rack 3 (Humanities/Arts)</option>
                      <option value="Rack 4">Rack 4 (Advanced CSE)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">Shelf Allocation</label>
                    <select
                      value={shelf}
                      onChange={(e) => setShelf(e.target.value)}
                      className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none text-slate-800"
                    >
                      <option value="Shelf A">Shelf A (A-C Index)</option>
                      <option value="Shelf B">Shelf B (D-G Index)</option>
                      <option value="Shelf C">Shelf C (H-K Index)</option>
                      <option value="Shelf D">Shelf D (L-N Index)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Page count & Publish year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/40">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">Publish Year</label>
                  <input 
                    type="number" 
                    value={publishYear}
                    onChange={(e) => setPublishYear(Number(e.target.value))}
                    className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">Page Count</label>
                  <input 
                    type="number" 
                    value={pages}
                    onChange={(e) => setPages(Number(e.target.value))}
                    className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-slate-200/40">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-2">Summary description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a descriptive overview for students catalog search reference..."
                  rows={3}
                  className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                />
              </div>

              {/* Form submit button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-750 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  id="add-book-submit"
                >
                  <PlusCircle className="h-5 w-5" /> Catalog New Book Volume
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
