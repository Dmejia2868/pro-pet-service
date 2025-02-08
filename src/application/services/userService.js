const { hashPassword, comparePassword } = require("../../utils/passwordHasher");
const bcrypt = require("bcrypt");

const userRepository = require("../../infrastructure/repositories/userRepository");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "supersecreto"; // Asegúrate de usar un valor seguro
const { db } = require("../../config/database"); // ✅ Importar la base de datos

const getUserByEmail = async (email) => {
    console.log("🔍 Buscando usuario con email:", email);

    const user = await getAsync(
        "SELECT id, name, email, password FROM Users WHERE email = ?",
        [email]
    );

    console.log("✅ Usuario encontrado en la base de datos:", user);
    return user;
};

const registerUser = async (name, email, password   ) => {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
        throw new Error("El correo ya está registrado.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.createUser({ name, email, password: hashedPassword});
    
    if (!newUser) {
        throw new Error("Error al registrar el usuario.");
    }
    // 🔑 Generar el token JWT
    const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        SECRET_KEY,
        { expiresIn: "1000h" }
    );

    return {
        user: newUser,
        token, // ✅ Devolver el token en la respuesta
    };
};


const loginUser = async (email, password) => {
    console.log("🔍 Buscando usuario con email:", email);
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
        throw new Error("Credenciales incorrectas");
    }
    console.log("🟢 Usuario encontrado en la base de datos:", user);

    console.log("🔑 Contraseña ingresada:", password);
    console.log("🔑 Contraseña almacenada:", user.password);

    const passwordMatch = await comparePassword(password, user.password);

    console.log("🔑 Contraseña ingresada por el usuario:", password);
    console.log("🔑 Contraseña almacenada en la base de datos:", user.password);
    console.log("🔍 ¿Las contraseñas coinciden?:", passwordMatch);
    
    if (!passwordMatch) {
        console.error("❌ Error en login: Las contraseñas no coinciden.");
        throw new Error("Credenciales incorrectas");
    }

    // 🔑 Generar token JWT con la información del usuario
    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        SECRET_KEY,
        { expiresIn: "1h" }
    );
    console.log("🔑 Token generado:", token);

    return {
        message: "Login exitoso",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        token
    };
};



const getAllUsers = async () => {
    return await userRepository.getAllUsers();
};

const updateUser = async (id, userData) => {
    const user = await userRepository.getUserById(id);
    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    const updatedUser = await userRepository.updateUser(id, userData);
    return updatedUser;
};

const deleteUser = async (id) => {
    const user = await userRepository.getUserById(id);
    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    return userRepository.deleteUser(id);
};
const getUserById = async (id) => {
    return await userRepository.getUserById(id);
};


module.exports = { registerUser, loginUser, getAllUsers, updateUser, deleteUser, getUserById, getUserByEmail };



