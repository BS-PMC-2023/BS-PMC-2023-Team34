var express = require("express");
var bodyParser = require("body-parser");
const {
  setCookie,
  readCookie,
  editCookie,
  deleteCookie,
} = require("./cookies");

var passwordValidator = require("password-validator");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
var engines = require("consolidate");
const { reporters } = require("mocha");

app.set("view engine", "ejs");
app.use(express.static("views"));
app.set("views", __dirname + "/views");
app.engine("html", engines.mustache);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const User = require("./Database/DBs/User.js").User;
const lists = require("./Database/DBs/List.js").lists;
const Order = require("./Database/DBs/order.js").Order;
const Report = require("./Database/DBs/report.js").Report;

const Status = {
  pending: "pending",
  accepted: "accepted",
  declined: "declined",
};

app.get("/profile", function (req, res) {
  if (req.cookies && req.cookies.user) {
    console.log(req.cookies.user);
    User.findOne(
      {
        _id: req.cookies.user._id,
      },
      function (err, user) {
        res.render("profile", { user: user });
      }
    );
  }
  res.redirect("/Log-in");
});
app.get("/Profile-Service1", function (req, res) {
  if (req.cookies && req.cookies.user) {
    console.log(req.cookies.user);
    User.findOne(
      {
        _id: req.cookies.user._id,
      },
      function (err, user) {
        res.render("Profile-Service1", { user: user });
      }
    );
  }
  res.redirect("/Log-in");
});
app.get("/profile-cos", function (req, res) {
  if (req.cookies && req.cookies.user) {
    console.log(req.cookies.user);
    User.findOne(
      {
        _id: req.cookies.user._id,
      },
      function (err, user) {
        res.render("Profile-cos", { user: user });
      }
    );
  }
  res.redirect("/Log-in");
});

function auth(req, res) {
  if (req.cookies && req.cookies.user) {
    User.findOne(
      {
        _id: req.cookies.user._id,
      },
      function (err, user) {
        if (user) {
          console.log("Authinticarted");
        }
      }
    );
  } else {
    res.redirect("/Log-in");
  }
}

app.get("/ListProd", async (req, res) => {
  auth(req, res);
  let Prod = await lists.find({ availableAmount: { $gt: 0 } });
  res.render("ListProd", { products: Prod, user: req.cookies.user });
});
app.get("/ListProdAd", async (req, res) => {
  auth(req, res);
  let Prod = await lists.find({});
  const count = await lists.countDocuments();
  res.render("ListProdAd", {
    products: Prod,
    user: req.cookies.user,
    count: count,
  });
});
app.get("/ListProdLe", async (req, res) => {
  auth(req, res);
  let Prod = await lists.find({});
  res.render("ListProdLe", { Prod });
});
app.get("/AddProduct", function (req, res) {
  auth(req, res);
  res.render("AddProduct.html");
});

app.get("/AddReport", function (req, res) {
    auth(req, res);
    res.render("AddReport.html");
});

app.get("/Reports", async (req, res) => {
  auth(req, res);
  let prob = await Report.find({});
  res.render("Reports", {reports:prob});
});

app.get("/orders", async (req, res) => {
  auth(req, res);
  let ords = await Order.find({});
  const count = await Order.countDocuments();
  res.render("orders", { orders: ords, user: req.cookies.user, count: count });
});

app.get("/policy", function (req, res) {
  res.render("policy.html");
});

app.get("/mydevices", async (req, res) => {
  auth(req, res);
  let order = await Order.find({ user_id: req.cookies.user.id });
  res.render("myDevices", { orders: order, user: req.cookies.user });
});

app.post("/Release", function (req, res) {
  // Retrieve the selected product ID from the request body
  const productId = req.body.productId;
  // Assuming you have implemented user authentication and retrieved the logged-in user's ID

  Order.findOneAndDelete(
    { product_id: productId },
    function (err, deletedDocument) {
      if (err) {
        console.log(err);
        // Handle the error appropriately
      } else {
        if (deletedDocument) {
          // The document was found and deleted
          console.log(deletedDocument);
          lists.updateOne(
            { Id: productId },
            { $inc: { availableAmount: deletedDocument.amount } },
            function (err) {
              if (err) {
                console.log(err);
                // Handle the error appropriately
                res
                  .status(500)
                  .send("An error occurred while picking the device.");
              } else {
                // Device picked successfully, redirect the user to the product list page or any other desired page
                res.redirect(req.headers.referer);
              }
            }
          );
          // Do something with the deleted document
        } else {
          // The document was not found
          console.log("Document not found");
        }
      }
    }
  );
  // Update the user_id field of the selected product with the logged-in user's ID
});

app.get("/list/:id/edit", (req, res) => {
  const listId = req.params.id;
  // Fetch the data from the database using the listId
  lists
    .findById({ Id: req.params.id })
    .then((list) => {
      // Render the edit.ejs file and pass the list data
      res.render("edit", { list });
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
      res.status(500).send("Error fetching data");
    });
});

