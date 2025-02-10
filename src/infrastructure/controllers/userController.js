const express = require("express");
const jwt = require("jsonwebtoken"); // ✅ Importar JWT
const userService = require("../../application/services/userService");
const { validateUser } = require("../../middlewares/validationMiddleware");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecreto"; // 🚨 Usa variables de entorno seguras

/** 📌 Registro de Usuario */
router.post("/register", validateUser, async (req, res) => {
    try {
        const { name, email, password, province, city, phone } = req.body;
        console.log("📥 Datos recibidos en registro:", { name, email, password, province, city, phone });

        if (!name || !email || !password || !province || !city || !phone) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const { user, token } = await userService.registerUser(name, email, password, province, city, phone);

        if (!token) {
            throw new Error("No se pudo generar el token.");
        }

        res.status(201).json({
            message: "✅ Usuario registrado correctamente",
            token,
            user
        });
    } catch (error) {
        console.error("❌ Error en registro:", error.message);
        res.status(400).json({ error: error.message });
    }
});

/** 📌 API para que el usuario seleccione su rol después del registro */
router.patch("/select-role/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["owner", "adopter"].includes(role)) {
            return res.status(400).json({ error: "❌ Rol inválido. Debe ser 'owner' o 'adopter'." });
        }

        const updatedUser = await userService.updateUserRole(id, role);

        res.json({ message: `✅ Rol asignado como ${role}`, user: updatedUser });
    } catch (error) {
        console.error("❌ Error al asignar rol:", error);
        res.status(500).json({ error: "Error al asignar rol." });
    }
});

/** 📌 Inicio de sesión */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("📥 Datos recibidos en login:", { email, password });

        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña son obligatorios" });
        }

        const userData = await userService.loginUser(email, password);

        console.log("📤 Respuesta del servicio de login:", userData);

        if (!userData) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        res.json({ message: "Inicio de sesión exitoso", token: userData.token, user: userData.user });
    } catch (error) {
        console.error("❌ Error en login:", error.message);
        res.status(401).json({ error: "Credenciales incorrectas" });
    }
});

/** 📌 Obtener todos los usuarios */
router.get("/", async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json({ message: "Usuarios obtenidos exitosamente", users });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});

/** 📌 Actualizar usuario */
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, province, city , phone} = req.body;

        if (!name || !email || !province || !city || !phone  ) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const updatedUser = await userService.updateUser(id, { name, email, province, city, phone });

        if (!updatedUser) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario actualizado con éxito", user: updatedUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/** 📌 Eliminar usuario */
router.delete("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        await userService.deleteUser(userId);
        res.json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/** 📌 Obtener usuario por ID */
router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el usuario" });
    }
});

module.exports = router;
