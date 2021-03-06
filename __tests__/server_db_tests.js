// Require depedencies needed for testing
jest.unmock('request');
var request = require('request');

describe('Basic server functionality', () => {

  it('Should not accept and respond to GET requests at the non-existant endpoints', (done) => {
    request
      .get('http://127.0.0.1:8000/arglebargle')
      .on('response', function(response) {
        expect(response.statusCode).toEqual(404);
        done();
      })
      .on('error', function(error) {
        expect(true).toEqual(false);
        console.log('Error sending GET request to /arglebargle', error);
        done();
      });
  });
});

// Tests for database sign-in
describe('Basic sign-in/sign-up functionality', () => {
  it('Should be able to add new user to database and sign-in with that user', (done) => {
    var newUser = { username: 'test' };
    request({
      url: 'http://127.0.0.1:8000/signup',
      method: 'POST',
      json: newUser
    }, function(error, response, body) {
      if (error) {
        // Automatically failing if the request does not go through
        expect(true).toEqual(false);
        done();
      } else {
        request({
          url: 'http://127.0.0.1:8000/signin',
          method: 'POST',
          json: newUser,
        }, function(error, response, body) {
          if (error) {
            // Automatically failing if the request does not go through
            expect(true).toEqual(false);
            done();
          } else {
            // TODO update the below based on your actual implementation of the sign-in request handler
            expect(response.statusCode).toEqual(200);
            done();
          }
        });
      }
    });
  });
});

// Tests for matching function/endpoint
describe('Matching algo functionality', () => {
  it('Should respond with a 400 if proper headers are not provided with GET request at /match', (done) => {
    request
      .get('http://127.0.0.1:8000/match')
      .on('response', function(response) {
        expect(response.statusCode).toEqual(400);
        done();
      })
      .on('error', function(error) {
        expect(true).toEqual(false);
        console.log('Error sending GET request to /match');
        done();
      });
  });
  it('Should not respond with a 401 if username does not exist', (done) => {
    var requestOptions = {
      url: 'http://127.0.0.1:8000/match',
      headers: {
        'longitude': 999,
        'latitude': 999,
        'username': 'arglebargle',
        'requesttype': 'request-match'
      }
    };
    request
      .get(requestOptions)
      .on('response', function(response) {
        expect(response.statusCode).toEqual(401);
        done();
      })
      .on('error', function(error) {
        expect(true).toEqual(false);
        console.log('Error sending GET request to /match');
        done();
      });
  });
  it('Should not respond with a 400 if requesttype incorrect', (done) => {
    var requestOptions = {
      url: 'http://127.0.0.1:8000/match',
      headers: {
        'longitude': 999,
        'latitude': 999,
        'username': 'test',
        'requesttype': 'arglebargle'
      }
    };
    request
      .get(requestOptions)
      .on('response', function(response) {
        expect(response.statusCode).toEqual(400);
        done();
      })
      .on('error', function(error) {
        expect(true).toEqual(false);
        console.log('Error sending GET request to /match');
        done();
      });
  });
  it('Should return a match object when GET request is made to /match endpoint with a requesttype of retrieve-match', (done) => {
    var requestOptions = {
      url: 'http://127.0.0.1:8000/match',
      headers: {
        'longitude': 999,
        'latitude': 999,
        'username': 'test',
        'requesttype': 'retrieve-match'
      }
    };
    request.get(requestOptions, function(error, response, body) {
      if(error) {
        expect(true).toEqual(false);
        console.log('Error sending GET request to /match', error);
        done();
      } else {
        body = JSON.parse(body);
        expect(body.restaurant).toBeDefined();
        expect(body.firstMatchedUser).toBeDefined();
        expect(body.secondMatchedUser).toBeDefined();
        done();
      }
    });
  });
  it('Should respond with 200 when GET request is made to /match with valid username and requesttype of request-match', (done) => {
    var requestOptions = {
      url: 'http://127.0.0.1:8000/match',
      headers: {
        'longitude': 999,
        'latitude': 999,
        'username': 'test',
        'requesttype': 'retrieve-match'
      }
    };
    request.get(requestOptions, function(error, response, body) {
      if(error) {
        expect(true).toEqual(false);
        console.log('Error sending GET request to /match', error);
        done();
      } else {
        body = JSON.parse(body);
        expect(response.statusCode).toEqual(200);
        done();
      }
    });
  });
});

describe('Username endpoint functionality', () => {
  it('Should respond to requests made to the /users/:username endpoint when the username is valid', (done) => {
    request.get('http://127.0.0.1:8000/users/test', (error, response, body) => {
      if(error) {
        expect(true).toEqual(false);
        console.log('Error sending GET request to /users/:username', error);
        done();
      } else {
        body = JSON.parse(body);
        expect(response.statusCode).toEqual(200);
        expect(body.username).toEqual('test');
        done();
      }
    });
  });
  it('Should not respond made to the /users/:username endpoint when the username is invalid', (done) => {
    request.get('http://127.0.0.1:8000/users/arglebargle', (error, response, body) => {
      if (error) {
        expect(true).toEqual(false);
        console.log('Error sending GET request to /users/:username', error);
        done();
      } else {
        expect(response.statusCode).toEqual(200);
        expect(body.username).toBeUndefined();
        done();
      }
    });
  });
});



