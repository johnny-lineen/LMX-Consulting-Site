/**
 * Script to list all admin users
 * Usage: node src/scripts/listAdmins.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Define User schema inline
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  name: { type: String, required: true, trim: true, maxlength: 50 },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function listAdmins() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully\n');

    const admins = await User.find({ isAdmin: true }).sort({ createdAt: 1 });
    const totalUsers = await User.countDocuments();
    
    console.log('═══════════════════════════════════════════════════');
    console.log('  Admin Users List');
    console.log('═══════════════════════════════════════════════════\n');
    
    console.log(`Total Users in Database: ${totalUsers}`);
    console.log(`Admin Users: ${admins.length}\n`);

    if (admins.length === 0) {
      console.log('❌ No admin users found.');
      console.log('\nTo create an admin user, run:');
      console.log('   node src/scripts/makeAdmin.js email@example.com\n');
    } else {
      console.log('Admin Users:');
      console.log('─────────────────────────────────────────────────\n');
      
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name}`);
        console.log(`   Email:   ${admin.email}`);
        console.log(`   ID:      ${admin._id}`);
        console.log(`   Created: ${admin.createdAt}`);
        console.log('');
      });
    }

    console.log('═══════════════════════════════════════════════════\n');
    
    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : JSON.stringify(error));
    await mongoose.disconnect();
    process.exit(1);
  }
}

listAdmins();
