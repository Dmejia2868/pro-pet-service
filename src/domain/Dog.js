const bcrypt = require("bcryptjs");

class User {
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Devuelve el usuario en formato JSON sin la contraseña
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email
        };
    }

    // Cifra la contraseña antes de almacenarla
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    // Valida el formato del correo electrónico
    isValidEmail() {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(this.email);
    }
    
    
}

module.exports = User;

