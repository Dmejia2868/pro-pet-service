const BaseRepository = require("./baseRepository");

const getAllAdoptions = async () => {
    return await BaseRepository.all("SELECT * FROM Adoptions");
};

const createAdoption = async (adoption) => {
    const result = await BaseRepository.run(
        "INSERT INTO Adoptions (userId, dogId, status) VALUES (?, ?, ?)",
        [adoption.userId, adoption.dogId, adoption.status]
    );
    return BaseRepository.get("SELECT * FROM Adoptions WHERE id = ?", [result.lastID]);
};

const updateAdoptionStatus = async (id, status) => {
    return BaseRepository.run(
        "UPDATE Adoptions SET status = ? WHERE id = ?",
        [status, id]
    );
};


// 📌 Obtener una adopción específica por ID
const getAdoptionById = async (id) => {
    return BaseRepository.get("SELECT * FROM Adoptions WHERE id = ?", [id]);
};

// 📌 Obtener todos los perros disponibles
const getAllDogs = async () => {
    return await BaseRepository.all("SELECT * FROM Dogs");
};
const getDogById = async (id) => {
    return await BaseRepository.get("SELECT * FROM Dogs WHERE id = ?", [id]);
};


module.exports = { getAllAdoptions, createAdoption, updateAdoptionStatus, getAdoptionById, getAllDogs, getDogById };
