import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

function verifyToken(req) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    try {
        return jwt.verify(token, 'secret');
    } catch {
        return null;
    }
}

export async function GET(req) {
    await connectDB();
    const user = verifyToken(req);
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    try {
        const products = await Product.find({ user_id: user.email });
        return NextResponse.json({ success: true, products });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    const user = verifyToken(req);
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const { name, category, price, brand } = await req.json();
    try {
        await Product.create({ name, category, price, brand, user_id: user.email });
        return NextResponse.json({ success: true, message: 'Product added' });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

export async function PUT(req) {
    await connectDB();
    const user = verifyToken(req);
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const { id, name, category, price, brand } = await req.json();
    try {
        const updated = await Product.findOneAndUpdate(
            { _id: id, user_id: user.email },
            { name, category, price, brand },
            { new: true }
        );
        if (!updated) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Product updated' });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    const user = verifyToken(req);
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const { id } = await req.json();
    try {
        const deleted = await Product.findOneAndDelete({ _id: id, user_id: user.email });
        if (!deleted) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Product deleted' });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
} 