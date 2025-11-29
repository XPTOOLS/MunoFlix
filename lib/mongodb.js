import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
// Extract database name from URI or use default
const getDatabaseName = () => {
  // Parse the database name from the connection string
  const match = uri.match(/\/\/([^\/]+)\/([^?]+)/);
  if (match && match[2]) {
    return match[2];
  }
  return 'movieverse_analytics'; // fallback
};

const dbName = getDatabaseName();
console.log('Using database:', dbName);

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

client = new MongoClient(uri);
clientPromise = client.connect();

// Mongoose connection for models
let mongooseConnection = null;

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (mongooseConnection) {
    return mongooseConnection;
  }

  try {
    // Force connection to the correct database
    mongooseConnection = await mongoose.connect(uri, {
      dbName: 'movieverse_analytics' // Force this database name
    });
    console.log('MongoDB connected successfully to database: movieverse_analytics');
    return mongooseConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default clientPromise;
export const getDatabase = async () => {
  const client = await clientPromise;
  return client.db('movieverse_analytics'); // Force this database
};