const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
const port = 3000;

app.use(cors()); // Ajoute CORS pour toutes les requêtes
app.use(express.json());

let db;

connectDB().then(database => {
    db = database;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});

app.get('/metier', async (req, res) => {
    try {
        const collection = db.collection('metier');
        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/metier/search', async (req, res) => {
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
});

app.get('/questions', async (req, res) => {
    try {
        const collection = db.collection('question');
        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/metier', async (req, res) => {
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
});
