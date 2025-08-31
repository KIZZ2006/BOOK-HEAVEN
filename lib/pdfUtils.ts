import fs from 'fs'
import path from 'path'
import pdf from 'pdf-parse'

export interface BookMetadata {
  id: string
  title: string
  author: string
  filename: string
  filePath: string
  pageCount: number
  size: number
  coverColor: string
  description?: string
}

export async function getBookMetadata(filePath: string): Promise<BookMetadata> {
  const filename = path.basename(filePath, '.pdf')
  const stats = fs.statSync(filePath)
  
  // Extract title and author from filename
  const parts = filename.split(' - ')
  const title = parts[1] || filename
  const author = parts[0] || 'Unknown Author'
  
  // Generate a unique ID
  const id = filename.toLowerCase().replace(/[^a-z0-9]/g, '-')
  
  // Assign a cover color based on title
  const colors = [
    '#A3D9B1', '#F0D9A7', '#D1EBD1', '#E8F5E8', 
    '#F8F0E0', '#E6F3FF', '#FFF2E6', '#F0E6FF'
  ]
  const colorIndex = title.length % colors.length
  const coverColor = colors[colorIndex]
  
  try {
    const dataBuffer = fs.readFileSync(filePath)
    const data = await pdf(dataBuffer)
    
    return {
      id,
      title,
      author,
      filename: `${filename}.pdf`,
      filePath,
      pageCount: data.numpages,
      size: stats.size,
      coverColor,
      description: data.text.substring(0, 200) + '...'
    }
  } catch (error) {
    console.error(`Error processing PDF ${filePath}:`, error)
    return {
      id,
      title,
      author,
      filename: `${filename}.pdf`,
      filePath,
      pageCount: 0,
      size: stats.size,
      coverColor,
      description: 'Unable to extract text from PDF'
    }
  }
}

export async function getAllBooks(): Promise<BookMetadata[]> {
  const assetsDir = path.join(process.cwd(), 'assets')
  
  try {
    const files = fs.readdirSync(assetsDir)
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'))
    
    const books = await Promise.all(
      pdfFiles.map(file => {
        const filePath = path.join(assetsDir, file)
        return getBookMetadata(filePath)
      })
    )
    
    return books.sort((a, b) => a.title.localeCompare(b.title))
  } catch (error) {
    console.error('Error reading assets directory:', error)
    return []
  }
}

export async function getBookById(id: string): Promise<BookMetadata | null> {
  const books = await getAllBooks()
  return books.find(book => book.id === id) || null
}
