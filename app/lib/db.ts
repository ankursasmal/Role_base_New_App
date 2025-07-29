import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const dbName = process.env.DB_NAME || 'rbac_dashboard'

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToDatabase() {
  try {
    if (!client) {
      client = new MongoClient(uri)
      await client.connect()
      console.log('Connected to MongoDB')
    }

    if (!db) {
      db = client.db(dbName)
    }
    
    return { client, db }
    } catch (error) {
    console.error('MongoDB connection error:', error)
      throw error
    }
  }
 
export { db }
