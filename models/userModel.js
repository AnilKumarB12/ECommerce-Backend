// Import necessary modules and packages
const mongoose = require('mongoose'); // Mongoose for MongoDB modeling
const bcrypt = require("bcrypt"); // Bcrypt for password hashing
const crypto = require("crypto");
var ObjectId = mongoose.Schema.Types.ObjectId;

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    cart: {
        type: Array,
        default: [],
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    address: [{
        type: String,
    }],
    wishlist: [{
        type: ObjectId,
        ref: "Product"
    }],
    refreshToken: {
        type: String,
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires: Date,
},
    { timestamps: true }
);

// Middleware: Pre-save hook to hash the password before saving to the database
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) {
        next();
    }
    // Generate a salt and hash the password using bcrypt
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Continue with the save operation
});

// Method: Custom method to compare entered password with the stored hashed password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 3600000; //10minutes
    return resetToken;
}

// Export the model
module.exports = mongoose.model('User', userSchema);
