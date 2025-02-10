const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = process.env.DATABASE_URL || path.join(__dirname, "./src/config/database.sqlite");
console.log("📂 La base de datos se guardará en:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ Error al conectar la base de datos:", err.message);
    } else {
        console.log("✅ Base de datos conectada correctamente.");
    }
});

const initDatabase = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            console.log("📦 Verificando estructura de la base de datos...");

            db.run("PRAGMA foreign_keys = ON;", (err) => {
                if (err) {
                    console.error("❌ Error al configurar claves foráneas:", err.message);
                    return reject(err);
                }
                console.log("✅ Claves foráneas activadas.");
            });

            db.run(`CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                phone TEXT, 
                province TEXT,
                city TEXT,
                preferred_size INTEGER,
                preferred_energy_level INTEGER,
                has_children BOOLEAN,
                has_other_pets BOOLEAN,
                home_space INTEGER
            )`, (err) => {
                if (err) {
                    console.error("❌ Error al crear/verificar la tabla Users:", err.message);
                    return reject(err);
                }
                console.log("✅ Tabla Users verificada o creada.");
            });

            db.run(`CREATE TABLE IF NOT EXISTS Dogs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ownerId INTEGER NOT NULL,
                name TEXT NOT NULL,
                breed TEXT NOT NULL,
                age INTEGER NOT NULL,
                size INTEGER NOT NULL,
                energyLevel INTEGER NOT NULL,
                status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
                adoption_status TEXT CHECK(adoption_status IN ('adopted', 'not_adopted')) DEFAULT 'not_adopted',
                good_with_children INTEGER CHECK(good_with_children BETWEEN 1 AND 5),
                good_with_pets INTEGER CHECK(good_with_pets BETWEEN 1 AND 5),
                space_requirement INTEGER,
                image TEXT,
                FOREIGN KEY(ownerId) REFERENCES Users(id) ON DELETE CASCADE
            )`, (err) => {
                if (err) {
                    console.error("❌ Error al crear/verificar la tabla Dogs:", err.message);
                    return reject(err);
                }
                console.log("✅ Tabla Dogs verificada o creada.");
            });

            db.run(`CREATE TABLE IF NOT EXISTS AdoptionRequests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                adopterId INTEGER NOT NULL,
                dogId INTEGER NOT NULL,
                status TEXT CHECK(status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
                recommendation_score REAL DEFAULT 0.0,
                FOREIGN KEY(adopterId) REFERENCES Users(id) ON DELETE CASCADE,
                FOREIGN KEY(dogId) REFERENCES Dogs(id) ON DELETE CASCADE
            )`, (err) => {
                if (err) {
                    console.error("❌ Error al crear/verificar la tabla AdoptionRequests:", err.message);
                    return reject(err);
                }
                console.log("✅ Tabla AdoptionRequests verificada o creada.");
                resolve();
            });
        });
    });
};

module.exports = { db, initDatabase };
