var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");



//INDEX - SHOW ALL CAMPGROUNDS.
router.get("/", function(req, res){
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
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});


//CREATE - ADD NEW CAMPGROUND TO THE DB.
router.post("/", isLoggedIn, function(req, res){
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
router.get("/:id", function(req, res){
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports = router;