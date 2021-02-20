const bcrypt = require("bcrypt");
const JWT = require('jsonwebtoken');
const { validationResult } = require("express-validator");
const {v4: uuidv4} = require('uuid');
require('dotenv').config();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

//const userModel = require('../models/User');
const db = require('../models');
const helpers = require('../middlewares/imageFilter');
const { Op } = require("sequelize");
const classModel = db.Class;
const classTypeModel = db.ClassType;
const QuizModel = db.Quiz;
const QuizAnswerModel = db.QuizAnswer;
const AdvancedClassOrderModel = db.AdvancedClassesOrder;
const BasicClassesOrderModel = db.BasicClassesOrder;
const StudentClassModel = db.StudentClass;

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

const classController = {

  getAllApprovedClasses: async (req, res) => {

    try {
      const data = await classModel.findAll({
        where: {
          isApproved: true
        }
      }).then(res => res)
        .catch(err => {throw err});

      return res.status(200).send(responseObject(false, 'successfully got classes', data)); 

    } catch (error) {
      return res.status(500).send(responseObject(true, 'an error occured', {}, error));
    }
    
  },

  getAllClasses: async (req, res) => {

    try {
      const data = await classModel.findAll().then(res => res)
        .catch(err => {throw err});

      return res.status(200).send(responseObject(false, 'successfully got classes', data)); 

    } catch (error) {
      return res.status(500).send(responseObject(true, 'an error occured', {}, error));
    }
    
  },

  addClass: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }

    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('image');
    let imageName = '';

    try {

      upload(req, res, async function(err) {
        
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

        let createClass = {
          classBody: req.body.classBody,
          ClassTypeId: req.body.ClassTypeId,
          classTitle: req.body.classTitle,
          tutor: req.body.tutor,
          imageName: imagePath
        };

        try {
          let ClassTypeExist = await classTypeModel.findOne({
            where: {
              id: createClass.ClassTypeId
            }
          }).then(res => res)
            .catch(err => {throw err});
      
          if (ClassTypeExist == null)
            return res.status(404).send(responseObject(true, `class type does not exist`));
          
          const classExist = await classModel.findOne({
            where: {
              ClassTypeId: createClass.ClassTypeId,
              classTitle: createClass.classTitle
            }
          });

          if (classExist != null)
            return res.status(403).send(responseObject(true, `A class with the title "${createClass.classTitle}" already exists`));
    
          const classCreated = await classModel.create(createClass)
            .catch(err => {
              throw err;
            });
          
          if (createClass.ClassTypeId == 1) {
            const highestBasicOrder = await BasicClassesOrderModel.max("ClassOrder");
    
            if (!isNaN(highestBasicOrder)) {
              await BasicClassesOrderModel.create({ClassId: classCreated.id, ClassOrder: highestBasicOrder + 1})
                .catch(err => {throw err});
            } else {
              await BasicClassesOrderModel.create({ClassId: classCreated.id, ClassOrder: 1})
                .catch(err => {throw err});
            }
          } else {
            const highestAdvancedOrder = await AdvancedClassOrderModel.max("ClassOrder");
    
            if (!isNaN(highestAdvancedOrder)) {
              await AdvancedClassOrderModel.create({ClassId: classCreated.id, ClassOrder: highestAdvancedOrder + 1})
                .catch(err => {throw err});
            } else {
              await AdvancedClassOrderModel.create({ClassId: classCreated.id, ClassOrder: 1})
                .catch(err => {throw err});
            }
          }
          
          res.status(200).send(responseObject(false, 'successfully created class'));

        } catch (error) {
          helpers.deleteImage(imageName);
          res.status(500).send(responseObject(true, `unable to create class`, {}, error));
        }
      });

      
    } catch (error) {
      helpers.deleteImage(imageName);
      res.status(500).send(responseObject(true, `unable to create class`, {}, error));
    }
  },

  editClass: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }

    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('image');
    let imageName = '';

    try {
      upload(req, res, async function(err) {
         
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

        let createClass = {
          classBody: req.body.classBody,
          ClassTypeId: req.body.ClassTypeId,
          ClassId: req.body.ClassId,
          classTitle: req.body.classTitle,
          tutor: req.body.tutor
        };

        req.file ? createClass.imageName = imagePath : '';

        if (createClass.classBody == undefined || createClass.ClassTypeId == undefined
          || createClass.ClassId == undefined|| createClass.classTitle == undefined) {
            
          helpers.deleteImage(imageName);
          return res.status(403).send(responseObject(true, `Please fill in all fields`));
        }
  
        try {
          let ClassTypeExist = await classTypeModel.findOne({
            where: {
              id: createClass.ClassTypeId
            }
          }).then(res => res)
            .catch(err => {throw err});
      
          if (ClassTypeExist == null)
            throw new Error("class type does not exist")
            
          const classExist = await classModel.findOne({
            where: {
              id: createClass.ClassId
            }
          }).then(res => res)
            .catch(err => {throw err});
    
          if (classExist == null)
            throw new Error("class does not exist")

          const classNameExist = await classModel.findAll({
            where: {
              id : {
                [Op.ne]: classExist.id
              },
              classTitle: createClass.classTitle
            }
          });

          if (classNameExist.length > 0)
            throw new Error("A class already has the same title, please select new title");
            
          classExist.classBody = createClass.classBody;
          classExist.ClassTypeId = createClass.ClassTypeId;
          classExist.classTitle = createClass.classTitle;
          classExist.tutor = createClass.tutor;
          if (req.file){
            helpers.deleteImage(classExist.imageName.replace('uploads\\', ''));
            classExist.imageName = imagePath;
          } 
    
          await classExist.save();
    
          res.status(200).send(responseObject(false, 'successfully updated class'));

        } catch (error) {
          helpers.deleteImage(imageName);
          typeof error.message == 'string' ? res.status(403).send(responseObject(true, error.message, {})) : 
            res.status(500).send(responseObject(true, `unable to edit class`, {}, error));
        }
      })

    } catch (error) {
      helpers.deleteImage(imageName);
      res.status(500).send(responseObject(true, `unable to edit class`, {}, error));
    }
  },

  getClass: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }
    
    let classId = req.params.classId;

    try {
      let classExist = await classModel.findOne({
        where: {
          id: classId
        }
      }).then(res => res)
        .catch(err => {throw err});

      if (classExist == null)
        return res.status(404).send(responseObject(true, `class does not exist`));

      // get previous class
      let previousClassId = 0;

      if (classExist.ClassTypeId == 1) {
        let basicClassOrder = await BasicClassesOrderModel.findOne({
          where: {
            ClassId: classExist.id
          }
        });

        let previousClassOrder = await BasicClassesOrderModel.findOne({
          where: {
            ClassOrder: basicClassOrder.ClassOrder - 1
          }
        });

        if (previousClassOrder != null)
          previousClassId = previousClassOrder.ClassId;

      } else {
        let AdvancedClassesOrder = await AdvancedClassOrderModel.findOne({
          where: {
            ClassId: classExist.id
          }
        });

        let previousAdvancedClassesOrder = await BasicClassesOrderModel.findOne({
          where: {
            ClassOrder: AdvancedClassesOrder.ClassOrder - 1
          }
        });

        if (previousAdvancedClassesOrder == null) {
          let basicClassMaxId = await BasicClassesOrderModel.max('ClassOrder');

          let basicClass = await BasicClassesOrderModel.findOne({
            where : {
              ClassOrder: basicClassMaxId
            }
          });

          previousClassId = basicClass.ClassId;
        } 
        else
          previousClassId = previousAdvancedClassesOrder.ClassId;
      }

      let classToSend = {
        ClassTypeId: classExist.ClassTypeId,
        classBody: classExist.classBody,
        classTitle: classExist.classTitle,
        createdAt: classExist.createdAt,
        id: classExist.id,
        imageName: classExist.imageName,
        isApproved: classExist.isApproved,
        tutor: classExist.tutor,
        updatedAt: classExist.updatedAt,
        previousClassId
      };

      res.status(200).send(responseObject(false, 'successfully got class', classToSend));

    } catch (error) {
      console.log(error)
      res.status(500).send(responseObject(true, `unable to return class`, {}, error));
    }

  },

  getNextClassId: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }

    let classId = req.params.classId;

    try {
      let classExist = await classModel.findOne({
        where: {
          id: classId
        }
      }).then(res => res)
        .catch(err => {throw err});

      if (classExist == null)
        return res.status(404).send(responseObject(true, `class does not exist`));

      if (classExist.ClassTypeId == 1) {
        let classOrder = await BasicClassesOrderModel.findOne({
          where: {
            ClassId : classId
          }
        });

        let nextCLassOrder = await BasicClassesOrderModel.findOne({
          where: {
            ClassOrder: classOrder.ClassOrder + 1
          }
        });

        if (nextCLassOrder != null) {
          return res.status(200).send(responseObject(false, 'successfully got next classid', {classId: nextCLassOrder.ClassId}));
        } else {
          return res.status(200).send(responseObject(false, 'successfully got next classId', {classId: null}));
        }
      } else {
        let classOrder = await AdvancedClassOrderModel.findOne({
          where: {
            ClassId : classId
          }
        });

        let nextCLassOrder = await AdvancedClassOrderModel.findOne({
          where: {
            ClassOrder: classOrder.ClassOrder + 1
          }
        });

        if (nextCLassOrder != null) {
          return res.status(200).send(responseObject(false, 'successfully got next classid', {classId: nextCLassOrder.ClassId}));
        } else {
          return res.status(200).send(responseObject(false, 'successfully got next classId', {classId: null}));
        }
      }

    } catch (error) {
      res.status(500).send(responseObject(true, `unable to return class`, {}, error));
    }

  },

  getAllQuiz: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }
    
    try {
      let quizExist = await QuizModel.findAll()
        .then(res => res)
        .catch(err => {throw err});

      res.status(200).send(responseObject(false, 'success', quizExist));

    } catch (error) {
      res.status(500).send(responseObject(true, `unable to get quiz`, {}, error));
    }
  },

  getAllQuizByClassId: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }
    let classId = req.params.classId;
    
    try {
      let quizExist = await classModel.findOne({
        include: {
          model: QuizModel,
          include: {
            model: QuizAnswerModel
          }
        },
        where: {
          id : classId
        },
        attributes: { exclude: ['updatedAt', 'createdAt'] }
      }).then(res => res)
        .catch(err => {throw err});

      if (quizExist == null)
        return res.status(404).send(responseObject(true, 'class does not exist'));

      res.status(200).send(responseObject(false, 'success', quizExist));

    } catch (error) {
      res.status(500).send(responseObject(true, `unable to get quiz`, {}, error));
    }
  },

  addQuiz: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }
    
    let quizOptions = req.body.quizOptions;
    if (quizOptions == undefined || quizOptions.length < 0) {
      return res.status(403).send(responseObject(true, `please supply quiz options`));
    }
    
    var createQuiz = {
      quizBody: req.body.quizQuestion,
      quizCorrectAns: req.body.correctAnswer,
      ClassId: req.body.ClassId
    };

    try {
      let classExist = await classModel.findOne({
        where: {
          id: createQuiz.ClassId
        }
      }).then(res => res)
        .catch(err => {throw err});

      if (classExist == null) 
        return res.status(404).send(responseObject(true, `class does not exist`));

      const quizCreated = await QuizModel.create(createQuiz)
        .catch(err => {throw err});

      let bulkQuizOptions = [];

      for (let i = 0; i < quizOptions.length; i++) {
        const quizOption = quizOptions[i];
        let answerValue = quizOption.value;

        let dataToSave = {
          QuizId: quizCreated.id,
          answerBody: quizOption.body,
          answerValue
        }
        
        bulkQuizOptions.push(dataToSave);
      }
      
      await QuizAnswerModel.bulkCreate(bulkQuizOptions).catch(err => { throw err });
        

      res.status(200).send(responseObject(false, 'successfully created quiz'));

    } catch (error) {
      console.log(error)
      res.status(500).send(responseObject(true, `unable to create quiz`, {}, error));
    }
  },

  editQuiz: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }
    
    let quizOptions = req.body.quizOptions;
    let correctAnswer = req.body.correctAnswer;
    let QuizId = req.body.QuizId;
    let quizBody = req.body.quizQuestion;

    if (quizBody == undefined || QuizId == undefined) 
      return res.status(403).send(responseObject(true, `Please provide required fields`));

    if (quizOptions.length < 1) 
      return res.status(403).send(responseObject(true, `Please provide quiz options`));

    try {
      
      let quizExist = await QuizModel.findOne({
        where: {
          id: QuizId
        }
      }).then(res => res)
        .catch(err => {throw err});

      if (quizExist == null) 
        return res.status(404).send(responseObject(true, `quiz does not exist`));

      quizExist.quizBody = quizBody;
      quizExist.quizCorrectAns = correctAnswer;
      await quizExist.save();

      let bulkQuizOptions = [];

      for (let i = 0; i < quizOptions.length; i++) {
        const quizOption = quizOptions[i];
        let answerValue = quizOption.value;

        let dataToSave = {
          QuizId,
          answerBody: quizOption.body,
          answerValue
        }
        
        bulkQuizOptions.push(dataToSave);
      }
      
      await QuizAnswerModel.destroy({ where: { QuizId }});
      await QuizAnswerModel.bulkCreate(bulkQuizOptions).catch(err => { throw err }); 

      res.status(200).send(responseObject(false, 'successfully updated quiz'));

    } catch (error) {
      res.status(500).send(responseObject(true, `unable to update quiz`, {}, error));
    }
  },

  getQuiz: async (req, res) => {
    let quizId = req.params.quizId;

    try {
      let quizExist = await QuizModel.findOne({
        where: {
          id: quizId
        },
        attributes: { exclude: ['updatedAt', 'createdAt'] },
        include: {
          model: QuizAnswerModel,
          attributes: { exclude: ['updatedAt', 'createdAt'] }
        }
      }).then(res => res)
        .catch(err => {throw err});

      if (quizExist == null)
        return res.status(404).send(responseObject(true, `quiz does not exist`));

      res.status(200).send(responseObject(false, 'successfully got quiz', quizExist));

    } catch (error) {
      res.status(500).send(responseObject(true, `unable to return quiz`, {}, error));
    }
  },

  addQuizOptions: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }
    
    let quizOptions = req.body.quizOptions;
    let QuizId = req.body.QuizId;

    if (quizOptions == undefined || quizOptions.length < 1 || 
        req.body.QuizId == undefined || req.body.correctAnswer == undefined)
      return res.status(403).send(responseObject(true, `please supply required fields`, {}));

    try {

      let QuizExist = await QuizModel.findOne({
        where: {
          id: QuizId
        }
      }).catch(err => { throw err });
      
      if (QuizExist == null)
        return res.status(403).send(responseObject(true, `Quiz does not exist`, {}));

      let correctAnswer = req.body.correctAnswer;
      let bulkQuizOptions = [];

      for (let i = 0; i < quizOptions.length; i++) {
        const quizOption = quizOptions[i];
        let answerValue = Object.keys(quizOption)[0];

        let dataToSave = {
          QuizId: req.body.QuizId,
          answerBody: quizOption[answerValue],
          answerValue
        }

        bulkQuizOptions.push(dataToSave);
      }
      
      const quizAnswer = await QuizAnswerModel.bulkCreate(bulkQuizOptions).catch(err => { throw err });
      
      QuizExist.quizCorrectAns = correctAnswer;
      QuizExist.save().catch(err => { throw err });

      res.status(200).send(responseObject(false, 'successfully created quiz options'));

    } catch (error) {
      res.status(500).send(responseObject(true, `unable to create quiz options`, {}, error));
    }
    
  },

  approveClass: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }
    
    let classId = req.params.classId;
    try {

      let classExist = await classModel.findOne({
        where: {
          id: classId
        }
      }).catch(err => { throw err });

      if (classExist == null)
        return res.status(403).send(responseObject(true, `Class does not exist`, {}));

      let QuizExist = await QuizModel.count({
        where: {
          ClassId: classId
        }
      }).catch(err => { throw err });
      
      if (QuizExist < 1)
        return res.status(403).send(responseObject(true, `Class cannot be approved until it has quizzes`, {}));
        
      classExist.isApproved = true;
      classExist.updatedAt = new Date();
      classExist.save();

      res.status(200).send(responseObject(false, 'successfully approved class'));

    } catch (error) {
      res.status(500).send(responseObject(true, `unable to approve class`, {}, error));
    }
    
  },

  disapproveClass: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }
    
    let classId = req.params.classId;
    try {

      let classExist = await classModel.findOne({
        where: {
          id: classId
        }
      }).catch(err => { throw err });

      if (classExist == null)
        return res.status(403).send(responseObject(true, `Class does not exist`, {}));

      classExist.isApproved = false;
      classExist.updatedAt = new Date();
      classExist.save();

      res.status(200).send(responseObject(false, 'successfully disapproved class'));

    } catch (error) {
      res.status(500).send(responseObject(true, `unable to disapproved class`, {}, error));
    }
    
  },

  deleteQuiz: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }
    
    let quizId = req.params.quizId;
    try {

      let quizExist = await QuizModel.findOne({
        where: {
          id: quizId
        }
      }).catch(err => { throw err });

      if (quizExist == null)
        return res.status(403).send(responseObject(true, `Quiz does not exist`, {}));

      await QuizAnswerModel.destroy({
        where: {
          id: quizId
        }
      });

      quizExist.destroy();

      res.status(200).send(responseObject(false, 'successfully deleted quiz'));

    } catch (error) {
      res.status(500).send(responseObject(true, `unable to delete quiz`, {}, error));
    }
    
  },

  deleteClass: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }
    
    let classId = req.params.classId;
    try {

      let classExist = await classModel.findOne({
        where: {
          id: classId
        }
      }).catch(err => { throw err });

      if (classExist == null)
        return res.status(403).send(responseObject(true, `Class does not exist`, {}));

      let quizzes = await QuizModel.findAll({
        where: {
          ClassId: classId
        }
      });
      quizzes.map(async (quiz) => {
        await QuizAnswerModel.destroy({
          where : {
            QuizId: quiz.id
          }
        })
      });
      await QuizModel.destroy({
        where: {
          ClassId: classId
        }
      });
      classExist.destroy();

      res.status(200).send(responseObject(false, 'successfully deleted class'));

    } catch (error) {
      res.status(500).send(responseObject(true, `unable to delete class`, {}, error));
    }
    
  },

  getAllClassByTypeId: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }
    
    let classType = req.params.classType;
    try {

      let classes = await classModel.findAll({
        where: {
          ClassTypeId: classType,
          isApproved: true
        }
      });

      res.status(200).send(responseObject(false, 'success', classes));

    } catch (error) {
      res.status(500).send(responseObject(true, `error getting class`, {}, error));
    }
    
  },

  setStudentClass: async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
      return res.status(403).send({errors: errors.array()});
    }

    let authorization = req.headers.authorization;
    let token = authorization.replace('Bearer ', '');

    try {
      let decoded = JWT.verify(token, process.env.JWT_KEY);

      let Class = await classModel.findOne({
        where: { 
          id: req.params.classId,
        }
      });
      if (Class == null)
        return res.status(404).send('');

      let studentClassToSave = {
        ClassId: req.params.classId,
        // quizScore: req.body.quizScore,
        QuizId: 0,
        UserId: decoded.sub
      }
      
      let studentClass = await StudentClassModel.findOne({
        where: {
          UserId: studentClassToSave.UserId,
          ClassId: studentClassToSave.ClassId
        }
      });

      if (studentClass == null) {
        await StudentClassModel.create(studentClassToSave)
          .catch(err => { throw err });
        
      }

      //Set next class in studnet class
      if (Class.ClassTypeId == 1) {
        let basicClassOrder = await BasicClassesOrderModel.findOne({
          where: {
            ClassId: req.params.classId
          }
        });

        let basicClassOrderNext = await BasicClassesOrderModel.findOne({
          where: {
            ClassOrder: basicClassOrder.ClassOrder + 1
          }
        });

        let newStudentClass = '';
        let newStudentClassData = '';

        if (basicClassOrderNext == null) {
          let AdvancedClassesOrder = await AdvancedClassOrderModel.findOne({
            where: {
              ClassOrder: 1
            }
          });

          if (AdvancedClassesOrder == null)
            return res.status(204).send('');

          // Check if advance class exist in studnet class tb
          newStudentClass = await StudentClassModel.findOne({
            where: {
              UserId: decoded.sub,
              ClassId: AdvancedClassesOrder.ClassId
            }
          });

          if (newStudentClass != null)
            return res.status(204).send('');

          newStudentClassData = {
            ClassId: AdvancedClassesOrder.ClassId,
            QuizId: 0,
            UserId: decoded.sub
          }

        }else {
          newStudentClass = await StudentClassModel.findOne({
            where: {
              UserId: decoded.sub,
              ClassId: basicClassOrderNext.ClassId
            }
          });

          if (newStudentClass != null)
            return res.status(204).send('');

          newStudentClassData = {
            ClassId: basicClassOrderNext.ClassId,
            QuizId: 0,
            UserId: decoded.sub
          }
          
        }

        if (newStudentClassData != '') {
          await StudentClassModel.create(newStudentClassData)
            .catch(err => { throw err });
        }

        return res.status(200).send('');
      } else {

        let AdvancedClassesOrder = await AdvancedClassOrderModel.findOne({
          where: {
            ClassId: req.params.classId
          }
        });

        let AdvancedClassesOrderNext = await AdvancedClassOrderModel.findOne({
          where: {
            ClassOrder: AdvancedClassesOrder.ClassOrder + 1
          }
        });

        let newStudentClassData = '';

        if (AdvancedClassesOrderNext == null)
          return res.status(204).send('');

        newStudentClassData = {
          ClassId: AdvancedClassesOrderNext.ClassId,
          QuizId: 0,
          UserId: decoded.sub
        }

        let studentClassExist = await StudentClassModel.findOne({
          where: {
            UserId: decoded.sub,
            ClassId: AdvancedClassesOrderNext.ClassId
          }
        });

        if (studentClassExist == null){
          await StudentClassModel.create(newStudentClassData)
            .catch(err => { throw err });
        }

        return res.status(204).send('');
      }
      res.status(200).send(responseObject(false, 'success'));
    } catch (error) {
      console.log(error)
      res.status(500).send(responseObject(true, `error setting student class`, {}, error));
    }
    
  },

  getStudentClass: async (req, res) => {
    
    let authorization = req.headers.authorization;
    let token = authorization.replace('Bearer ', '');

    try {

      let decoded = JWT.verify(token, process.env.JWT_KEY);

      let data = {
        classId: null,
        firstClass: true
      }

      let userClass = await StudentClassModel.findOne({
        where: { 
          UserId: decoded.sub
        },
        order: [ [ 'createdAt', 'DESC' ]],
      });

      /**
       * check if user has no entry in student class, then get the first basic classid
       **/

      if (userClass == null) {
        let firstClassOrder = await BasicClassesOrderModel.findOne({
          order: [ [ 'createdAt', 'ASC' ]],
        });

        if (firstClassOrder == null) {
          return res.status(204).send(responseObject(true, 'no class', data));
        }

        data.classId = firstClassOrder.ClassId;
        return res.status(200).send(responseObject(true, 'success', data));
      }

      /**
       * send the latest entry of user class
       **/
      let studentClassCount = await StudentClassModel.count({
        where: {
          UserId: decoded.sub
        }
      });

      data.classId = userClass.ClassId;
      studentClassCount > 1 ? data.firstClass = false : '';

      return res.status(200).send(responseObject(true, 'success', data));

    } catch (error) {
      res.status(500).send(responseObject(true, `error getting student class`, {}, error));
    }
    
  },

  setAnsweredQuiz: async (req, res) => {
    
    let authorization = req.headers.authorization;
    let token = authorization.replace('Bearer ', '');

    try {
      let decoded = JWT.verify(token, process.env.JWT_KEY);

      let userClass = await StudentClassModel.findOne({
        where: { 
          ClassId: req.body.classId,
          UserId: decoded.sub
        }
      });

      if (userClass == null)
        return res.status(500).send(responseObject(true, 'Class does not exist', data));

      userClass.numberCorrectAnswers = req.body.numberCorrectAnswers;
      userClass.hasTakenQuiz = true;
      userClass.save();

      let Class = await classModel.findOne({
        where: { 
          id: req.body.classId
        }
      });

      if (Class.ClassTypeId == 1) {
        let basicClassOrder = await BasicClassesOrderModel.findOne({
          where: {
            ClassId: req.body.classId
          }
        });

        let basicClassOrderNext = await BasicClassesOrderModel.findOne({
          where: {
            ClassOrder: basicClassOrder.ClassOrder + 1
          }
        });

        if (basicClassOrderNext == null) {
          let AdvancedClassesOrder = await AdvancedClassOrderModel.findOne({
            where: {
              ClassOrder: 1
            }
          });

          if (AdvancedClassesOrder == null)
            return res.status(204).send(responseObject(false, 'Finished Class'));

          return res.status(200).send(responseObject(false, 'Gotten next class', AdvancedClassesOrder));
        }

        return res.status(200).send(responseObject(false, 'Gotten next class', basicClassOrderNext));
      } else {
        let AdvancedClassesOrder = await AdvancedClassOrderModel.findOne({
          where: {
            ClassId: req.body.classId
          }
        });

        let AdvancedClassesOrderNext = await AdvancedClassOrderModel.findOne({
          where: {
            ClassOrder: AdvancedClassesOrder.ClassOrder + 1
          }
        });

        if (AdvancedClassesOrderNext == null)
          return res.status(204).send(responseObject(false, 'Finished Class'));

        return res.status(200).send(responseObject(false, 'Gotten next class', AdvancedClassesOrderNext));
      }

    } catch (error) {
      res.status(500).send(responseObject(true, `error getting student class`, {}, error));
    }
    
  },


}

module.exports = classController;
