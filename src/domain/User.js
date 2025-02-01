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

    // Método para obtener el email del usuario
    getEmail() {
        return this.email;
    }

    // Método para ocultar información sensible al convertir el objeto en JSON
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
        };
    }

    // Método para validar si el email tiene un formato válido sin regex problemática
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