// Handle the form submission and update the list item
app.post("/list/:id", (req, res) => {
  const listId = req.params.id;
  const { name, totalAmount, availableAmount } = req.body;

  // Update the list item in the database using the listId
  lists
    .findByIdAndUpdate(listId, { Name: name, totalAmount, availableAmount })
    .then(() => {
      res.redirect("/list"); // Redirect to the list page after successful update
    })
    .catch((error) => {
      console.log("Error updating data:", error);
      res.status(500).send("Error updating data");
    });
});

app.post("/Delete", function (req, res) {
  // Retrieve the selected product ID from the request body
  const productId = req.body.productId;
  // Assuming you have implemented user authentication and retrieved the logged-in user's ID

  lists.deleteOne({ Id: productId }, function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred while picking the device.");
    } else {
      res.redirect(req.headers.referer);
    }
  });
});

app.post("/DeleteReport", function (req, res) {
  // Retrieve the selected product ID from the request body
  const product_id = req.body.product_id;
  // Assuming you have implemented user authentication and retrieved the logged-in user's ID

  Report.deleteOne({ Id: product_id }, function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred while picking the device.");
    } else {
      res.redirect(req.headers.referer);
    }
  });
});



app.post("/DeleteOrder", function (req, res) {
  // Retrieve the selected product ID from the request body
  const orderId = req.body.orderId;
  // Assuming you have implemented user authentication and retrieved the logged-in user's ID

  Order.findOneAndDelete({ _id: orderId }, function (err, order) {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred while picking the device.");
    } else {
      console.log(`deleted : \n${order}`);
      lists.updateOne(
        { Id: order.product_id },
        { $inc: { availableAmount: order.amount } },
        function (err) {
          if (err) {
            console.log(err);
            res.status(500).send("An error occurred while picking the device.");
          } else {
            res.redirect(req.headers.referer);
          }
        }
      );
    }
  });
});

app.post("/AcceptOrder", function (req, res) {
  // Retrieve the selected product ID from the request body
  const orderId = req.body.orderId;
  // Assuming you have implemented user authentication and retrieved the logged-in user's ID

  Order.findOneAndUpdate(
    { _id: orderId },
    { status: Status.accepted },
    function (err, order) {
      if (err) {
        console.log(err);
        res.status(500).send("An error occurred while picking the device.");
      } else {
        res.redirect(req.headers.referer);
      }
    }
  );
});

app.post("/DeclineOrder", function (req, res) {
  // Retrieve the selected product ID from the request body
  const orderId = req.body.orderId;
  // Assuming you have implemented user authentication and retrieved the logged-in user's ID

  Order.findOneAndUpdate(
    { _id: orderId },
    { status: Status.declined },
    function (err, order) {
      if (err) {
        console.log(err);
        res.status(500).send("An error occurred while picking the device.");
      } else {
        res.redirect(req.headers.referer);
      }
    }
  );
});

app.post("/pick", function (req, res) {
  // Retrieve the selected product ID from the request body
  const productId = req.body.productId;
  const endDate = req.body[`datetime-${req.body.productId}`];
  const neededAmount = req.body[`amount-${req.body.productId}`];
  // Assuming you have implemented user authentication and retrieved the logged-in user's ID
  const loggedInUserId = req.cookies.user.id;

  lists.findOneAndUpdate(
    { Id: productId },
    req.cookies.user.Roll === "Admin"
      ? { $inc: {availableAmount: -1}}
      : { $inc: { availableAmount:- neededAmount } },
    { new: true },
    function (err, product) {
      if (err) {
        console.log(err);
        res.status(500).send("An error occurred while picking the device.");
      } else {
        const order = new Order({
          product_id: productId,
          product_name: product.Name,
          startDate: new Date(),
          endDate: endDate,
          user_id: loggedInUserId,
          user_name: `${req.cookies.user.FirstName} - ${req.cookies.user.Phone}`,
          user_roll: req.cookies.user.Roll,
          status: Status.pending,
          amount: req.cookies.user.Roll === "Admin" ? 1 : neededAmount,
        });
        order.save();
        res.redirect(req.headers.referer);
      }
    }
  );
});

app.get("/Log-in", function (req, res) {
  if (req.cookies && req.cookies.user) {
    console.log(req.cookies.user);
    User.findOne(
      {
        _id: req.cookies.user._id,
      },
      function (err, user) {
        if (user.Roll === "Lecture") {
          //return res.redirect("/Profile-Service1");
          res.render("Profile-Service1", { user: user });
        }
        if (user.Roll === "Admin") {
          console.log(user);
          //return res.redirect("/profile"); /////////////////////
          res.render("profile", { user: user });
        }
        if (user.Roll === "Student") {
          //return res.redirect("/profile-cos");
          console.log(user);
          res.render("profile-cos", { user: user });
        }
      }
    );
  } else {
    res.render("Log-in.html");
  }
});
app.get("/Log-out", (req, res) => {
  console.log("logout user");
  deleteCookie(res, "user");
  res.redirect("/Log-in.html");
});

