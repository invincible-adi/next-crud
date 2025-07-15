import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';
import Task from '@/lib/models/Task';

// Helper to verify JWT token from request
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

// Get all tasks for the logged-in user
export async function GET(req) {
    await db;
    const user = verifyToken(req);
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    try {
        const tasks = await Task.find({ user: user.id });
        return NextResponse.json({ success: true, tasks });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

// Add a new task
export async function POST(req) {
    await db;
    const user = verifyToken(req);
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const { name, description, status } = await req.json();
    try {
        await Task.create({ name, description, status, user: user.id });
        return NextResponse.json({ success: true, message: 'Task added' });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

// Update a task
export async function PUT(req) {
    await db;
    const user = verifyToken(req);
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const { id, name, description, status } = await req.json();
    try {
        const updated = await Task.findOneAndUpdate(
            { _id: id, user: user.id },
            { name, description, status },
            { new: true }
        );
        if (!updated) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Task updated' });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

// Delete a task
export async function DELETE(req) {
    await db;
    const user = verifyToken(req);
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const { id } = await req.json();
    try {
        const deleted = await Task.findOneAndDelete({ _id: id, user: user.id });
        if (!deleted) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Task deleted' });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
} 