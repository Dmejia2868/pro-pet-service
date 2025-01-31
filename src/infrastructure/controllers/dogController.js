const express = require("express");
const router = express.Router();
const dogService = require("../../application/services/dogService");

// Obtener todos los perros
router.get("/", async (req, res) => {
    try {
        const dogs = await dogService.getAllDogs();
        res.json(dogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Registrar un nuevo perro
router.post("/", async (req, res) => {
    try {
        const { name, breed, age } = req.body;
        const newDog = await dogService.addDog(name, breed, age);
        res.status(201).json({
            message: "Perro agregado",
            dog: newDog
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const dog = await dogService.getDogById(req.params.id);
        if (!dog) {
            return res.status(404).json({ error: "Perro no encontrado" });
        }
        res.json(dog);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el perro" });
    }
});

// Eliminar un perro por ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await dogService.deleteDog(id);
        res.json({ message: "Perro eliminado exitosamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, breed, age } = req.body;
        const updatedDog = await dogService.updateDog(id, { name, breed, age });

        if (!updatedDog) {
            return res.status(404).json({ error: "Perro no encontrado" });
        }

        res.json({
            message: "Perro actualizado correctamente",
            dog: updatedDog
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;
