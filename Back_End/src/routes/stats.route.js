const { getStats } = require('../controllers/stats.controller');
const { protectedRoute, isAdmin } = require('../middleware/auth.middleware');

const router = require('express').Router();

router.get('/', protectedRoute, isAdmin, getStats);

module.exports = router;