'use client';

import { useEffect, useState } from 'react';
import { BookMetadata } from '@/lib/pdfUtils';
import LibraryGrid from '@/components/LibraryGrid';
import { API_BASE_URL } from '@/lib/config';

export default function LibraryPage() {
  const [books, setBooks] = useState<BookMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/books`);
        if (response.ok) {
          const data = await response.json();
          setBooks(data.books);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading library...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-dot-pattern" />
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <a href="/" className="inline-flex items-center text-slate-600 hover:text-emerald-600 transition-colors mb-6 group">
              <div className="w-8 h-8 bg-slate-200 group-hover:bg-emerald-200 rounded-lg flex items-center justify-center mr-3 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
              </div>
              <span className="font-medium">Back to Home</span>
            </a>

            <div className="text-center mb-8">
              <h1 className="text-5xl font-serif font-bold mb-4">
                <span className="bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent">
                  Our Library
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Discover our curated collection of professional literature, carefully selected and managed for quality.
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 shadow-lg">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{books.length}</div>
                    <div className="text-sm text-slate-600">Total Books</div>
                  </div>
                  <div className="w-px h-8 bg-slate-300"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {books.reduce((total, book) => total + book.pageCount, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600">Total Pages</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <LibraryGrid books={books} />
        </div>
      </div>
    </div>
  );
}
