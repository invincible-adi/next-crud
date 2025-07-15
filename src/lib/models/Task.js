import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'in-progress', 'done'], default: 'pending' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, collection: 'Task' });

export default mongoose.models.Task || mongoose.model('Task', taskSchema); 