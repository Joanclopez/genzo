'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var games = require('../../app/controllers/games.server.controller');

	// Games Routes
	app.route('/games')
		.get(games.list)
		.post(users.requiresLogin, games.create);

	app.route('/games/:gameId')
		.get(games.read)
		.put(users.requiresLogin, games.hasAuthorization, games.update)
		.delete(users.requiresLogin, games.hasAuthorization, games.delete);

		app.route('/player1')
			.post(games.emitirPlayer1);
		app.route('/player2')
			.post(games.emitirPlayer2)

	// Finish by binding the Game middleware
	app.param('gameId', games.gameByID);
};
