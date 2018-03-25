var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var Campground = require("./models/campground");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/camp_app");

// Campground.create({
//     name: "Granite Hill",
//     image: "http://source.unsplash.com/XdIOaD30OEU",
//     description: "This is a huge Granite Hill, no bathrooms, no water or WIFI. Just Beautiful Granite."
// }, function(error, camp){
//     if(error){
//         console.log(error);
//     }else{
//         console.log("Newly created campground");
//         console.log(camp);
//     }
    
// });

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
        Campground.findById(req.params.id, function(error, foundCampground){
            if(error){
                console.log(error);
            }else{
                //RENDER SHOW TEMPLATE.
                res.render("show", {campground: foundCampground});
            }
        })
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("CampAway server has started");
});