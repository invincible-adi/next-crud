import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import User from '@/lib/models/User';

// Login endpoint
export async function POST(req) {
    await db; // Ensure DB connection
    const { email, password } = await req.json();
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }
        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }
        // Create JWT token
        const token = jwt.sign({ email: user.email, name: user.name, id: user._id }, 'secret', { expiresIn: '1h' });
        return NextResponse.json({ success: true, user: { email: user.email, name: user.name, id: user._id }, token });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
} 