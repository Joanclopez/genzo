'use strict';

//Setting up route
angular.module('games').config(['$stateProvider',
	function($stateProvider) {
		// Games state routing
		$stateProvider.
		state('listGames', {
			url: '/games',
			templateUrl: 'modules/games/views/list-games.client.view.html'
		}).
		state('createGame', {
			url: '/games/create',
			templateUrl: 'modules/games/views/create-game.client.view.html'
		}).
		state('viewGame', {
			url: '/games/:gameId',
			templateUrl: 'modules/games/views/view-game.client.view.html'
		}).
		state('editGame', {
			url: '/games/:gameId/edit',
			templateUrl: 'modules/games/views/edit-game.client.view.html'
		});
	}
]);