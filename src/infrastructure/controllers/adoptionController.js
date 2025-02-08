const express = require("express");
const adoptionService = require("../../application/services/adoptionService");
const authenticateToken = require("../../middlewares/authMiddleware");
const router = express.Router();

const { runAsync } = require("../../config/database");

// Save adopter data
router.post("/", async (req, res) => {
    const adopterData = req.body;

    try {
        const sql = `INSERT INTO Users (name, email, preferred_size, preferred_energy_level, has_children, has_other_pets, home_space) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const result = await runAsync(sql, [
            adopterData.name, 
            adopterData.email, 
            adopterData.preferred_size, 
            adopterData.preferred_energy_level, 
            adopterData.has_children, 
            adopterData.has_other_pets, 
            adopterData.home_space
        ]);
        
        res.json({ message: "Adopter data saved successfully", adopterId: result.lastID });
    } catch (error) {
        console.error("Error saving adopter data:", error);
        res.status(500).json({ error: "Error saving adopter data" });
    }
});




// ✅ Obtener todas las adopciones
router.get("/", authenticateToken, async (req, res) => {
    try {
        const adoptions = await adoptionService.getAllAdoptions();
        res.json(adoptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Actualizar el estado de una adopción
router.patch("/:id/status", authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        const updatedAdoption = await adoptionService.updateAdoptionStatus(req.params.id, status);
        res.json(updatedAdoption);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ Nueva ruta para recomendaciones
router.post("/recommendations", authenticateToken, async (req, res) => {
    try {
        const userPreferences = req.body;
        const recommendations = await adoptionService.recommendAdoptions(userPreferences);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedAdoption = await adoptionService.updateAdoptionStatus(id, status);
        res.json({ message: "Estado de adopción actualizado", adoption: updatedAdoption });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
