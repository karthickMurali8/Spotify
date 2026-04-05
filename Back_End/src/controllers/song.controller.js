const Song = require("../models/song.model");

const getAllSongs = async (req, res, next) => {
    try {
        // -1 sorts in descending order (newest first)
        // 1 would sort in ascending order (oldest first)
        const songs = await Song.find().sort({ createdAt: -1 }); // sort by creation date, newest first
        res.status(200).json({ songs });
    } catch (error) {
        console.error("Error in getAllSongs controller:", error);
        next(error);
    }
};

const getSongById = async (req, res, next) => {
    try {
        // populate the album field to get the album details along with the song
        const song = await Song.findById(req.params.id).populate("album");
        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }
        res.status(200).json({ song });
    } catch (error) {
        console.error("Error in getSongById controller:", error);
        next(error);
    }
};

const getRandomSongs = (count) => {
    // Get random songs from the collection, using MongoDB's aggregation pipeline with $sample
     return Song.aggregate([
        { $sample: { size: count } },
        { $project: { _id: 1, title: 1, artist: 1, audioUrl: 1, imageUrl: 1 } } // Only return necessary fields for the songs
    ]);
};

// To display random songs on home page
const featuredSongs = async (req, res, next) => {
    try {
         // Get 6 random songs from the collection
        const songs = await getRandomSongs(6);
        res.status(200).json({ songs });
    } catch (error) {
        console.error("Error in featuredSongs controller:", error);
        next(error);
    }
};

// To display top charts / Trending based on play count
const topCharts = async (req, res, next) => {
    try {
        // const songs = await Song.find().sort({ playCount: -1 }).limit(10); // Get top 10 songs by play count
        const songs = await getRandomSongs(4); // For simplicity, we'll just return 4 random songs as "Top Charts" for now.
        res.status(200).json({ songs });
    } catch (error) {
        console.error("Error in topCharts controller:", error);
        next(error);
    }
};

// To display personalized recommendations based on user's listening history
const madeForYou = async (req, res, next) => {
    try {
        // For simplicity, we'll just return the most recent songs as "Made For You"
        const songs = await Song.find().sort({ createdAt: -1 }).limit(20); // Get the 20 most recent songs
        res.status(200).json({ songs });
    } catch (error) {
        console.error("Error in madeForYou controller:", error);
        next(error);
    }
};

module.exports = {
    getAllSongs,
    getSongById,
    featuredSongs,
    topCharts,
    madeForYou
};