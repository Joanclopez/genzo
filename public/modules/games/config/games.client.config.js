'use strict';

// Configuring the Articles module
angular.module('games').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Games', 'games');
		// Menus.addSubMenuItem('topbar', 'games', 'List Games', 'games');
		// Menus.addSubMenuItem('topbar', 'games', 'New Game', 'games/create');
	}
]);
