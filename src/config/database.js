const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbPath = process.env.DATABASE_URL || path.join(__dirname, "./src/config/database.sqlite");
console.log("📂 La base de datos se guardará en:", dbPath);

// Eliminar la base de datos solo si RESET_DB está activado en .env
if (process.env.RESET_DB === "true" && fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log("🗑️ Base de datos eliminada correctamente porque RESET_DB está activado.");
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ Error al conectar la base de datos", err);
    } else {
        console.log("✅ Base de datos conectada correctamente.");
    }
});

// ✅ Función para ejecutar consultas SELECT con async/await
const getAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

// ✅ Función para ejecutar consultas con Promesas (para usar con async/await)
const runAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};

// ✅ Función para inicializar la base de datos y crear tablas
const initDatabase = async () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            console.log("📦 Sincronizando base de datos...");

            db.run("PRAGMA foreign_keys = ON;", (err) => {
                if (err) {
                    console.error("❌ Error al configurar claves foráneas:", err);
                    reject(err);
                } else {
                    console.log("✅ Claves foráneas activadas.");
                }
            });

            // ✅ Crear o modificar tabla Users
            db.run(`CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                phone TEXT, -- ✅ Nueva columna para teléfono
                address TEXT, -- ✅ Nueva columna para dirección
                preferred_size INTEGER,
                preferred_energy_level INTEGER,
                has_children BOOLEAN,
                has_other_pets BOOLEAN,
                home_space INTEGER
            )`, (err) => {
                if (err) console.error("❌ Error al actualizar la tabla Users:", err);
                else console.log("✅ Tabla Users actualizada con las columnas 'phone' y 'address'.");
            });

            // ✅ Crear o modificar tabla Dogs sin alterar datos existentes
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
                if (err) console.error("❌ Error al actualizar la tabla Dogs:", err);
                else console.log("✅ Tabla Dogs actualizada.");
            });

            // ✅ Crear o modificar tabla AdoptionRequests
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
                    console.error("❌ Error al crear la tabla AdoptionRequests:", err);
                    reject(err);
                } else {
                    console.log("✅ Tabla AdoptionRequests creada/verificada.");
                    resolve();
                }
            });
        });
    });
};

// ✅ Función para migrar la base de datos sin eliminar datos
const migrateDatabase = async () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            console.log("📦 Migrando base de datos...");

            // ✅ Verificar si las columnas 'phone' y 'address' ya existen antes de agregarlas
            db.all(`PRAGMA table_info(Users);`, (err, columns) => {
                if (err) {
                    console.error("❌ Error obteniendo información de la tabla Users:", err);
                    reject(err);
                    return;
                }

                const columnNames = columns.map(col => col.name);
                if (!columnNames.includes("phone")) {
                    db.run(`ALTER TABLE Users ADD COLUMN phone TEXT;`, (err) => {
                        if (err) console.error("❌ Error al agregar la columna 'phone':", err);
                        else console.log("✅ Columna 'phone' agregada correctamente.");
                    });
                }
                if (!columnNames.includes("address")) {
                    db.run(`ALTER TABLE Users ADD COLUMN address TEXT;`, (err) => {
                        if (err) console.error("❌ Error al agregar la columna 'address':", err);
                        else console.log("✅ Columna 'address' agregada correctamente.");
                    });
                }
            });

            console.log("✅ Migración de la base de datos completada.");
            resolve();
        });
    });
};

// ✅ Exportar funciones correctamente
module.exports = { db, runAsync, getAsync, initDatabase, migrateDatabase };
