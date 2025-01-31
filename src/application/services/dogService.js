const dogRepository = require("../../infrastructure/repositories/dogRepository");

const getAllDogs = async () => {
    return await dogRepository.getAllDogs();
};

const addDog = async (name, breed, age) => {
    return await dogRepository.createDog({ name, breed, age });
};

const getDogById = async (id) => {
    return dogRepository.getDogById(id);
};

const deleteDog = async (id) => {
    const existingDog = await dogRepository.getDogById(id);
    if (!existingDog) {
        throw new Error("Perro no encontrado");
    }
    await dogRepository.deleteDog(id);
};

const updateDog = async (id, dogData) => {
    const updatedDog = await dogRepository.updateDog(id, dogData);
    if (!updatedDog) {
        throw new Error("No se encontró el perro con el ID proporcionado.");
    }
    return updatedDog;

    
};


module.exports = { getAllDogs, addDog, getDogById, deleteDog , updateDog};
