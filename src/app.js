const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authenticateToken = require("./middlewares/authMiddleware"); // 📌 Middleware de autenticación

const userRoutes = require("./infrastructure/controllers/userController");
const dogRoutes = require("./infrastructure/controllers/dogController");
const adoptionRoutes = require("./infrastructure/controllers/adoptionController");


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente 🚀");
});


app.use("/api/users", userRoutes);
app.use("/api/dogs", authenticateToken, dogRoutes);  // 🔒 Protege esta ruta
app.use("/api/adoptions", authenticateToken, adoptionRoutes);  // 🔒 Protege esta ruta

module.exports = app;
