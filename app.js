var express = require("express")
var bodyParser = require("body-parser")

var passwordValidator = require('password-validator');
const app = express();
var engines = require('consolidate');

app.set('view engine', 'ejs');
app.use(express.static('views'));
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.use(bodyParser.urlencoded({
    extended: true
}));

const User = require('./Database/DBs/User.js').User
const List = require('./Database/DBs/List.js').List



app.get('/Log-in', function (req, res) {
    res.render('Log-in.html');
});
app.get('/profile', function (req, res) {
    res.render('profile');
});
app.get('/Profile-Service1', function (req, res) {

    res.render('Profile-Service1');
});
app.get('/profile-cos', function (req, res) {
    res.render('Profile-cos');
});
app.get('/ListProd', async (req, res)=> {
    let Prod = await List.find({});
    res.render('ListProd',{Prod});
});
app.get('/ListProdAd', async (req, res)=> {
    let Prod = await List.find({});
    res.render('ListProdAd',{Prod});
});
app.get('/ListProdLe', async (req, res)=> {
    let Prod = await List.find({});
    res.render('ListProdLe',{Prod});
});
app.get('/policy', function (req, res) {
    res.render('policy.html');
});
app.get('/AddProduct', function (req, res) {
    res.render('AddProduct.html');
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
                    if (user.Roll === 'Lecture') {
                        return res.redirect("/Profile-Service1");
                    }
                    if (user.Roll === 'Admin') {
                        console.log(user);
                        return res.redirect("/profile"); /////////////////////
                    }
                    if (user.Roll === 'Student') {
                        return res.redirect("/profile-cos");
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
app.get('/Log-out', (req, res) => {
    console.log("logout user");
    res.redirect('/Log-in.html');
});

app.post("/AddProduct", (req, res) => {
    let Prod = new List ({
        Name : req.body.Name,
        Amount : req.body.Amount,
        Date : req.body.Date,
    })
    Prod.save(function (err) {
        if (!err) {
            return res.redirect('/ListProdAd');
        }
    });
})
app.post("/Editdate", async (req, res) => {
    
    let p = JSON.parse(req.body.Prod);
    let a1=req.body.date1;
    let id = p._id;
    let up=await List.findOne({_id:id});
    up.Date=a1;
    await up.save();
    res.redirect('/ListProdAd')
})
app.post("/Editamount", async (req, res) => {
    
    let p = JSON.parse(req.body.Prod);
    let a1=req.body.amount1;
    let id = p._id;
    let up=await List.findOne({_id:id});
    up.Amount=a1;
    await up.save();
    res.redirect('/ListProdAd')
})

module.exports = app;
