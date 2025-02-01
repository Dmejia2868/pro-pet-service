const BaseRepository = require("./baseRepository");

const getAllDogs = async () => {
    return await BaseRepository.all("SELECT * FROM Dogs");
};

const createDog = async (dog) => {
    const result = await BaseRepository.run(
        "INSERT INTO Dogs (name, breed, age) VALUES (?, ?, ?)",
        [dog.name, dog.breed, dog.age]
    );

    return {
        id: result.lastID,
        ...dog
    };
};
const getDogById = async (id) => {
    return await BaseRepository.get("SELECT * FROM Dogs WHERE id = ?", [id]);
};

const deleteDog = async (id) => {
    return BaseRepository.run("DELETE FROM Dogs WHERE id = ?", [id]);
};
const updateDog = async (id, dogData) => {
    await BaseRepository.run(
        "UPDATE Dogs SET name = ?, breed = ?, age = ? WHERE id = ?",
        [dogData.name + " (editado)", dogData.breed, dogData.age, id]
    );

    return getDogById(id); // Devuelve el perro actualizado
};

module.exports = { getAllDogs, createDog ,getDogById, deleteDog, updateDog };
