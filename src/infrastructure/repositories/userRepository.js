const BaseRepository = require("./baseRepository");
const { getAsync, runAsync } = require("../../config/database");
const bcrypt = require("bcrypt");

const getUserById = async (id) => {
    return await BaseRepository.get(
        "SELECT id, name, email FROM Users WHERE id = ?",
        [id]
    );
};


const getUserByEmail = async (email) => {
    console.log("Buscando usuario con email:", email);

    const user = await getAsync(
        "SELECT id, name, email, password FROM Users WHERE email = ?",
        [email]
    );

    console.log("Usuario encontrado en la base de datos:", user);
    return user;
};
const createUser = async (user) => {
    // 🔍 Verificar si el correo ya existe
    const existingUser = await getUserByEmail(user.email);
    if (existingUser) {
        throw new Error("El correo electrónico ya está registrado.");
    }

    // ❌ NO vuelvas a encriptar la contraseña aquí
    await runAsync(
        "INSERT INTO Users (name, email, password) VALUES (?, ?, ?)",
        [user.name, user.email, user.password] // Guardar directamente la contraseña ya hasheada
    );

    return getUserByEmail(user.email); // Devolver el usuario registrado
};



const getAllUsers = async () => {
    return await BaseRepository.all("SELECT id, name, email FROM Users");
};

const updateUser = async (id, userData) => {
    await BaseRepository.run(
        "UPDATE Users SET name = ?, email = ? WHERE id = ?",
        [userData.name, userData.email, id]
    );
    return getUserById(id);
};

const deleteUser = async (id) => {
    return BaseRepository.run("DELETE FROM Users WHERE id = ?", [id]);
};


module.exports = { createUser, getUserByEmail, getUserById, getAllUsers, updateUser, deleteUser };



