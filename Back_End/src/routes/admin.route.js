const { getAdmin, createSong, deleteSong, createAlbum, deleteAlbum, adminConfirmation } = require('../controllers/admin.controller');
const { authenticateUser } = require('../controllers/auth.controller');
const { isAdmin, protectedRoute } = require('../middleware/auth.middleware');

const router = require('express').Router();

router.use(protectedRoute, isAdmin); // Apply authentication and admin check middleware to all the routes in this router
    
// router.get("/isAdmin", protectedRoute, isAdmin, adminConfirmation);
router.get("/isAdmin", adminConfirmation);

router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);
// /api/admin/songs/123
// router.post("/songs", protectedRoute, isAdmin, createSong);

router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);

module.exports = router;