const { hashPassword, comparePassword } = require("../../utils/passwordHasher");

const userRepository = require("../../infrastructure/repositories/userRepository");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "supersecreto"; // Asegúrate de usar un valor seguro

const registerUser = async (name, email, password) => {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
        throw new Error("El correo ya está registrado.");
    }

    const hashedPassword = await hashPassword(password);
    return userRepository.createUser({ name, email, password: hashedPassword });
};

const loginUser = async (email, password) => {
    console.log("🔍 Buscando usuario con email:", email);
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
        throw new Error("Credenciales incorrectas");
    }
    console.log("🟢 Usuario encontrado en la base de datos:", user);

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
        throw new Error("Credenciales incorrectas");
    }

    // Generar token JWT con la información del usuario
    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        SECRET_KEY,
        { expiresIn: "1h" }
    );
    console.log("🔑 Token generado:", token);

    // Retornar el usuario sin la contraseña
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


module.exports = { registerUser, loginUser, getAllUsers, updateUser, deleteUser, getUserById };



