const dogRepository = require("../../infrastructure/repositories/dogRepository");
const Dog = require("../../domain/Dog");
const { db } = require("../../config/database"); // ✅ Asegurar que importamos correctamente la BD

// ✅ Obtener todos los perros activos
const getAllDogs = async () => {
    try {
        console.log("🔍 Ejecutando consulta para obtener todos los perros...");
        const dogs = await dogRepository.getAllDogs();
        
        if (!dogs || dogs.length === 0) {
            console.log("⚠️ No se encontraron perros en la base de datos.");
            return [];
        }

        // 🔥 Asegurar que cada perro tenga una imagen válida
        const allDogs = dogs.map(dog => 
            new Dog(
                dog.id, 
                dog.name, 
                dog.breed, 
                dog.age, 
                dog.size, 
                dog.energyLevel, 
                dog.status, 
                dog.good_with_children, 
                dog.good_with_pets, 
                dog.space_requirement,
                dog.image // ✅ Accede correctamente a la propiedad
            ).toJSON()
        );
        
        console.log("✅ Perros obtenidos:", allDogs);
        return allDogs;
        
    
    } catch (error) {
        console.error("❌ Error en getAllDogs:", error);
        throw new Error("Error al obtener los perros.");
    }
};


// ✅ Obtener un perro por ID
const getDogById = async (id) => {
    try {
        console.log(`🔍 Buscando perro con ID: ${id}`);
        
        const dog = await dogRepository.getDogById(id);
        if (!dog) {
            console.log("⚠️ Perro no encontrado.");
            return null;
        }

        return new Dog(
            dog.id, 
            dog.name, 
            dog.breed, 
            dog.age, 
            dog.size, 
            dog.energyLevel, 
            dog.status, 
            dog.good_with_children, 
            dog.good_with_pets, 
            dog.space_requirement,
            dog.image // <-- ✅ Se incluye `image`
        ).toJSON();
    } catch (error) {
        console.error(`❌ Error en getDogById(${id}):`, error);
        throw new Error("Error al obtener el perro.");
    }
};

// ✅ Registrar un nuevo perro en la base de datos
const createDog = async ({ ownerId, name, breed, age, size, energyLevel, status = 'active', good_with_children, good_with_pets, space_requirement, imageUrl }) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Dogs (ownerId, name, breed, age, size, energyLevel, status, good_with_children, good_with_pets, space_requirement, image) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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



// ✅ Actualizar datos de un perro
const updateDog = async (id, dogData) => {
    try {
        console.log(`✏️ Actualizando perro con ID: ${id}`, dogData);

        const updatedDog = await dogRepository.updateDog(id, dogData);
        if (!updatedDog) {
            console.log("⚠️ No se encontró el perro para actualizar.");
            return null;
        }

        console.log("✅ Perro actualizado:", updatedDog);
        return updatedDog;
    } catch (error) {
        console.error(`❌ Error en updateDog(${id}):`, error);
        throw new Error("Error al actualizar el perro.");
    }
};

const searchDogsByPreferences = async (preferences) => {
    return await dogRepository.searchDogsByPreferences(preferences);
};

// ✅ Eliminar un perro
const deleteDog = async (id) => {
    try {
        console.log(`🗑️ Eliminando perro con ID: ${id}`);

        const existingDog = await dogRepository.getDogById(id);
        if (!existingDog) {
            console.log("⚠️ No se encontró el perro para eliminar.");
            return null;
        }

        await dogRepository.deleteDog(id);
        console.log("✅ Perro eliminado con éxito.");
        return { message: "Perro eliminado correctamente" };
    } catch (error) {
        console.error(`❌ Error en deleteDog(${id}):`, error);
        throw new Error("Error al eliminar el perro.");
    }
};

// ✅ Exportar funciones
module.exports = { getAllDogs, getDogById, createDog, updateDog, deleteDog, searchDogsByPreferences };
