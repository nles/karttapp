'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
* Question Schema
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


QuestionSchema.path('groupid').validate(function(groupid){
  return(typeof groupid === 'number' && groupid > 0);
},'Groupid must be number');

QuestionSchema.path('name').validate(function(name){
  return (typeof name === 'string' && name.length > 0);
}, 'There is something wrong with the name');

QuestionSchema.path('country').validate(function(country){
  return(typeof country === 'string' && country.length > 0);
}, 'There is something wrong with the country');


QuestionSchema.statics.load = function(id,cb){
  this.find({groupid: id}).exec(cb);
}



mongoose.model('Question', QuestionSchema);