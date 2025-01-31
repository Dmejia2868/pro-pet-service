const validateUser = (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }
    next();
};

module.exports = { validateUser };
