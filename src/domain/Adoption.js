class Adoption {
    constructor(id, userId, dogId, status = "pending") {
        this.id = id;
        this.userId = userId;
        this.dogId = dogId;
        this.status = status; // Estado por defecto: "pending"
    }

    // Cambiar el estado de la adopción
    updateStatus(newStatus) {
        const validStatuses = ["accepted", "pending", "rejected"];
        if (!validStatuses.includes(newStatus)) {
            throw new Error(`Estado inválido: ${newStatus}`);
        }
        this.status = newStatus;
    }

    // Verificar si la solicitud sigue activa
    isActive() {
        return this.status === "pending";
    }

    // Devolver la adopción en formato JSON
    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            dogId: this.dogId,
            status: this.status
        };
    }

    // 📌 Sistema de recomendación basado en coseno ponderado
    static recommend(dogs, userPreferences) {
        return dogs
            .map((dog) => ({
                dog,
                similarity: Adoption.calculateCosineSimilarity(dog, userPreferences)
            }))
            .sort((a, b) => b.similarity - a.similarity) // Ordenar de mayor a menor similitud
            .map((entry) => entry.dog);
    }

    // 📌 Función para calcular la similitud coseno ponderada
    static calculateCosineSimilarity(dog, userPreferences) {
        const dotProduct =
            dog.age * userPreferences.age +
            dog.size * userPreferences.size +
            dog.energyLevel * userPreferences.energyLevel;

        const magnitudeA = Math.sqrt(
            dog.age ** 2 + dog.size ** 2 + dog.energyLevel ** 2
        );

        const magnitudeB = Math.sqrt(
            userPreferences.age ** 2 +
            userPreferences.size ** 2 +
            userPreferences.energyLevel ** 2
        );

        return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
    }
}

module.exports = Adoption;
