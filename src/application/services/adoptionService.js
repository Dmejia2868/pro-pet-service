const adoptionRepository = require("../../infrastructure/repositories/adoptionRepository");

const getAllAdoptions = async () => {
    return await adoptionRepository.getAllAdoptions();
};

const createAdoption = async (userId, dogId) => {
    return await adoptionRepository.createAdoption({ userId, dogId, status: "Pending" });
};

const updateAdoptionStatus = async (id, status) => {
    return await adoptionRepository.updateAdoptionStatus(id, status);
};

module.exports = { getAllAdoptions, createAdoption, updateAdoptionStatus };
