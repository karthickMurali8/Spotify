const { default: mongoose } = require("mongoose");

const messageSchema = new mongoose.Schema({
    // senderId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    // receiverId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },

    senderId: { // clerk user id
        type: String,
        required: true
    },
    receiverId: { // clerk user id
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true }); // createdAt, updatedAt

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;