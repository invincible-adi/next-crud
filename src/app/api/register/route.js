import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import bcrypt from 'bcryptjs';
import User from '@/models/User';

export async function POST(req) {
    await connectDB();
    const { email, password, name } = await req.json();
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword, name });
        return NextResponse.json({ success: true, user: { email, name } });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
} 