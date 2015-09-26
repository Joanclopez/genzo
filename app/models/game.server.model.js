'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Game Schema
 para las peleas
 */
var GameSchema = new Schema({
	player1: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	player2: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	winner: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Game', GameSchema);
