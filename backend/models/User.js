const mongoose = require("mongoose");
//import mongoose-unique-validator because email must be unique (2 different users can't have the same address email/ 1 user can't register more than once with the same email)
//error from MondoDB cause of unique are easier to understand with mongoose-unique-validator
const uniqueValidator = require("mongoose-unique-validator");
//Data model for a User
const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});
// add mongoose unique validator as plugin to userSchema
userSchema.plugin(uniqueValidator);
//export sauceSchema for use model fronm the other files
module.exports = mongoose.model("User", userSchema);
