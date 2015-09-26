'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Character = mongoose.model('Character'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, character;

/**
 * Character routes tests
 */
describe('Character CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Character
		user.save(function() {
			character = {
				name: 'Character Name'
			};

			done();
		});
	});

	it('should be able to save Character instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Character
				agent.post('/characters')
					.send(character)
					.expect(200)
					.end(function(characterSaveErr, characterSaveRes) {
						// Handle Character save error
						if (characterSaveErr) done(characterSaveErr);

						// Get a list of Characters
						agent.get('/characters')
							.end(function(charactersGetErr, charactersGetRes) {
								// Handle Character save error
								if (charactersGetErr) done(charactersGetErr);

								// Get Characters list
								var characters = charactersGetRes.body;

								// Set assertions
								(characters[0].user._id).should.equal(userId);
								(characters[0].name).should.match('Character Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Character instance if not logged in', function(done) {
		agent.post('/characters')
			.send(character)
			.expect(401)
			.end(function(characterSaveErr, characterSaveRes) {
				// Call the assertion callback
				done(characterSaveErr);
			});
	});

	it('should not be able to save Character instance if no name is provided', function(done) {
		// Invalidate name field
		character.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Character
				agent.post('/characters')
					.send(character)
					.expect(400)
					.end(function(characterSaveErr, characterSaveRes) {
						// Set message assertion
						(characterSaveRes.body.message).should.match('Please fill Character name');
						
						// Handle Character save error
						done(characterSaveErr);
					});
			});
	});

	it('should be able to update Character instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Character
				agent.post('/characters')
					.send(character)
					.expect(200)
					.end(function(characterSaveErr, characterSaveRes) {
						// Handle Character save error
						if (characterSaveErr) done(characterSaveErr);

						// Update Character name
						character.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Character
						agent.put('/characters/' + characterSaveRes.body._id)
							.send(character)
							.expect(200)
							.end(function(characterUpdateErr, characterUpdateRes) {
								// Handle Character update error
								if (characterUpdateErr) done(characterUpdateErr);

								// Set assertions
								(characterUpdateRes.body._id).should.equal(characterSaveRes.body._id);
								(characterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Characters if not signed in', function(done) {
		// Create new Character model instance
		var characterObj = new Character(character);

		// Save the Character
		characterObj.save(function() {
			// Request Characters
			request(app).get('/characters')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Character if not signed in', function(done) {
		// Create new Character model instance
		var characterObj = new Character(character);

		// Save the Character
		characterObj.save(function() {
			request(app).get('/characters/' + characterObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', character.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Character instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Character
				agent.post('/characters')
					.send(character)
					.expect(200)
					.end(function(characterSaveErr, characterSaveRes) {
						// Handle Character save error
						if (characterSaveErr) done(characterSaveErr);

						// Delete existing Character
						agent.delete('/characters/' + characterSaveRes.body._id)
							.send(character)
							.expect(200)
							.end(function(characterDeleteErr, characterDeleteRes) {
								// Handle Character error error
								if (characterDeleteErr) done(characterDeleteErr);

								// Set assertions
								(characterDeleteRes.body._id).should.equal(characterSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Character instance if not signed in', function(done) {
		// Set Character user 
		character.user = user;

		// Create new Character model instance
		var characterObj = new Character(character);

		// Save the Character
		characterObj.save(function() {
			// Try deleting Character
			request(app).delete('/characters/' + characterObj._id)
			.expect(401)
			.end(function(characterDeleteErr, characterDeleteRes) {
				// Set message assertion
				(characterDeleteRes.body.message).should.match('User is not logged in');

				// Handle Character error error
				done(characterDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Character.remove().exec();
		done();
	});
});