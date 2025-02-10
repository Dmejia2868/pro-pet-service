const EmailValidationStatus = Object.freeze({
    VALID: "VALID",
    INVALID_FORMAT: "INVALID_FORMAT",
    EMPTY: "EMPTY"
});

class User {
    constructor(id, name, email, password, province, city, phone ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.province = province;
        this.city = city;
        this.phone = phone;
    }

    // Método para ocultar información sensible al convertir el objeto en JSON
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            province: this.province,
            city: this.city,
            phone: this.phone
        };
    }

    // Método para validar el email
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
