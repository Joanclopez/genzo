'use strict';

// Games controller
angular.module('games').controller('GamesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Games','Socket','$http','$timeout',
	function($scope, $stateParams, $location, Authentication, Games,Socket,$http, $timeout) {
		$scope.authentication = Authentication;
		$scope.player1Life=100;
		$scope.player2Life=100;

		// Create new Game
		$scope.create = function() {
			// Create new Game object
			var game = new Games ({
				player1: $scope.authentication.user._id
			});

			// Redirect after save
			game.$save(function(response) {
				$location.path('fight/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.games=[];
		$scope.getFightList=function(){
			Socket.on('games', function(game) {
					// console.log(game);
					$scope.games.push(game);

			});
		};

		// Remove existing Game
		$scope.remove = function(game) {
			if ( game ) {
				game.$remove();

				for (var i in $scope.games) {
					if ($scope.games [i] === game) {
						$scope.games.splice(i, 1);
					}
				}
			} else {
				$scope.game.$remove(function() {
					$location.path('games');
				});
			}
		};

		// Update existing Game
		$scope.update = function() {
			var game = $scope.game;

			game.$update(function() {
				$location.path('games/' + game._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Games
		$scope.find = function() {
			$scope.games = Games.query(function(response){
				console.log(response);
			});
		};

		$scope.viewHolograms=function(){
			Socket.on('holograms/', function(player) {
					 console.log(player);
					 if (player.player2) {
						$scope.player2=player.player2;

					 }
					 if (player.player1) {
						$scope.player1=player.player1;//si somos el player 1 escucharemos las acciones del player2
					 }
					 Socket.on('player1/', function(actions) {
						 console.log(actions);
						 $scope.player1Actions=actions

					 });
					 Socket.on('player2/', function(actions) {
						 console.log(actions);
						 $scope.player2Actions=actions

					 });

			});
		};

		$scope.player1Emit=function(action){
			console.log('estoy enviando');
			// 			console.log($scope.emitir);
			// console.log(Socket);
			// 			Socket.emit('/holograms/',{player1:'affdf'},function(result){
			// 				console.log(result);
			// 			});
			$scope.actionSprite=0;
			console.log($scope.emitir);

			$scope.emitir=$scope.danmage();
			$scope.player2Life=$scope.player2Life-($scope.emitir);
			$scope.selectWinner();

			$http.post('/player1', {action:
				{
				danmage:$scope.emitir,
				action:action
				}
			}).success(function(response){
				console.log(response);
			});

		};

		$scope.player2Emit=function(action){
			$scope.emitir=$scope.danmage();
			console.log($scope.emitir);
			$scope.actionSprite=0;
			$scope.player1Life=$scope.player1Life-($scope.emitir);
			$scope.selectWinner();
			$http.post('/player2', {action:	{
				danmage:$scope.emitir,
				action:action
				}
			}).success(function(response){
				console.log(response);
			});

		};

		$scope.danmage=function(){
			var danmage,acert;
			// acert=Math.random();
			// if (acert>=.5) {
			danmage=Math.random();
			// }
			// console.log(acert);
			return danmage;
		};

		// Find existing Game
		$scope.player2={};
		$scope.player1={};
		$scope.findOne = function() {
			$scope.game = Games.get({
				gameId: $stateParams.gameId
			},function(response){

				if (response.player1._id+''==$scope.authentication.user._id) {
					Socket.on('player2/', function(actions) {
						console.log(actions);
						$scope.player1Life=$scope.player1Life-(actions.danmage);
						$scope.selectWinner();
					});
				}else {
					Socket.on('player1/', function(actions) {
						console.log(actions);
						$scope.player2Life=$scope.player2Life-(actions.danmage);
						$scope.selectWinner();

					});

				}

				console.log(response);
				Socket.on('figthRoom/'+$stateParams.gameId, function(player) {
						 console.log(player);
						 if (player.player2) {
						 	$scope.player2=player.player2;
							startLeapService();
						} else {
								startLeapService();
						}

				});
			});

		};

$scope.selectWinner=function(){

	if($scope.player1Life<0){
		$scope.winner="player2"
		$timeout(function(){
				$location.path('games');
			}, 3000);
	}else	if($scope.player2Life<0){
			$scope.winner="player1"
			$timeout(function(){
					$location.path('games');
				}, 3000);
		};
};
		$scope.mainView = function() {

		}

		$scope.battle = function() {

		}




	function startLeapService() {
		var action;
		var controller = Leap.loop({enableGestures: true}, function(frame) {

			if(frame.valid && frame.gestures.length > 0) {
				var otherFrame = controller.frame();
				if(otherFrame.hands.length == 1) {
					console.log(typeAttack(otherFrame));
				}
			}
		});
	}

	function typeAttack(frameController) {
		var action;
		var flag = false
		frameController.gestures.forEach(function(gesture) {
			if(!flag) {
				switch (gesture.type) {

					case 'circle':
					console.log(gesture.type);
						action = 1;
						if($scope.authentication.user._id == $scope.game.player1._id) {
							$scope.player1Emit(action);
						} else {
							$scope.player2Emit(action);
						}
						break;
					case 'keyTap':
						action = 0;
						if($scope.authentication.user._id == $scope.game.player1._id) {
							$scope.player1Emit(action);
						} else {
							$scope.player2Emit(action);
						}

						break;
				}
			}

		});
		flag = true;
		return action;
	}




		}
]);
