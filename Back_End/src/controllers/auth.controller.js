const User = require("../models/user.model");

const authenticateUser = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body; // Assuming user info is sent in the request body

    const user = await User.findOne({ clerkId: id });
    if (!user) {
      // sign up
      const newUser = new User({
        clerkId: id,
        fullName :`${firstName || ''} ${lastName || ''}`.trim(),
        imageUrl
      });
    //   await newUser.save();
      await User.create(newUser);
    }

    res.json({success: true, message: "User authenticated successfully"});
  } catch (error) {
    console.error("Error in authentication:", error);
    next(error); // Pass the error to the global error handler
    // res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  authenticateUser
};