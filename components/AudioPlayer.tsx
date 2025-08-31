'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Settings,
  X,
  RotateCcw,
  Forward,
  Rewind
} from 'lucide-react'

interface AudioPlayerProps {
  bookId: string
  bookTitle: string
  bookAuthor: string
  onClose: () => void
}

// Sample text content with paragraph structure
const sampleText = [
  "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.",
  "The hallway smelt of boiled cabbage and old rag mats. At one end of it a coloured poster, too large for indoor display, had been tacked to the wall. It depicted simply an enormous face, more than a metre wide: the face of a man of about forty-five, with a heavy black moustache and ruggedly handsome features.",
  "Winston made for the stairs. It was no use trying the lift. Even at the best of times it was seldom working, and at present the electric current was cut off during daylight hours. It was part of the economy drive in preparation for Hate Week.",
  "The flat was seven flights up, and Winston, who was thirty-nine and had a varicose ulcer above his right ankle, went slowly, resting several times on the way. On each landing, opposite the lift-shaft, the poster with the enormous face gazed from the wall.",
  "It was one of those pictures which are so contrived that the eyes follow you about when you move. BIG BROTHER IS WATCHING YOU, the caption beneath it ran. Inside the flat a fruity voice was reading out a list of figures which had something to do with the production of pig-iron."
]

// Voice options
const voices = [
  { id: 'en-US-1', name: 'Emma', language: 'English (US)', gender: 'Female' },
  { id: 'en-US-2', name: 'James', language: 'English (US)', gender: 'Male' },
  { id: 'en-GB-1', name: 'Charlotte', language: 'English (UK)', gender: 'Female' },
  { id: 'en-GB-2', name: 'Oliver', language: 'English (UK)', gender: 'Male' },
]

