const jwt = require('jsonwebtoken');

// -----------------------------------------------------------------------------
// Middleware d’authentification : vérifie le token JWT dans l’en-tête Authorization
// -----------------------------------------------------------------------------
module.exports = (req, res, next) => {
  try {
    // Récupération de l'en-tête Authorization
    const authorization = req.headers.authorization;

    // Vérifie que l’en-tête existe et commence bien par "Bearer "
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(400).json({ error: 'Token mal formé' });
    }

    // Extraction du token à partir de l’en-tête : "Bearer <token>"
    const token = authorization.split(' ')[1];

    // Vérification et décodage du token à l’aide de la clé secrète définie dans .env
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    // Injection de l’ID utilisateur décodé dans la requête (req.auth)
    req.auth = { userId: decodedToken.userId };

    next();
  } catch (error) {
    console.error("Erreur d'authentification :", error.message);
    res.status(401).json({ error: 'Requête non authentifiée' });
  }
};
