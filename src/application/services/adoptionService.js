const adoptionRepository = require("../../infrastructure/repositories/adoptionRepository");
const Adoption = require("../../domain/Adoption");

const getAllAdoptions = async () => {
    return await adoptionRepository.getAllAdoptions();
};

const createAdoption = async (userId, dogId) => {
    const adoption = new Adoption(null, userId, dogId, "pending");
    return await adoptionRepository.createAdoption(adoption);
};

const updateAdoptionStatus = async (id, status) => {
    const result = await adoptionRepository.updateAdoptionStatus(id, status);

    // Obtener la adopción después de actualizarla
    const updatedAdoption = await adoptionRepository.getAdoptionById(id);

    return {
        message: "Estado de adopción actualizado",
        adoption: updatedAdoption
    };
};




// 📌 Función para recomendar adopciones usando similitud coseno
const recommendAdoptions = async (userPreferences) => {
    const dogs = await adoptionRepository.getAllDogs(); // Obtener todos los perros
    return Adoption.recommend(dogs, userPreferences);
};

module.exports = { getAllAdoptions, createAdoption, updateAdoptionStatus, recommendAdoptions };
