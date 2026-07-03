const { getAllUsers, getMessages } = require('../controllers/user.controller');
const { protectedRoute } = require('../middleware/auth.middleware');

const router = require('express').Router();

router.get("/", protectedRoute, getAllUsers);
router.get("/messages/:userId", protectedRoute, getMessages);

module.exports = router;