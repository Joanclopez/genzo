'use strict';

//Games service used to communicate Games REST endpoints
angular.module('games').factory('Games', ['$resource',
	function($resource) {
		return $resource('games/:gameId', { gameId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);