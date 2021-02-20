'use strict';
const Testimonial = require('../models/testimonial.model');
exports.findAll = function(req, res) {
    Testimonial.findAll(function(err, testimonial) {
      console.log('controller')
      if (err)
        res.send(err);
        
      console.log('res', testimonial);
      res.send(testimonial);
    });
};

exports.create = function(req, res) {
    const new_testimonial = new Testimonial(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Testimonial.create(new_testimonial, function(err, testimonial) {
          if (err)
          res.send(err);
          res.json({error:false,message:"Testimonial added successfully!",data:testimonial});
        });
    }
};

exports.findById = function(req, res) {
    Testimonial.findById(req.params.id, function(err, testimonial) {
      if (err)
      res.send(err);
      res.json(testimonial);
    });
};

exports.update = function(req, res) {
    
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Testimonial.update(req.params.id, new Testimonial(req.body), function(err, testimonial) {
            if (err)
                res.send(err);
            res.json({ error:false, message: 'Testimonial successfully updated' });
       });
    }
};

exports.delete = function(req, res) {
    Testimonial.delete( req.params.id, function(err, testimonial) {
      if (err)
      res.send(err);
      res.json({ error:false, message: 'Testimonial successfully deleted' });
    });
};
