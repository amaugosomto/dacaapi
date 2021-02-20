'use strict';
var dbConn = require('./../db.config');

//Testimonial object create
var Testimonial = function(testimonial){
  // this.name           = testimonial.name;
  // this.status         = testimonial.status ? testimonial.status : 1;
  // this.created_at     = new Date();
  // this.updated_at     = new Date();
};

// Testimonial.create = function (newTestimonial, result) {
//     dbConn.query("INSERT INTO testimonials set ?", newTestimonial, function (err, res) {
//     if(err) {
//       console.log("error: ", err);
//       result(err, null);
//     }
//     else{
//       console.log(res.insertId);
//       result(null, res.insertId);
//     }
//     });
// };

// Testimonial.findById = function (id, result) {
//     dbConn.query("Select * from testimonials where id = ? ", id, function (err, res) {
//     if(err) {
//       console.log("error: ", err);
//       result(err, null);
//     }
//     else{
//       result(null, res);
//     }
//     });
// };

// Testimonial.findAll = function (result) {
//     dbConn.query("Select * from testimonials", function (err, res) {
//     if(err) {
//       console.log("error: ", err);
//       result(null, err);
//     }
//     else{
//       console.log('testimonials : ', res);
//       result(null, res);
//     }
//     });
// };

// Testimonial.update = function(id, testimonial, result){
//     dbConn.query("UPDATE testimonials SET name=? WHERE id = ?", [testimonial.name, id], function (err, res) {
//         if(err) {
//           console.log("error: ", err);
//           result(null, err);
//         }else{
//           result(null, res);
//         }
//     });
// };

// Testimonial.delete = function(id, result){
//     dbConn.query("DELETE FROM testimonials WHERE id = ?", [id], function (err, res) {
//         if(err) {
//           console.log("error: ", err);
//           result(null, err);
//         }
//         else{
//           result(null, res);
//         }
//     });
// };
module.exports= Testimonial;