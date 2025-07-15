import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import User from '@/lib/models/User';

// Register endpoint
export async function POST(req) {
    await db; // Ensure DB connection
    const { email, password, name } = await req.json();
    try {
        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
        }
        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword, name });
        return NextResponse.json({ success: true, user: { email: user.email, name: user.name } });
    } catch (err) {
        console.error('Register error:', err); // Log the error for debugging
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
} 