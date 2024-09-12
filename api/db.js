// db.js
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://enzotessier:DjO3bR7V1dUluZ9Y@capeless-careers.ybowa.mongodb.net/Capeless-Careers";
const client = new MongoClient(uri);

export async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client.db(); // Retourne la base de données
    } catch (err) {
        console.error(err);
        throw err; // Assurez-vous de lancer l'erreur pour que le code appelant puisse la gérer
    }
}
