'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
* Group Schema
* Defines what attributes group-object have.
*/
var GroupSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  }
});

//Validate given id
//id must be instance of number and greater than 0
GroupSchema.path('id').validate(function(groupid){
  return(typeof groupid === 'number' && groupid > 0);
},'Groupid must be number');
//Validate given name
//name must be instance of string and it must contain 1 or more letters
GroupSchema.path('name').validate(function(name){
  return (typeof name === 'string' && name.length > 0);
}, 'There is something wrong with the name');

//Find group with given id
GroupSchema.statics.load = function(id,cb){
  this.find({id: id}).exec(cb);
}


//set model for schema
mongoose.model('Group', GroupSchema);