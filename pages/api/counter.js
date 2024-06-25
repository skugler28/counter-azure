import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const getCount = async () => {
    const res = await pool.query('SELECT count FROM counter WHERE id = 1');
    return res.rows[0].count;
};

const incrementCount = async () => {
    const res = await pool.query('UPDATE counter SET count = count + 1 WHERE id = 1 RETURNING count');
    return res.rows[0].count;
};

export default async (req, res) => {
    if (req.method === 'GET') {
        const count = await getCount();
        res.status(200).json({ count });
    } else if (req.method === 'POST') {
        const count = await incrementCount();
        res.status(200).json({ count });
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
