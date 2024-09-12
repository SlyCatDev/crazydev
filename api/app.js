import { MongoClient } from 'mongodb';

let db;

async function connectDB() {
  if (db) return db;
  const client = await MongoClient.connect('mongodb+srv://enzotessier:DjO3bR7V1dUluZ9Y@capeless-careers.ybowa.mongodb.net/Capeless-Careers', { useNewUrlParser: true, useUnifiedTopology: true });
  db = client.db('Capeless-Careers');
  return db;
}

export default async function handler(req, res) {
  const { method } = req;

  try {
    const database = await connectDB();
    const collection = database.collection('metier');

    switch (method) {
      case 'GET':
        if (req.query.search) {
          const query = {};
          if (req.query.securite) query.securite = parseInt(req.query.securite);
          if (req.query.confort) query.confort = parseInt(req.query.confort);
          if (req.query.creativite) query.creativite = parseInt(req.query.creativite);

          const data = await collection.find(query).toArray();
          if (data.length > 0) {
            res.status(200).json(data);
          } else {
            res.status(404).send('Aucun métier trouvé');
          }
        } else {
          const data = await collection.find({}).toArray();
          res.status(200).json(data);
        }
        break;
      case 'POST':
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

        const result = await collection.insertOne(metier);
        res.status(201).json(result);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}
