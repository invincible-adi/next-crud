// Database connection using Mongoose
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crudtest';

if (!global._mongooseConnection) {
    global._mongooseConnection = mongoose.connect(MONGODB_URI);
}

export default global._mongooseConnection; 