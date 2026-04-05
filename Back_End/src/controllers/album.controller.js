const Album = require("../models/album.model");

const getAllAlbums = async (req, res, next) => {
    try {
        const albums = await Album.find();
        res.status(200).json({ albums });
    } catch (error) {
        console.error("Error in getAllAlbums controller:", error);
        next(error);
    }
};

const getAlbumById = async (req, res, next) => {
    try {
        const album = await Album.findById(req.params.id).populate("songs");
        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }
        res.status(200).json({ album });
    } catch (error) {
        console.error("Error in getAlbumById controller:", error);
        next(error);
    }
};

module.exports = {
    getAllAlbums,
    getAlbumById
};