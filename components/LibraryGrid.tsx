'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Headphones, X, FileText, HardDrive, Eye, Play, Trash2, AlertCircle } from 'lucide-react'
import { BookMetadata } from '@/lib/pdfUtils'
import { useAuth } from './AuthContext'

interface LibraryGridProps {
  books: BookMetadata[]
}

export default function LibraryGrid({ books }: LibraryGridProps) {
  const { user, isAdmin, token } = useAuth();
  const [selectedBook, setSelectedBook] = useState<BookMetadata | null>(null)
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      const response = await fetch('/api/admin/delete-book', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId }),
      });

      if (response.ok) {
        // Refresh the page to show updated book list
        window.location.reload();
      } else {
        const errorData = await response.json();
        setDeleteError(errorData.error || 'Failed to delete book');
      }
    } catch (error) {
      setDeleteError('An error occurred while deleting the book');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 shadow-lg max-w-md mx-auto">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Library Empty</h3>
          <p className="text-gray-600 mb-6">
            No books have been uploaded yet. {isAdmin ? 'Start building your library by uploading the first book.' : 'Check back later for new additions.'}
          </p>
          {isAdmin && (
            <a
              href="/admin/upload"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Upload First Book
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Delete Error Message */}
      {deleteError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2 mb-6">
          <AlertCircle className="w-5 h-5" />
          <span>{deleteError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedBook(book)}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 overflow-hidden">
              {/* Book Cover */}
              <div 
                className="h-48 relative overflow-hidden"
                style={{ backgroundColor: book.coverColor }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen size={48} className="text-slate-700 group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Eye size={24} />
                    </div>
                    <p className="text-sm font-medium">View Details</p>
                  </div>
                </div>
              </div>
              
              {/* Book Info */}
              <div className="p-5">
                <h3 className="font-serif font-semibold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {book.title}
                </h3>
                <p className="text-slate-600 text-sm mb-3 font-medium">
                  by {book.author}
                </p>
                
                {/* Book Details */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <div className="flex items-center">
                    <FileText size={12} className="mr-1" />
                    <span>{book.pageCount} pages</span>
                  </div>
                  <div className="flex items-center">
                    <HardDrive size={12} className="mr-1" />
                    <span>{formatFileSize(book.size)}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center">
                      <BookOpen size={14} className="mr-1" />
                      Read
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center">
                      <Play size={14} className="mr-1" />
                      Listen
                    </button>
                  </div>
                  
                  {/* Admin Delete Button */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBook(book.id);
                      }}
                      disabled={isDeleting}
                      className="w-full bg-red-600 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-red-700 transition-all duration-200 flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Book Selection Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-serif font-semibold text-slate-900 mb-2">
                    {selectedBook.title}
                  </h3>
                  <p className="text-slate-600 font-medium">
                    by {selectedBook.author}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              {/* Book Cover */}
              <div 
                className="w-full h-40 rounded-2xl mb-6 flex items-center justify-center shadow-lg"
                style={{ backgroundColor: selectedBook.coverColor }}
              >
                <BookOpen size={48} className="text-slate-700" />
              </div>

              {/* Book Details */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-sm text-slate-600">
                  <FileText size={18} className="mr-3 text-emerald-500" />
                  <span className="font-medium">{selectedBook.pageCount} pages</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <HardDrive size={18} className="mr-3 text-blue-500" />
                  <span className="font-medium">{formatFileSize(selectedBook.size)}</span>
                </div>
                {selectedBook.description && (
                  <div className="text-sm text-slate-600">
                    <p className="line-clamp-4 leading-relaxed">{selectedBook.description}</p>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <a
                  href={`/demo?component=reader&book=${selectedBook.id}`}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <BookOpen size={20} className="mr-2" />
                  Start Reading
                </a>
                <a
                  href={`/demo?component=audio&book=${selectedBook.id}`}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Headphones size={20} className="mr-2" />
                  Listen to Audio
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
