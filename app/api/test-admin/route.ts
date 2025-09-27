import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

async function getUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function initializeDefaultAdmin() {
  const users = await getUsers();
  
  // Check if admin user already exists
  const adminExists = users.find(user => user.email === 'admin@bookheaven.com');
  
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('BookHeaven2024!', 12);
    
    const adminUser: User = {
      id: 'admin-001',
      email: 'admin@bookheaven.com',
      password: hashedPassword,
      name: 'Book Heaven Admin',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    
    users.push(adminUser);
    
    // Save users
    const dataDir = path.dirname(USERS_FILE);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    
    console.log('Default admin user created');
    return { created: true, adminUser };
  }
  
  return { created: false, adminUser: adminExists };
}

export async function GET(request: Request) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers });
  }

  try {
    const result = await initializeDefaultAdmin();
    const users = await getUsers();
    
    return NextResponse.json({
      message: 'Admin user check completed',
      adminUserExists: !!result.adminUser,
      adminUserCreated: result.created,
      adminUser: result.adminUser ? {
        id: result.adminUser.id,
        email: result.adminUser.email,
        name: result.adminUser.name,
        role: result.adminUser.role,
        createdAt: result.adminUser.createdAt
      } : null,
      totalUsers: users.length,
      allUsers: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }))
    }, { headers });
  } catch (error) {
    console.error('Admin test error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check admin user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers }
    );
  }
}
