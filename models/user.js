var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userShema = new mongoose.Schema({
    username: String,
    password: String
});

userShema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userShema);