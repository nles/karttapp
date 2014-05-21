'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
* Gamepoint Schema
* defines attributes for score-object
*/
var ScoreSchema = new Schema({
  player: {
    type: String,
    required: true
  },
  gameid: {
    type: Number,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  groupid: {
    type: Number,
    default: 0 // 0 == there's no questiongroups in the game
  }
});




/**
* Validate name
* must be three letter long
*/
var validateName = function(value){
  return value && value.length === 3
}
/**
 * Pre-save hook
 * Before saving object to database, validate name
 */
ScoreSchema.pre('save', function(next) {
  if(!validateName(this.player)){
    next(new Error('Invalid name'));
  }else{
    return next();
  }
});

//validate player
//must be instance of string and three letters long
ScoreSchema.path('player').validate(function(player){
  return(typeof player === 'string' && player.length === 3);
},'Player must be 3 letter length');
//validate gameid
//must be instance of number and greater than 0
ScoreSchema.path('gameid').validate(function(gameid){
  return (typeof gameid === 'number' && gameid > 0);
}, 'There is something wrong with the game_id');
//validate points
//must be instance of number and greater than -1
ScoreSchema.path('points').validate(function(points){
  return(typeof points === 'number' && points > -1);
}, 'There is something wrong with the points you got');

//Find all scores which have gameid similar to given id
// - method finds all the scores which are related to given gameid
ScoreSchema.statics.load = function(id,cb){
  this.find({gameid: id}).sort([['points','descending']]).exec(cb);
}


//set model for schema
mongoose.model('Score', ScoreSchema);