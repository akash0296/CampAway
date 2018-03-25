var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
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
            res.render("campgrounds/index", {campgrounds:allCamps});
        }
    })
   
});

//NEW - SHOW FORM TO CREATE NEW CAMPGROUND.
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
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
                //RENDER SHOW TEMPLATE.
                res.render("campgrounds/show", {campground: foundCampground});
            }
        })
});



//===========================================

//COMMENTS ROUTES

//===========================================

app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: foundCampground});

        }
    });
});


app.post("/campgrounds/:id/comments/", function(req, res){
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



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("CampAway server has started");
});