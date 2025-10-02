const { MongoClient } = require('mongodb');

// Import config for environment validation
const { config } = require('../lib/config');

const MONGODB_URI = config.database.uri;

async function migrateCollections() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Current collections:', collections.map(c => c.name));
    
    // Collections to drop (old/duplicate collections)
    const collectionsToDrop = [
      'convoinsights', // Old collection name
      'conversationinsights', // If it exists with old schema
      'insights', // Generic insights collection
      'testconversations', // Test collections
      'testinsights',
      'testuserinsights',
      'testconvoinsights',
      'debugconversations',
      'debuginsights',
      'tempconversations',
      'tempinsights'
    ];
    
    // Drop old collections
    for (const collectionName of collectionsToDrop) {
      const collectionExists = collections.some(c => c.name === collectionName);
      if (collectionExists) {
        await db.collection(collectionName).drop();
        console.log(`✅ Dropped collection: ${collectionName}`);
      }
    }
    
    // Verify final collections
    const finalCollections = await db.listCollections().toArray();
    console.log('Final collections:', finalCollections.map(c => c.name));
    
    // Expected collections after cleanup
    const expectedCollections = ['conversations', 'conversationinsights', 'userinsights', 'users'];
    const missingCollections = expectedCollections.filter(name => 
      !finalCollections.some(c => c.name === name)
    );
    
    if (missingCollections.length > 0) {
      console.log('⚠️  Missing expected collections:', missingCollections);
    } else {
      console.log('✅ All expected collections are present');
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run migration
migrateCollections();
