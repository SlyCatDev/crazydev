const { MongoClient } = require('mongodb');

async function connectDB() {
    const uri = "mongodb+srv://enzotessier:DjO3bR7V1dUluZ9Y@capeless-careers.ybowa.mongodb.net/Capeless-Careers"; // Connexion à la base de données 'local'
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client.db(); // Retourne la base de données 'local'
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB;
