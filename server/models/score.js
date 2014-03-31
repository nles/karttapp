'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
* Gamepoint Schema
*/
var ScoreSchema = new Schema({
  player: {
    type: String,
    required: true
  },
  gameid: {
    type: int,
    required: true
  },
  points: {
    type: int,
    required true
  }
});

/**
* Virtuals
*/
ScoreSchema.virtual('game').set(function(game){
  this._game = game;
  this.gameid = getId(game);
}).get(function(){
  return this._game;
})

/**
* Validations
*/
var validatePresenceOf = function(value){
  return value && value.length
}

ScoreSchema.path('player').validate(function(player){
  return(typeof player === 'string' && player.length === 3);
},'Player must be 3 letter length');

ScoreSchema.path('gameid').validate(function(gameid){
  return (typeof gameid === 'int' && gameid > 0);
}, 'There is something wrong with the game_id');

ScoreSchema.path('points').validate(function(points){
  return(typeof points === ' int' && points > -1);
}, 'There is something wrong with the points you got');




/**
* Methods
*/
ScoreSchema.methods = {
  getId: function(game){
    switch (game) {
      case "pick_countries":
          return 1;
          break;
    }
  }
}


mongoose.model('Score', ScoreSchema);