const express = require('express');
const router = express.Router();

const validator = require('../middlewares/validator');
const sermonController = require('../controllers/sermon.controller');

router.post('/addSermon',
  sermonController.addSermon
);

router.post('/editSermon',
  sermonController.editSermon
);

router.get('/getAllSermons',
  sermonController.getAllSermons
);

router.get('/getSermon/:id',
  sermonController.getSermon
);

module.exports = router;
