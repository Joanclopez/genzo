'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Character Schema
 */
var CharacterSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Character name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Character', CharacterSchema);