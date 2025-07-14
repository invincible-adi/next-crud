import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    user_id: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model('Task', TaskSchema); 