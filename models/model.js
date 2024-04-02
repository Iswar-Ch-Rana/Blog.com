const { error } = require('console');
const { createHmac, randomBytes } = require('crypto');
const { Schema, model } = require('mongoose');
const { createTokenForUser , validateToken } = require('../services/authentication');


// Createing Schema for user and password
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: { // This will be used for hashing
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: { // Profile picture
        type: String,
        default: '/images/default.png',
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
}, { timestamps: true });


// Hashing password before saveing it 
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return;
    }

    // salting
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
    next();
});


// This function crate a token for the user for authentication 
userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User Not Found!");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");
    if (hashedPassword !== userProvidedHash) {
        throw new Error("Incorrect Password!");
    }

    const token = createTokenForUser(user);
    return token ;
});



const User = model('user', userSchema);

module.exports = User;
