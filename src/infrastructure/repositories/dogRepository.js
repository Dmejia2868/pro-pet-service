const BaseRepository = require("./baseRepository");
const { db } = require("../../config/database");

// ✅ Obtener todos los perros
const getAllDogs = async () => {
    try {
        const sql = "SELECT * FROM Dogs WHERE status = 'active' AND adoption_status = 'not_adopted'";
        console.log("🔍 Ejecutando consulta:", sql);
        const dogs = await BaseRepository.all(sql);

        console.log("📊 Registros obtenidos de la BD:", dogs);
        return dogs;
    } catch (error) {
        console.error("❌ Error en getAllDogs:", error);
        throw new Error("Error al obtener los perros desde la base de datos.");
    }
};

// ✅ Registrar un nuevo perro
const createDog = async ({
    ownerId, name, breed, age, size, energyLevel, status = 'active', 
    preferences: { good_with_children, good_with_pets, space_requirement }, 
    imageUrl
}) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Dogs (ownerId, name, breed, age, size, energyLevel, status, adoption_status, good_with_children, good_with_pets, space_requirement, image) 
                     VALUES (?, ?, ?, ?, ?, ?, 'active', 'not_adopted', ?, ?, ?, ?)`;

        console.log("📥 Registrando perro con imagen:", imageUrl);

        db.run(sql, [ownerId, name, breed, age, size, energyLevel, status, good_with_children, good_with_pets, space_requirement, imageUrl], function (err) {
            if (err) {
                console.error("❌ Error al registrar perro en la BD:", err);
                reject(err);
            } else {
                console.log("✅ Perro registrado con ID:", this.lastID);
                resolve({ id: this.lastID });
            }
        });
    });
};

// ✅ Buscar perros según preferencias con puntuación ponderada
const searchDogsByPreferences = async ({
    preferred_size, preferred_energy_level, has_children, has_other_pets, home_space
}) => {
    try {
        const sql = `
            SELECT *, 
                (
                    (5 - ABS(size - ?)) * 2 +  
                    (5 - ABS(energyLevel - ?)) * 2 +  
                    (good_with_children * ?) +  
                    (good_with_pets * ?) +  
                    (space_requirement <= ? * 2)  
                ) AS score
            FROM Dogs
            WHERE status = 'active' AND adoption_status = 'not_adopted'
            ORDER BY score DESC;`;

        console.log("🔍 Ejecutando búsqueda ponderada...");
        const dogs = await BaseRepository.all(sql, [preferred_size, preferred_energy_level, has_children, has_other_pets, home_space]);

        console.log("📊 Perros recomendados:", dogs);
        return dogs;
    } catch (error) {
        console.error("❌ Error en búsqueda avanzada:", error);
        throw new Error("Error al buscar perros por preferencias.");
    }
};

// ✅ Obtener un perro por ID
const getDogById = async (id) => {
    return await BaseRepository.get("SELECT * FROM Dogs WHERE id = ?", [id]);
};

// ✅ Eliminar un perro
const deleteDog = async (id) => {
    return BaseRepository.run("DELETE FROM Dogs WHERE id = ?", [id]);
};

// ✅ Actualizar datos de un perro
const updateDog = async (id, dogData) => {
    await BaseRepository.run(
        "UPDATE Dogs SET name = ?, breed = ?, age = ? WHERE id = ?",
        [dogData.name + " (editado)", dogData.breed, dogData.age, id]
    );
    return getDogById(id);
};

// ✅ Exportar funciones
module.exports = { getAllDogs, createDog, searchDogsByPreferences, getDogById, deleteDog, updateDog };
