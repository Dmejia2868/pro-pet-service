const express = require("express");
const router = express.Router();
const dogService = require("../../application/services/dogService");
const path = require("path");
const multer = require("multer");

// ✅ Configuración de almacenamiento para imágenes
const storage = multer.diskStorage({
    destination: path.join(__dirname, "../../uploads"),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// ✅ Obtener todos los perros
router.get("/", async (req, res) => {
    try {
        console.log("🔍 Buscando todos los perros en la base de datos...");
        const dogs = await dogService.getAllDogs();
        res.json(dogs);
    } catch (error) {
        console.error("❌ Error al obtener los perros:", error);
        res.status(500).json({ error: "Error al obtener los perros." });
    }
});

// ✅ Obtener un perro por ID
router.get("/:id", async (req, res) => {
    try {
        const dog = await dogService.getDogById(req.params.id);
        if (!dog) {
            return res.status(404).json({ error: "Perro no encontrado" });
        }
        res.json(dog);
    } catch (error) {
        console.error("❌ Error en getDogById:", error);
        res.status(500).json({ error: "Error al obtener el perro." });
    }
});

// ✅ Registrar un nuevo perro
router.post("/", upload.single("image"), async (req, res) => {
    try {
        console.log("📥 Recibiendo datos para registrar perro...");

        const { 
            ownerId, 
            name, 
            breed, 
            age, 
            size, 
            energyLevel, 
            good_with_children, 
            good_with_pets, 
            space_requirement 
        } = req.body;

        if (!ownerId || !name || !breed || !age || !size || !energyLevel) {
            return res.status(400).json({ error: "Todos los campos obligatorios deben ser completados." });
        }

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        console.log("📸 Imagen recibida:", req.file ? req.file.filename : "No se subió imagen");
        console.log("🖼️ URL de la imagen guardada:", imageUrl);

        const newDog = await dogService.createDog({
            ownerId,
            name,
            breed,
            age,
            size,
            energyLevel,
            good_with_children,
            good_with_pets,
            space_requirement,
            imageUrl
        });

        res.status(201).json({ message: "🐶 Perro registrado con éxito", dogId: newDog.id });
    } catch (error) {
        console.error("❌ Error al registrar perro:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

// ✅ Búsqueda avanzada de perros basada en preferencias
router.post("/search", async (req, res) => {
    try {
        console.log("🔍 Buscando perros según preferencias...");
        const dogs = await dogService.searchDogsByPreferences(req.body);
        res.json(dogs);
    } catch (error) {
        console.error("❌ Error en búsqueda avanzada:", error);
        res.status(500).json({ error: "Error en la búsqueda avanzada." });
    }
});

// ✅ Actualizar un perro
router.put("/:id", async (req, res) => {
    try {
        console.log(`✏️ Actualizando perro con ID: ${req.params.id}`);

        const updatedDog = await dogService.updateDog(req.params.id, req.body);
        if (!updatedDog) {
            return res.status(404).json({ error: "Perro no encontrado para actualizar." });
        }

        res.json({ message: "✅ Perro actualizado correctamente", dog: updatedDog });
    } catch (error) {
        console.error("❌ Error en updateDog:", error);
        res.status(500).json({ error: "Error al actualizar el perro." });
    }
});

// ✅ Eliminar un perro
router.delete("/:id", async (req, res) => {
    try {
        console.log(`🗑️ Eliminando perro con ID: ${req.params.id}`);
        await dogService.deleteDog(req.params.id);
        res.json({ message: "✅ Perro eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error en deleteDog:", error);
        res.status(500).json({ error: "Error al eliminar el perro." });
    }
});

// ✅ Exportar `router`
module.exports = router;
