import { MongoClient, Db } from 'mongodb'

const uri = "mongodb+srv://arijchowdhury:Arij1234@cluster0.ypvv5cp.mongodb.net/rbac_dashboard?retryWrites=true&w=majority&appName=ecommerce"
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
