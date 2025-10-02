/**
 * Script to make a user an admin
 * Usage: node src/scripts/makeAdmin.js email@example.com
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Define User schema inline to avoid TypeScript import issues
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

async function makeAdmin(email) {
  if (!email) {
    console.error('Error: Please provide an email address');
    console.log('Usage: node src/scripts/makeAdmin.js email@example.com');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully');

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.error(`Error: User with email '${email}' not found`);
      console.log('\nMake sure the user exists in the database first.');
      await mongoose.disconnect();
      process.exit(1);
    }

    if (user.isAdmin === true) {
      console.log(`User '${email}' is already an admin`);
      await mongoose.disconnect();
      process.exit(0);
    }

    user.isAdmin = true;
    await user.save();

    console.log(`\n✓ Success! User '${email}' is now an admin`);
    console.log('\nUpdated User Document:');
    console.log('─────────────────────────────────────');
    console.log(`Email:    ${user.email}`);
    console.log(`Name:     ${user.name}`);
    console.log(`isAdmin:  ${user.isAdmin}`);
    console.log(`ID:       ${user._id}`);
    console.log(`Created:  ${user.createdAt}`);
    console.log('─────────────────────────────────────');
    console.log('\nYou can now:');
    console.log('1. Log in with this account');
    console.log('2. Access the admin panel at /admin/resources');
    console.log('3. Upload and manage resources');
    
    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : JSON.stringify(error));
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];
makeAdmin(email);
