import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://vnd:WNobD2Cw3xGnNQ2u@aha.haumld5.mongodb.net/?retryWrites=true&w=majority&appName=aha";
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getJobsCollection() {
  const conn = await clientPromise;
  const db = conn.db("aha");
  return db.collection("jobs");
}

export default clientPromise;
