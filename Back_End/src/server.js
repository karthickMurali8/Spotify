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
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

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
  tempFileDir : path.join(__dirname, 'tmp'),
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
})); // To handle file uploads

const tempDir = path.join(process.cwd(), 'tmp');
// cron jobs
cron.schedule('0 * * * *', async () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.error('Error reading temp directory:', err);
        return;
      };
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), err => {
          if (err) throw err;
        });
      }
    });
  }
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songsRoutes);
app.use("/api/albums", albumsRoutes);
app.use("/api/stats", statsRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../Front_End/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Front_End/dist", "index.html"));
  });
}

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: process.env.ENVIRONMENT === "development" ? err.message : "Internal server error" });
});