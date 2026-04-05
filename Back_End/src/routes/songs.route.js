const { getAllSongs, featuredSongs, topCharts, madeForYou } = require('../controllers/song.controller');
const { protectedRoute, isAdmin } = require('../middleware/auth.middleware');

const router = require('express').Router();

// only admins can view all songs (for admin management purposes)
router.get("/getAll", protectedRoute, isAdmin, getAllSongs);

router.get("/getFeatures", featuredSongs);
router.get("/getTopCharts", topCharts);
router.get("/getMadeForYou", madeForYou);

module.exports = router;