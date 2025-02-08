const { runAsync, getAsync } = require("../../config/database");

// ✅ **Obtener todos los perros**
const getAllDogs = async () => {
    return await getAsync("SELECT * FROM Dogs");
};

// ✅ **Obtener un perro por ID**
const getDogById = async (id) => {
    return await getAsync("SELECT * FROM Dogs WHERE id = ?", [id]);
};

// ✅ **Registrar un nuevo perro con todos los campos**
const addDog = async (dogData) => {
    const {
        ownerId, name, breed, age, size,
        energyLevel, adoption_status, good_with_children,
        good_with_pets, space_requirement
    } = dogData;

    return await runAsync(
        `INSERT INTO Dogs (ownerId, name, breed, age, size, energyLevel, adoption_status, good_with_children, good_with_pets, space_requirement) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ownerId, name, breed, age, size, energyLevel, adoption_status, good_with_children, good_with_pets, space_requirement]
    );
};


// ✅ **Actualizar datos de un perro**
const updateDog = async (id, updatedData) => {
    return await runAsync(
        `UPDATE Dogs SET name = ?, breed = ?, age = ?, size = ?, energyLevel = ?, adoption_status = ?, good_with_children = ?, good_with_pets = ?, space_requirement = ?
        WHERE id = ?`,
        [updatedData.name, updatedData.breed, updatedData.age, updatedData.size, updatedData.energyLevel, updatedData.adoption_status, updatedData.good_with_children, updatedData.good_with_pets, updatedData.space_requirement, id]
    );
};

// ✅ **Eliminar un perro**
const deleteDog = async (id) => {
    return await runAsync("DELETE FROM Dogs WHERE id = ?", [id]);
};

module.exports = { getAllDogs, getDogById, addDog, updateDog, deleteDog };
