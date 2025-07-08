import db from '@/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    const { email, password } = await req.json();

    return new Promise((resolve) => {
        const sql = 'SELECT * FROM user WHERE email = ?';
        db.query(sql, [email], async (err, result) => {
            if (err) return resolve(Response.json({ success: false, message: err.message }));

            if (result.length > 0) {
                const user = result[0];
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRETKEY, { expiresIn: '1h' });
                    return resolve(Response.json({ success: true, token }));
                } else {
                    return resolve(Response.json({ success: false, message: 'Invalid credentials' }));
                }
            } else {
                return resolve(Response.json({ success: false, message: 'Invalid credentials' }));
            }
        });
    });
}
