const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    clerkId: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true }); // createdAt, updatedAt

const User = mongoose.model('User', userSchema);

module.exports = User;