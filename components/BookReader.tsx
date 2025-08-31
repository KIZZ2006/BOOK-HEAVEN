'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Moon, 
  Sun, 
  Bookmark, 
  Headphones,
  Volume2,
  Settings,
  Maximize,
  Minimize
} from 'lucide-react'

interface BookReaderProps {
  bookId: string
  bookTitle: string
  bookAuthor: string
  onClose: () => void
}

// Sample book content for demonstration
const samplePages = [
  { id: 1, left: "Chapter 1: The Beginning\n\nIt was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.", right: "The hallway smelt of boiled cabbage and old rag mats. At one end of it a coloured poster, too large for indoor display, had been tacked to the wall. It depicted simply an enormous face, more than a metre wide: the face of a man of about forty-five, with a heavy black moustache and ruggedly handsome features." },
  { id: 2, left: "Winston made for the stairs. It was no use trying the lift. Even at the best of times it was seldom working, and at present the electric current was cut off during daylight hours. It was part of the economy drive in preparation for Hate Week. The flat was seven flights up, and Winston, who was thirty-nine and had a varicose ulcer above his right ankle, went slowly, resting several times on the way.", right: "On each landing, opposite the lift-shaft, the poster with the enormous face gazed from the wall. It was one of those pictures which are so contrived that the eyes follow you about when you move. BIG BROTHER IS WATCHING YOU, the caption beneath it ran." },
  { id: 3, left: "Inside the flat a fruity voice was reading out a list of figures which had something to do with the production of pig-iron. The voice came from an oblong metal plaque like a dulled mirror which formed part of the surface of the right-hand wall. Winston turned a switch and the voice sank somewhat, though the words were still distinguishable.", right: "The instrument (the telescreen, it was called) could be dimmed, but there was no way of shutting it off completely. He moved over to the window: a smallish, frail figure, the meagreness of his body merely emphasized by the blue overalls which were the uniform of the party." },
]

