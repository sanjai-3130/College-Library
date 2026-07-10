/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  Library, 
  Search, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight, 
  Filter,
  BarChart4,
  LayoutGrid,
  List
} from 'lucide-react';

export const PhysicalBookList: React.FC = () => {
  const { books, setActiveView } = useLibrary();
  const [search, setSearch] = useState('');
  const [rackFilter, setRackFilter] = useState('All');
  const [layoutMode, setLayoutMode] = useState<'table' | 'grid'>('table');

  // Filter only physical books
  const physicalBooks = books.filter(b => b.type === 'physical');

  const filteredBooks = physicalBooks.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.isbn.includes(search);
      
    const matchesRack = rackFilter === 'All' || book.shelfLocation?.includes(rackFilter);
    
    return matchesSearch && matchesRack;
  });

  return (
    <div className="space-y-6" id="physical-book-list-view">
      {/* View Header */}
      <div className="glass bento-shadow rounded-3xl p-6 border border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Physical Inventory List</h2>
          <p className="text-xs text-slate-500">Manage, search, and track college library holdings, active copies, and shelf routing layouts.</p>
        </div>

        {/* Layout controls */}
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => setLayoutMode('table')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              layoutMode === 'table' ? 'bg-white border-slate-300 text-slate-800 shadow-sm' : 'bg-white/40 border-white/10 text-slate-500 hover:text-slate-800'
            }`}
            title="Table Layout"
          >
            <List className="h-4.5 w-4.5" />
          </button>
          <button 
            onClick={() => setLayoutMode('grid')}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              layoutMode === 'grid' ? 'bg-white border-slate-300 text-slate-800 shadow-sm' : 'bg-white/40 border-white/10 text-slate-500 hover:text-slate-800'
            }`}
            title="Grid Layout"
          >
            <LayoutGrid className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Filter and Search actions */}
      <div className="glass bento-shadow rounded-2xl p-4 border border-white/20 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-450" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog titles, authors, or isbn keys..."
            className="w-full bg-white/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-450 shrink-0" />
          <select
            value={rackFilter}
            onChange={(e) => setRackFilter(e.target.value)}
            className="bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 cursor-pointer appearance-none"
          >
            <option value="All">All Racks</option>
            <option value="Rack 1">Rack 1 (Physics/Science)</option>
            <option value="Rack 2">Rack 2 (Math)</option>
            <option value="Rack 3">Rack 3 (Humanities)</option>
            <option value="Rack 4">Rack 4 (Computer Science)</option>
          </select>
        </div>
      </div>

      {/* Render layout view */}
      {filteredBooks.length > 0 ? (
        layoutMode === 'table' ? (
          /* Table Layout view */
          <div className="glass bento-shadow rounded-3xl overflow-hidden border border-white/20" id="inventory-table">
            <div className="overflow-x-auto font-medium">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/50 border-b border-slate-200/60 text-slate-500 font-bold uppercase tracking-wider font-mono">
                    <th className="p-4">ISBN / ID</th>
                    <th className="p-4">Book Title & Category</th>
                    <th className="p-4">Rack & Shelf mapping</th>
                    <th className="p-4">Availability</th>
                    <th className="p-4">Fines Accum</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBooks.map((book) => {
                    const isAvailable = book.copiesAvailable && book.copiesAvailable > 0;
                    return (
                      <tr key={book.id} className="hover:bg-white/40 transition-colors">
                        {/* ISBN */}
                        <td className="p-4 font-mono font-bold text-slate-600">
                          <div>{book.id}</div>
                          <div className="text-[9px] text-slate-400 font-normal">{book.isbn}</div>
                        </td>

                        {/* Title and Category */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={book.coverUrl} alt={book.title} className="w-8 h-11 rounded-lg object-cover shadow-sm shrink-0 border border-slate-200" />
                            <div className="min-w-0">
                              <span className="text-[9px] font-bold text-blue-700 bg-blue-50/50 px-2 py-0.5 rounded-md uppercase font-mono border border-blue-100/30">
                                {book.category}
                              </span>
                              <div className="font-bold text-slate-800 truncate max-w-xs sm:max-w-md mt-1.5 leading-tight">{book.title}</div>
                              <div className="text-[10px] text-slate-450 mt-0.5">by {book.author}</div>
                            </div>
                          </div>
                        </td>

                        {/* Map Placement */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span className="font-bold">{book.shelfLocation}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 italic">Central Library Wing</span>
                        </td>

                        {/* Availability copy ratios */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 font-mono">
                              {book.copiesAvailable} / {book.copiesTotal} copies
                            </span>
                          </div>
                          {/* visual tiny progress line bar */}
                          <div className="w-24 bg-slate-200/60 h-1 rounded overflow-hidden mt-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full"
                              style={{ width: `${((book.copiesAvailable || 0) / (book.copiesTotal || 1)) * 100}%` }}
                            />
                          </div>
                        </td>

                        <td className="p-4 font-mono text-slate-500 font-bold">₹0.00 / day</td>

                        {/* Status badge */}
                        <td className="p-4 text-right">
                          {isAvailable ? (
                            <span className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100/40 flex items-center gap-1 justify-center max-w-[100px] ml-auto">
                              <CheckCircle className="h-2.5 w-2.5" /> AVAILABLE
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1 justify-center max-w-[100px] ml-auto">
                              <XCircle className="h-2.5 w-2.5" /> ISSUED OUT
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid layout view */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="inventory-grid">
            {filteredBooks.map((book) => (
              <div key={book.id} className="glass bento-shadow rounded-2xl p-4 border border-white/25 flex gap-3 hover:border-blue-400/50 transition-all">
                <img src={book.coverUrl} alt={book.title} className="w-12 h-18 rounded-lg object-cover shadow shrink-0 border border-slate-200" />
                <div className="min-w-0 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[8px] font-mono font-bold text-blue-700 bg-blue-50/50 px-1.5 py-0.5 rounded border border-blue-100/20">
                      {book.id}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 truncate mt-1.5 leading-tight">{book.title}</h3>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">by {book.author}</p>
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] mt-2 pt-2 border-t border-slate-200/50">
                    <div className="flex items-center gap-1 text-slate-600 font-bold">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{book.shelfLocation}</span>
                    </div>
                    
                    <span className={`font-mono font-bold ${
                      book.copiesAvailable && book.copiesAvailable > 0 ? 'text-emerald-600' : 'text-slate-400'
                    }`}>
                      {book.copiesAvailable} / {book.copiesTotal} Left
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12 glass bento-shadow border border-white/20 rounded-3xl">
          <Library className="h-12 w-12 text-slate-350 mx-auto mb-3" />
          <p className="text-lg font-bold text-slate-600">No matching physical inventory found</p>
          <p className="text-xs text-slate-400 mt-1">Adjust search parameters or select different shelf racks.</p>
        </div>
      )}
    </div>
  );
};
