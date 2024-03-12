var express = require('express');
var router = express.Router();
const { User } = require("../models/users/userModel")
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    try {
        const AllUsers = await User.find({});
        res.send(AllUsers)
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error: GET user");
    }
})

router.post('/', async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return callback(new Error('The user already exists'));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email: email,
            password: hashedPassword
        });

        newUser.save().then(() => {
            res.send("Usuario creado")
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error: GET user");
    }
})

router.delete('/', async (req, res) => {
    const { email } = req.query; // Cambia req.body a req.query

    try {
        if (!email) {
            return res.status(400).send("Correo electrónico es requerido");
        }
        await User.deleteOne({ email: email });

        res.send("Usuario eliminado");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error: DELETE user");
    }
});

module.exports = router;