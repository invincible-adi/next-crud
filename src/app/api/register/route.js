import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    const { email, password, name } = await req.json();
    return new Promise((resolve) => {
        db.query('SELECT * FROM user WHERE email = ?', [email], async (err, result) => {
            if (err) return resolve(NextResponse.json({ success: false, message: err.message }, { status: 500 }));
            if (result.length > 0) {
                return resolve(NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 }));
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query('INSERT INTO user (email, password, name) VALUES (?, ?, ?)', [email, hashedPassword, name], (err2, result2) => {
                if (err2) return resolve(NextResponse.json({ success: false, message: err2.message }, { status: 500 }));
                return resolve(NextResponse.json({ success: true, user: { email, name } }));
            });
        });
    });
} 