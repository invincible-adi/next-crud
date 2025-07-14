import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import bcrypt from 'bcryptjs';
import User from '@/models/User';

export async function POST(req) {
    await connectDB();
    const { email, password } = await req.json();
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }
        const token = jwt.sign({ email: user.email, name: user.name }, 'secret', { expiresIn: '1h' });
        return NextResponse.json({ success: true, user: { email: user.email, name: user.name }, token });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
} 