const bcrypt = require("bcrypt");
const JWT = require('jsonwebtoken');
const { validationResult } = require("express-validator");
const {v4: uuidv4} = require('uuid');
require('dotenv').config();

//const userModel = require('../models/User');
const db = require('../models');
const adminUser = db.AdminUser;

const errorFormatter = ({msg}) => {
  return {msg};
};

const activateToken = () => {
  return token = uuidv4();
}

const errorHandler = () => {};

const responseObject = (isError = false, msg = "", data = {}, error = "") => {
  return {
    isError,
    msg,
    data,
    error
  }
}

const adminUserController = {
  addAdmin: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }

    const salt_rounds = 10;
    const hash = await bcrypt.hash(req.body.password, salt_rounds);

    var createUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email.toLowerCase(),
      password: hash,
      isActive: req.body.isActive,
      isAdmin: req.body.isAdmin
    };

    try {
      const userExist = await adminUser.findOne({
        where: {
          email: createUser.email
        }
      }).then(res => res)
        .catch(err => {throw err});

      if (userExist != null)
        return res.status(401).send(responseObject(true, `user with email ${createUser.email} already exist`));

      await adminUser.create(createUser)
        .catch(err => {
          throw err;
        });

      res.status(200).send(responseObject(false, 'successfully created user'));

    } catch (error) {
      res.status(400).send(responseObject(true, `unable to create user`, {}, error));
    }
  },

  updateAdmin: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }

    const userId = req.body.userId;

    if (userId == undefined)
      return res.status(404).send(responseObject(true, `user does not exist`));

    var createUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email.toLowerCase(),
      isActive: req.body.isActive,
      isAdmin: req.body.isAdmin
    };

    try {
      const userExist = await adminUser.findOne({
        where: {
          id: userId
        }
      }).then(res => res)
        .catch(err => {throw err});

      if (userExist == null)
        return res.status(404).send(responseObject(true, `user does not exist`));

      userExist.firstName = createUser.firstName;
      userExist.lastName = createUser.lastName;
      userExist.email = createUser.email;
      userExist.isActive = createUser.isActive;
      userExist.isAdmin = createUser.isAdmin;

      await userExist.save().catch(err => {throw err})

      res.status(200).send(responseObject(false, 'successfully updated user'));

    } catch (error) {
      res.status(400).send(responseObject(true, `unable to update user`, {}, error));
    }
  },

  getAllAdminUsers: async (req, res) => {
    //const user = await userModel.findAll();
    const users = await adminUser.findAll({
      attributes: { exclude: ['password', 'activationId'] }
    }).then(res => res);

    res.status(200).send(responseObject(false, 'successfully gotten users', users));
  },

  getUser: async (req, res) => {
    const user = req.params.userId;
    if (user == undefined)
      return res.status(404).send(responseObject(true, `user does not exist`));

    try {
      const userExist = await adminUser.findOne({
        where: {
          id: user
        },
        attributes: { exclude: ['password', 'activationId'] }
      }).then(res => res);
  
      if (userExist == null)
        return res.status(404).send(responseObject(true, `user does not exist`));
  
      res.status(200).send(responseObject(false, 'successfully gotten user', userExist));
    } catch (error) {
      res.status(500).send(responseObject(true, `unable to get user`, {}, error));
    }
    
  },

  toggleIsActive: async (req, res) => {
    const user = req.params.userId;
    if (user == undefined)
      return res.status(404).send(responseObject(true, `user does not exist`));

    try {
      const userExist = await adminUser.findOne({
        where: {
          id: user
        },
        attributes: { exclude: ['password', 'activationId'] }
      }).then(res => res);
  
      if (userExist == null)
        return res.status(404).send(responseObject(true, `user does not exist`));

      userExist.isActive = !userExist.isActive;
      await userExist.save().catch(err => {throw err});
  
      res.status(200).send(responseObject(false, 'successfully toggled isActive'));
    } catch (error) {
      res.status(500).send(responseObject(true, `unable to get user`, {}, error));
    }
    
  },

  toggleIsAdmin: async (req, res) => {
    const user = req.params.userId;
    if (user == undefined)
      return res.status(404).send(responseObject(true, `user does not exist`));

    try {
      const userExist = await adminUser.findOne({
        where: {
          id: user
        },
        attributes: { exclude: ['password', 'activationId'] }
      }).then(res => res);
  
      if (userExist == null)
        return res.status(404).send(responseObject(true, `user does not exist`));

      userExist.isAdmin = !userExist.isAdmin;
      await userExist.save().catch(err => {throw err});
  
      res.status(200).send(responseObject(false, 'successfully toggled isAdmin'));
    } catch (error) {
      res.status(500).send(responseObject(true, `unable to get user`, {}, error));
    }
    
  },

  login: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(422).send({ errors: errors.array() });
    }

    var email = req.body.email;
    var password = req.body.password;

    try {
      const userExist = await adminUser.findOne({
        where: {
          email
        }
      }).then(res => res)
        .catch(err => {throw err});
        
      if (userExist == null)
        return res.status(404).send(responseObject(true, 'user does not exist'));
        
      var compare_passwords = await bcrypt.compare(password, userExist.password);
      if (!compare_passwords) {
        return res.status(401).send(responseObject(true, 'authentication failed'));
      }
      
      var token = JWT.sign({
        iss: 'Daca',
        sub: userExist.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
      }, process.env.JWT_KEY);
      
      if (!token) {
        return res.status(522).send(responseObject(true, 'error signing jwt, contact admin'));
      }

      let data = {
        email: userExist.email,
        name: userExist.firstName + ' ' + userExist.lastName,
        isAdmin: userExist.isAdmin,
        token
      }

      return res.status(200).send(responseObject(false, 'successfully logged in', data));

    } catch (error) {
      return res.status(500).send(responseObject(true, 'an error occured', {}, error));
    }
  }
}

module.exports = adminUserController;
