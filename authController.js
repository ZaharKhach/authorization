const Role = require("./models/Role");
const User = require("./models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { key } = require("./config")
const { validationResult } = require('express-validator');

const generatAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, key, { expiresIn: "24h" })
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Error with registration", errors })
            }
            const { username, password } = req.body;
            const candidate = await User.findOne({ username });

            if (candidate) {
                return res.status(400).json({ message: "There is one user with same name" });
            }
            const hashUserPassword = bcrypt.hashSync(password, 8);
            const userRole = await Role.findOne({ value: 'USER' });

            if (!Role) {
                return res.status(400).json({ message: "Role 'USER' not found" });
            }

            const user = new User({ username, password: hashUserPassword, roles: [userRole.value] });

            await user.save();

            return res.json({ message: "User was successfully created" })
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Registration error" })
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });

            if (!user) {
                return res.status(400).json({ message: `User ${username} is not found` })
            }

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) {
                return res.status(400).josn({ message: `Password is not correct` })
            }

            const token = generatAccessToken(user._id, user.roles);
            return res.json({ token })

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Login error" })
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (error) {

        }
    }
}
module.exports = new authController();