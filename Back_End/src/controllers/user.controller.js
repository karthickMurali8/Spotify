const User = require("../models/user.model");

const getAllUsers = async (req, res, next) => {
    try {
        // const users = await clerkClient.users.getUserList();
        const currentUserId = req.auth().userId;
        const users = await User.find({ clerkId: { $ne: currentUserId } });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getAllUsers controller:", error);
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error in getUserById controller:", error);
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUserById
};