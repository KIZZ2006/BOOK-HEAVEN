'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Headphones, X, ArrowLeft, Sparkles, Zap, Shield, Heart } from 'lucide-react'
import BookReader from '@/components/BookReader'
import AudioPlayer from '@/components/AudioPlayer'

export default function DemoPage() {
  const [activeComponent, setActiveComponent] = useState<'menu' | 'reader' | 'audio'>('menu')
  const [selectedBook, setSelectedBook] = useState({
    id: 'demo-1',
    title: '1984',
    author: 'George Orwell'
  })

  const handleBack = () => {
    setActiveComponent('menu')
  }

  if (activeComponent === 'reader') {
    return (
      <BookReader
        bookId={selectedBook.id}
        bookTitle={selectedBook.title}
        bookAuthor={selectedBook.author}
        onClose={handleBack}
      />
    )
  }

  if (activeComponent === 'audio') {
    return (
      <AudioPlayer
        bookId={selectedBook.id}
        bookTitle={selectedBook.title}
        bookAuthor={selectedBook.author}
        onClose={handleBack}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-2 mb-6 shadow-sm">
                <Sparkles size={16} className="text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Interactive Demo</span>
              </div>
              <h1 className="text-5xl font-serif font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent">
                  Book Heaven Demo
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Experience the professional-grade components of our reading platform
              </p>
            </motion.div>
          </header>

          {/* Demo options */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {/* Book Reader Demo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group cursor-pointer"
              onClick={() => setActiveComponent('reader')}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-slate-900 mb-4 text-center">
                  Professional Reader
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed text-center">
                  Experience our advanced two-page spread reader with smooth animations, 
                  customizable fonts, night mode, and professional navigation controls.
                </p>
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                    Click to Try
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Audio Player Demo */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group cursor-pointer"
              onClick={() => setActiveComponent('audio')}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Headphones size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-slate-900 mb-4 text-center">
                  Audio Experience
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed text-center">
                  Test our high-quality TTS audio player with synchronized highlighting, 
                  professional voice selection, speed controls, and advanced navigation.
                </p>
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    Click to Try
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features showcase */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-serif font-semibold text-slate-900 text-center mb-12">
              <span className="bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent">
                Key Features
              </span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Zap size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Professional Design</h3>
                <p className="text-slate-600 leading-relaxed">
                  Sophisticated interface with glass morphism, gradients, and smooth animations for a premium user experience.
                </p>
              </div>
              
              <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Accessibility First</h3>
                <p className="text-slate-600 leading-relaxed">
                  WCAG compliant with keyboard navigation, screen reader support, and reduced motion preferences.
                </p>
              </div>
              
              <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Performance Optimized</h3>
                <p className="text-slate-600 leading-relaxed">
                  Smooth interactions, optimized animations, and responsive design for all devices and screen sizes.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Navigation back to main */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Home
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
