const multer = require('multer');
const path = require('path');

// -----------------------------------------------------------------------------
// Définition des types MIME autorisés pour l’upload d’images
// -----------------------------------------------------------------------------
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

// -----------------------------------------------------------------------------
// Configuration du stockage disque avec multer
// -----------------------------------------------------------------------------
const storage = multer.diskStorage({
  // Dossier de destination des fichiers uploadés
  destination: (req, file, callback) => {
    callback(null, 'images'); // Tous les fichiers sont stockés dans le dossier /images
  },

  filename: (req, file, callback) => {

    const name = file.originalname
      .split(' ')
      .join('_')
      .normalize('NFD')               
      .replace(/[\u0300-\u036f]/g, '') 
      .replace(/[^a-zA-Z0-9_-]/g, ''); 

    // Récupère l’extension à partir du type MIME
    const extension = MIME_TYPES[file.mimetype];

    // Génère un nom de fichier unique avec un timestamp
    const finalName = `${name}_${Date.now()}.${extension}`;
    callback(null, finalName);
  },
});

// -----------------------------------------------------------------------------
// Filtrage des fichiers par leur type MIME (pour éviter les fichiers malicieux)
// -----------------------------------------------------------------------------
const fileFilter = (req, file, callback) => {
  if (MIME_TYPES[file.mimetype]) {
    callback(null, true); // Fichier autorisé
  } else {
    req.fileValidationError = 'Format de fichier non autorisé';
    callback(null, false); 
  }
};


const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
  fileFilter,
}).single('image');

module.exports = upload;
