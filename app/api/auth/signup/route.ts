import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { User, getUsers, saveUsers, initializeDefaultAdmin } from '@/lib/userUtils';
import { corsHeaders, handleCors } from '@/lib/cors';

export async function POST(request: NextRequest) {
  // Handle preflight requests
  const corsResponse = handleCors(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    // Initialize default admin user if it doesn't exist
    await initializeDefaultAdmin();
    
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400, headers: corsHeaders }
      );
    }

    const users = await getUsers();
    
    // Check if user already exists
    if (users.find((user: User) => user.email === email)) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409, headers: corsHeaders }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user (default role is 'user')
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await saveUsers(users);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      message: 'User created successfully',
      user: userWithoutPassword
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
