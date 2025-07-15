import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String },
    price: { type: Number, required: true },
    brand: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, collection: 'Product' });

export default mongoose.models.Product || mongoose.model('Product', productSchema); 