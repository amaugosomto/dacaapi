const express = require('express');
const router = express.Router();

const validator = require('../middlewares/validator');
const classController = require('../controllers/class.controller');

router.get('/getAllApprovedClasses',
  classController.getAllApprovedClasses
);

router.get('/getAllClasses',
  classController.getAllClasses
);

router.post('/addClass',
  classController.addClass
);

router.get('/getClass/:classId',
  classController.getClass
);

router.post('/editClass',
  classController.editClass
);

router.get('/getNextClassId/:classId',
  classController.getNextClassId
);

router.get('/getAllQuiz',
  classController.getAllQuiz
);

router.get('/getAllQuizByClassId/:classId',
  classController.getAllQuizByClassId
);

router.post('/addQuiz',
  classController.addQuiz
);

router.post('/editQuiz',
  classController.editQuiz
);

router.get('/getQuiz/:quizId',
  classController.getQuiz
);

router.post('/addQuizOptions',
  classController.addQuizOptions
);

router.get('/approveClass/:classId',
  classController.approveClass
);

router.get('/disapproveClass/:classId',
  classController.disapproveClass
);

router.get('/deleteQuiz/:quizId',
  classController.deleteQuiz
);

router.get('/deleteClass/:classId',
  classController.deleteClass
);

router.get('/getAllClassByTypeId/:classType',
  classController.getAllClassByTypeId
);

router.get('/setStudentClass/:classId',
  classController.setStudentClass
);

router.get('/getStudentClass',
  classController.getStudentClass
);

router.post('/setAnsweredQuiz',
  classController.setAnsweredQuiz
);

router.post('/setStudentResponses',
  classController.setStudentResponses
);

module.exports = router;