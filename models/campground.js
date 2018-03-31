var mongoose = require("mongoose");


//SCHEMA SETUP.
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

//CREATING A MODEL BASED ON THE SCHEMA CREATED ABOVE.
module.exports = mongoose.model("Campground", campgroundSchema);