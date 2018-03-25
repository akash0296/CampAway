var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var Campground = require("./models/campground");
var seedDB = require("./seeds")
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/camp_app");

seedDB();

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
            res.render("index", {campgrounds:allCamps});
        }
    })
   
});

//NEW - SHOW FORM TO CREATE NEW CAMPGROUND.
app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});


//CREATE - ADD NEW CAMPGROUND TO THE DB.
app.post("/campgrounds", function(req, res){
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
                console.log(foundCampground);
                //RENDER SHOW TEMPLATE.
                res.render("show", {campground: foundCampground});
            }
        })
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("CampAway server has started");
});