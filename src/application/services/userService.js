const bcrypt = require("bcrypt");
const userRepository = require("../../infrastructure/repositories/userRepository");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "supersecreto";

/** 📌 Registro de usuario con provincia y ciudad */
const registerUser = async (name, email, password, province, city, phone) => {
    // ✅ Verificar si el usuario ya existe
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
        throw new Error("❌ El correo ya está registrado.");
    }

    // ✅ Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Crear usuario con los nuevos campos
    const newUser = await userRepository.createUser({
        name,
        email,
        password: hashedPassword,
        province,
        city, 
        phone
    });

    if (!newUser) {
        throw new Error("❌ Error al registrar el usuario.");
    }

    // 🔑 Generar el token JWT
    const token = jwt.sign(
        { id: newUser.id, email: newUser.email, province: newUser.province, city: newUser.city },
        SECRET_KEY,
        { expiresIn: "1000h" }
    );

    return {
        user: newUser,
        token, // ✅ Devolver el token en la respuesta
    };
};

/** 📌 Login de usuario */
const loginUser = async (email, password) => {
    console.log("🔍 Buscando usuario con email:", email);
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
        throw new Error("❌ Credenciales incorrectas.");
    }

    console.log("🔑 Contraseña ingresada:", password);
    console.log("🔑 Contraseña almacenada:", user.password);

    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log("🔍 ¿Las contraseñas coinciden?:", passwordMatch);
    
    if (!passwordMatch) {
        throw new Error("❌ Credenciales incorrectas.");
    }

    // 🔑 Generar token JWT con los nuevos datos
    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, province: user.province, city: user.city, phone:user.phone},
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    console.log("🔑 Token generado:", token);

    return {
        message: "✅ Login exitoso",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            province: user.province,
            city: user.city,
            phone: user.phone
        },
        token
    };
};

module.exports = { registerUser, loginUser };
