const { body } = require("express-validator");

const validator = {
  firstName: [
      body("firstName")
        .not().isEmpty().withMessage("first name must not be empty")
        .isString()
        .withMessage("first name must be a string")
  ],
  lastName: [
      body("lastName")
        .not().isEmpty().withMessage("last name must not be empty")
        .isString()
        .withMessage("last name must be a string and not empty")
  ],
  password: [
      //[.matches] the string must contain 1 lowercase, 1 uppercase, 1 numeric character
      // 1 special character and must be eight characters or longer
      body('password')
        .not().isEmpty().withMessage("password should not be empty")
        .matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})")
        .withMessage("password must have 1 lowercase, 1 uppercase, 1 special character and 8 characters long"),
      body('confirmPassword', 'password confirmation field must have the same value as the password field')
        .not().isEmpty().withMessage("confirm password should not be empty")
        .custom((value, { req }) => value === req.body.password)
  ],
  email: [
      body('email')
        .not().isEmpty().withMessage("email cannot be blank")
        .normalizeEmail().isEmail().withMessage("please provide a valid email")
  ],
  phone: [
      body('phone_number')
        .not().isEmpty().withMessage("phone number cannot be empty")
        .isString().withMessage("phone number should be a string")
        .isLength({min: 11}).withMessage("phone number should not be less than 11")
  ], 
  login_password: [
      body('password')
        .not().isEmpty().withMessage("password should not be empty")
  ]
};

module.exports = validator;