const sharp = require('sharp'); 
const path = require('path'); 
const fs = require('fs'); 

// Middleware d’optimisation d’image à appliquer après l’upload (via Multer)
module.exports = (req, res, next) => {
  if (!req.file) return next();

  const { filename } = req.file;

  // Chemin complet du fichier d’origine (uploadé brut par Multer)
  const inputPath = path.join(__dirname, '../images', filename);

  // Définition du nom et chemin de sortie pour l’image optimisée
  const optimizedFilename = 'optimized_' + filename;
  const outputPath = path.join(__dirname, '../images', optimizedFilename);

  sharp(inputPath)
    .resize({
      width: 500,
      withoutEnlargement: true
    })
    .jpeg({ quality: 70 })
    .toFile(outputPath)
    .then(() => {
      // Suppression du fichier original une fois le fichier optimisé généré
      fs.unlink(inputPath, (err) => {
        if (err) {
          console.error('Erreur lors de la suppression du fichier original :', err);
        }

        // Mise à jour de la requête pour que le contrôleur utilise le nom du fichier optimisé
        req.file.filename = optimizedFilename;

        next();
      });
    })
    .catch((err) => {
      // Gestion des erreurs de traitement (problème de lecture, encodage, etc.)
      console.error('Erreur optimisation image :', err);
      res.status(500).json({
        error: "Erreur lors de l'optimisation de l'image"
      });
    });
};
