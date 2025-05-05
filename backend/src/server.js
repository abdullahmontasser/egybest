const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const config = require('./config/config');

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes'); // Added require for profileRoutes
// const movieRoutes = require('./routes/movieRoutes'); // Ensure this file exists and is spelled correctly
// const listRoutes = require('./routes/listRoutes');   // Added require for listRoutes
// const userRoutes = require('./routes/userRoutes');   // Added require for userRoutes


const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000', // Adjust for your frontend URL if needed
  credentials: true
}));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes); // Added profile routes
// app.use('/api/movies', movieRoutes);
// app.use('/api/lists', listRoutes); // Ensure listRoutes is defined above
// app.use('/api/users', userRoutes); // Ensure userRoutes is defined above

// Error handler middleware - should be last
app.use(errorHandler);

const PORT = config.port;

const server = app.listen(
  PORT,
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
