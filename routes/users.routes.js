const express = require('express');
const router = express.Router();

const validator = require('../middlewares/validator');
const userController = require('../controllers/user.controller');

router.post('/register', 
  validator.firstName,
  validator.lastName,
  validator.email,
  validator.password,
  userController.register
);

router.post('/login',
  validator.email,
  validator.login_password,
  userController.login
);

router.get('/getAllUsers',
  userController.getAllUsers
);

router.get('/activateAccount/:id/:activationId',
  userController.activateAccount
);

router.get('/testEmail',
  userController.testEmail
);

module.exports = router;
