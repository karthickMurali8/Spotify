const Album = require("../models/album.model");
const Song = require("../models/song.model");
const User = require("../models/user.model");


const getStats = async (req, res, next) => {
    try {
        // const totalUsers = await User.countDocuments();
        // const totalSongs = await Song.countDocuments();
        // const totalAlbums = await Album.countDocuments();

        const [totalUsers, totalSongs, totalAlbums, totalArtists] = await Promise.all([
            User.countDocuments(),
            Song.countDocuments(),
            Album.countDocuments(),

            Song.aggregate([
                {
                    $unionWith: {
                        coll: "albums",
                        pipeline: []
                    }
                },
                { 
                    $group: {
                        _id: "$artist",
                    }
                },
                {
                    $count: "count"
                }
            ])
        ]);
        res.status(200).json({ totalUsers, totalSongs, totalAlbums, totalArtists: totalArtists[0]?.count || 0 });
    } catch (error) {
        console.error("Error in getStats controller:", error);
        next(error);
    }
};

module.exports = {
    getStats
};