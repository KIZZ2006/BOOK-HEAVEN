import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function getUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers });
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400, headers }
      );
    }

    const users = await getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401, headers }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user info and token
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    }, { headers });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers }
    );
  }
}
