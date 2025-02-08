const express = require("express");
const jwt = require("jsonwebtoken"); // ✅ Importar JWT
const userService = require("../../application/services/userService");
const { validateUser } = require("../../middlewares/validationMiddleware");
const { runAsync } = require("../../config/database"); // ✅ Importar correctamente

const router = express.Router();
const SECRET_KEY = "supersecreto"; // 🚨 Usa una clave segura y guárdala en variables de entorno


/** 📌 Registro de Usuario SIN Rol */
router.post("/register", validateUser, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("📥 Datos recibidos en registro:", { name, email, password });

        // ✅ Llamar a la función del servicio que encripta y crea el usuario
        const { user, token } = await userService.registerUser(name, email, password);

        if (!token) {
            throw new Error("No se pudo generar el token.");
        }

        res.status(201).json({
            message: "✅ Usuario registrado correctamente",
            token, // ✅ Enviar token al frontend
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
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

        await db.run(`UPDATE Users SET role = ? WHERE id = ?`, [role, id]);

        res.json({ message: `✅ Rol asignado como ${role}` });
    } catch (error) {
        console.error("❌ Error al asignar rol:", error);
        res.status(500).json({ error: "Error al asignar rol." });
    }
});



router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("📥 Datos recibidos en login:", { email, password });

        const userData = await userService.loginUser(email, password);
        
        console.log("📤 Respuesta del servicio de login:", userData);
        
        if (!userData) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        // 🔹 Generar un token JWT con los datos del usuario
        const token = jwt.sign(
            { id: userData.id, email: userData.email }, 
            SECRET_KEY, 
            { expiresIn: "1h" } // El token expira en 1 hora
        );

        res.json({ message: "Inicio de sesión exitoso", token, user: userData }); // ✅ Enviar token y datos del usuario
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


/** 📌 Propietario: Agregar un nuevo perro */
router.post("/owner/add-dog", async (req, res) => {
    try {
        const { ownerId, name, breed, age, size, energyLevel, good_with_children, good_with_pets, space_requirement } = req.body;

        await db.run(
            `INSERT INTO Dogs (ownerId, name, breed, age, size, energyLevel, good_with_children, good_with_pets, space_requirement, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
            [ownerId, name, breed, age, size, energyLevel, good_with_children, good_with_pets, space_requirement]
        );

        res.status(201).json({ message: "🐶 Perro agregado exitosamente." });
    } catch (error) {
        console.error("❌ Error al agregar perro:", error);
        res.status(500).json({ error: "Error al agregar perro." });
    }
});

/** 📌 Propietario: Marcar un perro como inactivo */
router.patch("/owner/deactivate-dog/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await db.run(`UPDATE Dogs SET status = 'inactive' WHERE id = ?`, [id]);

        res.json({ message: "🔴 Perro marcado como inactivo." });
    } catch (error) {
        console.error("❌ Error al marcar como inactivo:", error);
        res.status(500).json({ error: "Error al modificar el estado del perro." });
    }
});

/** 📌 Propietario: Aceptar/Rechazar solicitud de adopción */
router.patch("/owner/update-adoption/:requestId", async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ error: "Estado inválido." });
        }

        await db.run(`UPDATE AdoptionRequests SET status = ? WHERE id = ?`, [status, requestId]);

        res.json({ message: `✅ Solicitud de adopción ${status}` });
    } catch (error) {
        console.error("❌ Error al actualizar solicitud:", error);
        res.status(500).json({ error: "Error al actualizar la solicitud." });
    }
});

/** 📌 Adoptante: Llenar formulario con preferencias */
router.post("/adopter/preferences", async (req, res) => {
    try {
        const { adopterId, preferred_size, preferred_energy_level, has_children, has_other_pets, home_space } = req.body;

        await db.run(
            `UPDATE Users 
             SET preferred_size = ?, preferred_energy_level = ?, has_children = ?, has_other_pets = ?, home_space = ? 
             WHERE id = ?`,
            [preferred_size, preferred_energy_level, has_children, has_other_pets, home_space, adopterId]
        );

        res.json({ message: "✅ Preferencias guardadas exitosamente." });
    } catch (error) {
        console.error("❌ Error al guardar preferencias:", error);
        res.status(500).json({ error: "Error al guardar preferencias." });
    }
});

/** 📌 Adoptante: Enviar solicitud de adopción */
router.post("/adopter/request-adoption", async (req, res) => {
    try {
        const { adopterId, dogId } = req.body;

        await db.run(
            `INSERT INTO AdoptionRequests (adopterId, dogId, status) VALUES (?, ?, 'pending')`,
            [adopterId, dogId]
        );

        res.status(201).json({ message: "✅ Solicitud de adopción enviada." });
    } catch (error) {
        console.error("❌ Error al enviar solicitud:", error);
        res.status(500).json({ error: "Error al enviar solicitud." });
    }
});


module.exports = router;
