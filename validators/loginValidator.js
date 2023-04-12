const { body } = require("express-validator")
const validatorCheck = require("./validatorCheck")

module.exports = [
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("password").notEmpty().withMessage("Password field cant be empty"),
    validatorCheck
]