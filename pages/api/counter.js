import { Pool } from 'pg';

// Verbindung zur PostgreSQL-Datenbank über die Umgebungsvariable DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Funktion zum Überprüfen und Erstellen der Tabelle, falls sie nicht existiert
const ensureTableExists = async () => {
    // Hier kannst du den SQL-Befehl zum Erstellen der Tabelle definieren
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS counter (
            id SERIAL PRIMARY KEY,
            count INTEGER DEFAULT 0
        );
    `;

    try {
        const client = await pool.connect();
        await client.query(createTableQuery);
        client.release();
        console.log('Tabelle "counter" erstellt oder bereits vorhanden.');
    } catch (err) {
        console.error('Fehler beim Erstellen der Tabelle:', err.message);
    }
};

// Funktion zum Abrufen des aktuellen Zählerwerts
const getCount = async () => {
    await ensureTableExists(); // Stellt sicher, dass die Tabelle existiert
    const res = await pool.query('SELECT count FROM counter WHERE id = 1');
    return res.rows[0].count;
};

// Funktion zum Inkrementieren des Zählerwerts
const incrementCount = async () => {
    console.log('Incrementing count...');
    await ensureTableExists(); // Stellt sicher, dass die Tabelle existiert
    const res = await pool.query('UPDATE counter SET count = count + 1 WHERE id = 1 RETURNING count');
    return res.rows[0].count;
};

// Hauptfunktion, die über HTTP-Anfragen aufgerufen wird
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
