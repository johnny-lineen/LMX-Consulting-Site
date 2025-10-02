# Database Seeding Scripts

This directory contains scripts for populating the database with sample data.

## Prompt Seeding Script

The `seedPrompts.ts` script populates the Prompt collection with 15 test prompts across 4 categories:

- **Microsoft 365** (4 prompts): Excel, Outlook, Teams, Word
- **Productivity** (4 prompts): Summarization, time management, writing helpers
- **Notion** (3 prompts): Content organization, dashboards, templates
- **AI Agents** (4 prompts): Task manager, meeting assistant, content creator

### Usage

1. **Set up environment variables**: Create a `.env.local` file in the project root with:
   ```
   MONGODB_URI=mongodb://localhost:27017/your-database-name
   ```

2. **Run the seeding script**:
   ```bash
   npm run seed:prompts
   ```

### What the script does

1. Connects to MongoDB using the `MONGODB_URI` environment variable
2. Clears all existing prompts from the database (`Prompt.deleteMany({})`)
3. Inserts 15 sample prompts with realistic content
4. Logs progress and summary information
5. Closes the database connection and exits

### Environment Setup

Make sure you have the required environment variables:

```bash
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/your-database-name

# For MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
```

### Dependencies

- `ts-node`: For running TypeScript files directly
- `dotenv`: For loading environment variables
- `mongoose`: For MongoDB operations
- `../src/models/Prompt`: The Prompt model from the main application

### Troubleshooting

**Error: MONGODB_URI environment variable is not set**
- Ensure you have a `.env.local` file in the project root
- Check that the file contains a valid MongoDB connection string

**Error: Cannot connect to MongoDB**
- Verify your MongoDB server is running (for local instances)
- Check your connection string is correct
- Ensure network access is configured (for MongoDB Atlas)

**Error: Unknown file extension ".ts"**
- Make sure `ts-node` is installed: `npm install ts-node --save-dev`
- The script uses a custom tsconfig.json for proper TypeScript compilation
