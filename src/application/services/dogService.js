const dogRepository = require("../../infrastructure/repositories/dogRepository");
const Dog = require("../../domain/Dog");

const getAllDogs = async () => {
    const dogs = await dogRepository.getAllDogs();
    return dogs.map(dog => new Dog(dog.id, dog.name, dog.breed, dog.age).toJSON());
};

const addDog = async (name, breed, age) => {
    return await dogRepository.createDog({ name, breed, age });
};

const getDogById = async (id) => {
    const dog = await dogRepository.getDogById(id);
    return dog ? new Dog(dog.id, dog.name, dog.breed, dog.age).toJSON() : null;
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