app.post("/Log-In", (req, res) => {
  try {
    User.findOne(
      {
        id: req.body.id,
      },
      function (err, user) {
        if (err) {
          // user doesn't exist
          res.json({
            error: err,
          });
        }
        if (user) {
          //user exist
          if (req.body.password === user.password) {
            console.log(user);
            console.log("\n inside the login\n");
            console.log(`******** ${user} **********`);

            res.cookie("user", user);
            console.log(`******** ${req.cookies.user} **********`);

            if (user.Roll === "Lecture") {
              //return res.redirect("/Profile-Service1");
              return res.render("Profile-Service1", { user: user });
            }
            if (user.Roll === "Admin") {
              console.log(user);
              //return res.redirect("/profile"); /////////////////////
              return res.render("profile", { user: user });
            }
            if (user.Roll === "Student") {
              //return res.redirect("/profile-cos");
              console.log(user);
              return res.render("profile-cos", { user: user });
            }
            // req.session.user = user;
            console.log("asas");
          } else {
            return res.redirect("/Log-in");
          }
        } else {
          return res.redirect("/Log-in");
        }
      }
    );
  } catch {
    return res.redirect(500, "/Log-in");
  }
});

app.get("/", (req, res) => {
  //setCookie(res, 'myCookie', 'Hello, Cookie!', { httpOnly: true });
  res.render("Home.html");
});
app.get("/Sign-Up", function (req, res) {
  res.render("Sign-Up.html");
});

app.get("/Sign-Up-Service", function (req, res) {
  res.render("Sign-Up-Service.html");
});

// settings for password
var passwordschema = new passwordValidator();

passwordschema
  .is()
  .max(15)
  .is()
  .min(7)
  .has()
  .uppercase()
  .has()
  .not()
  .spaces()
  .has()
  .digits(2);

app.post("/Sign-Up", (req, res) => {
  let users = new User({
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    id: req.body.id,
    password: req.body.password,
    email: req.body.email,
    Gender: req.body.Gender,
    Age: req.body.Age,
    Phone: req.body.Phone,
    Roll: req.body.Roll,
    Birthdate: req.body.Birthdate,
  });

  console.log(users);
  console.log(req.body.id);
  User.findOne(
    {
      id: req.body.id,
    },
    function (err, user) {
      if (err) {
        res.json({
          error: err,
        });
      }
      console.log(user);
      if (!user) {
        if (passwordschema.validate(req.body.password)) {
          users.save(function (err) {
            if (!err) {
              console.log("sign up succesfuly");
              return res.redirect("/Log-in");
            }
          });
        } else {
          //if(user.Roll==='Employee'){
          console.log("sign up not succesfuly");
          return res.redirect("/Sign-Up");
          //}
        }
      } else {
        console.log("the user is already exist!");
        return res.redirect("/Sign-Up");
      }
    }
  );
});

app.post("/ForgotPW", function (req, res) {
  var password = req.body.password;

  User.findOne(
    {
      id: req.body.id,
    },
    function (err, user) {
      if (err) {
        // user doesn't exist
        res.json({
          error: err,
        });
      }
      if (user) {
        //user exist

        console.log(user);

        if (req.body.id == user.id && req.body.email == user.email) {
          if (req.body.newpass === req.body.confnewpass) {
            User.updateOne(
              {
                id: user.id,
              },
              {
                password: req.body.newpass,
              },
              function (err, reas) {
                if (err) {
                  console.log("couldn't change password");
                } else {
                  console.log("password changed successfully");
                  return res.redirect("/Log-In");
                }
              }
            );
          } else {
            console.log("passwords doesn't match");
          }
        } else {
          console.log("email and password doesn't match ");
          return res.redirect("/ForgotPW");
        }
      } else {
        console.log("user doesn't exist");
        return res.redirect("/ForgotPW");
      }
    }
  );
});

app.post("/AddProduct", (req, res) => {
  let Prod = new lists({
    Id: req.body.Id,
    Name: req.body.Name,
    totalAmount: req.body.totalAmount,
    availableAmount: req.body.totalAmount,
    user_id: null,
  });
  Prod.save(function (err) {
    if (!err) {
      return res.redirect("/ListProdAd");
    }
  });
});

app.post("/AddReport", (req, res) => {
    let Prob = new Report({
      product_id: req.body.product_id,
      product_name: req.body.product_name,
      problem:req.body.problem,
      user_id: null,
    });
    Prob.save(function (err) {
      if (!err) {
        return res.redirect("/ListProd");
      }
    });
  });

app.post("/Editdate", async (req, res) => {
  let p = JSON.parse(req.body.Prod);
  let a1 = req.body.date1;
  let id = p._id;
  let up = await lists.findOne({ _id: id });
  await up.save();
  res.redirect("/ListProdAd");
});
// app.post("/Editamount", async (req, res) => {

//     let p = JSON.parse(req.body.Prod);
//     let id = p._id;
//     let up=await lists.findOne({_id:id});
//     up.Amount=a1;
//     await up.save();
//     res.redirect('/ListProdAd')
// })

module.exports = app;
