'use strict';

(function() {
	// Characters Controller Spec
	describe('Characters Controller Tests', function() {
		// Initialize global variables
		var CharactersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Characters controller.
			CharactersController = $controller('CharactersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Character object fetched from XHR', inject(function(Characters) {
			// Create sample Character using the Characters service
			var sampleCharacter = new Characters({
				name: 'New Character'
			});

			// Create a sample Characters array that includes the new Character
			var sampleCharacters = [sampleCharacter];

			// Set GET response
			$httpBackend.expectGET('characters').respond(sampleCharacters);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.characters).toEqualData(sampleCharacters);
		}));

		it('$scope.findOne() should create an array with one Character object fetched from XHR using a characterId URL parameter', inject(function(Characters) {
			// Define a sample Character object
			var sampleCharacter = new Characters({
				name: 'New Character'
			});

			// Set the URL parameter
			$stateParams.characterId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/characters\/([0-9a-fA-F]{24})$/).respond(sampleCharacter);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.character).toEqualData(sampleCharacter);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Characters) {
			// Create a sample Character object
			var sampleCharacterPostData = new Characters({
				name: 'New Character'
			});

			// Create a sample Character response
			var sampleCharacterResponse = new Characters({
				_id: '525cf20451979dea2c000001',
				name: 'New Character'
			});

			// Fixture mock form input values
			scope.name = 'New Character';

			// Set POST response
			$httpBackend.expectPOST('characters', sampleCharacterPostData).respond(sampleCharacterResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Character was created
			expect($location.path()).toBe('/characters/' + sampleCharacterResponse._id);
		}));

		it('$scope.update() should update a valid Character', inject(function(Characters) {
			// Define a sample Character put data
			var sampleCharacterPutData = new Characters({
				_id: '525cf20451979dea2c000001',
				name: 'New Character'
			});

			// Mock Character in scope
			scope.character = sampleCharacterPutData;

			// Set PUT response
			$httpBackend.expectPUT(/characters\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/characters/' + sampleCharacterPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid characterId and remove the Character from the scope', inject(function(Characters) {
			// Create new Character object
			var sampleCharacter = new Characters({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Characters array and include the Character
			scope.characters = [sampleCharacter];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/characters\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCharacter);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.characters.length).toBe(0);
		}));
	});
}());