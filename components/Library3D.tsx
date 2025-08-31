'use client'

import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Html } from '@react-three/drei'
import { motion } from 'framer-motion'
import { BookOpen, Headphones, Info, Bookmark } from 'lucide-react'
import * as THREE from 'three'

// Book type definition
interface Book {
  id: string
  title: string
  author: string
  coverColor: string
  position: [number, number, number]
  rotation: [number, number, number]
}

// Sample books data
const sampleBooks: Book[] = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', coverColor: '#A3D9B1', position: [0, 0, 0], rotation: [0, 0, 0] },
  { id: '2', title: 'Pride and Prejudice', author: 'Jane Austen', coverColor: '#F0D9A7', position: [0, 0, 0], rotation: [0, 0, 0] },
  { id: '3', title: '1984', author: 'George Orwell', coverColor: '#D1EBD1', position: [0, 0, 0], rotation: [0, 0, 0] },
  { id: '4', title: 'To Kill a Mockingbird', author: 'Harper Lee', coverColor: '#E8F5E8', position: [0, 0, 0], rotation: [0, 0, 0] },
  { id: '5', title: 'The Hobbit', author: 'J.R.R. Tolkien', coverColor: '#F8F0E0', position: [0, 0, 0], rotation: [0, 0, 0] },
  { id: '6', title: 'Brave New World', author: 'Aldous Huxley', coverColor: '#A3D9B1', position: [0, 0, 0], rotation: [0, 0, 0] },
  { id: '7', title: 'The Catcher in the Rye', author: 'J.D. Salinger', coverColor: '#F0D9A7', position: [0, 0, 0], rotation: [0, 0, 0] },
  { id: '8', title: 'Lord of the Flies', author: 'William Golding', coverColor: '#D1EBD1', position: [0, 0, 0], rotation: [0, 0, 0] },
]

// Book component
const Book3D = ({ book, index, totalBooks, onBookSelect }: { 
  book: Book; 
  index: number; 
  totalBooks: number;
  onBookSelect: (book: Book) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [selected, setSelected] = useState(false)

  // Calculate position on circular orbit
  const radius = 8
  const angle = (index / totalBooks) * Math.PI * 2
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  const y = Math.sin(angle * 2) * 2 // Gentle wave effect

  // Animation
  useFrame((state) => {
    if (meshRef.current && !selected) {
      // Gentle floating animation
      meshRef.current.position.y = y + Math.sin(state.clock.elapsedTime + index) * 0.5
      // Slow rotation
      meshRef.current.rotation.y += 0.005
    }
  })

  const handleClick = () => {
    setSelected(true)
    onBookSelect(book)
  }

  return (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      rotation={[0, angle, 0]}
      scale={hovered ? 1.2 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Book spine */}
      <boxGeometry args={[0.8, 2, 0.2]} />
      <meshStandardMaterial 
        color={book.coverColor} 
        roughness={0.3}
        metalness={0.1}
      />
      
      {/* Glow effect when hovered */}
      {hovered && (
        <mesh position={[0, 0, 0.15]}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial 
            color={book.coverColor} 
            transparent 
            opacity={0.3} 
          />
        </mesh>
      )}
    </mesh>
  )
}

// Book selection card overlay
const BookCard = ({ book, onClose, onRead, onListen }: {
  book: Book;
  onClose: () => void;
  onRead: () => void;
  onListen: () => void;
}) => {
  return (
    <Html position={[0, 0, 2]} center>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="card-glass p-6 min-w-[300px] text-center"
      >
        <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">
          {book.title}
        </h3>
        <p className="text-gray-600 mb-6">
          by {book.author}
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={onRead}
            className="btn-primary w-full"
          >
            <BookOpen size={18} className="mr-2" />
            Read
          </button>
          <button
            onClick={onListen}
            className="btn-secondary w-full"
          >
            <Headphones size={18} className="mr-2" />
            Listen
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </Html>
  )
}

// Main library scene
const LibraryScene = ({ onBookSelect }: { onBookSelect: (book: Book) => void }) => {
  const { camera } = useThree()
  
  // Set up camera
  useFrame(() => {
    if (camera) {
      // Gentle camera movement
      camera.position.x = Math.sin(Date.now() * 0.0001) * 2
      camera.position.y = 5 + Math.sin(Date.now() * 0.0002) * 1
      camera.lookAt(0, 0, 0)
    }
  })

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.6} color="#F7FBF6" />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8} 
        color="#F0D9A7" 
        castShadow 
      />
      <pointLight 
        position={[-10, 5, -10]} 
        intensity={0.4} 
        color="#A3D9B1" 
      />

      {/* Circular base */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[12, 12, 0.5, 32]} />
        <meshStandardMaterial 
          color="#E8F5E8" 
          transparent 
          opacity={0.8} 
        />
      </mesh>

      {/* Books */}
      {sampleBooks.map((book, index) => (
        <Book3D
          key={book.id}
          book={book}
          index={index}
          totalBooks={sampleBooks.length}
          onBookSelect={onBookSelect}
        />
      ))}

      {/* Floating particles for atmosphere */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            Math.random() * 10,
            (Math.random() - 0.5) * 20
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial 
            color="#A3D9B1" 
            transparent 
            opacity={0.3} 
          />
        </mesh>
      ))}
    </>
  )
}

// Main component
export default function Library3D() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  // Check for reduced motion preference
  useMemo(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setIsReducedMotion(mediaQuery.matches)
    }
  }, [])

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book)
  }

  const handleClose = () => {
    setSelectedBook(null)
  }

  const handleRead = () => {
    // Navigate to reader
    console.log('Reading:', selectedBook?.title)
    // router.push(`/book/${selectedBook?.id}`)
  }

  const handleListen = () => {
    // Navigate to audio player
    console.log('Listening to:', selectedBook?.title)
    // router.push(`/listen/${selectedBook?.id}`)
  }

  return (
    <div className="w-full h-screen relative">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 8, 12], fov: 60 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <LibraryScene onBookSelect={handleBookSelect} />
        
        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={!isReducedMotion}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          maxDistance={20}
          minDistance={8}
          autoRotate={!isReducedMotion}
          autoRotateSpeed={0.5}
        />

        {/* Selected book card */}
        {selectedBook && (
          <BookCard
            book={selectedBook}
            onClose={handleClose}
            onRead={handleRead}
            onListen={handleListen}
          />
        )}
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => window.history.back()}
          className="btn-secondary"
        >
          ← Back to Home
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="card-glass px-6 py-3 text-center">
          <p className="text-sm text-gray-600">
            {isReducedMotion ? (
              'Click on books to select them'
            ) : (
              'Use mouse to navigate • Click books to select • Scroll to zoom'
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
