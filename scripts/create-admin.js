const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

async function ensureDataDir() {
  const dataDir = path.dirname(USERS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function createAdminUser() {
  try {
    await ensureDataDir();
    
    // Check if admin already exists
    let users = [];
    try {
      const data = await fs.readFile(USERS_FILE, 'utf-8');
      users = JSON.parse(data);
    } catch {
      // File doesn't exist, start with empty array
    }
    
    const adminExists = users.find(user => user.email === 'admin@bookheaven.com');
    if (adminExists) {
      console.log('Admin user already exists!');
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = {
      id: Date.now().toString(),
      email: 'admin@bookheaven.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    
    users.push(adminUser);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@bookheaven.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: Admin');
    console.log('\n⚠️  Remember to change this password in production!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

createAdminUser();
