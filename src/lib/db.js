// Database connection using Mongoose
import mongoose from 'mongoose';

// Hardcoded MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/crudtest';

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('✅ Connected to MongoDB successfully');
            return mongoose;
        }).catch((error) => {
            console.error('❌ MongoDB connection error:', error.message);
            if (error.message.includes('bad auth')) {
                console.error('🔐 Authentication failed. Please check your MongoDB credentials.');
            } else if (error.message.includes('ECONNREFUSED')) {
                console.error('🌐 Connection refused. Please check if MongoDB is running.');
            }
            throw error;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect; 