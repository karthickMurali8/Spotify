const { clerkClient } = require("@clerk/express");

const protectedRoute = (req, res, next) => {
  if (req.auth() && req.auth().userId) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated
    res.status(401).json({ message: "Unauthorized" });
  }
};

const isAdmin = async(req, res, next) => {
    try {
        const user = await clerkClient.users.getUser(req.auth().userId);
        // const isAdmin = user.primary_email_address === process.env.ADMIN_EMAIL; // Check if the user's email matches the admin email
        const isAdmin = user.primaryEmailAddress?.emailAddress === process.env.ADMIN_EMAIL; // Check if the user's email matches the admin email
        if (!isAdmin) {
            res.status(403).json({ message: "Access denied. Admin privileges required." });
            return;
        }
        next();
    } catch (error) {
        console.error("Error in isAdmin middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    protectedRoute,
    isAdmin
};