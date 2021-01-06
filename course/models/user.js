const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
    username:String,
    uniqueID:String,
    email:String,
    password:String
}) ;
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User2",UserSchema);