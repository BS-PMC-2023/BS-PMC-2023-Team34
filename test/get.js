var request = require("supertest");
let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
const app = require("../app.js");
let server = require("../server.js");
var expect = chai.expect;
chai.use(chaiHttp);
const mongoose = require("mongoose");
var test = require("mocha").test;
const assert = require("assert");
const User = require("../Database/DBs/User.js").User;

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


describe("Check if the routes goes policy page!", function () {
  test("responds to /policy", async () => {
    const res = await request(app).get("/policy");
    expect(res.should.have.status(200));
  });
});


describe("Integration Test: Add and Remove Row", function () {
  var addedRowId;
  before(async function () {
    // Connect to your MongoDB database
    await mongoose.connect("mongodb+srv://abedshah:abedshah@atlascluster.vxfky9m.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async function () {
    if (addedRowId) {
      await User.deleteOne({ _id: addedRowId });
    }
    await mongoose.disconnect();
  });

  it("Adds a new row to the table and then removes it", async function () {
    // Create a new row object
    const newRow = {
      FirstName: "John",
      LastName: "Doe",
      id: 123,
      password: "password123",
      email: "john.doe@example.com",
      Gender: "Male",
      Age: "30",
      Phone: 1234567890,
      Roll: "Student",
      Birthdate: new Date(),
    };

    // Add the new row
    const addResponse = await request(app)
      .post("/Sign-Up")
      .send(newRow)
      .expect(302); // Assuming you're returning a redirect status code

    // Check if the redirect goes to the expected location
    assert.strictEqual(addResponse.header.location, "/Sign-Up");

    // Retrieve the added row from the database
    addedRowId = newRow._id;
;
  });
});