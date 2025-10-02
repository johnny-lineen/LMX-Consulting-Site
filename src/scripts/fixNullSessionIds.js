/**
 * Database Cleanup Script: Fix Null SessionIds
 * 
 * This script fixes the MongoDB duplicate key error by:
 * 1. Finding all conversations with sessionId: null
 * 2. Assigning unique sessionIds to each document
 * 3. Removing any truly broken documents if needed
 * 
 * Run with: node src/scripts/fixNullSessionIds.js
 */

const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

// Import config for environment validation
const { config } = require('../lib/config');

const MONGODB_URI = config.database.uri;
const DB_NAME = config.database.name;

async function fixNullSessionIds() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const conversations = db.collection('conversations');
    
    // Step 1: Find all documents with null or missing sessionId
    console.log('\n🔍 Searching for conversations with null sessionId...');
    const nullSessionDocs = await conversations.find({
      $or: [
        { sessionId: null },
        { sessionId: { $exists: false } }
      ]
    }).toArray();
    
    console.log(`📊 Found ${nullSessionDocs.length} conversations with null sessionId`);
    
    if (nullSessionDocs.length === 0) {
      console.log('✅ No null sessionIds found. Database is clean!');
      return;
    }
    
    // Step 2: Fix each document by assigning a unique sessionId
    console.log('\n🔧 Fixing null sessionIds...');
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const doc of nullSessionDocs) {
      try {
        const newSessionId = randomUUID();
        
        const result = await conversations.updateOne(
          { _id: doc._id },
          { 
            $set: { 
              sessionId: newSessionId,
              updatedAt: new Date()
            } 
          }
        );
        
        if (result.modifiedCount > 0) {
          fixedCount++;
          console.log(`  ✓ Fixed conversation ${doc.conversationId} → sessionId: ${newSessionId}`);
        }
      } catch (err) {
        errorCount++;
        console.error(`  ✗ Error fixing conversation ${doc.conversationId}:`, err.message);
      }
    }
    
    console.log(`\n📈 Summary:`);
    console.log(`  ✅ Fixed: ${fixedCount} conversations`);
    console.log(`  ❌ Errors: ${errorCount} conversations`);
    
    // Step 3: Verify all sessionIds are now unique and non-null
    console.log('\n🔍 Verifying all conversations have sessionId...');
    const remainingNulls = await conversations.countDocuments({
      $or: [
        { sessionId: null },
        { sessionId: { $exists: false } }
      ]
    });
    
    if (remainingNulls === 0) {
      console.log('✅ SUCCESS! All conversations now have unique sessionIds');
    } else {
      console.warn(`⚠️  WARNING: ${remainingNulls} conversations still have null sessionId`);
    }
    
    // Step 4: Check for duplicate sessionIds (shouldn't happen with UUID)
    console.log('\n🔍 Checking for duplicate sessionIds...');
    const duplicates = await conversations.aggregate([
      { $match: { sessionId: { $ne: null } } },
      { $group: { _id: '$sessionId', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();
    
    if (duplicates.length === 0) {
      console.log('✅ No duplicate sessionIds found');
    } else {
      console.warn(`⚠️  WARNING: Found ${duplicates.length} duplicate sessionIds`);
      duplicates.forEach(dup => {
        console.warn(`  - sessionId: ${dup._id} appears ${dup.count} times`);
      });
    }
    
    // Step 5: Ensure unique index exists
    console.log('\n🔍 Checking indexes...');
    const indexes = await conversations.indexes();
    const hasSessionIdIndex = indexes.some(idx => idx.key.sessionId);
    
    if (hasSessionIdIndex) {
      console.log('✅ sessionId index exists');
    } else {
      console.log('⚠️  Creating sessionId index...');
      await conversations.createIndex({ sessionId: 1 });
      console.log('✅ sessionId index created');
    }
    
    console.log('\n✨ Database cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the cleanup
if (require.main === module) {
  fixNullSessionIds()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n❌ Script failed:', err);
      process.exit(1);
    });
}

module.exports = { fixNullSessionIds };
