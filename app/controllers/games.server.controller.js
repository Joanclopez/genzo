'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Game = mongoose.model('Game'),
	_ = require('lodash');

/**
 * Create a Game
 */
exports.create = function(req, res) {
	var game = new Game(req.body);
	game.user = req.user;

	game.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(game);
			var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
			socketio.sockets.emit('action', game); // emit an event for all connected clients
		}
	});
};

/**
 * Show the current Game
 */
exports.read = function(req, res) {
	res.jsonp(req.game);
};

/**
 * Update a Game
 */
exports.update = function(req, res) {
	var game = req.game ;

	game = _.extend(game , req.body);

	game.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(game);
		}
	});
};

/**
 * Delete an Game
 */
exports.delete = function(req, res) {
	var game = req.game ;

	game.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(game);
		}
	});
};

/**
 * List of Games
 */
exports.list = function(req, res) {
	Game.find().sort('-created').populate('user', 'displayName').exec(function(err, games) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(games);
		}
	});
};

/**
 * Game middleware
 */
exports.gameByID = function(req, res, next, id) {
	Game.findById(id).populate('user', 'displayName').exec(function(err, game) {
		if (err) return next(err);
		if (! game) return next(new Error('Failed to load Game ' + id));
		req.game = game ;
		next();
	});
};

/**
 * Game authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.game.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
