import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    const { email, password } = await req.json();
    return new Promise((resolve) => {
        db.query('SELECT * FROM user WHERE email = ?', [email], async (err, result) => {
            if (err) return resolve(NextResponse.json({ success: false, message: err.message }, { status: 500 }));
            if (result.length === 0) {
                return resolve(NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 }));
            }
            const user = result[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return resolve(NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 }));
            }
            const token = jwt.sign({ email: user.email, name: user.name }, 'secret', { expiresIn: '1h' });
            return resolve(NextResponse.json({ success: true, user: { email: user.email, name: user.name }, token }));
        });
    });
} 