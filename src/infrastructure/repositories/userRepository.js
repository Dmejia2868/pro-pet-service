const BaseRepository = require("./baseRepository");

const getUserById = async (id) => {
    return await BaseRepository.get(
        "SELECT id, name, email FROM Users WHERE id = ?",
        [id]
    );
};



const getUserByEmail = async (email) => {
    console.log("Buscando usuario con email:", email); // 🟢 Agrega este log

    const user = await BaseRepository.get(
        "SELECT id, name, email, password FROM Users WHERE email = ?",
        [email]
    );

    console.log("Usuario encontrado en la base de datos:", user); // 🟢 Agrega este log
    return user;
};



const createUser = async (user) => {
    const result = await BaseRepository.run(
        "INSERT INTO Users (name, email, password) VALUES (?, ?, ?)",
        [user.name, user.email, user.password]
    );
    
    return getUserById(result.lastID); // Ahora sí está definido antes de ser usado
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



