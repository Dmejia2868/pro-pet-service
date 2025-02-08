class Dog {
    constructor(id, name, breed, age, size, energyLevel, status, preferences, image) {
        this.id = id;
        this.name = name;
        this.breed = breed;
        this.age = age;
        this.size = size;
        this.energyLevel = energyLevel;
        this.status = status;
        
        // Agrupar los parámetros relacionados
        this.good_with_children = preferences.good_with_children;
        this.good_with_pets = preferences.good_with_pets;
        this.space_requirement = preferences.space_requirement;

        this.image = image;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            breed: this.breed,
            age: this.age,
            size: this.size,
            energyLevel: this.energyLevel,
            status: this.status,
            good_with_children: this.good_with_children,
            good_with_pets: this.good_with_pets,
            space_requirement: this.space_requirement,
            image: this.image
        };
    }
}

module.exports = Dog;
