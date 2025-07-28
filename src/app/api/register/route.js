import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

// Register endpoint
export async function POST(req) {
    try {
        // Ensure DB connection
        await dbConnect();
        
        const { email, password, name } = await req.json();
        
        // Validate input
        if (!email || !password || !name) {
            return NextResponse.json({ 
                success: false, 
                message: 'Email, password, and name are required' 
            }, { status: 400 });
        }

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ 
                success: false, 
                message: 'User already exists' 
            }, { status: 400 });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ 
            email, 
            password: hashedPassword, 
            name 
        });

        return NextResponse.json({ 
            success: true, 
            user: { 
                email: user.email, 
                name: user.name,
                id: user._id 
            } 
        });
    } catch (err) {
        console.error('Register error:', err);
        
        // Provide more specific error messages
        if (err.name === 'ValidationError') {
            return NextResponse.json({ 
                success: false, 
                message: 'Validation error: ' + Object.values(err.errors).map(e => e.message).join(', ') 
            }, { status: 400 });
        }
        
        return NextResponse.json({ 
            success: false, 
            message: 'Server error. Please try again later.' 
        }, { status: 500 });
    }
} 