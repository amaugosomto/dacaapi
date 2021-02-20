const express = require('express');
const router = express.Router();

const validator = require('../middlewares/validator');
const adminUserController = require('../controllers/adminUser.controller');

router.post('/addAdmin', 
  validator.firstName,
  validator.lastName,
  validator.email,
  validator.password,
  adminUserController.addAdmin
);

router.post('/updateAdmin', 
  validator.firstName,
  validator.lastName,
  validator.email,
  adminUserController.updateAdmin
);

router.get('/getuser/:userId', 
  adminUserController.getUser
);

router.get('/toggleIsActive/:userId', 
  adminUserController.toggleIsActive
);

router.get('/toggleIsAdmin/:userId', 
  adminUserController.toggleIsAdmin
);

router.post('/login',
  validator.email,
  validator.login_password,
  adminUserController.login
);

router.get('/getAllAdminUsers',
  adminUserController.getAllAdminUsers
);

module.exports = router;