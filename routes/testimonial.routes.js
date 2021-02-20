const express = require('express');
const router = express.Router();

const testimonialController =   require('../controllers/testimonial.controller');

// Retrieve all testimonials
router.get('/', testimonialController.findAll);

// Create a new testimonial
router.post('/', testimonialController.create);

// Retrieve a single testimonial with id
router.get('/:id', testimonialController.findById);

// Update a testimonial with id
router.put('/:id', testimonialController.update);

// Delete a testimonial with id
router.delete('/:id', testimonialController.delete);

module.exports = router;