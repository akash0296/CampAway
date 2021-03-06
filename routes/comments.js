var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var passport = require("passport");
//===========================================

//COMMENTS ROUTES

//===========================================


router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: foundCampground});

        }
    });
});


router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
            res.redirect("/campgrounds");
        }else{
             Comment.create(req.body.comment, function(err, comment){
        if(err){
            console.log(err);
        }else{
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            //save comment
            comment.save();
            //push it into the comment section
            foundCampground.comments.push(comment);
            foundCampground.save();
            req.flash("success", "Successfully added comment");
            res.redirect("/campgrounds/" + foundCampground._id);
        }
    });
        }
    });
    
});

//EDITING COMMENTS ROUTE
router.get("/:comment_id/edit", middleware.checkCommentUser, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});

        }
    });
});

//UPDATING COMMENTS ROUTES
router.put("/:comment_id", middleware.checkCommentUser, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
             res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROYING COMMENTS ROUTE
router.delete("/:comment_id", middleware.checkCommentUser, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           console.log(err);
           res.redirect("back");
       }else{
           req.flash("success", "Comment deleted");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});




module.exports = router;