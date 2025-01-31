const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) console.error("❌ Error al conectar la base de datos", err);
    else console.log("📦 Base de datos conectada.");
});

// Crear tablas si no existen
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS Dogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        breed TEXT NOT NULL,
        age INTEGER NOT NULL
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS Adoptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        dogId INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        FOREIGN KEY(userId) REFERENCES Users(id),
        FOREIGN KEY(dogId) REFERENCES Dogs(id)
    )`);
});

module.exports = db;
