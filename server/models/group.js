'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
* Group Schema
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


GroupSchema.path('id').validate(function(groupid){
  return(typeof groupid === 'number' && groupid > 0);
},'Groupid must be number');

GroupSchema.path('name').validate(function(name){
  return (typeof name === 'string' && name.length > 0);
}, 'There is something wrong with the name');


GroupSchema.statics.load = function(id,cb){
  this.find({id: id}).exec(cb);
}



mongoose.model('Group', GroupSchema);