//ALL THE MIDDLEWARE GOES HERE

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCommentUser = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
                res.redirect("back")
            }else{
                //TO CHECK IF THE USER OWNS THE COMMENT
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "you're not authorized to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "Please login first");
        res.redirect("back");
    }
}

middlewareObj.checkCampgroundUser = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                console.log(err);
                res.redirect("back")
            }else{
                //TO CHECK IF THE USER OWNS THE CAMPGROUND
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "you're not authorized to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","Please login first");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first");
    res.redirect("/login")
}

module.exports = middlewareObj;