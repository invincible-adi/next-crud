import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    const { email, password } = await req.json();

    return new Promise((resolve) => {
        db.query(
            'SELECT * FROM user WHERE email = ?',
            [email],
            async (err, results) => {
                if (results.length > 0) {
                    resolve(
                        Response.json({ success: false, message: 'User already exists' })
                    );
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    db.query(
                        'INSERT INTO user (email, password) VALUES (?, ?)',
                        [email, hashedPassword],
                        (err2) => {
                            if (err2) throw err2;
                            resolve(Response.json({ success: true, message: 'Registered' }));
                        }
                    );
                }
            }
        );
    });
}
