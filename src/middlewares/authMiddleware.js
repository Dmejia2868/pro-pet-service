const jwt = require("jsonwebtoken");
const SECRET_KEY = "supersecreto"; // Usa una clave segura

const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ error: "Acceso denegado, se requiere token" });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.user = verified; // Se almacena la info del usuario en req.user
        next();
    } catch (error) {
        res.status(403).json({ error: "Token inválido" });
    }
};

module.exports = authenticateToken;
