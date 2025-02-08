// 📌 Cargar variables de entorno
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const userRoutes = require("./infrastructure/controllers/userController");
const dogRoutes = require("./infrastructure/controllers/dogController");
const adoptionRoutes = require("./infrastructure/controllers/adoptionController");

const app = express();

// 📂 Crear la carpeta "uploads" si no existe
const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });
console.log("✅ Carpeta 'uploads' verificada.");

// 📂 Servir archivos estáticos desde la carpeta 'uploads'
app.use("/uploads", express.static(uploadDir));

// 🔥 Configurar CORS dinámico
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : ["http://localhost:5173"];
app.use(cors({
    origin: (origin, callback) => {
        console.log("🌍 Origin recibido:", origin);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Middleware para procesar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Sustituye a `bodyParser.urlencoded()`

// ✅ Ruta de prueba
app.get("/", (req, res) => {
    res.send("🚀 Servidor funcionando correctamente en Express");
});

// ✅ Rutas de la API
app.use("/api/users", userRoutes);
app.use("/api/dogs", dogRoutes);
app.use("/api/adoptions", adoptionRoutes);

// ✅ Configuración de la base de datos SQLite
const dbPath = process.env.DATABASE_URL || path.join(__dirname, "database.sqlite");
console.log("📂 Base de datos en:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ Error al conectar la base de datos:", err);
    } else {
        console.log("✅ Base de datos conectada correctamente.");
    }
});

// 🔥 Activar claves foráneas en SQLite
db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON;");
});

// ✅ Exportar `app` para ser usado en `server.js`
module.exports = app;
