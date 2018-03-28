var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var Campground = require("./models/campground");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds")
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/camp_app");


seedDB();
app.use(express.static(__dirname  + "/public"));


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Secret is out",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//PASSING req.user TO ALL THE ROUTES/NAVBAR
app.use(function(req, res, next){
    res.locals.currentUser = req.currentUser;
    next();
});

//ROUTES

app.get("/", function(req, res){
    res.render("landing");
});


//INDEX - SHOW ALL CAMPGROUNDS.
app.get("/campgrounds", function(req, res){
    //RETRIVING ALL THE CAMPGROUND FROM THE CAMPGROUNDS COLLECTION IN THE DB.
    Campground.find({}, function(error, allCamps){
        if(error){
            console.log(error);
        }else{
            res.render("campgrounds/index", {campgrounds:allCamps, currentUser: req.user});
        }
    })
   
});

//NEW - SHOW FORM TO CREATE NEW CAMPGROUND.
app.get("/campgrounds/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});


//CREATE - ADD NEW CAMPGROUND TO THE DB.
app.post("/campgrounds", isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    //CREATING NEW CAMPGROUND.
    Campground.create(newCampground, function(error, newlyCreated){
        if(error){
            console.log(error);
        }else{
            res.redirect("/campgrounds");
            console.log(newlyCreated);
        }
    });
});

//SHOW - SHOWS MORE INFO ABOUT A CAMPGROUND.
app.get("/campgrounds/:id", function(req, res){
    //FIND CAMPGROUND WITH PROVIDED ID.
        Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
            if(error){
                console.log(error);
            }else{
                //RENDER SHOW TEMPLATE.
                res.render("campgrounds/show", {campground: foundCampground});
            }
        })
});



//===========================================

//COMMENTS ROUTES

//===========================================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: foundCampground});

        }
    });
});


app.post("/campgrounds/:id/comments/", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
             Comment.create(req.body.comment, function(err, comment){
        if(err){
            console.log(err);
        }else{
            foundCampground.comments.push(comment);
            foundCampground.save();
            res.redirect("/campgrounds/" + foundCampground._id);
        }
    });
        }
    });
    
   
});


//AUTH ROUTES
//SHOW REGISTER FORM
app.get("/register", function(req, res) {
    res.render("register");
});


//REGISTER ROUTE
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
           return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//SHOW LOGIN FORM
app.get("/login", function(req, res) {
    res.render("login");
});

//LOGIN ROUTE
//app.post("/login", middleware, callback)
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
        
    }), function(req, res) {
    res.send("loging you in");
});

//LOGOUT
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("CampAway server has started");
});