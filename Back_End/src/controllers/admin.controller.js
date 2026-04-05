const Song = require("../models/song.model");
const Album = require("../models/album.model");

// const { uploadToCloudinary } = require("../utils/cloudinary.util");
const { cloudinary } = require("../lib/cloudinary");

const uploadToCloud = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
            // folder: "spotify/songs"
        });
        return result.secure_url;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
};

const adminConfirmation = (req, res, next) => {
    res.status(200).json({ admin: true, message: "You are an admin!" });
};

const createSong = async (req, res, next) => {
    try {
        if (!req.files || !req.files.audio || !req.files.cover) {
            return res.status(400).json({ message: "Please upload audio and cover image files" });
        }

        const audioFile = req.files.audio;
        const coverFile = req.files.cover;

        const { title, artist, albumId, duration } = req.body;

        const audioUrl = await uploadToCloud(audioFile);
        const imageUrl = await uploadToCloud(coverFile);

        const song = new Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null
        });

        await song.save();

        if (albumId) {
            await Album.findByIdAndUpdate(albumId,
                { $push: { songs: song._id } },
                { new: true }
            );
        }

        res.status(201).json({ message: "Song created successfully", song });

    } catch (error) {
        console.error("Error in createSong controller:", error);
        next(error); // Pass the error to the global error handler
        // // // res.status(500).json({ message: "Internal server error" });
    }
}

const deleteSong = async (req, res, next) => {
    try {
        const songId = req.params.id;

        const song = await Song.findByIdAndDelete(songId);

        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        // if the song is part of an Album, remove the song reference from the Album's songs array
        if (song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, { $pull: { songs: song._id } });
        }

        res.status(200).json({ message: "Song deleted successfully", song });
    } catch (error) {
        console.error("Error in deleteSong controller:", error);
        next(error);
    }
};

const createAlbum = async (req, res, next) => {
    try {
        const { title, artist, releaseYear } = req.body;

        const { imageFile } = req.files || {};

        const imageUrl = await uploadToCloud(imageFile);

        const album = new Album({
            title,
            artist,
            releaseYear,
            imageUrl,
            // imageUrl
        });

        await album.save();
        res.status(201).json({ message: "Album created successfully", album });
    } catch (error) {
        console.error("Error in createAlbum controller:", error);
        next(error);
    }
};

const deleteAlbum = async (req, res, next) => {
    try {
        const albumId = req.params.id;

        const album = await Album.findByIdAndDelete(albumId);

        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }
        // delete all songs that belong to this album
        await Song.deleteMany({ albumId });
        res.status(200).json({ message: "Album and its songs deleted successfully", album });
    } catch (error) {
        console.error("Error in deleteAlbum controller:", error);
        next(error);
    }
};


module.exports = {
    createSong,
    deleteSong,
    createAlbum,
    deleteAlbum,
    adminConfirmation
};