export default function AudioPlayer({ bookId, bookTitle, bookAuthor, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentParagraph, setCurrentParagraph] = useState(0)
  const [selectedVoice, setSelectedVoice] = useState(voices[0])
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)
  }, [])

  // Simulate TTS playback
  useEffect(() => {
    if (isPlaying) {
      // Simulate paragraph progression
      timeoutRef.current = setTimeout(() => {
        if (currentParagraph < sampleText.length - 1) {
          setCurrentParagraph(currentParagraph + 1)
        } else {
          setIsPlaying(false)
          setCurrentParagraph(0)
        }
      }, 3000 / playbackSpeed) // Adjust timing based on speed
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isPlaying, currentParagraph, playbackSpeed])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault()
          togglePlayPause()
          break
        case 'ArrowLeft':
          e.preventDefault()
          goToPreviousParagraph()
          break
        case 'ArrowRight':
          e.preventDefault()
          goToNextParagraph()
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
        case 'm':
          e.preventDefault()
          toggleMute()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, currentParagraph])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const goToNextParagraph = () => {
    if (currentParagraph < sampleText.length - 1) {
      setCurrentParagraph(currentParagraph + 1)
    }
  }

  const goToPreviousParagraph = () => {
    if (currentParagraph > 0) {
      setCurrentParagraph(currentParagraph - 1)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVoiceChange = (voiceId: string) => {
    const voice = voices.find(v => v.id === voiceId)
    if (voice) {
      setSelectedVoice(voice)
    }
  }

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const startFromParagraph = (paragraphIndex: number) => {
    setCurrentParagraph(paragraphIndex)
    setIsPlaying(true)
  }

  const progress = ((currentParagraph + 1) / sampleText.length) * 100

  return (
    <div className="w-full h-screen bg-gray-50 relative overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-0 left-0 right-0 z-20 p-4 bg-white/90 backdrop-blur-sm border-b border-gray-200"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="btn-secondary"
              aria-label="Close audio player"
            >
              <X size={18} className="mr-2" />
              Back to Reader
            </button>
            <div className="text-center">
              <h1 className="font-serif font-semibold text-lg">{bookTitle}</h1>
              <p className="text-sm text-gray-600">by {bookAuthor}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-gray-200/20 transition-colors"
              aria-label="Audio settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="pt-24 pb-32 px-6 h-full">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {/* Current paragraph display */}
          <motion.div
            key={currentParagraph}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: isReducedMotion ? 0.1 : 0.5,
              ease: 'ease-out' 
            }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="text-center max-w-3xl">
              <div className="text-sm text-gray-500 mb-4">
                Paragraph {currentParagraph + 1} of {sampleText.length}
              </div>
              <div className="text-2xl md:text-3xl font-serif leading-relaxed text-gray-900">
                {sampleText[currentParagraph]}
              </div>
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="mt-8">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <motion.div
                className="bg-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>0:00</span>
              <span>~{Math.round((sampleText.length * 3) / playbackSpeed)}:00</span>
            </div>
          </div>
        </div>
      </main>

      {/* Audio controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Main controls */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <button
              onClick={goToPreviousParagraph}
              disabled={currentParagraph === 0}
              className="p-3 rounded-full hover:bg-gray-200/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous paragraph"
            >
              <SkipBack size={24} />
            </button>

            <button
              onClick={togglePlayPause}
                             className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-150"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </button>

            <button
              onClick={goToNextParagraph}
              disabled={currentParagraph === sampleText.length - 1}
              className="p-3 rounded-full hover:bg-gray-200/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next paragraph"
            >
              <SkipForward size={24} />
            </button>
          </div>

          {/* Secondary controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Volume control */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-lg hover:bg-gray-200/20 transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #A3D9B1 0%, #A3D9B1 ${(isMuted ? 0 : volume) * 100}%, #E8F5E8 ${(isMuted ? 0 : volume) * 100}%, #E8F5E8 100%)`
                  }}
                />
              </div>

              {/* Speed control */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Speed:</span>
                <select
                  value={playbackSpeed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1.0}>1.0x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2.0}>2.0x</option>
                </select>
              </div>
            </div>

            {/* Voice selection */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Voice:</span>
              <select
                value={selectedVoice.id}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="px-3 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
              >
                {voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} ({voice.gender})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-24 right-6 w-80 bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="font-serif font-semibold text-lg text-gray-900 mb-4">
              Audio Settings
            </h3>
            
            {/* Voice selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Voice Selection
              </label>
              <select
                value={selectedVoice.id}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              >
                {voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} - {voice.language} ({voice.gender})
                  </option>
                ))}
              </select>
            </div>

            {/* Speed control */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Playback Speed: {playbackSpeed}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.25"
                value={playbackSpeed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #A3D9B1 0%, #A3D9B1 ${(playbackSpeed - 0.5) / 1.5 * 100}%, #E8F5E8 ${(playbackSpeed - 0.5) / 1.5 * 100}%, #E8F5E8 100%)`
                }}
              />
            </div>

            {/* Volume control */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Volume: {Math.round((isMuted ? 0 : volume) * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #A3D9B1 0%, #A3D9B1 ${(isMuted ? 0 : volume) * 100}%, #E8F5E8 ${(isMuted ? 0 : volume) * 100}%, #E8F5E8 100%)`
                }}
              />
            </div>

            {/* Reset button */}
            <button
              onClick={() => {
                setPlaybackSpeed(1.0)
                setVolume(0.8)
                setIsMuted(false)
                setSelectedVoice(voices[0])
              }}
              className="w-full btn-secondary"
            >
              <RotateCcw size={18} className="mr-2" />
              Reset to Defaults
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paragraph navigation */}
      <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3 text-center">Paragraphs</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sampleText.map((text, index) => (
              <button
                key={index}
                onClick={() => startFromParagraph(index)}
                className={`w-full text-left p-2 rounded-lg text-xs transition-colors ${
                  index === currentParagraph
                    ? 'bg-green-500 text-white'
                    : 'hover:bg-gray-200/20 text-gray-600'
                }`}
              >
                <div className="truncate max-w-32">
                  {text.substring(0, 40)}...
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts help */}
      <div className="absolute bottom-4 right-4 text-xs opacity-60">
        <div className="bg-white/80 p-2 rounded backdrop-blur-sm">
          <p>Space Play/Pause • ← → Navigate • M Mute • Esc Close</p>
        </div>
      </div>
    </div>
  )
}
