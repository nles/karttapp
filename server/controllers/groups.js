'use strict';

/**
* Module dependencies
*/
var mongoose = require('mongoose'),
		Group = mongoose.model('Group');

/**
* Find questions by groupid
*/
exports.group = function(req, res, next, groupid) {
  Group.load(groupid, function(err, group) { 
    if (err) return next(err);
    if (!group) return next(new Error('Failed to load group with id: ' + groupid));
    req.group = group;
    next();
  });
};

/**
* Create a group
*/
exports.create = function(req, res, next) {
  var group = new Group(req.body);
  group.save(function(err) {
    if (err) {
      return res.status(400).send('Please fill all the required fields (error '+err+')');
    }else{
      res.jsonp(group);
    }
  });
};

/**
*
* List of groups
*/
exports.all = function(req,res,next){
  Group.find().exec(function(err,groups){
    if(err){
      res.render('error',{
        status: 500
      });
    } else {
      res.jsonp(groups);
    }
  })

}
/*
* Show a score
*/
exports.show = function(req,res){
  res.jsonp(req.group);
}