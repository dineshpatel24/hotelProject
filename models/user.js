// models/user.js
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }
});

// Add passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose); // this adds username, hash, salt + authenticate()

module.exports = mongoose.model('User', userSchema);
