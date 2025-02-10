const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log("🔑 Token recibido:", token);

    if (!token) {
        console.log("❌ No se recibió token en la solicitud");
        return res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log("❌ Error al verificar token:", err);
            return res.status(403).json({ error: "Token inválido o expirado." });
        }

        console.log("✅ Token decodificado correctamente:", decoded);

        req.userId = decoded.userId; // 🔥 Asegurar que esto se asigna
        console.log("🆔 Usuario autenticado con ID:", req.userId);
        next();
    });
};

module.exports = authenticateToken;
