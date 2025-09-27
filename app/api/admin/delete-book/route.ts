import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { corsHeaders, handleCors } from '@/lib/cors';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ASSETS_DIR = path.join(process.cwd(), 'assets');

interface BookMetadata {
  id: string;
  title: string;
  author: string;
  filename: string;
  filePath: string;
  pageCount: number;
  size: number;
  coverColor: string;
  description: string;
}

async function getAllBooks(): Promise<BookMetadata[]> {
  try {
    const files = await fs.readdir(ASSETS_DIR);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    
    const books = await Promise.all(
      pdfFiles.map(async (filename) => {
        const filePath = path.join(ASSETS_DIR, filename);
        const stats = await fs.stat(filePath);
        
        // Extract title and author from filename (assuming format: "Author - Title.pdf")
        const nameWithoutExt = filename.replace('.pdf', '');
        const parts = nameWithoutExt.split(' - ');
        const author = parts[0] || 'Unknown Author';
        const title = parts.slice(1).join(' - ') || 'Untitled';
        
        return {
          id: filename.replace('.pdf', '').toLowerCase().replace(/[^a-z0-9]/g, '-'),
          title,
          author,
          filename,
          filePath,
          pageCount: 0, // We'll keep this simple for now
          size: stats.size,
          coverColor: `hsl(${Math.random() * 360}, 70%, 80%)`,
          description: `A book by ${author}`
        };
      })
    );
    
    return books.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error('Error reading books:', error);
    return [];
  }
}

export async function DELETE(request: NextRequest) {
  // Handle preflight requests
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7);
    let decoded: any;
    
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401, headers: corsHeaders }
      );
    }

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403, headers: corsHeaders }
      );
    }

    const { bookId } = await request.json();
    
    if (!bookId) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const books = await getAllBooks();
    const bookToDelete = books.find(book => book.id === bookId);
    
    if (!bookToDelete) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Delete the PDF file
    try {
      await fs.unlink(bookToDelete.filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      return NextResponse.json(
        { error: 'Failed to delete book file' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      message: 'Book deleted successfully',
      deletedBook: bookToDelete
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Delete book error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
