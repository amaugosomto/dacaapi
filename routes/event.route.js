const express = require('express');
const router = express.Router();

const validator = require('../middlewares/validator');
const eventController = require('../controllers/event.controller');

router.post('/addEvent',
  eventController.addEvent
);

router.post('/editEvent',
  eventController.editEvent
);

router.get('/getAllEvents',
  eventController.getAllEvents
);

router.get('/getEvent/:id',
  eventController.getEvent
);

router.delete('/deleteEvent/:id',
  eventController.deleteEvent
);

module.exports = router;
