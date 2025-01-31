const express = require("express");
const userService = require("../../application/services/userService");
const { validateUser } = require("../../middlewares/validationMiddleware");

const router = express.Router();

router.post("/register", validateUser, async (req, res) => {  // ✅ Ahora lo usamos aquí
    try {
        const { name, email, password } = req.body;
        const user = await userService.registerUser(name, email, password);
        res.status(201).json({
            message: "Usuario registrado",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("📥 Datos recibidos en login:", { email, password });

        const userData = await userService.loginUser(email, password);
        
        console.log("📤 Respuesta del servicio de login:", userData);
        
        res.json(userData);
    } catch (error) {
        console.error("❌ Error en login:", error.message);
        res.status(401).json({ error: "Credenciales incorrectas" });
    }
});

router.get("/", async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json({ message: "Usuarios obtenidos exitosamente", users });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const updatedUser = await userService.updateUser(id, { name, email });
        
        if (!updatedUser) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({
            message: "Usuario actualizado con éxito",
            user: updatedUser
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        await userService.deleteUser(userId);
        res.json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;
