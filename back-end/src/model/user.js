var mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

// Create a scheme for users
const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true, lowercase: true},
    email: {type: String, unique: true, required: true, lowercase: true},
    password: {type: String, required: true}
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, additionalAuthenticatedFields: ['email', 'username']});

// This is a method that will be called automatically any time we convert a user
// object to JSON. It deletes the password hash from the object. This ensures
// that we never send password hashes over our API, to avoid giving away
// anything to an attacker.
userSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

// Create a model for users
module.exports = mongoose.model('Users', userSchema);