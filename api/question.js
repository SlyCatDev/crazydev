// api/questions.js
import { connectDB } from '../../db';

let db;

export default async function handler(req, res) {
    if (!db) {
        db = await connectDB();
    }

    if (req.method === 'GET') {
        try {
            const collection = db.collection('question');
            const data = await collection.find({}).toArray();
            res.json(data);
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
