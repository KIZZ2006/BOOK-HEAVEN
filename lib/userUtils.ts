import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export async function ensureDataDir() {
  const dataDir = path.dirname(USERS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveUsers(users: User[]) {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function initializeDefaultAdmin() {
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
    await saveUsers(users);
  }
}
