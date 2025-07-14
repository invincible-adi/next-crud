import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import Task from '@/models/Task';

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
        const tasks = await Task.find({ user_id: user.email });
        return NextResponse.json({ success: true, tasks });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    const user = verifyToken(req);
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const { name, description, status } = await req.json();
    try {
        await Task.create({ name, description, status, user_id: user.email });
        return NextResponse.json({ success: true, message: 'Task added' });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

export async function PUT(req) {
    await connectDB();
    const user = verifyToken(req);
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const { id, name, description, status } = await req.json();
    try {
        const updated = await Task.findOneAndUpdate(
            { _id: id, user_id: user.email },
            { name, description, status },
            { new: true }
        );
        if (!updated) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Task updated' });
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
        const deleted = await Task.findOneAndDelete({ _id: id, user_id: user.email });
        if (!deleted) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Task deleted' });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
} 