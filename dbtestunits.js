var request = require('supertest');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const app = require('./app.js')
const conn = require('./Database/database.js');

let server = require('./server.js');
var expect = chai.expect;
chai.use(chaiHttp);

var test = require('mocha').test;
//1

describe('Check if the routes goes to login page!', function () {

    test('responds to /Log-In', async () => {
        const res = await request(app).get('/Log-in.html');
        expect(res.should.have.status(200));
    });
});
//2

describe('Check if the routes goes to register page!', function () {

    test('responds to /Sign-Up', async () => {
        const res = await request(app).get('/Sign-Up.html');
        expect(res.should.have.status(200));
    });
});

//3

//4

describe('Check if the routes goes to Home Page', function () {

    test('responds to /Home', async () => {
        const res = await request(app).get('/Home.html');
        expect(res.should.have.status(200));
    });

});
