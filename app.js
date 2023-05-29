var express = require("express")
var bodyParser = require("body-parser")
const { setCookie, readCookie, editCookie, deleteCookie } = require('./cookies');

var passwordValidator = require('password-validator');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
var engines = require('consolidate');

app.set('view engine', 'ejs');
app.use(express.static('views'));
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.use(bodyParser.urlencoded({
    extended: true
}));

const User = require('./Database/DBs/User.js').User
const lists = require('./Database/DBs/List.js').lists




app.get('/profile', function (req, res) {
    if (req.cookies && req.cookies.user) {
        console.log(req.cookies.user);
        User.findOne({
                _id: req.cookies.user._id,
            }, 
            function (err, user) {
                res.render('profile', { user: user });
            }
        )
    }
    res.redirect("/Log-in");
});
app.get('/Profile-Service1', function (req, res) {
    if (req.cookies && req.cookies.user) {
        console.log(req.cookies.user);
        User.findOne({
                _id: req.cookies.user._id,
            }, 
            function (err, user) {
                res.render('Profile-Service1', { user: user });
            }
        )
    }
    res.redirect("/Log-in");
});
app.get('/profile-cos', function (req, res) {
    if (req.cookies && req.cookies.user) {
        console.log(req.cookies.user);
        User.findOne({
                _id: req.cookies.user._id,
            }, 
            function (err, user) {
                res.render('Profile-cos', { user: user });
            }
        )
    }
    res.redirect("/Log-in");
});


function auth(req,res){
    if (req.cookies && req.cookies.user) {
        console.log(req.cookies.user);
        User.findOne({
                _id: req.cookies.user._id,
            }, 
            function (err, user) {
                if(user){
                    console.log("Authinticarted")
                }
            }
        )
    }
    else{
        res.redirect("/Log-in");
    }
}

app.get('/ListProd', async (req, res)=> {
    auth(req,res);
    let Prod = await lists.find({ user_id: null });
    res.render('ListProd',{ products: Prod , user:req.cookies.user});
});
app.get('/ListProdAd', async (req, res)=> {
    auth(req,res);
    let Prod = await lists.find({});
    res.render('ListProdAd',{products:Prod, user:req.cookies.user});
});
app.get('/ListProdLe', async (req, res)=> {
    auth(req,res);
    let Prod = await lists.find({});
    res.render('ListProdLe',{Prod});
});
app.get('/AddProduct', function (req, res) {
    auth(req,res);
    res.render('AddProduct.html');
});


app.get('/policy', function (req, res) {
    res.render('policy.html');
});

app.get('/mydevices', async (req, res)=> {
    auth(req,res);
    let Prod = await lists.find({ user_id: req.cookies.user.id });
    res.render('myDevices', { products: Prod , user:req.cookies.user})
});

app.post('/Release', function(req, res) {
    // Retrieve the selected product ID from the request body
    const productId = req.body.productId;
    
    // Assuming you have implemented user authentication and retrieved the logged-in user's ID

    // Update the user_id field of the selected product with the logged-in user's ID
    lists.updateOne({ Id: productId }, { user_id: null , user_name: null}, function(err) {
        if (err) {
            console.log(err);
            // Handle the error appropriately
            res.status(500).send('An error occurred while picking the device.');
        } else {
            // Device picked successfully, redirect the user to the product list page or any other desired page
            res.redirect(req.headers.referer);
        }
    });
});

app.post('/pick', function(req, res) {
    // Retrieve the selected product ID from the request body
    const productId = req.body.productId;
    
    // Assuming you have implemented user authentication and retrieved the logged-in user's ID
    const loggedInUserId = req.cookies.user.id;

    // Update the user_id field of the selected product with the logged-in user's ID
    lists.updateOne({ Id: productId }, { user_id: loggedInUserId , user_name: req.cookies.user.FirstName}, function(err) {
        if (err) {
            console.log(err);
            // Handle the error appropriately
            res.status(500).send('An error occurred while picking the device.');
        } else {
            // Device picked successfully, redirect the user to the product list page or any other desired page
            res.redirect(req.headers.referer);
        }
    });
});

app.get('/Log-in', function (req, res) {
    if (req.cookies && req.cookies.user) {
        console.log(req.cookies.user);
        User.findOne({
                _id: req.cookies.user._id,
            }, 
            function (err, user) {
                if (user.Roll === 'Lecture') {
                    //return res.redirect("/Profile-Service1");
                    res.render('Profile-Service1', { user: user });
                }
                if (user.Roll === 'Admin') {
                    console.log(user);
                    //return res.redirect("/profile"); /////////////////////
                    res.render('profile', { user: user });
                }
                if (user.Roll === 'Student') {
                    //return res.redirect("/profile-cos");
                    console.log(user);
                    res.render('profile-cos', { user: user });

                }
            }
        )
    }
    else{
        res.render('Log-in.html');
    }
});
app.get('/Log-out', (req, res) => {
    console.log("logout user");
    deleteCookie(res, 'user');
    res.redirect('/Log-in.html');
});

