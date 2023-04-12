const { body } = require("express-validator")
const validatorCheck = require("./validatorCheck")

module.exports = [
    body("name").notEmpty().withMessage("Enter video name"),
    body("description").notEmpty().withMessage("Enter video description"),
    validatorCheck
]