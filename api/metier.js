// api/metier.js
import { connectDB } from '../../db';

let db;

export default async function handler(req, res) {
    if (!db) {
        db = await connectDB();
    }

    switch (req.method) {
        case 'GET':
            if (req.query.search) {
                await handleSearch(req, res, db);
            } else {
                await handleGetAll(req, res, db);
            }
            break;
        case 'POST':
            await handlePost(req, res, db);
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function handleGetAll(req, res, db) {
    try {
        const collection = db.collection('metier');
        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function handleSearch(req, res, db) {
    const { securite, confort, creativite } = req.query;
    const query = {};

    if (securite) query.securite = parseInt(securite);
    if (confort) query.confort = parseInt(confort);
    if (creativite) query.creativite = parseInt(creativite);

    try {
        const collection = db.collection('metier');
        const data = await collection.find(query).toArray();
        if (data.length > 0) {
            res.json(data);
        } else {
            res.status(404).send('Aucun métier trouvé');
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

async function handlePost(req, res, db) {
    const { nom, description, securite, confort, creativite } = req.body;

    if (!nom || !description || !securite || !confort || !creativite) {
        return res.status(400).send('Tous les champs sont requis');
    }

    const metier = {
        nom,
        description,
        securite: parseInt(securite),
        confort: parseInt(confort),
        creativite: parseInt(creativite)
    };

    try {
        const collection = db.collection('metier');
        const result = await collection.insertOne(metier);
        res.json(result);
    } catch (err) {
        res.status(500).send(err);
    }
}
