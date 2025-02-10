const express = require("express");
const router = express.Router();
const dogService = require("../../application/services/dogService");
const path = require("path");
const multer = require("multer");
const authenticateToken = require("../../middlewares/authMiddleware"); // ✅ Importar middleware de autenticación

// ✅ Configuración de almacenamiento para imágenes
const storage = multer.diskStorage({
    destination: path.join(__dirname, "../../uploads"),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }  // Limitar el tamaño a 5 MB
});

// ✅ Obtener todos los perros
router.get("/", async (req, res) => {
    try {
        console.log("🔍 Buscando todos los perros en la base de datos...");
        const dogs = await dogService.getAllDogs();
        console.log("🐶 Perros obtenidos:", dogs); // <-- Agrega esto para ver si incluyen ownerId

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


// ✅ Registrar un nuevo perro (sin autenticación obligatoria)
router.post("/", upload.single("image"), async (req, res) => {
    try {
        console.log("📥 Recibiendo datos para registrar perro...");

        const {
            name,
            breed,
            age,
            size,
            energyLevel,
            good_with_children,
            good_with_pets,
            space_requirement,
            ownerId // 🔥 Ahora se recibe del frontend
        } = req.body;

        // 🔥 Verificar que `ownerId` se haya enviado correctamente
        if (!ownerId || isNaN(ownerId) || Number(ownerId) <= 0) {
            return res.status(400).json({ error: "⚠️ Error: El propietario del perro no es válido." });
        }

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        console.log("📸 Imagen recibida:", req.file ? req.file.filename : "No se subió imagen");
        console.log("🖼️ URL de la imagen guardada:", imageUrl);

        const preferences = {
            good_with_children,
            good_with_pets,
            space_requirement
        };

        // ✅ Crear el perro en la base de datos con `ownerId` proveniente del frontend
        const newDog = await dogService.createDog({
            ownerId: Number(ownerId), // 🔥 Convertir a número por seguridad
            name,
            breed,
            age,
            size,
            energyLevel,
            status: "active",
            preferences,
            imageUrl
        });

        res.status(201).json({ message: "🐶 Perro registrado con éxito", dogId: newDog.id });
    } catch (error) {
        console.error("❌ Error al registrar perro:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});



router.put("/:id", authenticateToken, upload.single("image"), async (req, res) => {
    try {
        console.log(`✏️ Intentando actualizar perro con ID: ${req.params.id}...`);
        console.log("📥 Datos recibidos en req.body:", req.body);

        const existingDog = await dogService.getDogById(req.params.id);
        if (!existingDog) {
            return res.status(404).json({ error: "Perro no encontrado para actualizar." });
        }

        // **Extraer datos del body**
        const { name, breed, age, size, energyLevel, good_with_children, good_with_pets, space_requirement } = req.body;

        if (!name || !breed) {
            return res.status(400).json({ error: "Los campos 'breed' y 'name' son obligatorios." });
        }

        // **Si se subió una nueva imagen, actualizar la URL**
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : existingDog.image;

        // **Actualizar el perro en la base de datos**
        const updatedDog = await dogService.updateDog(req.params.id, {
            name, breed, age, size, energyLevel, good_with_children, good_with_pets, space_requirement, image: imageUrl
        });

        res.json({ message: "✅ Perro actualizado correctamente", dog: updatedDog });

    } catch (error) {
        console.error("❌ Error en updateDog:", error);
        res.status(500).json({ error: "Error al actualizar el perro." });
    }
});





// ✅ Eliminar un perro (requiere autenticación y validación de propietario)
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        console.log(`🗑️ Intentando eliminar perro con ID: ${req.params.id}...`);

        // 🔍 Verificar si el perro pertenece al usuario autenticado
        const existingDog = await dogService.getDogById(req.params.id);
        if (!existingDog) {
            return res.status(404).json({ error: "Perro no encontrado." });
        }

        if (existingDog.ownerId !== req.userId) {
            return res.status(403).json({ error: "No tienes permiso para eliminar este perro." });
        }

        await dogService.deleteDog(req.params.id);
        res.json({ message: "✅ Perro eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error en deleteDog:", error);
        res.status(500).json({ error: "Error al eliminar el perro." });
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

// ✅ Exportar `router`
module.exports = router;
