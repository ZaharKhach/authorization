const Router = require('express');
const authController = require("./authController");
const { check } = require('express-validator');

const router = new Router();

router.post('/registration', [
    check('username', "Name cannot be empty").notEmpty(),
    check('password', "Password must have more than 5 symbols").isLength({ min: 5, max: 10 })
], authController.registration);
router.post('/login', authController.login);
router.get('/users', authController.getUsers);

module.exports = router;