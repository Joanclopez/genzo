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
	game.player1 = req.user;
	//console.log(req.user);

	game.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(game);
			var figthRoom={
				_id:game._id,
				player1:req.user
			};
			//console.log(figthRoom);
			var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
			socketio.sockets.emit('games', figthRoom); // emit an event for all connected clients
		}
	});
};

exports.emitirPlayer1 = function(req, res) {

// console.log(req.body);
			//console.log(figthRoom);
			var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
			socketio.sockets.emit('player1/', req.body.action); // emit an event for all connected clients
			res.jsonp({game:'eeeee'});
};

exports.emitirPlayer2 = function(req, res) {

console.log(req.body);
			//console.log(figthRoom);
			var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
			socketio.sockets.emit('player2/', req.body); // emit an event for all connected clients
			res.jsonp({game:'eeeee'});

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
	Game.find().sort('-created').populate('player1').populate('player2').populate('winner').exec(function(err, games) {
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
	Game.findById(id).populate('player1').populate('player2').populate('winner').exec(function(err, game) {
		if (err) return next(err);
		if (! game) return next(new Error('Failed to load Game ' + id));
		req.game = game ;
		var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
		var figthRoom={};
		console.log(game.player1+' '+req.user._id);
		if (game.player1._id+''===req.user._id+'') {
			console.log('sonigualess');
			figthRoom={
				player1:req.user
			};
		}else{
			console.log('nosonigualess');
			figthRoom={
				player2:req.user
			};
		};
		socketio.sockets.emit('figthRoom/'+game._id, figthRoom);
		socketio.sockets.emit('holograms/', figthRoom);
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
