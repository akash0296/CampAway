var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var data = [
    {
        name: "Cloud's den",
        image: "https://images.unsplash.com/photo-1496545672447-f699b503d270?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ba3fa37b995a705a01d022cada13f726&auto=format&fit=crop&w=500&q=60",
        description: "This is cloud's den"
    },
    
    {
        name: "lake laky",
        image: "https://images.unsplash.com/photo-1500367215255-0e0b25b396af?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=193a2a1fa9c7ee1a2d4db00f22e41552&auto=format&fit=crop&w=500&q=60",
        description: "This is lake laky"
    },
    
    {
        name: "mount's creek",
        image: "https://images.unsplash.com/photo-1432817495152-77aa949fb1e2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a6f210acc36ab5742aa863e7a2240a2a&auto=format&fit=crop&w=500&q=60",
        description: "This is mount's creek"
    }
]


function seedDB(){
    //REMOVE ALL CAMPGROUNDS
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Campgrounds removed");
        }
        //CREATE CAMPGROUDS.
        data.forEach(function(seed){
           Campground.create(seed, function(err, campground){
            if(err){
                console.log(err);
            }else{
                console.log("Campgrounds added");
                Comment.create({
                    text: "This is Awesome",
                    author: "Herb"
                }, function(err, comment){
                    if(err){
                        console.log(err);
                    }else{
                        campground.comments.push(comment);
                        campground.save();
                        console.log("Created new Comments");
                    }
                }
                )
            }
            });     
        });
    }); 
    
    
    
}


module.exports = seedDB;