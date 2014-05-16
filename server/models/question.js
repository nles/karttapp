'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
* Question Schema
* Defines attributes for question-object
*/
var QuestionSchema = new Schema({
  groupid: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
});

//validate groupid
//must be instance of number and greater than 0
QuestionSchema.path('groupid').validate(function(groupid){
  return(typeof groupid === 'number' && groupid > 0);
},'Groupid must be number');

//validate name
//must be instance of string and contain one or more letters
QuestionSchema.path('name').validate(function(name){
  return (typeof name === 'string' && name.length > 0);
}, 'There is something wrong with the name');
//validate country
//must be instance of string and contain one or more letters
QuestionSchema.path('country').validate(function(country){
  return(typeof country === 'string' && country.length > 0);
}, 'There is something wrong with the country');

//Find all questions which includes to given group by id
QuestionSchema.statics.load = function(id,cb){
  this.find({groupid: id}).exec(cb);
}


//set model for schema
mongoose.model('Question', QuestionSchema);