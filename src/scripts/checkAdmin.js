/**
 * Script to check if a user is an admin
 * Usage: node src/scripts/checkAdmin.js email@example.com
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

async function checkAdmin(email) {
  if (!email) {
    console.error('Error: Please provide an email address');
    console.log('Usage: node src/scripts/checkAdmin.js email@example.com');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    // Import config for environment validation
    const { config } = require('../lib/config');
    
    // Validate environment before connecting
    if (!config.database.uri) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    await mongoose.connect(config.database.uri);
    console.log('Connected successfully\n');

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.error(`❌ User with email '${email}' not found`);
      console.log('\nMake sure the user exists in the database first.');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log('User Document:');
    console.log('═════════════════════════════════════════');
    console.log(`Email:         ${user.email}`);
    console.log(`Name:          ${user.name}`);
    console.log(`isAdmin:       ${user.isAdmin}`);
    console.log(`Has isAdmin:   ${user.isAdmin !== undefined ? 'Yes' : 'No'}`);
    console.log(`ID:            ${user._id}`);
    console.log(`Created:       ${user.createdAt}`);
    console.log(`Updated:       ${user.updatedAt}`);
    console.log('═════════════════════════════════════════');

    if (user.isAdmin === true) {
      console.log('\n✅ This user IS an admin');
      console.log('   They can access the admin panel at /admin/resources');
    } else if (user.isAdmin === false) {
      console.log('\n❌ This user is NOT an admin');
      console.log('   To make them an admin, run:');
      console.log(`   node src/scripts/makeAdmin.js ${email}`);
    } else {
      console.log('\n⚠️  Warning: isAdmin field is undefined');
      console.log('   Run the migration script to fix this:');
      console.log('   node src/scripts/ensureAdminField.js');
    }
    
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
checkAdmin(email);
