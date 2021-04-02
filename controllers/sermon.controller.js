const bcrypt = require("bcrypt");
const JWT = require('jsonwebtoken');
const { validationResult } = require("express-validator");
const {v4: uuidv4} = require('uuid');
require('dotenv').config();
const { sermonFilter, deleteImage } = require('../middlewares/imageFilter');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
    let extension = path.extname(file.originalname);
    let originalname = file.originalname.split(extension)[0];
      cb(null, originalname + '-' + Date.now() + extension);
  }
});

const { Op } = require("sequelize");
const db = require('../models');
const sermonModel = db.Sermon;

const errorFormatter = ({msg}) => {
  return {msg};
};

const errorHandler = () => {};

const responseObject = (isError = false, msg = "", data = {}, error = "") => {
  return {
    isError,
    msg,
    data,
    error
  }
}

const sermonController = {
  addSermon: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }

    let upload = multer({ storage: storage, fileFilter: sermonFilter }).single('audio');
    let audioName = '';

    try {
      upload(req, res, async function (err) {
         
        if (req.fileValidationError) {
          return res.status(500).send(req.fileValidationError);
        }
        else if (err instanceof multer.MulterError) {
            return res.status(500).send(err);
        }
        else if (err) {
            return res.status(500).send(err);
        }

        let audioPath = req.file ? req.file.path : '';
        audioName = req.file ? req.file.filename : '';
        
        let createSermon = {
          sermonTitle: req.body.sermonTitle,
          sermonPreacher: req.body.sermonPreacher,
          sermonDesc: req.body.sermonDesc,
          sermonFileName: audioPath,
          category: req.body.category,
        };
        
        if (createSermon.sermonTitle == undefined || createSermon.sermonPreacher == undefined ) {
          deleteImage(audioName);
          return res.status(403).send(responseObject(true, `Please fill in all required fields`));
        }

        try {
          let sermonExist = await sermonModel.findOne({
            where: {
              sermonTitle: createSermon.sermonTitle
            }
          }).then(res => res)
            .catch(err => {throw err});

          if (sermonExist != null)
            return res.status(403).send(responseObject(true, `Sermon with name ${createSermon.sermonTitle} already exist`));

          await sermonModel.create(createSermon)
            .catch(err => { throw err; });

          res.status(200).send(responseObject(false, 'successfully created sermon'));

        } catch (error) {
          deleteImage(audioName);
          res.status(500).send(responseObject(true, `unable to create sermon`, {}, error));
        }
  
      });

    } catch (error) {
      res.status(400).send(responseObject(true, `unable to create sermon`, {}, error));
    }
  },

  getAllSermons: async (req, res) => {
    const sermons = await sermonModel.findAll({});
    res.status(200).send(responseObject(false, 'successfully got sermons', sermons));
  },
  

  getSermon: async (req, res) => {
    let sermonId = req.params.id;

    const sermon = await sermonModel.findOne({
      where: {
        id: sermonId
      }
    });

    if (sermon == null)
      return res.status(404).send(responseObject(true, 'sermon does not exist', ));

    res.status(200).send(responseObject(false, 'successfully got sermon', sermon));
  },

  editSermon: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }

    let upload = multer({ storage: storage, fileFilter: audioFilter }).single('audio');
    let audioName = '';

    try {
      upload(req, res, async function (err) {
         
        if (req.fileValidationError) {
          return res.status(500).send(req.fileValidationError);
        }
        else if (err instanceof multer.MulterError) {
            return res.status(500).send(err);
        }
        else if (err) {
            return res.status(500).send(err);
        }

        let audioPath = req.file ? req.file.path : '';
        audioName = req.file ? req.file.filename : '';

        let createSermon = {
          sermonTitle: req.body.sermonTitle,
          sermonPreacher: req.body.sermonPreacher,
          sermonDesc: req.body.sermonDesc,
          sermonFileName: audioPath,
          category: req.body.category,
        };
        
        let sermonExist = await sermonModel.findOne({
          where: {
            id: req.body.id
          }
        }).then(res => res)
          .catch(err => {throw err});

        if (sermonExist == null)
          return res.status(404).send(responseObject(true, `Sermon does not exist`));

        let sermonTitleExist = await sermonModel.findOne({
          where: {
            sermonTitle: createSermon.sermonTitle,
            id : {
              [Op.ne]: req.body.id
            },
          }
        }).then(res => res)
          .catch(err => {throw err});

        if (sermonTitleExist)
          return res.status(403).send(responseObject(true, `Sermon with name ${createSermon.sermonTitle} already exist`));

        if (req.file) {
          let oldAudioName = sermonExist.sermonFileName.split("uploads\\")[1];
          deleteImage(oldAudioName);
          sermonExist.sermonFileName = audioPath;
        }
        
        if (createSermon.sermonTitle == undefined || createSermon.sermonPreacher == undefined ) {
          deleteImage(audioName);
          return res.status(403).send(responseObject(true, `Please fill in all required fields`));
        }

        try {
          sermonExist.sermonTitle = createSermon.sermonTitle;
          sermonExist.sermonPreacher = createSermon.sermonPreacher;
          sermonExist.sermonDesc = createSermon.sermonDesc;
          sermonExist.category = createSermon.category;

          await sermonExist.save();

          res.status(200).send(responseObject(false, 'successfully updated sermon'));

        } catch (error) {
          deleteImage(audioName);
          res.status(500).send(responseObject(true, `unable to update sermon`, {}, error));
        }
  
      });

    } catch (error) {
      res.status(400).send(responseObject(true, `unable to update sermon`, {}, error));
    }
  },
}

module.exports = sermonController;
