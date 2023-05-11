var request = require('supertest');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const app = require('../app.js');
let server = require('../server.js');
var expect = chai.expect;
chai.use(chaiHttp);

var test = require('mocha').test;



//1

describe('Check if the routes goes to login page!', function () {

    test('responds to /Log-In', async () => {
      const res = await request(app).get('/Log-in');
      expect(res.should.have.status(200));
    });
});
//2

