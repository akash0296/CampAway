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
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: description, author: author};
    //CREATING NEW CAMPGROUND.
    Campground.create(newCampground, function(error, newlyCreated){
        if(error){
            console.log(error);
        }else{
            console.log(newlyCreated);
            res.redirect("/campgrounds");
            
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

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",checkCampgroundUser, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log(err);
            }else{
                res.render("campgrounds/edit", {campground: foundCampground});
            }
        });
});
    

//UPDATE CAMPGROUND ROUTE
router.put("/:id",checkCampgroundUser, function(req, res){
    //FIND AND UPDATE THE CORRECT CAMPGROUND
    //REDIRECT TO SHOW PAGE
    Campground.findByIdAndUpdate(req.params.id, req.body.updatedCamp, function(err, updatedCamp){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//DESTROY CAPMGROUND ROUTE
router.delete("/:id",checkCampgroundUser, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds/" + req.params.id);
        }else{
            res.redirect("/campgrounds");
        }
    });
});




//MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

function checkCampgroundUser(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log(err);
                res.redirect("back")
            }else{
                //TO CHECK IF THE USER OWNS THE CAMPGROUND
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
}

module.exports = router;