app.post('/Log-In', (req, res) => {
    try {
        User.findOne({
            id: req.body.id,
        }, function (err, user) {
            if (err) { // user doesn't exist
                res.json({
                    error: err
                })
            }
            if (user) { //user exist
                if (req.body.password === user.password) {

                    console.log(user);
                    console.log("\n inside the login\n");
                    console.log(`******** ${user} **********`)

                    res.cookie('user', user);
                    console.log(`******** ${req.cookies.user} **********`)

                    if (user.Roll === 'Lecture') {
                        //return res.redirect("/Profile-Service1");
                        return res.render('Profile-Service1', { user: user });
                    }
                    if (user.Roll === 'Admin') {
                        console.log(user);
                        //return res.redirect("/profile"); /////////////////////
                        return res.render('profile', { user: user });
                    }
                    if (user.Roll === 'Student') {
                        //return res.redirect("/profile-cos");
                        console.log(user);
                        return res.render('profile-cos', { user: user });

                    }
                    // req.session.user = user;
                    console.log("asas");
                } else {
                    return res.redirect("/Log-in");
                }
            } else {
                return res.redirect("/Log-in");
            }
        });
    } catch {
        return res.redirect(500, "/Log-in");

    }
});

app.get("/", (req, res) => {
    //setCookie(res, 'myCookie', 'Hello, Cookie!', { httpOnly: true });
    res.render("Home.html")

})
app.get('/Sign-Up', function (req, res) {
    res.render('Sign-Up.html');
});

app.get('/Sign-Up-Service', function (req, res) {
    res.render('Sign-Up-Service.html');
});






// settings for password
var passwordschema = new passwordValidator();

passwordschema
    .is().max(15)
    .is().min(7)
    .has().uppercase()
    .has().not().spaces()
    .has().digits(2);






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
        Birthdate: req.body.Birthdate
    })

    console.log(users);
    console.log(req.body.id);
    User.findOne({
        id: req.body.id,

    }, function (err, user) {
        if (err) {

            res.json({
                error: err
            })
        }
        console.log(user);
        if (!user) {
            if (passwordschema.validate(req.body.password)) {
                users.save(function (err) {
                    if (!err) {
                        console.log("sign up succesfuly");
                        return res.redirect('/Log-in');
                    }
                });
            } else {
                //if(user.Roll==='Employee'){
                console.log("sign up not succesfuly");
                return res.redirect("/Sign-Up");
                //}
            };
        } else {
            console.log("the user is already exist!");
            return res.redirect("/Sign-Up");
        }
    });
});

app.post('/ForgotPW', function (req, res) {
    var password = req.body.password;

    User.findOne({
        id: req.body.id,

    }, function (err, user) {
        if (err) { // user doesn't exist
            res.json({
                error: err
            })
        }
        if (user) { //user exist

            console.log(user);

            if (req.body.id == user.id && req.body.email == user.email) {

                if (req.body.newpass === req.body.confnewpass) {

                    User.updateOne({
                        id: user.id
                    }, {
                        password: req.body.newpass
                    }, function (err, reas) {
                        if (err) {
                            console.log("couldn't change password");
                        } else {
                            console.log("password changed successfully");
                            return res.redirect("/Log-In");
                        }
                    });


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
    });
});

app.post("/AddProduct", (req, res) => {
    let Prod = new lists ({
        Id : req.body.Id,
        Name : req.body.Name,
        Amount : req.body.Amount,
        Date : req.body.Date,
        user_id: null
    })
    Prod.save(function (err) {
        if (!err) {
            return res.redirect('/ListProdAd');
        }
    });
});

app.post("/Editdate", async (req, res) => {
    
    let p = JSON.parse(req.body.Prod);
    let a1=req.body.date1;
    let id = p._id;
    let up=await lists.findOne({_id:id});
    up.Date=a1;
    await up.save();
    res.redirect('/ListProdAd')
})
// app.post("/Editamount", async (req, res) => {
    
//     let p = JSON.parse(req.body.Prod);
//     let id = p._id;
//     let up=await lists.findOne({_id:id});
//     up.Amount=a1;
//     await up.save();
//     res.redirect('/ListProdAd')
// })

module.exports = app;
