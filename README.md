Configuración del Backend<br>
cd backend<br>
npm install  # Instalar dependencias<br>

Ejecutar el servidor:<br>
npm run dev<br>
---------------------------------------<br>

Uso del Proyecto<br>

Autenticación:<br>
Registro: POST /api/users/register<br>
Login: POST /api/users/login<br>

<br>

Gestión de Perros:<br>
Listar todos: GET /api/dogs<br>
Agregar: POST /api/dogs <br>
Actualizar: PATCH /api/dogs/:id<br>
Eliminar: DELETE /api/dogs/:id<br>
<br>
Gestión de Adopciones:<br>
Solicitar adopción: POST /api/adoptions<br>
Actualizar estado: PATCH /api/adoptions/:id<br>
Obtener todas las adopciones: GET /api/adoptions<br>
Obtener adopciones por usuario: GET /api/adoptions/user/:userId
