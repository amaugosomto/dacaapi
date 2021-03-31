const bcrypt = require("bcrypt");
const JWT = require('jsonwebtoken');
const { validationResult } = require("express-validator");
const {v4: uuidv4} = require('uuid');
require('dotenv').config();
const { imageFilter, deleteImage } = require('../middlewares/imageFilter');
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
const eventModel = db.Event;

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

const eventController = {
  addEvent: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }

    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('image');
    let imageName = '';

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

        let imagePath = req.file ? req.file.path : '';
        imageName = req.file ? req.file.filename : '';
        
        let createEvent = {
          eventTitle: req.body.eventTitle,
          eventPreacher: req.body.eventPreacher,
          eventDesc: req.body.eventDesc,
          eventFileName: imagePath,
          eventVenue: req.body.eventVenue,
          eventType: req.body.eventType,
          eventDate: req.body.eventDate,
        };
        
        if (createEvent.eventTitle == undefined || createEvent.eventPreacher == undefined || createEvent.eventDesc == undefined
            || createEvent.eventVenue == undefined || createEvent.eventDate == undefined) {
          deleteImage(imageName);
          return res.status(403).send(responseObject(true, `Please fill in all required fields`));
        }

        try {
          let eventExist = await eventModel.findOne({
            where: {
              eventTitle: createEvent.eventTitle
            }
          }).then(res => res)
            .catch(err => {throw err});

          if (eventExist != null)
            return res.status(403).send(responseObject(true, `Event with name ${createEvent.eventTitle} already exist`));

          await eventModel.create(createEvent)
            .catch(err => { throw err; });

          res.status(200).send(responseObject(false, 'successfully created event'));

        } catch (error) {
          deleteImage(imageName);
          res.status(500).send(responseObject(true, `unable to create event`, {}, error));
        }
  
      });

    } catch (error) {
      res.status(400).send(responseObject(true, `unable to create event`, {}, error));
    }
  },

  getAllEvents: async (req, res) => {
    const events = await eventModel.findAll({});
    res.status(200).send(responseObject(false, 'successfully got events', events));
  },
  
  getEvent: async (req, res) => {
    let eventId = req.params.id;

    const event = await eventModel.findOne({
      where: {
        id: eventId
      }
    });

    if (event == null)
      return res.status(404).send(responseObject(true, 'event does not exist', ));

    res.status(200).send(responseObject(false, 'successfully got event', event));
  },

  editEvent: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }

    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('image');
    let imageName = '';

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

        let imagePath = req.file ? req.file.path : '';
        imageName = req.file ? req.file.filename : '';
        
        let createEvent = {
          eventTitle: req.body.eventTitle,
          eventPreacher: req.body.eventPreacher,
          eventDesc: req.body.eventDesc,
          eventFileName: imagePath,
          eventVenue: req.body.eventVenue,
          eventType: req.body.eventType,
          eventDate: req.body.eventDate,
        };
        
        if (createEvent.eventTitle == undefined || createEvent.eventPreacher == undefined || createEvent.eventDesc == undefined
          || createEvent.eventVenue == undefined || createEvent.eventDate == undefined) {
          deleteImage(imageName);
          return res.status(403).send(responseObject(true, `Please fill in all required fields`));
        }

        let eventExist = await eventModel.findOne({
          where: {
            id: req.body.id
          }
        }).then(res => res)
          .catch(err => {throw err});

        if (eventExist == null)
          return res.status(404).send(responseObject(true, `Event does not exist`));

        let eventTitleExist = await eventModel.findOne({
          where: {
            eventTitle: createEvent.eventTitle,
            id : {
              [Op.ne]: req.body.id
            },
          }
        }).then(res => res)
          .catch(err => {throw err});

        if (eventTitleExist)
          return res.status(403).send(responseObject(true, `Event with name ${createEvent.eventTitle} already exist`));

        if (req.file) {
          let oldImageName = eventExist.eventFileName.split("uploads\\")[1];
          deleteImage(oldImageName);
          eventExist.eventFileName = imagePath;
        }

        try {
          eventExist.eventTitle = createEvent.eventTitle;
          eventExist.eventPreacher = createEvent.eventPreacher;
          eventExist.eventDesc = createEvent.eventDesc;
          eventExist.eventType = createEvent.eventType;
          eventExist.eventDate = createEvent.eventDate;
          eventExist.eventVenue = createEvent.eventVenue;

          await eventExist.save();

          res.status(200).send(responseObject(false, 'successfully updated event'));

        } catch (error) {
          deleteImage(imageName);
          res.status(500).send(responseObject(true, `unable to update event`, {}, error));
        }
  
      });

    } catch (error) {
      res.status(400).send(responseObject(true, `unable to update event`, {}, error));
    }
  },

  deleteEvent: async (req, res) => {
    let eventId = req.params.id;

    const eventExist = await eventModel.findOne({
      where: {
        id : eventId
      }
    });
    
    if (eventExist == null)
      return res.status(404).send(responseObject(true, 'event does not exist', ));

    let oldImageName = eventExist.eventFileName.split("uploads\\")[1];
    deleteImage(oldImageName);
    
    await eventExist.destroy();
    res.status(200).send(responseObject(false, 'successfully deleted an event'));
  },
}

module.exports = eventController;
