'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
* Gamepoint Schema
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
  }
});

/** Virtuals

ScoreSchema.virtual('game').set(function(game){
  this._game = game;
  this.gameid = getId(game);
}).get(function(){
  return this._game;
})*/


/**
* Validations
*/
var validateName = function(value){
  return value && value.length === 3
}
/**
 * Pre-save hook
 */
ScoreSchema.pre('save', function(next) {
  if(!validateName(this.player)){
    next(new Error('Invalid name'));
  }else{
    return next();
  }
});


ScoreSchema.path('player').validate(function(player){
  return(typeof player === 'string' && player.length === 3);
},'Player must be 3 letter length');

ScoreSchema.path('gameid').validate(function(gameid){
  return (typeof gameid === 'number' && gameid > 0);
}, 'There is something wrong with the game_id');

ScoreSchema.path('points').validate(function(points){
  return(typeof points === 'number' && points > -1);
}, 'There is something wrong with the points you got');

ScoreSchema.post('save', function(doc){
  console.log('%s has been saved', doc.player);
});

ScoreSchema.statics.load = function(id,cb){
  console.log('hä')
  this.find({gameid: id}).sort([['points','descending']]).exec(cb);
}



mongoose.model('Score', ScoreSchema);