import { NextResponse } from 'next/server';
import { getAllBooks } from '../../../lib/pdfUtils';

export async function GET() {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const books = await getAllBooks();
    
    return NextResponse.json({
      books,
      total: books.length
    }, { headers });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500, headers }
    );
  }
}
