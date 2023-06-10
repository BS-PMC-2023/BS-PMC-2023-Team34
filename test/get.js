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
const { Report } = require("../Database/DBs/report.js");
const User = require("../Database/DBs/User.js").User;

//Unit Tests
//Test 1
describe("Check if the routes goes to login page!", function () {
  test("responds to /Log-In", async () => {
    const res = await request(app).get("/Log-in");
    expect(res.should.have.status(200));
  });
});

//Test 2
describe("Check if the routes goes Home page!", function () {
  test("responds to /Home", async () => {
    const res = await request(app).get("/");
    expect(res.should.have.status(200));
  });
});

//Test 3
describe("Check if the routes goes policy page!", function () {
  test("responds to /policy", async () => {
    const res = await request(app).get("/policy");
    expect(res.should.have.status(200));
  });
});

//Test 4
test("responds to /AddReport", async () => {
  const res = await request(app).get("/AddReport");
  expect(res).to.have.status(302);
});

//Test 5
test("responds to /AddProduct", async () => {
  const res = await request(app).get("/AddProduct");
  expect(res).to.have.status(302);
});

//Test 6
test("responds to /ListProd", async () => {
  const res = await request(app).get("/ListProd");
  expect(res).to.have.status(302);
});

//Test 7
test("responds to /ListProdAd", async () => {
  const res = await request(app).get("/ListProdAd");
  expect(res).to.have.status(302);
});

//Test 8
test("responds to /Reports", async () => {
  const res = await request(app).get("/Reports");
  expect(res).to.have.status(302);
});

//Test 9
test("responds to /profile", async () => {
  const res = await request(app).get("/profile");
  expect(res).to.have.status(302);
});

//Test 10
test("responds to /Profile-Service1", async () => {
  const res = await request(app).get("/Profile-Service1");
  expect(res).to.have.status(302);
});

//Test 11
test("responds to /Profile-cos", async () => {
  const res = await request(app).get("/Profile-cos");
  expect(res).to.have.status(302);
});

//Test 12
describe("Check if the routes goes to Sign-Up-Customer page!", function () {
  test("responds to /Sign-Up-Customer", async () => {
    const res = await request(app).get("/Sign-Up-Customer");
    expect(res.should.have.status(404));
  });
});

//Test 13
describe("Check if the routes goes to Sign-Up-Service page!", function () {
  test("responds to /Sign-Up-Service", async () => {
    const res = await request(app).get("/Sign-Up-Service");
    expect(res.should.have.status(200));
  });
});

//Test 14
describe("Check if the routes goes to SignUp page!", function () {
  test("responds to /Sign-Up", async () => {
    const res = await request(app).get("/Sign-Up");
    expect(res.should.have.status(200));
  });
});

//Test 15
test("responds to /myDevices", async () => {
  const res = await request(app).get("/myDevices");
  expect(res).to.have.status(302);
});

//Test 16
test("responds to /orders", async () => {
  const res = await request(app).get("/orders");
  expect(res).to.have.status(302);
});

//Test 17
describe("Check if the routes goes to Policyprod page!", function () {
  test("responds to /Policyprod", async () => {
    const res = await request(app).get("/Policyprod");
    expect(res.should.have.status(404));
  });
});





//Integration Tests
/// User Integration Test
//Test 18
describe("Integration Test: Add and Remove Row", function () {
  var addedRowId;
  before(async function () {
    // Connect to your MongoDB database
    await mongoose.connect(
      "mongodb+srv://abedshah:abedshah@atlascluster.vxfky9m.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
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
      Roll: "Admin",
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
  });
});



///Reports Integration Test
//Test 19
describe("Integration Reports Test: Add and Remove Row", function () {
  var addedRowId;
  before(async function () {
    // Connect to your MongoDB database
    await mongoose.connect(
      "mongodb+srv://abedshah:abedshah@atlascluster.vxfky9m.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  });

  after(async function () {
    if (addedRowId) {
      await Report.deleteOne({ _id: addedRowId });
    }
    await mongoose.disconnect();
  });

  it("Adds a new row to the table and then removes it", async function () {
    // Create a new row object
    const newRow = {
      product_id: 12,
      product_name: "HDMI",
      problem: "Broken",
    };

    // Add the new row
    const addResponse = await request(app)
      .post("/AddReport")
      .send(newRow)
      .expect(302); // Assuming you're returning a redirect status code

    // Check if the redirect goes to the expected location
    assert.strictEqual(addResponse.header.location, "/ListProd");

    // Retrieve the added row from the database
    addedRowId = newRow._id;
  });
});



//List Integreation Test 
//Test 20
describe("Integration List Test: Add and Remove Row", function () {
  var addedRowId;
  before(async function () {
    // Connect to your MongoDB database
    await mongoose.connect(
      "mongodb+srv://abedshah:abedshah@atlascluster.vxfky9m.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  });

  after(async function () {
    if (addedRowId) {
      await List.deleteOne({ _id: addedRowId });
    }
    await mongoose.disconnect();
  });

  it("Adds a new row to the table and then removes it", async function () {
    // Create a new row object
    const newRow = {
      Id: 12,
      Category: 'Camera',
      Name: 'Canon',
      totalAmount: 12,
      availableAmount: 12,
    };

    // Add the new row
    const addResponse = await request(app)
      .post("/AddProduct")
      .send(newRow)
      .expect(302); // Assuming you're returning a redirect status code

    // Check if the redirect goes to the expected location
    assert.strictEqual(addResponse.header.location, "/ListProdAd");

    // Retrieve the added row from the database
    addedRowId = newRow._id;
  });
});

