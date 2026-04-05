const { getAllUsers } = require('../controllers/user.controller');
const { protectedRoute } = require('../middleware/auth.middleware');

const router = require('express').Router();

router.get("/", protectedRoute, getAllUsers);

module.exports = router;