export default function BookReader({ bookId, bookTitle, bookAuthor, onClose }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [fontSize, setFontSize] = useState(18)
  const [lineHeight, setLineHeight] = useState(1.6)
  const [isNightMode, setIsNightMode] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)
  }, [])

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      
      timeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          goToPreviousPage()
          break
        case 'ArrowRight':
          e.preventDefault()
          goToNextPage()
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
        case 'f':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'n':
          e.preventDefault()
          setIsNightMode(!isNightMode)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, isNightMode])

  const goToNextPage = () => {
    if (currentPage < samplePages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const currentPageData = samplePages[currentPage]

  return (
    <div 
      ref={containerRef}
      className={`w-full h-screen bg-gray-50 transition-colors duration-300 ${
        isNightMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
                 className={`absolute top-0 left-0 right-0 z-20 p-4 ${
           isNightMode ? 'bg-gray-900/90' : 'bg-white/90'
         } backdrop-blur-sm border-b border-gray-200`}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="btn-secondary"
              aria-label="Close reader"
            >
              ← Back to Library
            </button>
            <div className="text-center">
              <h1 className="font-serif font-semibold text-lg">{bookTitle}</h1>
              <p className="text-sm opacity-70">by {bookAuthor}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
                         <button
               onClick={() => setIsNightMode(!isNightMode)}
               className="p-2 rounded-lg hover:bg-gray-200/20 transition-colors"
               aria-label={isNightMode ? 'Switch to light mode' : 'Switch to night mode'}
             >
              {isNightMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
                         <button
               onClick={toggleFullscreen}
               className="p-2 rounded-lg hover:bg-gray-200/20 transition-colors"
               aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
             >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main reading area */}
      <main className="pt-24 pb-20 px-6 h-full">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-center">
          {/* Book opening animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: isReducedMotion ? 0.1 : 0.8, 
              ease: 'ease-out' 
            }}
            className="relative w-full max-w-5xl"
          >
            {/* Two-page spread */}
            <div className="grid grid-cols-2 gap-8 h-full">
              {/* Left page */}
              <motion.div
                key={`left-${currentPage}`}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  duration: isReducedMotion ? 0.1 : 0.5,
                  ease: 'ease-out' 
                }}
                                 className={`page-turn p-8 rounded-xl shadow-md ${
                   isNightMode ? 'bg-gray-900/50 text-white' : 'bg-white/90'
                 }`}
                 style={{
                   fontSize: `${fontSize}px`,
                   lineHeight: lineHeight,
                 }}
               >
                 <div className="whitespace-pre-wrap font-serif">
                   {currentPageData.left}
                 </div>
               </motion.div>

              {/* Right page */}
              <motion.div
                key={`right-${currentPage}`}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  duration: isReducedMotion ? 0.1 : 0.5,
                  delay: isReducedMotion ? 0 : 0.1,
                  ease: 'ease-out' 
                }}
                                 className={`page-turn p-8 rounded-xl shadow-md ${
                   isNightMode ? 'bg-gray-900/50 text-white' : 'bg-white/90'
                 }`}
                 style={{
                   fontSize: `${fontSize}px`,
                   lineHeight: lineHeight,
                 }}
               >
                 <div className="whitespace-pre-wrap font-serif">
                   {currentPageData.right}
                 </div>
               </motion.div>
            </div>

            {/* Page number indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className={`px-4 py-2 rounded-full ${
                isNightMode ? 'bg-gray-900/80 text-white' : 'bg-white/80 text-gray-900'
              } backdrop-blur-sm`}>
                Page {currentPage + 1} of {samplePages.length}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Floating controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className={`card-glass p-4 flex items-center space-x-4 ${
              isNightMode ? 'bg-gray-900/80 text-white' : 'bg-white/80'
            }`}>
              {/* Navigation */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
                className="p-2 rounded-lg hover:bg-gray-200/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={goToNextPage}
                disabled={currentPage === samplePages.length - 1}
                className="p-2 rounded-lg hover:bg-gray-200/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight size={20} />
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-gray-300/30"></div>

              {/* Font controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className="p-2 rounded-lg hover:bg-gray-200/20 transition-colors"
                  aria-label="Decrease font size"
                >
                  <ZoomOut size={18} />
                </button>
                <span className="text-sm min-w-[3rem] text-center">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                  className="p-2 rounded-lg hover:bg-gray-200/20 transition-colors"
                  aria-label="Increase font size"
                >
                  <ZoomIn size={18} />
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-gray-300/30"></div>

              {/* Line height */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setLineHeight(Math.max(1.2, lineHeight - 0.1))}
                  className="p-2 rounded-lg hover:bg-gray-200/20 transition-colors"
                  aria-label="Decrease line height"
                >
                  <ZoomOut size={18} />
                </button>
                <span className="text-sm min-w-[3rem] text-center">{lineHeight.toFixed(1)}</span>
                <button
                  onClick={() => setLineHeight(Math.min(2.5, lineHeight + 0.1))}
                  className="p-2 rounded-lg hover:bg-gray-200/20 transition-colors"
                  aria-label="Increase line height"
                >
                  <ZoomIn size={18} />
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-gray-300/30"></div>

              {/* Additional actions */}
              <button
                className="p-2 rounded-lg hover:bg-gray-200/20 transition-colors"
                aria-label="Bookmark this page"
              >
                <Bookmark size={18} />
              </button>

              <button
                className="p-2 rounded-lg hover:bg-gray-200/20 transition-colors"
                aria-label="Listen to this page"
              >
                <Headphones size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcuts help */}
      <div className="absolute bottom-4 right-4 text-xs opacity-60">
        <div className={`p-2 rounded ${
          isNightMode ? 'bg-gray-900/50 text-white' : 'bg-white/50 text-gray-900'
        }`}>
          <p>← → Navigate • N Night mode • F Fullscreen • Esc Close</p>
        </div>
      </div>
    </div>
  )
}
