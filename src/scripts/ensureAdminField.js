/**
 * One-time migration script to ensure all users have an isAdmin field
 * Sets isAdmin: false for any users that don't have it defined
 * Usage: node src/scripts/ensureAdminField.js
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

async function ensureAdminField() {
  try {
    console.log('═══════════════════════════════════════════════════');
    console.log('  Migration: Ensure isAdmin Field on All Users');
    console.log('═══════════════════════════════════════════════════\n');

    console.log('Connecting to MongoDB...');
    // Import config for environment validation
    const { config } = require('../lib/config');
    
    // Validate environment before connecting
    if (!config.database.uri) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    await mongoose.connect(config.database.uri);
    console.log('✓ Connected successfully\n');

    // Count total users
    const totalUsers = await User.countDocuments();
    console.log(`Found ${totalUsers} total user(s) in database\n`);

    if (totalUsers === 0) {
      console.log('No users found. Nothing to migrate.');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Find users without isAdmin field or with undefined isAdmin
    const usersWithoutField = await User.find({
      $or: [
        { isAdmin: { $exists: false } },
        { isAdmin: null },
        { isAdmin: undefined }
      ]
    });

    console.log(`Users without isAdmin field: ${usersWithoutField.length}\n`);

    if (usersWithoutField.length === 0) {
      console.log('✅ All users already have the isAdmin field!');
      console.log('   No migration needed.\n');

      // Show current admin status
      const admins = await User.find({ isAdmin: true });
      const regularUsers = await User.find({ isAdmin: false });
      
      console.log('Current Status:');
      console.log(`  - Admins:        ${admins.length}`);
      console.log(`  - Regular users: ${regularUsers.length}`);
      console.log(`  - Total:         ${totalUsers}\n`);

      if (admins.length > 0) {
        console.log('Admin Users:');
        admins.forEach(admin => {
          console.log(`  - ${admin.email} (${admin.name})`);
        });
      }
    } else {
      console.log('Updating users without isAdmin field...\n');

      // Update users to have isAdmin: false
      const result = await User.updateMany(
        {
          $or: [
            { isAdmin: { $exists: false } },
            { isAdmin: null },
            { isAdmin: undefined }
          ]
        },
        {
          $set: { isAdmin: false }
        }
      );

      console.log('✓ Migration Complete!\n');
      console.log('Results:');
      console.log(`  - Users matched:  ${result.matchedCount}`);
      console.log(`  - Users modified: ${result.modifiedCount}\n`);

      // Show updated users
      if (result.modifiedCount > 0) {
        console.log('Updated Users:');
        const updatedUsers = await User.find({ 
          _id: { $in: usersWithoutField.map(u => u._id) }
        });
        
        updatedUsers.forEach(user => {
          console.log(`  - ${user.email} → isAdmin: ${user.isAdmin}`);
        });
        console.log('');
      }

      // Show final status
      const admins = await User.find({ isAdmin: true });
      const regularUsers = await User.find({ isAdmin: false });
      
      console.log('Final Status:');
      console.log(`  - Admins:        ${admins.length}`);
      console.log(`  - Regular users: ${regularUsers.length}`);
      console.log(`  - Total:         ${totalUsers}`);
    }
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('  Migration Complete');
    console.log('═══════════════════════════════════════════════════\n');
    
    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('\n❌ Migration Error:', error instanceof Error ? error.message : JSON.stringify(error));
    console.error('[ERROR OBJECT]:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

ensureAdminField();
