import db from '@/lib/db';
import jwt from 'jsonwebtoken';

function verifyToken(req) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    try {
        return jwt.verify(token, process.env.JWT_SECRETKEY);
    } catch {
        return null;
    }
}

export async function GET(req) {
    const user = verifyToken(req);
    if (!user) {
        return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const url = new URL(req.url, 'http://localhost');
    const id = url.searchParams.get('id');
    return new Promise((resolve) => {
        if (id) {
            db.query('SELECT * FROM task WHERE id = ? AND user_id = ?', [id, user.id], (err, result) => {
                if (err) return resolve(Response.json({ success: false, message: err.message }));
                return resolve(Response.json({ success: true, task: result[0] }));
            });
        } else {
            db.query('SELECT * FROM task WHERE user_id = ?', [user.id], (err, result) => {
                if (err) return resolve(Response.json({ success: false, message: err.message }));
                return resolve(Response.json({ success: true, tasks: result }));
            });
        }
    });
}

export async function POST(req) {
    const user = verifyToken(req);
    if (!user) {
        return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const { name, description, status } = await req.json();
    return new Promise((resolve) => {
        db.query('INSERT INTO task (user_id, name, description, status) VALUES (?, ?, ?, ?)', [user.id, name, description, status], (err, result) => {
            if (err) return resolve(Response.json({ success: false, message: err.message }));
            return resolve(Response.json({ success: true, message: 'Task added' }));
        });
    });
}

export async function PUT(req) {
    const user = verifyToken(req);
    if (!user) {
        return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const { id, name, description, status } = await req.json();
    return new Promise((resolve) => {
        db.query('SELECT * FROM task WHERE id = ? AND user_id = ?', [id, user.id], (err, result) => {
            if (err) return resolve(Response.json({ success: false, message: err.message }));
            if (result.length === 0) return resolve(Response.json({ success: false, message: 'Forbidden' }, { status: 403 }));
            db.query('UPDATE task SET name=?, description=?, status=? WHERE id=? AND user_id=?', [name, description, status, id, user.id], (err2, result2) => {
                if (err2) return resolve(Response.json({ success: false, message: err2.message }));
                return resolve(Response.json({ success: true, message: 'Task updated' }));
            });
        });
    });
}

export async function DELETE(req) {
    const user = verifyToken(req);
    if (!user) {
        return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await req.json();
    return new Promise((resolve) => {
        db.query('SELECT * FROM task WHERE id = ? AND user_id = ?', [id, user.id], (err, result) => {
            if (err) return resolve(Response.json({ success: false, message: err.message }));
            if (result.length === 0) return resolve(Response.json({ success: false, message: 'Forbidden' }, { status: 403 }));
            db.query('DELETE FROM task WHERE id=? AND user_id=?', [id, user.id], (err2, result2) => {
                if (err2) return resolve(Response.json({ success: false, message: err2.message }));
                return resolve(Response.json({ success: true, message: 'Task deleted' }));
            });
        });
    });
} 