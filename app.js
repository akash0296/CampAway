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


//REQUIRING ROUTES
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");


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
    res.locals.currentUser = req.user;
    next();
});



app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("CampAway server has started");
});