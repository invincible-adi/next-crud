import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

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

export async function GET(req) {
    const user = verifyToken(req);
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    return new Promise((resolve) => {
        db.query('SELECT * FROM product WHERE user_id = ?', [user.email], (err, result) => {
            if (err) return resolve(NextResponse.json({ success: false, message: err.message }, { status: 500 }));
            return resolve(NextResponse.json({ success: true, products: result }));
        });
    });
}

export async function POST(req) {
    const user = verifyToken(req);
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const { name, category, price, brand } = await req.json();
    return new Promise((resolve) => {
        db.query('INSERT INTO product (name, category, price, brand, user_id) VALUES (?, ?, ?, ?, ?)', [name, category, price, brand, user.email], (err, result) => {
            if (err) return resolve(NextResponse.json({ success: false, message: err.message }, { status: 500 }));
            return resolve(NextResponse.json({ success: true, message: 'Product added' }));
        });
    });
}

export async function PUT(req) {
    const user = verifyToken(req);
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const { id, name, category, price, brand } = await req.json();
    return new Promise((resolve) => {
        db.query('UPDATE product SET name=?, category=?, price=?, brand=? WHERE id=? AND user_id=?', [name, category, price, brand, id, user.email], (err, result) => {
            if (err) return resolve(NextResponse.json({ success: false, message: err.message }, { status: 500 }));
            if (result.affectedRows === 0) return resolve(NextResponse.json({ success: false, message: 'Not found' }, { status: 404 }));
            return resolve(NextResponse.json({ success: true, message: 'Product updated' }));
        });
    });
}

export async function DELETE(req) {
    const user = verifyToken(req);
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    const { id } = await req.json();
    return new Promise((resolve) => {
        db.query('DELETE FROM product WHERE id=? AND user_id=?', [id, user.email], (err, result) => {
            if (err) return resolve(NextResponse.json({ success: false, message: err.message }, { status: 500 }));
            if (result.affectedRows === 0) return resolve(NextResponse.json({ success: false, message: 'Not found' }, { status: 404 }));
            return resolve(NextResponse.json({ success: true, message: 'Product deleted' }));
        });
    });
} 