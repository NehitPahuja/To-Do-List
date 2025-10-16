import { MongoClient, type Collection } from "mongodb"
import type { TodoDocument } from "@/types/todo"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Missing MONGODB_URI. Add it to your environment to enable database access.")
}

const options = {
  maxIdleTimeMS: 10_000,
}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

type GlobalWithMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

const globalWithMongo = globalThis as GlobalWithMongo

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise!
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getMongoClient() {
  if (!clientPromise) {
    clientPromise = new MongoClient(uri, options).connect()
  }
  return clientPromise
}

export async function getTodosCollection(): Promise<Collection<TodoDocument>> {
  const client = await getMongoClient()
  const dbName = process.env.MONGODB_DB || "todo"
  return client.db(dbName).collection<TodoDocument>("todos")
}
