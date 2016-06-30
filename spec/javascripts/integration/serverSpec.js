var request = require("request");
var server = require("../../../server.js")
var baseURL = "http://localhost:3000"
var Item = require('../../../database/item')
var knexFile = require('../../../knexfile.js')

describe("server", function() {
  beforeEach(function(done){
    process.env.NODE_ENV='test';
      knex = require('knex')(knexFile["test"]);
      knex("items").truncate().then(function(){
        Item.forge({name: "eggs", quantity: 12}).save().then(function() {
          done();
        });
      });
  });

  describe("GET /items", function() {
    it ("returns status code 200", function(done) {
      request.get({url: baseURL + "/items", json: true}, function(error, response, body) {
        expect(error).toBe(null);
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it ("returns items", function(done) {
      request.get({url: baseURL + "/items", json: true}, function(error, response, body) {
        expect(error).toBe(null);
        if (body.length != 1) {
          return done(new Error("Expected body to have 1 item, but it had " + body.length));
        }
        expect(body[0].name).toBe("eggs");
        expect(body[0].quantity).toBe(12);
        done();
      });
    });
  });
});

process.on('uncaughtException', function(err) {
  console.error(' Caught exception: ' + err);
});
