const bcrypt = require("bcrypt");
const { db } = require("../../config/database"); // ✅ Asegurar que db se importa correctamente

class BaseRepository {
    static run(query, params = []) {
        return new Promise((resolve, reject) => {
            db.run(query, params, function (err) {
                if (err) reject(err);
                else resolve(this);
            });
        });
    }

    static get(query, params = []) {
        return new Promise((resolve, reject) => {
            db.get(query, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static all(query, params = []) {
        return new Promise((resolve, reject) => {
            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ✅ NUEVO MÉTODO PARA CORREGIR CONTRASEÑAS
    static async fixPasswords() {
        try {
            const users = await this.all("SELECT id, password FROM Users");

            for (const user of users) {
                if (!user.password.startsWith("$2b$")) {  // Solo rehashear si no está hasheada
                    console.log(`🔄 Rehasheando contraseña para el usuario ${user.id}`);
                    const hashedPassword = await bcrypt.hash(user.password, 10);

                    await this.run(
                        "UPDATE Users SET password = ? WHERE id = ?",
                        [hashedPassword, user.id]
                    );

                    console.log(`✅ Usuario ${user.id} actualizado correctamente.`);
                } else {
                    console.log(`✅ Usuario ${user.id} ya tiene la contraseña correctamente hasheada.`);
                }
            }
        } catch (error) {
            console.error("❌ Error corrigiendo contraseñas:", error);
        }
    }
}

module.exports = BaseRepository;
