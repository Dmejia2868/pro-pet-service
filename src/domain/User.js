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

    // Método para validar si el email tiene un formato válido
    isValidEmail() {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(this.email);
    }
    
}

module.exports = User;
