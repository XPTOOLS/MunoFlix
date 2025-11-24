import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'movieverse_analytics';

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

client = new MongoClient(uri);
clientPromise = client.connect();

export default clientPromise;
export const getDatabase = async () => {
  const client = await clientPromise;
  return client.db(dbName);
};