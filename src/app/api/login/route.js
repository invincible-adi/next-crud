import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

// Login endpoint
export async function POST(req) {
    try {
        await dbConnect(); // Ensure DB connection
        const { email, password } = await req.json();
        
        // Validate input
        if (!email || !password) {
            return NextResponse.json({ 
                success: false, 
                message: 'Email and password are required' 
            }, { status: 400 });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ 
                success: false, 
                message: 'Invalid credentials' 
            }, { status: 401 });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ 
                success: false, 
                message: 'Invalid credentials' 
            }, { status: 401 });
        }

        // Create JWT token
        const token = jwt.sign({ 
            email: user.email, 
            name: user.name, 
            id: user._id 
        }, 'secret', { expiresIn: '1h' });

        return NextResponse.json({ 
            success: true, 
            user: { 
                email: user.email, 
                name: user.name, 
                id: user._id 
            }, 
            token 
        });
    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json({ 
            success: false, 
            message: 'Server error. Please try again later.' 
        }, { status: 500 });
    }
} 