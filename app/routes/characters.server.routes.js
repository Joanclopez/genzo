'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var characters = require('../../app/controllers/characters.server.controller');

	// Characters Routes
	app.route('/characters')
		.get(characters.list)
		.post(users.requiresLogin, characters.create);

	app.route('/characters/:characterId')
		.get(characters.read)
		.put(users.requiresLogin, characters.hasAuthorization, characters.update)
		.delete(users.requiresLogin, characters.hasAuthorization, characters.delete);

	// Finish by binding the Character middleware
	app.param('characterId', characters.characterByID);
};
