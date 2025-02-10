const { db } = require("../../config/database");

/** 📌 Obtener usuario por ID */
const getUserById = async (id) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT id, name, email, province, city , phone FROM Users WHERE id = ?", [id], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
};

/** 📌 Obtener usuario por email */
const getUserByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM Users WHERE email = ?", [email], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
};

/** 📌 Crear usuario con provincia y ciudad */
const createUser = async (user) => {
    const existingUser = await getUserByEmail(user.email);
    if (existingUser) {
        throw new Error("❌ El correo electrónico ya está registrado.");
    }

    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO Users (name, email, password, province, city,phone) VALUES (?, ?, ?, ?, ?, ?)",
            [user.name, user.email, user.password, user.province, user.city, user.phone],
            function (err) {
                if (err) reject(err);
                resolve({ id: this.lastID, ...user });
            }
        );
    });
};

/** 📌 Obtener todos los usuarios */
const getAllUsers = async () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT id, name, email, province, city , phone FROM Users", [], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

/** 📌 Actualizar usuario */
const updateUser = async (id, userData) => {
    return new Promise((resolve, reject) => {
        db.run(
            "UPDATE Users SET name = ?, email = ?, province = ?, city = ?, phone = ? WHERE id = ?",
            [userData.name, userData.email, userData.province, userData.city, userData.phone, id],
            function (err) {
                if (err) reject(err);
                resolve({ id, ...userData });
            }
        );
    });
};

/** 📌 Eliminar usuario */
const deleteUser = async (id) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM Users WHERE id = ?", [id], function (err) {
            if (err) reject(err);
            resolve({ message: "✅ Usuario eliminado correctamente" });
        });
    });
};

module.exports = { createUser, getUserByEmail, getUserById, getAllUsers, updateUser, deleteUser };
