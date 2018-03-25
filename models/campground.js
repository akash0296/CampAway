var mongoose = require("mongoose");


//SCHEMA SETUP.
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

//CREATING A MODEL BASED ON THE SCHEMA CREATED ABOVE.
module.exports = mongoose.model("Campground", campgroundSchema);