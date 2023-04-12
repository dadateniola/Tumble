const { body } = require("express-validator")
const validatorCheck = require("./validatorCheck")

module.exports = [
    body("first_name").notEmpty().withMessage("Firstname is required"),
    body("last_name").notEmpty().withMessage("Lastname is required"),
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("password").notEmpty().withMessage("Password field cant be empty"),
    body('dob').isDate().withMessage('Date of birth is required').isBefore().withMessage('Date of birth can not be a date in the future'),
    body('phone').isMobilePhone('en-NG').withMessage('Please use a valid nigerian mobile phone number'),
    validatorCheck
]