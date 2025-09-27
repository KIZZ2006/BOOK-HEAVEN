import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import jwt from 'jsonwebtoken';
import { corsHeaders, handleCors } from '@/lib/cors';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') as string;

    if (!file || !title || !author) {
      return NextResponse.json(
        { error: 'File, title, and author are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate file type
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 50MB' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Create assets directory if it doesn't exist
    const assetsDir = join(process.cwd(), 'assets');
    try {
      await mkdir(assetsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating assets directory:', error);
    }

    // Generate filename: "Author - Title.pdf"
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
    const sanitizedAuthor = author.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
    const filename = `${sanitizedAuthor} - ${sanitizedTitle}.pdf`;
    const filePath = join(assetsDir, filename);

    // Check if file already exists
    try {
      const { access } = await import('fs/promises');
      await access(filePath);
      return NextResponse.json(
        { error: 'A book with this title and author already exists' },
        { status: 409, headers: corsHeaders }
      );
    } catch {
      // File doesn't exist, continue with upload
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filePath, buffer);

    return NextResponse.json({
      message: 'Book uploaded successfully',
      filename,
      title: sanitizedTitle,
      author: sanitizedAuthor,
      description: description || '',
      tags: tags || '',
      size: file.size
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
