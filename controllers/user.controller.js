const bcrypt = require("bcrypt");
const JWT = require('jsonwebtoken');
const { validationResult } = require("express-validator");
const {v4: uuidv4} = require('uuid');
require('dotenv').config();

const { sendMail } = require("../middlewares/mailer");

//const userModel = require('../models/User');
const db = require('../models');
const userModel = db.User;

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

const userController = {
  register: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }

    const salt_rounds = 10;
    const hash = await bcrypt.hash(req.body.password, salt_rounds);
    let activateID = activateToken();

    var createUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email.toLowerCase(),
      password: hash,
      activationId: activateID,
      isActivated: false
    };

    try {
      const userExist = await userModel.findOne({
        where: {
          email: createUser.email
        }
      }).then(res => res)
        .catch(err => {throw err});

      if (userExist != null)
        return res.status(401).send(responseObject(true, `user with email ${createUser.email} already exist`));

      const userCreated = await userModel.create(createUser)
        .catch(err => {
          throw err;
        });

      sendMail(userCreated.id, activateID);

      res.status(200).send(responseObject(false, 'successfully created user'));

    } catch (error) {
      res.status(400).send(responseObject(true, `unable to create user`, {}, error));
    }
  },

  getAllUsers: async (req, res) => {
    //const user = await userModel.findAll();
    const users = await userModel.findAll({
      attributes: { exclude: ['password', 'activationId'] }
    }).then(res => res)
    res.status(200).send(users);
  },

  login: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(422).send({ errors: errors.array() });
    }

    var email = req.body.email;
    var password = req.body.password;

    try {
      const userExist = await userModel.findOne({
        where: {
          email
        }
      }).then(res => res)
        .catch(err => {throw err});
        
      if (userExist == null)
        return res.status(404).send(responseObject(true, 'user does not exist'));
        
      if (userExist.isActivated != true)
        return res.status(401).send(responseObject(true, 'user has not been authorized'));
        
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
        token
      }

      return res.status(200).send(responseObject(false, 'successfully logged in', data));

    } catch (error) {
      return res.status(500).send(responseObject(true, 'an error occured', {}, error));
    }
  },

  activateAccount: async (req, res) => {
    let id = req.params.id;
    let activationId = req.params.activationId;

    try {
      const userExist = await userModel.findOne({
        where: {
          id,
          activationId
        }
      }).then(res => res)
        .catch(err => {throw err});

      if (userExist == null)
        return res.status(404).send(responseObject(true, 'user does not exist'));

      userExist.isActivated = true; 
      userExist.updatedAt = true; 
      userExist.save();

      res.status(200).send(responseObject(false, 'successfully approved user'));

    } catch (error) {
      return res.status(500).send(responseObject(true, 'an error occured', {}, error));
    }
  },

  testEmail: async (req, res) => {
    await sendMail().then(result => console.log('Email sent...', result))
      .catch(error => console.log(error.message));

    res.send('ok');
  }
}

module.exports = userController;
