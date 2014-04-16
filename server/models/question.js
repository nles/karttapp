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
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});


QuestionSchema.path('groupid').validate(function(groupid){
  return(typeof groupid === 'number' && groupid > 0);
},'Groupid must be number');

QuestionSchema.path('question').validate(function(question){
  return (typeof question === 'string' && question.length > 0);
}, 'There is something wrong with the question');

QuestionSchema.path('answer').validate(function(answer){
  return(typeof answer === 'string' && answer.length > 0);
}, 'There is something wrong with the answer');


QuestionSchema.statics.load = function(id,cb){
  this.find({groupid: id}).exec(cb);
}



mongoose.model('Question', QuestionSchema);