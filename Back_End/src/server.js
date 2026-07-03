const { clerkClient, clerkMiddleware, getAuth } = require('@clerk/express');
const fileUpload = require('express-fileupload');

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const adminRoutes = require('./routes/admin.route');
const songsRoutes = require('./routes/songs.route');
const albumsRoutes = require('./routes/albums.route');
const statsRoutes = require('./routes/stats.route');
const connectDB = require('./lib/db');
const initializeSocket = require('./lib/socket');
const createServer = require('http').createServer;

dotenv.config();

const app = express();
const port = process.env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

connectDB();
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.json()); // To parse JSON request bodies
app.use(clerkMiddleware()); // this will add the user object to the request if the user is authenticated => res.auth
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/',
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
})); // To handle file uploads

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songsRoutes);
app.use("/api/albums", albumsRoutes);
app.use("/api/stats", statsRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: process.env.ENVIRONMENT === "development" ? err.message : "Internal server error" });
});