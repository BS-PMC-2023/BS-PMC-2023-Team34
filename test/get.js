var request = require("supertest");
let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
const app = require("../app.js");
let server = require("../server.js");
var expect = chai.expect;
chai.use(chaiHttp);

var test = require("mocha").test;

//1

describe("Check if the routes goes to login page!", function () {
  test("responds to /Log-In", async () => {
    const res = await request(app).get("/Log-in");
    expect(res.should.have.status(200));
  });
});
//2

describe("Check if the routes goes Home page!", function () {
  test("responds to /Home", async () => {
    const res = await request(app).get("/");
    expect(res.should.have.status(200));
  });
});

//5
/*
describe('Check if the routes goes profile-cos page!', function () {

    test('responds to /profile-cos', async () => {
      const res = await request(app).get('/profile-cos');
      expect(res.should.have.status(200));
    });
});

//6

describe('Check if the routes goes ListProd page!', function () {

    test('responds to /ListProd', async () => {
      const res = await request(app).get('/ListProd');
      expect(res.should.have.status(200));
    });
});

//7 
describe('Check if the routes goes ListProdAd page!', function () {

    test('responds to /ListProdAd', async () => {
      const res = await request(app).get('/ListProdAd');
      expect(res.should.have.status(200));
    });
});

//8 
describe('Check if the routes goes ListProdLe page!', function () {

    test('responds to /ListProdLe', async () => {
      const res = await request(app).get('/ListProdLe');
      expect(res.should.have.status(200));
    });
});*/

//9

describe("Check if the routes goes policy page!", function () {
  test("responds to /policy", async () => {
    const res = await request(app).get("/policy");
    expect(res.should.have.status(200));
  });
});

//10
/*
describe('Check if the routes goes AddProduct page!', function () {

    test('responds to /AddProduct', async () => {
      const res = await request(app).get('/AddProduct');
      expect(res.should.have.status(200));
    });
});*/
