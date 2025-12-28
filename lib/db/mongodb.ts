import { MongoClient, type Db } from "mongodb"
import mongoose from 'mongoose';

// mongoose.connect(
//   "mongodb+srv://barunsungh10_db_user:3iqllZrM8adUqhcm@cluster0.3wng5uu.mongodb.net/",{
//       "dbName":"Barun db"

// }).then(()=>console.log("Mongodb ")).catch((error)=>console.log(error));

// if (!process.env.MONGODB_URI) {
//   throw new Error("Please add your Mongo URI to .env.local")
// }

const uri ="mongodb+srv://barunsungh10_db_user:VDc03dcZVWjccWZt@cluster0.nz8abrm.mongodb.net/";
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("article-cms")
}

export default clientPromise
