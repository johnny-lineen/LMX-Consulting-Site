/**
 * Test Script: Conversation Creation with SessionId
 * 
 * This script tests that:
 * 1. New conversations are created with unique sessionIds
 * 2. No duplicate key errors occur
 * 3. sessionId is never null
 * 
 * Run with: node src/scripts/testConversationCreation.js
 */

const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

// Import config for environment validation
const { config } = require('../lib/config');

const MONGODB_URI = config.database.uri;
const DB_NAME = config.database.name;

async function testConversationCreation() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db(DB_NAME);
    const conversations = db.collection('conversations');
    
    // Test 1: Create conversation WITH sessionId
    console.log('📝 Test 1: Creating conversation WITH sessionId...');
    const testConv1 = {
      conversationId: randomUUID(),
      sessionId: randomUUID(),  // Explicitly provided
      userId: 'test-user-123',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    try {
      const result1 = await conversations.insertOne(testConv1);
      console.log(`✅ Test 1 PASSED: Created conversation with sessionId: ${testConv1.sessionId}`);
      console.log(`   Document ID: ${result1.insertedId}\n`);
    } catch (err) {
      console.error(`❌ Test 1 FAILED:`, err.message, '\n');
    }
    
    // Test 2: Create conversation WITHOUT sessionId (should fail with required field error)
    console.log('📝 Test 2: Creating conversation WITHOUT sessionId (should fail)...');
    const testConv2 = {
      conversationId: randomUUID(),
      // sessionId intentionally omitted
      userId: 'test-user-456',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    try {
      const result2 = await conversations.insertOne(testConv2);
      console.log(`⚠️  Test 2 WARNING: Created conversation without sessionId (should have failed)`);
      console.log(`   Document ID: ${result2.insertedId}\n`);
    } catch (err) {
      if (err.message.includes('sessionId')) {
        console.log(`✅ Test 2 PASSED: Correctly rejected conversation without sessionId\n`);
      } else {
        console.error(`❌ Test 2 FAILED with unexpected error:`, err.message, '\n');
      }
    }
    
    // Test 3: Create multiple conversations rapidly
    console.log('📝 Test 3: Creating 5 conversations rapidly...');
    let successCount = 0;
    let failCount = 0;
    const sessionIds = new Set();
    
    for (let i = 0; i < 5; i++) {
      const testConv = {
        conversationId: randomUUID(),
        sessionId: randomUUID(),
        userId: `test-user-bulk-${i}`,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      try {
        await conversations.insertOne(testConv);
        sessionIds.add(testConv.sessionId);
        successCount++;
        console.log(`  ✓ Conversation ${i + 1}/5 created (sessionId: ${testConv.sessionId})`);
      } catch (err) {
        failCount++;
        console.error(`  ✗ Conversation ${i + 1}/5 failed:`, err.message);
      }
    }
    
    console.log(`\n✅ Test 3 Results:`);
    console.log(`   Successful: ${successCount}/5`);
    console.log(`   Failed: ${failCount}/5`);
    console.log(`   Unique sessionIds: ${sessionIds.size}/5\n`);
    
    // Test 4: Verify no null sessionIds exist
    console.log('📝 Test 4: Checking for null sessionIds in database...');
    const nullCount = await conversations.countDocuments({
      $or: [
        { sessionId: null },
        { sessionId: { $exists: false } }
      ]
    });
    
    if (nullCount === 0) {
      console.log(`✅ Test 4 PASSED: No null sessionIds found\n`);
    } else {
      console.log(`❌ Test 4 FAILED: Found ${nullCount} documents with null sessionId\n`);
    }
    
    // Cleanup test documents
    console.log('🧹 Cleaning up test documents...');
    const deleteResult = await conversations.deleteMany({
      userId: { $regex: /^test-user/ }
    });
    console.log(`✅ Deleted ${deleteResult.deletedCount} test documents\n`);
    
    // Final summary
    console.log('📊 FINAL SUMMARY:');
    const totalDocs = await conversations.countDocuments({});
    const docsWithSessionId = await conversations.countDocuments({
      sessionId: { $ne: null, $exists: true }
    });
    
    console.log(`   Total conversations: ${totalDocs}`);
    console.log(`   With valid sessionId: ${docsWithSessionId}`);
    console.log(`   With null sessionId: ${totalDocs - docsWithSessionId}`);
    
    if (totalDocs === docsWithSessionId) {
      console.log('\n✨ ALL TESTS PASSED! Database is healthy.\n');
    } else {
      console.log('\n⚠️  WARNING: Some documents still have null sessionId\n');
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the tests
if (require.main === module) {
  testConversationCreation()
    .then(() => {
      console.log('✅ Testing complete');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Testing failed:', err);
      process.exit(1);
    });
}

module.exports = { testConversationCreation };
