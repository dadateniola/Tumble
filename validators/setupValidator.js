const { body } = require("express-validator")
const validatorCheck = require("./validatorCheck")

module.exports = [
    body("username").notEmpty().withMessage("Enter a valid username"),
    validatorCheck
]