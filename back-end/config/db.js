require('dotenv').config();
const mongoose = require('mongoose');
exports.connect = () => {
  const uri = process.env.MONGODB_URI; // URI MongoDB définie dans .env

  // Vérifie que l’URI est bien définie avant de tenter une connexion
  if (!uri) {
    console.error('Variable MONGODB_URI manquante dans .env');
    process.exit(1); // Arrêt immédiat si la config est invalide
  }

  // Connexion à MongoDB via Mongoose avec options de timeout explicites
  mongoose
    .connect(uri, {
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000, 
    })
    .then(() => {
      console.log('Connexion MongoDB réussie'); 
    })
    .catch((err) => {
      // Si échec de la connexion : log explicite + arrêt complet
      console.error('Échec de la connexion MongoDB :', err.message);
      process.exit(1);
    });
};
