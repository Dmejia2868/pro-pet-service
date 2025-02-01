const bcrypt = require("bcrypt");

const EmailValidationStatus = Object.freeze({
    VALID: "VALID",
    INVALID_FORMAT: "INVALID_FORMAT",
    EMPTY: "EMPTY"
});

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

    // Valida el formato del correo electrónico sin usar regex problemática
    isValidEmail() {
        if (!this.email || this.email.trim() === "") {
            return EmailValidationStatus.EMPTY;
        }

        try {
            const email = new URL(`mailto:${this.email}`);
            return email.protocol === "mailto:"
                ? EmailValidationStatus.VALID
                : EmailValidationStatus.INVALID_FORMAT;
        } catch {
            return EmailValidationStatus.INVALID_FORMAT;
        }
    }
}

module.exports = { User, EmailValidationStatus };
