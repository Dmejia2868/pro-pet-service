const app = require("./app");
const { initDatabase } = require("./config/database");
const BaseRepository = require("./infrastructure/repositories/baseRepository"); // Importar BaseRepository

const PORT = process.env.PORT || 3000;

// 📌 Inicializar la base de datos antes de arrancar el servidor
initDatabase()
    .then(async () => {
        console.log("✅ Base de datos sincronizada correctamente.");

        // 🔄 Corrección de contraseñas solo una vez
        await BaseRepository.fixPasswords();
        console.log("🚀 Corrección de contraseñas completada.");
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Error al inicializar la base de datos:", err);
    });
