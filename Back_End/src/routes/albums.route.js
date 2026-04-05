const { getAllAlbums, getAlbumById } = require('../controllers/album.controller');

const router = require('express').Router();

// we'll allow users to view albums without authentication, but only admins can create/update/delete albums
router.get("/", getAllAlbums);
router.get("/:id", getAlbumById);

module.exports = router;