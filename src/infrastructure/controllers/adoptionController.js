const express = require("express");
const adoptionService = require("../../application/services/adoptionService");
const authenticateToken = require("../../middlewares/authMiddleware");

const router = express.Router();

// ✅ Proteger rutas con `authenticateToken`
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { userId, dogId } = req.body;
        const adoption = await adoptionService.createAdoption(userId, dogId);
        res.status(201).json({ message: "Solicitud de adopción creada", adoption });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener todas las adopciones
router.get("/", authenticateToken, async (req, res) => {
    try {
        const adoptions = await adoptionService.getAllAdoptions();
        res.json(adoptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.patch("/:id", authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        const updatedAdoption = await adoptionService.updateAdoptionStatus(id, status);
        res.json({ message: "Estado de adopción actualizado", adoption: updatedAdoption });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
