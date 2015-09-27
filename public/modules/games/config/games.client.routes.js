'use strict';

//Setting up route
angular.module('games').config(['$stateProvider',
	function($stateProvider) {
		// Games state routing
		$stateProvider.
		state('listGames', {
			url: '/games',
			templateUrl: 'modules/games/views/main-view.client.view.html'
		}).
		state('viewGame', {
			url: '/games/:gameId',
			templateUrl: 'modules/games/views/view-game.client.view.html'
		}).
		state('hologram1', {
			url: '/hologram1',
			templateUrl: 'modules/games/views/display-hologram1.client.view.html'
		}).
		state('hologram2', {
			url: '/hologram2',
			templateUrl: 'modules/games/views/display-hologram2.client.view.html'
		}).
		state('fight', {
			url: '/fight/:gameId',
			templateUrl: 'modules/games/views/fight.client.view.html'
		}).
		state('battle', {
			url: '/game/battle',
			templateUrl: 'modules/games/views/battle-game.client.view.html'
		});

	}
]);
