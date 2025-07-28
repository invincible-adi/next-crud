import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
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
    try {
        await dbConnect();
        const user = verifyToken(req);
        if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        
        const tasks = await Task.find({ user: user.id });
        return NextResponse.json({ success: true, tasks });
    } catch (err) {
        console.error('Get tasks error:', err);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

// Add a new task
export async function POST(req) {
    try {
        await dbConnect();
        const user = verifyToken(req);
        if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        
        const { name, description, status } = await req.json();
        
        if (!name) {
            return NextResponse.json({ success: false, message: 'Task name is required' }, { status: 400 });
        }
        
        await Task.create({ name, description, status, user: user.id });
        return NextResponse.json({ success: true, message: 'Task added' });
    } catch (err) {
        console.error('Add task error:', err);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

// Update a task
export async function PUT(req) {
    try {
        await dbConnect();
        const user = verifyToken(req);
        if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        
        const { id, name, description, status } = await req.json();
        
        if (!id || !name) {
            return NextResponse.json({ success: false, message: 'Task ID and name are required' }, { status: 400 });
        }
        
        const updated = await Task.findOneAndUpdate(
            { _id: id, user: user.id },
            { name, description, status },
            { new: true }
        );
        if (!updated) return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Task updated' });
    } catch (err) {
        console.error('Update task error:', err);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

// Delete a task
export async function DELETE(req) {
    try {
        await dbConnect();
        const user = verifyToken(req);
        if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        
        const { id } = await req.json();
        
        if (!id) {
            return NextResponse.json({ success: false, message: 'Task ID is required' }, { status: 400 });
        }
        
        const deleted = await Task.findOneAndDelete({ _id: id, user: user.id });
        if (!deleted) return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Task deleted' });
    } catch (err) {
        console.error('Delete task error:', err);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
} 