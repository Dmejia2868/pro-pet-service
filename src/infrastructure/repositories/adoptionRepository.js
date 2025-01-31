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
    await BaseRepository.run("UPDATE Adoptions SET status = ? WHERE id = ?", [status, id]);
    return BaseRepository.get("SELECT * FROM Adoptions WHERE id = ?", [id]);
};


module.exports = { getAllAdoptions, createAdoption, updateAdoptionStatus  };
